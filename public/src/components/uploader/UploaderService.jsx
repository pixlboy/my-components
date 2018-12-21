var jnprDataObject = require('./DataObjectFactory').getDataObject();
var Evaporate = require('../../lib/evaporate');
var JnprS3UploaderService = require('./JnprS3UploaderService');
let _ = require('underscore');

var UploaderService = {

    s3Config: {},
    getDynamicAWSKeys: {},
    onUploadCompleted: {},
    onUpdateSession: {},

    setCofigsFor: function (appId, props) {

        jnprDataObject.setRestrictionsFor(appId, props);
        if (!('aws_signerUrl' in props) || !('aws_key' in props) || !('aws_bucket' in props) || !('aws_region' in props)) {
            console.log('aws configurations are missing or imcomplete');
        } else {
            this._initAW3ConfigFor(appId, props);
            if ('fixedAWSConfigs' in props) {
                if (!('sessionToken' in props) || !('secretAccessKey' in props)) {
                    console.log('aws configurations are missing or imcomplete');
                } else {
                    this.s3Config[appId]['secretAccessKey'] = props['secretAccessKey'];
                    this.s3Config[appId]['sessionToken'] = props['sessionToken'];
                }
            }
            this.s3Config[appId]['signerUrl'] = props['aws_signerUrl'];
            this.s3Config[appId]['key'] = props['aws_key'];
            this.s3Config[appId]['bucket'] = props['aws_bucket'];
            this.s3Config[appId]['region'] = props['aws_region'];
            this.s3Config[appId]['currentFileNames'] = 'currentFileNames' in props ? props['currentFileNames'] : [];
            this.s3Config[appId]['requestingApp'] = props['requestingApp'];
            this.s3Config[appId]['reinitiateSessionDuration'] = props['reinitiateSessionDuration'];
            // passing x_amz_header if exists
            if ('x_amz_headers' in props) {
                this.s3Config[appId]['x_amz_headers'] = props['x_amz_headers'];
            }
        }
        this.getDynamicAWSKeys[appId] = props['getDynamicAWSKeys'];
        this.onUploadCompleted[appId] = props['onUploadCompleted'];
        this.onUpdateSession[appId] = props['onUpdateSession'];
    },

    updateCurrentFileNames: function (appId, fileNames) {
        this.s3Config[appId]['currentFileNames'] = fileNames;
    },

    updateFileOptions: function (appId, options) {
        //console.log("options coming: " + options);
        this.s3Config[appId]['x_amz_headers']['x-amz-meta-attachment-type'] = options['type'];
        this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private'] = options['mode'] == 'private' ? 'X' : '';
        //console.log("this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private']: " + this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private']);
    },

    checkUploadedFilesFor: function (appId, files) {
        return jnprDataObject.checkUploadedFilesFor(appId, files);
    },

    getFilesFor: function (appId, status) {
        return jnprDataObject.getFilesFor(appId, status);
    },

    resetFilesFor: function (appId) {
        jnprDataObject.resetFilesFor(appId);
    },

    jnprFileUpload: function (appId, logging) {
        var getStats = function (ms, size) {
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

        var _this = this;

        var uploadOne = function (file, cb) {
            // adding config
            JnprS3UploaderService.config(_this._getEvaporateConfigFor(appId, logging, file));
            var startDt = new Date().getTime();
            JnprS3UploaderService.send(appId, function (percentTransferred) {
                file['status'] = 'STATUS_UPLOADING';
                file['uploaded'] = percentTransferred;
                file['stats'] = getStats(new Date().getTime() - startDt, file.file.size);
                jnprDataObject.setProgressFor(appId, null, file);
            }, file).then(function (finish, failure) {
                if (finish === file.fileKey) {
                    // we need to make sure it is dispatched just once
                    if (file['status'] !== 'STATUS_COMPLETED') {
                        file['status'] = 'STATUS_COMPLETED';
                        file['uploaded'] = 1;
                        file['stats'] = getStats(new Date().getTime() - startDt, file.file.size);
                        jnprDataObject.setProgressFor(appId, null, file);
                        setTimeout(() => {
                            file['status'] = 'STATUS_EXPIRED';
                            jnprDataObject.setProgressFor(appId, null, file);
                        }, 2000
                        );
                        cb();
                    }
                }
                if (failure) {
                    file['status'] = 'STATUS_FAILED';
                    jnprDataObject.setProgressFor(appId, failure, file);
                    setTimeout(() => {
                        file['status'] = 'STATUS_EXPIRED';
                        jnprDataObject.setProgressFor(appId, null, file);
                    }, 2000
                    );
                    cb();
                }
            });
        }

        var uploadAll = function (cb) {
            var files = jnprDataObject.getFilesFor(appId, 'STATUS_CHOOSEN');
            if (files.length > 0) {
                uploadOne(files[0], function () {
                    uploadAll(cb);
                });
            } else {
                cb();
            }
        }
        uploadAll(function () {
        });


        // this needs improvements, we can pass one by one, instead of passing
        // all at once.
        // so as to make sure no conflicts
        // var files = jnprDataObject.getFilesFor( appId, 'STATUS_CHOOSEN' );
        // var startDt = {};
        // for ( var i = 0; i < files.length; i++ ) {
        // ( function( i ) {
        // startDt[i] = new Date().getTime();
        // JnprS3UploaderService.send( appId, function( percentTransferred ) {
        // files[i]['status'] = 'STATUS_UPLOADING';
        // files[i]['uploaded'] = percentTransferred;
        // files[i]['stats'] = getStats(new Date().getTime()- startDt[i],
        // files[i].file.size );
        // jnprDataObject.setProgressFor( appId, null, files[i] );
        // }, files[i] ).then( function( finish, failure ) {
        // if(finish===files[i].fileKey){
        // files[i]['status'] = 'STATUS_COMPLETED';
        // files[i]['uploaded'] = 1;
        // files[i]['stats'] = getStats(new Date().getTime()- startDt[i],
        // files[i].file.size );
        // jnprDataObject.setProgressFor( appId, null, files[i] );
        // setTimeout(() =>
        // ( function( i ) {
        // files[i]['status'] = 'STATUS_EXPIRED';
        // jnprDataObject.setProgressFor( appId, null, files[i] );
        // })( i ), 10000
        // );
        // }
        // if(failure){
        // files[i]['status'] = 'STATUS_FAILED';
        // jnprDataObject.setProgressFor( appId, failure, files[i] );
        // setTimeout(() =>
        // ( function( i ) {
        // files[i]['status'] = 'STATUS_EXPIRED';
        // jnprDataObject.setProgressFor( appId, null, files[i] );
        // })( i ), 10000
        // );
        // }
        // });
        // })( i );
        // }
    },

    fileUpload: function (appId, logging) {
        localStorage.clear();
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
                (function (i) {

                    let customHeaders = {};
                    var sessionInterval;
                    //if aws_key needs to be dynamically changed
                    // if (appId in _this.getDynamicAWSKeys && _this.getDynamicAWSKeys[appId] && _this.getDynamicAWSKeys[appId]().length > 0) {
                    //     let fileObj = null;
                    //     let file_aws_key = null;
                    //     let sessionToken = null;
                    //     let secretAccessKey = null;
                    //     fileObj = _.find(_this.getDynamicAWSKeys[appId](), function (f) {
                    //         return f.fileName == files[i].file.name;
                    //     });
                    //     file_aws_key = fileObj['aws_key'];
                    //     sessionToken = fileObj['sessionToken'];
                    //     secretAccessKey = fileObj['secretAccessKey'];

                    //     // requirement that we need to send keyId in headers
                    //     customHeaders['signHeaders'] = { KeyID: secretAccessKey };
                    // } else if(appId in _this.getDynamicAWSKeys && _this.getDynamicAWSKeys[appId] && _this.getDynamicAWSKeys[appId]().length == 0 && 'secretAccessKey' in  _this.s3Config[appId]){
                    //     customHeaders['signHeaders'] = { KeyID: _this.s3Config[appId]['secretAccessKey'] };
                    // } else {
                    //     customHeaders['signHeaders'] = { KeyID: _this.s3Config[appId]['key'] };
                    // }
                    _this.s3Config[appId]['bucket'] = files[i].configs.bucketName;
                    _this.s3Config[appId]['key'] = files[i].configs.accessKeyId;
                    _this.s3Config[appId]['sessionToken'] = files[i].configs.sessionToken ? files[i].configs.sessionToken : "";
                    // console.log('dynamic aws key for', files[i].file.name, ':', file_aws_key);

                    // now we got all the fileKeys
                    Evaporate.create(_this._getEvaporateConfigFor(appId, logging, files[i])).then(
                        function (evaporate) {
                            // var evaporate = new Evaporate(_this._getEvaporateConfigFor(appId, logging, files[i]));
                            var filename = encodeURI(files[i].file.name);
                            //console.log(filename);
                            var newfilename = filename.replace(/%20/g, " ");
                            //console.log(newfilename);

                            var addConfig = {
                                name: files[i].fileKey,
                                file: files[i].file,
                                progress: function (percentTransferred, stats) {
                                    files[i]['status'] = 'STATUS_UPLOADING';
                                    files[i]['uploaded'] = percentTransferred;
                                    files[i]['stats'] = stats;
                                    jnprDataObject.setProgressFor(appId, null, files[i]);
                                },

                                // here we need to pass additional headers for
                                // AWS
                                // Fix MYJ-9745: URL percentage encoding is needed when setting the request header fields.
                                // See more:
                                //      https://stackoverflow.com/questions/5251824/sending-non-ascii-text-in-http-post-header
                                //      https://stackoverflow.com/questions/4400678/what-character-encoding-should-i-use-for-a-http-header
                                xAmzHeadersAtInitiate: {
                                    'x-amz-meta-attachment-type': _this.s3Config[appId]['x_amz_headers']['x-amz-meta-attachment-type'] || '',
                                    'x-amz-meta-file-size': '' + files[i].file.size,
                                    'x-amz-meta-original-file-name': newfilename,
                                    'x-amz-meta-user-id': _this.s3Config[appId]['x_amz_headers']['x-amz-meta-user-id'] || '',
                                    'x-amz-security-token': files[i].configs.sessionToken,
                                    'x-amz-meta-requesting-app': _this.s3Config[appId]['requestingApp']
                                },

                                xAmzHeadersCommon: { 'x-amz-security-token': files[i].configs.sessionToken }
                            };

                            if (_this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private']) {
                                addConfig.xAmzHeadersAtInitiate['x-amz-meta-is-attachment-private'] = _this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private']
                            }

                            // if (appId in _this.getDynamicAWSKeys && _this.getDynamicAWSKeys[appId] && _this.getDynamicAWSKeys[appId]().length > 0) {
                            //     addConfig['xAmzHeadersAtInitiate']['x-amz-security-token'] = sessionToken;
                            //     addConfig['xAmzHeadersCommon'] ={};
                            //     addConfig['xAmzHeadersCommon']['x-amz-security-token'] = sessionToken;
                            // } else if(appId in _this.getDynamicAWSKeys && _this.getDynamicAWSKeys[appId] && _this.getDynamicAWSKeys[appId]().length == 0 && 'secretAccessKey' in  _this.s3Config[appId]){
                            //     addConfig['xAmzHeadersAtInitiate']['x-amz-security-token'] = _this.s3Config[appId]['sessionToken'];
                            //     addConfig['xAmzHeadersCommon'] ={};
                            //     addConfig['xAmzHeadersCommon']['x-amz-security-token'] = _this.s3Config[appId]['sessionToken'];
                            // }
                            customHeaders['signHeaders'] = { KeyID: files[i].configs.secretAccessKey };
                            sessionInterval = setInterval(function () {
                                _this.onUpdateSession[appId](files[i], function (updatedSessionToken, updatedAccessKeyId, updatedSecretAccessKey) {
                                    evaporate.pendingFiles[files[i].configs.bucketName + "/" + files[i].fileKey]['xAmzHeadersCommon']['x-amz-security-token'] = updatedSessionToken;
                                    evaporate.pendingFiles[files[i].configs.bucketName + "/" + files[i].fileKey]["con"]['aws_key'] = updatedAccessKeyId;
                                    evaporate.pendingFiles[files[i].configs.bucketName + "/" + files[i].fileKey]["con"]['signHeaders']['KeyID'] = updatedSecretAccessKey;
                                });
                            }, _this.s3Config[appId]['reinitiateSessionDuration'])
                            evaporate.add(addConfig, customHeaders).then(
                                function (awsObjectKey) {
                                    // we need to make sure this event is
                                    // dispatched only once
                                    if (files[i]['status'] !== 'STATUS_COMPLETED') {
                                        files[i]['status'] = 'STATUS_COMPLETED';
                                        clearInterval(sessionInterval);
                                        jnprDataObject.setProgressFor(appId, null, files[i]);
                                        _this.onUploadCompleted[appId](files[i]);
                                        setTimeout(() =>
                                            (function (i) {
                                                files[i]['status'] = 'STATUS_EXPIRED';
                                                jnprDataObject.setProgressFor(appId, null, files[i]);
                                            })(i), 2000
                                        );
                                    }
                                }, function (reason) {
                                    files[i]['status'] = 'STATUS_FAILED';
                                    clearInterval(sessionInterval);
                                    jnprDataObject.setProgressFor(appId, reason, files[i]);
                                    _this.onUploadCompleted[appId](files[i]);
                                    setTimeout(() =>
                                        (function (i) {
                                            files[i]['status'] = 'STATUS_EXPIRED';
                                            jnprDataObject.setProgressFor(appId, null, files[i]);
                                        })(i), 2000
                                    );

                                });
                        }, function (reasone) {
                            files[i]['status'] = 'STATUS_FAILED';
                            jnprDataObject.setProgressFor(appId, reason, files[i]);

                            setTimeout(() =>
                                (function (i) {
                                    files[i]['status'] = 'STATUS_EXPIRED';
                                    jnprDataObject.setProgressFor(appId, null, files[i]);
                                })(i), 2000
                            );

                        });
                })(i);
            }

        } else {
            this.jnprFileUpload(appId, logging);
        }
    },

    _getEvaporateConfigFor: function (appId, logging, file) {
        
        var extra_amz_headers = {};
        var filename = encodeURI(file.file.name);
        //console.log(filename);
        var newfilename = filename.replace(/%20/g, " ");
        //console.log(newfilename);

        // Fix MYJ-9745: URL percentage encoding is needed when setting the request header fields.
        // See more:
        //      https://stackoverflow.com/questions/5251824/sending-non-ascii-text-in-http-post-header
        //      https://stackoverflow.com/questions/4400678/what-character-encoding-should-i-use-for-a-http-header
        if (file) {
            extra_amz_headers = {
                'x-amz-meta-attachment-type': this.s3Config[appId]['x_amz_headers']['x-amz-meta-attachment-type'] || '',
                'x-amz-meta-file-size': '' + file.file.size,
                'x-amz-meta-is-attachment-private': this.s3Config[appId]['x_amz_headers']['x-amz-meta-is-attachment-private'] || '',
                'x-amz-meta-original-file-name': newfilename,
                'x-amz-meta-user-id': this.s3Config[appId]['x_amz_headers']['x-amz-meta-user-id'] || ''
            }

        }

        //for dynamic AWK Keys
        // if (file && appId in this.getDynamicAWSKeys && this.getDynamicAWSKeys[appId] && this.getDynamicAWSKeys[appId]().length > 0) {
        //     let fileObj = null;
        //     fileObj = _.find(this.getDynamicAWSKeys[appId](), function (f) {
        //         return f.fileName == file.file.name;
        //     });
        //     this.s3Config[appId]['key'] = fileObj['aws_key'];
        //     extra_amz_headers['x-amz-security-token'] = fileObj['sessionToken'];
        // } else if(file && appId in this.getDynamicAWSKeys && this.getDynamicAWSKeys[appId] && this.getDynamicAWSKeys[appId]().length == 0 && 'secretAccessKey' in  this.s3Config[appId]){
        //     this.s3Config[appId]['key'] = this.s3Config[appId]['key'];
        //     extra_amz_headers['x-amz-security-token'] = this.s3Config[appId]['sessionToken'];
        // }

        extra_amz_headers['x-amz-security-token'] = this.s3Config[appId]['sessionToken'];

        return {
            signerUrl: this.s3Config[appId]['signerUrl'],
            aws_key: this.s3Config[appId]['key'],
            bucket: this.s3Config[appId]['bucket'],
            aws_url: "https://" + this.s3Config[appId]['bucket'] + ".s3.amazonaws.com",
            awsRegion: this.s3Config[appId]['region'],
            cloudfront: false,
            awsSignatureVersion: '4',
            computeContentMd5: true,
            logging: logging,
            maxRetryAttemps: 3,
            maxRetryBackoffSecs: 300,
            maxFileSize: 10 * 100 * 100 * 100 * 1000, //10GB max size
            cryptoMd5Method: function (data) {
                return AWS.util.crypto.md5(data, 'base64');
            },
            cryptoHexEncodedHash256: function (data) {
                return AWS.util.crypto.sha256(data, 'hex');
            },
            extra_amz_headers: extra_amz_headers
        }
    },


    _initAW3ConfigFor: function (appId, props) {
        if (!(appId in this.s3Config)) {
            this.s3Config[appId] = {
                signerUrl: "",
                key: "",
                bucket: "",
                region: ""
            };
            if ('x_amz_headers' in props) {
                this.s3Config[appId]['x_amz_headers'] = {};
            }
            if ('sessionToken' in props) {
                this.s3Config[appId]['sessionToken'] = "";
            }
            if ('secretAccessKey' in props) {
                this.s3Config[appId]['secretAccessKey'] = "";
            }
        }
    },

    //this method is used to automatically convert filename to (1) (2)... if the fileName already exists in current list
    generateUploadFileName: function (fileName, fileNameList) {
        var generatedFileNameResults = this.generateBaseFileNameFromList(fileName, fileNameList);
        if (generatedFileNameResults[1] > 0) {
            var baseFilenames = generatedFileNameResults[0].split(".");
            fileName = baseFilenames[0] + "(" + generatedFileNameResults[1] + ")." + baseFilenames[1];
        }
        return fileName;
    },

    generateBaseFileNameFromList: function (fileName, fileNameList) {

        var passedBaseName = this.generateSingleBaseFileName(fileName)[0];

        var toCheckSequence = 0;
        var _this = this;
        fileNameList.forEach(function (fn) {
            var toCheckFileName = _this.generateSingleBaseFileName(fn);
            var bn = toCheckFileName[0];
            if (bn == passedBaseName) {
                if (toCheckFileName[1] >= toCheckSequence) {
                    toCheckSequence = toCheckFileName[1] + 1;
                }
            }
        });

        return [passedBaseName, toCheckSequence > 0 ? toCheckSequence : 0];
    },

    //this is to extra baseFilename, remove the (d) from fileName
    generateSingleBaseFileName: function (fileName) {
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
