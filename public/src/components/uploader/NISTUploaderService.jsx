var jnprDataObject = require('./DataObjectFactory').getDataObject();
var JnprS3UploaderService = require('./JnprS3UploaderService');
let _ = require('underscore');
let jQuery = require('jquery');

let ThreadWorker = function(props) {
    this.status = null; //'COMPLETE', 'PROGRESS', 'FAILED', 'CANCELED'
    this.retries = 0;
    this.fileReader = new FileReader();
    this.chunk = {};
    this.activeUpload = null;
    this.maxTries = 3;
    this.props = props;

    this.cancel = function() {
        this.status = 'CANCELED';
        if (this.activeUpload != null) {
            this.activeUpload.abort();
        }
        this.props.error(this.status);
    };

    this.upload = function(chunk) {
        if (this.status == null || this.status != 'PROGRESS') {
            this.status = null;
            this.retries = 0;
            this.chunk = chunk;
            this.fileReader.readAsDataURL(chunk.file);
        } else {
            console.log('uploading chunk is in progress');
        }
    };
    this.getStats = function(ms, size) {
        var speed = size / ms;
        var readableSpeed = "";

        if (speed > 1000000)
            readableSpeed = Math.floor(speed / 1000000) + " mb/s";
        else if (speed > 1000)
            readableSpeed = Math.floor(speed / 1000) + " kb/s";
        else
            readableSpeed = Math.floor(speed) + " b/s";
        return {
            speed: speed,
            readableSpeed: readableSpeed
        }
    };

    if (props.maxTries != undefined) {
        this.maxTries = props.maxTries;
    }
    var currentFile = jnprDataObject.getFilesFor(props.appId, 'STATUS_CHOOSEN')[this.props.fileIdx];
    var _this = this;
    //... stop retries if canceled
    this.fileReader.addEventListener("load", function() {
        if (_this.status == 'CANCELED') {
            return;
        }
        // data:;base64 or data:*/*;base64,is removed from string.
        //see https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        var chunkBase64 = _this.fileReader.result.substring(_this.fileReader.result.lastIndexOf(',') + 1);

        var chunkJsonForRequestBody = {
            index: _this.chunk.index + 1,
            compressionMode: "NORMAL",
            compressionSize: _this.chunk.size,
            originalSize: _this.chunk.size,
            content: chunkBase64,
            lastChunk: _this.chunk.index == _this.chunk.totalChunks - 1 ?
                1 : 0
        }
        var body = JSON.stringify(chunkJsonForRequestBody);

        var startDt = new Date().getTime();
        var chunkUploader = {
            url: _this.props.url,
            headers: _this.props.headers,
            type: "POST",
            data: body,
            processData: false,
            contentType: "application/json",
            dataType: "text",
            // timeout: 5000,  //testing purpose
            success: function(data, textStatus, xhr) {
                if (_this.status == 'CANCELED') {
                    return;
                }
                if (_this.status == 'FAILED' || (xhr.status == 201 && _this.chunk.index != _this.chunk.totalChunks - 1)) {
                    console.error("Upload failed");
                    _this.status = 'FAILED';
                    //Todo cancel all;;
                    return;
                }
                _this.status = 'COMPLETE';
                _this.activeUpload = null;
                var uploadedPercentage = (_this.chunk.index + 1) / _this.chunk.totalChunks;

                //when all chunk for the file is uploaded, we need to change status as 'STATUS_EXPIRED' to destroy the progress bar
                currentFile['status'] = uploadedPercentage == 1 ? 'STATUS_COMPLETED' : 'STATUS_UPLOADING';
                currentFile['uploaded'] = uploadedPercentage;
                currentFile['stats'] = _this.getStats(new Date().getTime() - startDt, currentFile.file.size);
                jnprDataObject.setProgressFor(_this.props.appId, null, currentFile);

                if (uploadedPercentage == 1) {
                    setTimeout(() => {
                        currentFile['status'] = 'STATUS_EXPIRED';
                        jnprDataObject.setProgressFor(_this.props.appId, null, currentFile);
                    }, 1000);
                }
                // console.log('chunk succes:',currentFile.file.name, ' : ', (_this.chunk.index + 1) + '/' + _this.chunk.totalChunks, _this.chunk.size);
                _this.props.success(_this.status);
            },
            error: function(jqXHR, textStatus, errorMessage) {
                if (_this.status == 'CANCELED') {
                    return;
                }
                // console.log(jqXHR, textStatus, errorMessage); // Optional
                _this.retries++;
                if (_this.retries <= _this.maxTries) {
                    // console.log("Retry", _this.retries);
                    _this.activeUpload = jQuery.ajax(chunkUploader);
                } else {
                    _this.status = 'FAILED';
                    _this.activeUpload = null;
                    _this.props.error(_this.status);
                }
            }
        }
        _this.status = 'PROGRESS';
        _this.activeUpload = jQuery.ajax(chunkUploader);
    }, false);
};

var UploaderService = {

    genericConfig: {},

    setGenericCofigsFor: function(appId, props) {
        this.appId = appId;
        jnprDataObject.setRestrictionsFor(appId, props);

        this._initGenericConfigFor(appId);
        this.genericConfig[appId]['currentFileNames'] = 'currentFileNames' in props ?
            props['currentFileNames'] : [];

    },

    updateCurrentFileNames: function(appId, fileNames) {
        this.genericConfig[appId]['currentFileNames'] = fileNames;
    },

    updateGenericFileOptionsFor: function(appId, options) {},

    checkUploadedFilesFor: function(appId, files, info) {
        return jnprDataObject.checkUploadedFilesFor(appId, files, info);
    },

    getFilesFor: function(appId, status) {
        return jnprDataObject.getFilesFor(appId, status);
    },

    resetFilesFor: function(appId) {
        jnprDataObject.resetFilesFor(appId);
    },

    nistUpload: function(fileData, fileIdx) {
        var _this = this;
        return new Promise(function(finish, failure) {
            var chunkArray = [];
            var lastChunk = {};
            var workers = [];

            var chunkMaxSize = 1024 * 1024 * 20; //20MB
            var file = fileData.file;
            var fileSize = file.size;
            var fileChunks = Math.ceil(fileSize / chunkMaxSize);

            var allDone = false;
            var allCanceled = false;
            var postConfigs = jnprDataObject.getPostMandatoryConfigs(_this.appId);
            var currentFileData = fileData;

            function createChunk(file, chunkSize, index) {
                var fileChunk = file.slice(index * chunkSize, (index + 1) * chunkSize);
                return {
                    index: index,
                    totalChunks: Math.ceil(file.size / chunkSize),
                    size: fileChunk.size,
                    file: fileChunk
                };
            }

            function createChunkArray() {
                if (fileChunks > 1) {
                    for (var i = 0; i < fileChunks - 1; i++) {
                        chunkArray.push(createChunk(file, chunkMaxSize, i));
                    }
                }
                lastChunk = createChunk(file, chunkMaxSize, fileChunks - 1);
            }

            function getAvailableChunk() {
                if (chunkArray.length > 0) {
                    var nextChunk = chunkArray.shift();
                    return nextChunk;
                } else {
                    return false;
                }
            }

            function getProgress() {
                return 1 - ((chunkArray.length + 1) / fileChunks); // + 1 for last chunk
            }

            function cancelAllUploads() {
                for (var i = 0; i < workers.length; i++) {
                    workers[i].cancel();
                }
                finish("CANCELLED");
            }

            function doneUploadNextChunk(worker) {
                var chunk = getAvailableChunk();
                if (chunk) {
                    // TODO: update progress

                    var startedNextUpload = false;
                    for (var i = 0; i < workers.length; i++) {
                        if (workers[i].status != 'PROGRESS') {
                            workers[i].upload(chunk);
                            startedNextUpload = true;
                            break;
                        }
                    }
                    if (!startedNextUpload) {
                        console.error("Did not find idle worker");
                    }
                } else {
                    if (!allDone) {
                        var doneCount = 0;
                        for (var i = 0; i < workers.length; i++) {
                            if (workers[i].status == 'COMPLETE') {
                                doneCount++;
                            }
                        }
                        if (doneCount == workers.length) {
                            allDone = true;
                            new ThreadWorker({
                                appId: _this.appId,
                                fileIdx: fileIdx,
                                url: postConfigs['uploaderUrlList'][fileIdx],
                                headers: postConfigs['customHeaders'],
                                success: function() {
                                    finish();
                                },
                                error: function() {
                                    failure();
                                }
                            }).upload(lastChunk);
                        }
                    }
                }
            }

            createChunkArray();
            // for first chunk
            var worker = new ThreadWorker({
                // maxTries: 5 optional
                appId: _this.appId,
                fileIdx: fileIdx,
                url: postConfigs['uploaderUrlList'][fileIdx],
                currentFileData: currentFileData,
                headers: postConfigs['customHeaders'],
                success: function() {
                    var chunk = getAvailableChunk();
                    if (chunk) {
                        worker.upload(chunk);
                    } else {
                        if (worker.lastChunk) {
                            finish();
                        } else {
                            worker.lastChunk = true;
                            worker.upload(lastChunk);
                        }
                    }
                    // threading
                    // for (var i = 0; i < 5; i++) {
                    //     workers[i] = new ThreadWorker({
                    //         appId: _this.appId,
                    //         url: postConfigs['uploaderUrlList'][fileIdx],
                    //         headers: postConfigs['customHeaders'],
                    //         success: function() {
                    //             doneUploadNextChunk();
                    //         },
                    //         error: function() {
                    //             if (!allCanceled) {
                    //                 cancelAllUploads();
                    //                 allCanceled = true;
                    //                 failure();
                    //             }
                    //         }
                    //     });
                    //     workers[i].upload(getAvailableChunk());
                    // }
                },
                error: function(reason) {
                    var currentFile = this.currentFileData;

                    currentFile['status'] = 'STATUS_FAILED';
                    jnprDataObject.setProgressFor(this.appId, reason, currentFile);

                    setTimeout(() => {
                        currentFile['status'] = 'STATUS_EXPIRED';
                        jnprDataObject.setProgressFor(this.appId, reason, currentFile);
                        failure(reason);
                    }, 2000);

                }
            });

            if (chunkArray.length == 0 && fileChunks == 1) {
                //if it's only one totalchunk as last chunk,
                worker.lastChunk = true;
                worker.upload(lastChunk);
            } else {
                worker.upload(getAvailableChunk());
            }

        });
    },

    nistFileUpload: function(appId, logging) {

        var files = this.getFilesFor(appId, 'STATUS_CHOOSEN');
        var havingBigFile = false;
        files.forEach(file => {
            if (file.file.size > 5000000000) //bigger than 5G
                havingBigFile = true;
        });
        havingBigFile = false;

        if (!havingBigFile) {
            var files = jnprDataObject.getFilesFor(appId, 'STATUS_CHOOSEN');
            var _this = this;
            // here we need to first map data as AWS return is asynchronous
            for (var i = 0; i < files.length; i++) {
                // attention below, we must pass context, as they are
                // asynchronous
                (function(i) {
                    _this.nistUpload(files[i], i).then(function() {

                    }, function(err) {
                        // console.log(err, 'promise error!');
                    });

                })(i);
            }

        }
    },

    _initGenericConfigFor: function(appId) {
        if (!(appId in this.genericConfig))
            this.genericConfig[appId] = {};
    },

    //this method is used to automatically convert filename to (1) (2)... if the fileName already exists in current list
    generateUploadFileName: function(fileName, fileNameList) {
        var generatedFileNameResults = this.generateBaseFileNameFromList(fileName, fileNameList);
        if (generatedFileNameResults[1] > 0) {
            var baseFilenames = generatedFileNameResults[0].split(".");
            fileName = baseFilenames[0] + "(" + generatedFileNameResults[1] + ")." + baseFilenames[1];
        }
        return fileName;
    },

    generateBaseFileNameFromList: function(fileName, fileNameList) {

        var passedBaseName = this.generateSingleBaseFileName(fileName)[0];

        var toCheckSequence = 0;
        var _this = this;
        fileNameList.forEach(function(fn) {
            var toCheckFileName = _this.generateSingleBaseFileName(fn);
            var bn = toCheckFileName[0];
            if (bn == passedBaseName) {
                if (toCheckFileName[1] >= toCheckSequence) {
                    toCheckSequence = toCheckFileName[1] + 1;
                }
            }
        });

        return [
            passedBaseName, toCheckSequence > 0 ?
            toCheckSequence :
            0
        ];
    },

    //this is to extra baseFilename, remove the (d) from fileName
    generateSingleBaseFileName: function(fileName) {
        var foundResult = fileName.match(/(\(\d+\))/);
        var foundNumber = 0;
        if (foundResult) {
            var foundItem = foundResult[0];
            fileName = fileName.replace(foundItem, '');
            //now let's extract number in bracket
            var numberResult = foundItem.match(/(\d+)/);
            if (numberResult) {
                foundNumber = numberResult[0];
            }
        }
        return [fileName, parseInt(foundNumber)];
    }
}

module.exports = UploaderService;
