var jnprDataObject = require( './DataObjectFactory' ).getDataObject();
var _generalHelper = {};

var JnprS3UploaderService = {

    signAuthURL: '',
    awsRegion: '',
    AWS_KEY: '',
    AWS_BUCKET: '',
    SIGNER_URL: '',
    cryptoMd5Method: null,
    cryptoHexEncodedHash256: null,
    cloudfront: false,
    awsUrl: '',
    // these two fields are NOT required by AWS, by internal app only
    id: '',
    objKey: '',
    extra_amz_headers:{},

    config: function( config ) {

                this.signAuthURL = config['signerUrl'],
                this.awsRegion = config['awsRegion'],
                this.AWS_KEY = config['aws_key'],
                this.AWS_BUCKET = config['bucket'],
                this.SIGNER_URL = config['signerUrl'],
                this.cryptoMd5Method = config['cryptoMd5Method'],
                this.cryptoHexEncodedHash256 = config['cryptoHexEncodedHash256'],
                this.cloudfront = 'cloudfront' in config ? config['cloudfront'] : false,
                this.id = config['id']
                ;

           if(config['extra_amz_headers'])
               this.extra_amz_headers=config['extra_amz_headers'];
    },


    send: function( appId, onProcess, file ) {

        this.objKey = file.fileKey;

        var uploadList = jnprDataObject.getFilesFor( appId, 'STATUS_CHOOSEN' );
        var _this = this;
        return new Promise( function(finish, failure ) {
            // in class used variables
            var
                fileReader = null,
                chunked = 0,
                fixedChunk = 6000000, // 6MB
                minChunks = Math.floor( file.file.size / fixedChunk ) == 0 ? 1
                    : Math.floor( file.file.size / fixedChunk ),
                maxChunked = minChunks == 1 ? minChunks
                    : minChunks + 1,
                uploadProgress = 0,
                partNumber = 0,
                formData = null,
                uploadId = null,
                PENDING = 0, FAILED = 1, COMPLETE = 100,

                CANCELLED = false,
                retryUpload = 0,
                threadArray = [],
                chunkArray = {
                    current: 0,
                    increment: function() {
                        return chunkArray.current = ( chunkArray.current + 1 );
                    }
                },

                completingMultiPart = false,
                // timeOffset I think have to look at the last
                timeOffset = 0,
                REQUEST = {},
                datetime = function( timeOffset ) {
                    return new Date( new Date().getTime() + timeOffset );
                },

                dateString = function( timeOffset ) {
                    return datetime( timeOffset ).toISOString()
                        .slice( 0, 19 ).replace( /-|:/g, '' )
                        + "Z";
                },
                timeInit = datetime( 0 );


            // start function definition
            function getUploadId( response ) {
                return response.substring( response
                    .search( '<UploadId>' ) + 10, response
                        .search( '</UploadId>' ) );
            }
            var isMinutesCalculating = false;
            function getMinutes( minutes ) {
                isMinutesCalculating = true;
                return Math
                    .round(( minutes * ( maxChunked - chunksSent ) ) );
            }
            function getCaseIdPath( key ) {
                var path = key.substr( 0, key.lastIndexOf( "/" ) );
                return path;
            }
            var timeElapsedCalculating = 0;
            function showCalculating() {
                setInterval(
                    function() {
                        if ( isMinutesCalculating == false ) {
                            timeElapsedCalculating = timeElapsedCalculating == 3 ? timeElapsedCalculating = 0
                                : timeElapsedCalculating = timeElapsedCalculating + 1

                            var dots = "";
                            for ( var i = 0; i < timeElapsedCalculating; i++ ) {
                                dots = dots + "..";
                            }
                        }
                    }, ( threadArray.length + 2 ) * 1000 );
            }
            var chunksSent = 0;
            var minutes = 0;


            function updateProgressPopUp( threadOccupied ) {
                if ( threadOccupied == 0 ) {
                    minutes = Math
                        .round(( ( new Date().getTime() - threadArray[0].timeInit ) / ( 1000 * 60 ) )
                        * ( maxChunked - chunksSent ) );
                    threadArray[0].timeInit = new Date().getTime();
                }
                onProcess ( chunksSent  / minChunks );
                chunksSent++;
            }

            function checkIsCancelled() {
                return file.status === 'STATUS_CANCELED';
            }

            function stringToSign( request ) {
                request.dateString = dateString( 0 );
                var signParts = [];
                signParts.push( 'AWS4-HMAC-SHA256' );
                var dateStr = request.dateString;

                request.x_amz_headers["x-amz-date"] = dateStr;
                signParts.push( dateStr );

                signParts
                    .push( request.credentialString = credentialString( request ) );
                signParts
                    .push( _this.cryptoHexEncodedHash256( canonicalRequest( request )._cr ) );

                var result = signParts.join( '\n' );

                return result;
            }

            function getPath() {
                var path = '/' + _this.AWS_BUCKET + '/'
                    + file.file.name;
                if ( _this.cloudfront
                    || _this.awsUrl.indexOf( 'cloudfront' ) > -1 ) {
                    path = '/' + file.file.name;
                }
                return path;
            }

            function uri( url ) {
                var p, href = url || '/';

                try {
                    p = new URL( href );
                } catch ( e ) {
                    p = document.createElement( 'a' );
                    p.href = href;
                }

                return {
                    protocol: p.protocol, // => "http:"
                    hostname: p.hostname, // => "example.com"
                    // IE omits the leading slash, so add it if it's
                    // missing
                    pathname: p.pathname.replace( /(^\/?)/, "/" ), // =>
                    // "/pathname/"
                    port: p.port, // => "3000"
                    search: ( p.search[0] === '?' ) ? p.search.substr( 1 )
                        : p.search, // => "search=test"
                    hash: p.hash, // => "#hash"
                    host: p.host
                    // => "example.com:3000"
                };
            }

            function getPayloadSha256Content( request ) {
                var result = request.contentSha256
                    || _this.cryptoHexEncodedHash256( request.payload || '' );
                return result;
            }

            function canonicalRequest( request ) {

                var canonParts = [];
                canonParts.push( request.method );
                canonParts.push( request.path );
                canonParts.push( canonicalQueryString( request ) || '' );

                var headers = canonicalHeaders( request );
                canonParts.push( headers.canonicalHeaders + '\n' );
                canonParts.push( headers.signedHeaders );

                request.payloadSha256 = getPayloadSha256Content( request );
                canonParts.push( request.payloadSha256 );

                request._cr = canonParts.join( "\n" );
                request.headers = headers;
                return request;
            }

            function credentialString( request ) {
                var credParts = [];
                credParts.push( request.dateString.slice( 0, 8 ) );
                credParts.push( _this.awsRegion );
                credParts.push( 's3' );
                credParts.push( 'aws4_request' );
                return credParts.join( '/' );
            }

            function canonicalQueryString( request ) {
                var qs = request.query_string || '', search = uri( [
                    request.awsUrl, request.path, qs].join( "" ) ).search, searchParts = search.length ? search
                        .split( '&' )
                        : [], encoded = [], nameValue, i;
                var maxSearchPartsLen = searchParts.length;
                for ( i = 0; i < maxSearchPartsLen; i++ ) {
                    nameValue = searchParts[i].split( "=" );
                    encoded
                        .push( {
                            name: encodeURIComponent( nameValue[0] ),
                            value: nameValue.length > 1 ? encodeURIComponent( nameValue[1] )
                                : null
                        })
                }
                var sorted = encoded.sort( function( a, b ) {
                    if ( a.name < b.name ) {
                        return -1;
                    } else if ( a.name > b.name ) {
                        return 1;
                    }
                    return 0;
                });

                var result = [];
                var maxSortedLen = sorted.length;
                for ( i = 0; i < maxSortedLen; i++ ) {
                    nameValue = sorted[i].value ? [sorted[i].name,
                        sorted[i].value].join( "=" ) : sorted[i].name
                        + '=';
                    result.push( nameValue );
                }

                return result.join( '&' );
            }

            function canonicalHeaders( request ) {
                var canonicalHeaders = [], keys = [], i;

                function addHeader( name, value ) {
                    var key = name.toLowerCase();
                    keys.push( key );
                    canonicalHeaders[key] = value.replace( /\s+/g, ' ' );
                }

                if ( request.computeContentMd5 ) {
                    addHeader( "Content-Md5", getPartMd5Digest( request ) );
                }

                addHeader( 'Host', uri( request.awsUrl ).hostname );

                if ( request.contentType ) {
                    addHeader( 'Content-Type', request.contentType || '' );
                }

                var amzHeaders = request.x_amz_headers || {};
                for ( var key in amzHeaders ) {
                    if ( amzHeaders.hasOwnProperty( key ) ) {
                        addHeader( key, amzHeaders[key] );
                    }
                }

                // if we have extra headers for amz
                var extraAmzHeaders = request.extra_amz_headers || null;
                if(extraAmzHeaders){
                  Object.keys(extraAmzHeaders).forEach(header=>{
                    addHeader( header, extraAmzHeaders[header] );
                  });
                }

                var sortedKeys = keys.sort( function( a, b ) {
                    if ( a < b ) {
                        return -1;
                    } else if ( a > b ) {
                        return 1;
                    }
                    return 0;
                });

                var result = [];

                var unsigned_headers = [], not_signed = request.not_signed_headers
                    || [], signed_headers = [];
                var maxNotSignedLen = not_signed.length;
                for ( i = 0; i < maxNotSignedLen; i++ ) {
                    unsigned_headers.push( not_signed[i].toLowerCase() );
                }
                var maxSortedKeyLen = sortedKeys.length;
                for ( i = 0; i < maxSortedKeyLen; i++ ) {
                    var k = sortedKeys[i];
                    result.push( [k, canonicalHeaders[k]].join( ":" ) );
                    if ( unsigned_headers.indexOf( k ) === -1 ) {
                        signed_headers.push( k );
                    }
                }

                return {
                    canonicalHeaders: result.join( "\n" ),
                    signedHeaders: signed_headers.join( ";" )
                };
            }

            function getPartMd5Digest( request ) {

                if ( request.computeContentMd5 ) {
                    request.md5_digest = _this.cryptoMd5Method( request.payload );
                }
                return request.md5_digest;
            }

            var ETAG = null;

            function xhr( url, type, headers, data, payload ) {
                return new Promise(
                    function( resolve, reject ) {

                        var xhr = new XMLHttpRequest();

                        xhr.onload = function() {
                            var status = xhr.status;
                            var response = xhr.response;

                            var ETag = xhr.getResponseHeader( 'ETag' );

                            ETAG=ETag;
                            var ETag = null;
                            xhr = undefined;
                            if ( status == 200 ) {

                                if ( ETag ) {

                                    resolve( ETag );
                                } else
                                    resolve( response );
                            } else {

                                resolve( "ERROR" );
                            }
                            payload = undefined;
                        };

                        xhr.ontimeout = function() {

                        }

                        xhr.onerror = function() {

                            resolve( "ERROR" );
                        }

                        if ( data != null ) {
                            var url_data = [url];
                            url_data.push( "?" );
                            for ( var key in data ) {
                                if ( data.hasOwnProperty( key ) ) {
                                    url_data.push( key );
                                    if ( data[key] != undefined
                                        && data[key] != "" )
                                        url_data.push( data[key] );
                                }
                            }
                            url = url_data.join( "" );
                        }

                        xhr.open( type, url );
                        if ( headers != null )
                            for ( var key in headers ) {
                                if ( headers.hasOwnProperty( key ) ) {
                                    xhr.setRequestHeader( key, headers[key] );
                                }
                            }
                        xhr.setRequestHeader( "Cache-Control",
                            "no-cache,no-store" );
                        if ( payload != undefined ) {
                            xhr.send( payload );
                        } else {
                            xhr.send();
                        }
                    });
            }

            // Pre Request to get the presigned URL
            function getChunk( from, to ) {

                return new Promise( function( resolve, reject ) {
                    var reader = new FileReader(), blob = file.file.slice(
                        from, to );

                    reader.onloadend = function( e ) {
                        resolve( e.target.result );
                        blob = undefined;
                        e = undefined;
                        reader = undefined;
                    }
                    reader.readAsArrayBuffer( blob );
                });
            }

            // Init request

            var formData = new FormData();
            var requestParams = {
                "uploads": ''
            };

            formData.append( "requestParams", JSON
                .stringify( requestParams ) );
            formData.append( "verb", "POST" );
            formData.append( "fileName", file.file.name );

            var headers = {
                // 'Authorization': token || ''
            }

            function uploadChunks() {

                return new Promise(
                    function( resolve, reject ) {

                        var loopIn = loop;
                        if ( chunkArray[loopIn].status != "COMPLETE"
                            && execution < 4 ) {

                            getChunk( chunkArray[loopIn].from,
                                chunkArray[loopIn].to )
                                .then(
                                function( response ) {

                                    var formData = new FormData();
                                    formData.append( "chunk", response );
                                    response = undefined;
                                    xhr( 'POST', url, headers, formData )
                                        .then(
                                        function( response ) {

                                            try {
                                                if ( response != "" ) {
                                                    chunkArray[loopIn].ETag = response;
                                                    chunkArray[loopIn].status = COMPLETE;
                                                }
                                            } catch ( err ) {
                                                chunkArray[loopIn].status = FAILED;
                                                allUploaded = false;
                                            }
                                            resolve( loop = loop + 1 );
                                        },
                                        function( err ) {

                                            chunkArray[loopIn].status = FAILED;
                                            allUploaded = false;
                                            reject( loop = loop + 1 );
                                        });

                                }, function( err ) {

                                    reject();
                                })
                        }
                    });
            }

            function looping() {
                uploadChunks()
                    .then(
                    function( response ) {
                        if ( loop < size ) {
                            looping();
                        } else {
                            var data = null;
                            if ( allUploaded ) {
                                if ( data == createCompleteMultipartData( uploadId ) ) {
                                    completeMultipartUpload( uploadId,
                                        data );
                                }
                            } else {
                                deleteMultipartUpload( uploadId );
                            }

                        }
                    }, function( err ) {
                    });
            }
            var REQUEST = {};


            function doSignAuth( request ) {
                return new Promise(
                    function( resolve, reject ) {
                        REQUEST.init.stringToSign = stringToSign( request );
                        xhr(
                            _this.signAuthURL,
                            "GET",
                            {KeyID:  _this.AWS_KEY},
                            {
                                "to_sign=": encodeURIComponent( REQUEST.init.stringToSign )
                            }).then( function( rfc210HMAC ) {
                                resolve( rfc210HMAC )
                            }, function( error ) {
                                reject();
                            });

                    });

                // REQUEST.request.rfc210HMAC = rfc210HMAC;
                // xhr(
                // (REQUEST.request.awsUrl + REQUEST.request.path),
                // "POST",
                // {
                // "Authorization" : authorizationString(REQUEST.request),
                // "x-amz-date" : REQUEST.request.x_amz_headers["x-amz-date"],
                // "x-amz-content-sha256" : REQUEST.request.payloadSha256
                // }, {
                // "uploads" : ""
                // }).then(function(response) {
                //
                // });
            }


            function authorizationString( request ) {
                var authParts = [];

                var credentials = request.credentialString;
                var headers = request.canonicalHeaders;

                authParts.push( ['AWS4-HMAC-SHA256 Credential=',
                    _this.AWS_KEY, '/', credentials].join( '' ) );
                authParts.push( 'SignedHeaders='
                    + request.headers.signedHeaders );
                authParts.push( 'Signature=' + request.rfc210HMAC );

                return authParts.join( ', ' );
            }

            REQUEST.init = {
                _cr: "",
                key: "",
                path: '/' + _this.objKey,
                data: undefined,
                query_string: "?uploads",
                awsUrl: "https://" + _this.AWS_BUCKET
                + ".s3.amazonaws.com",
                method: "POST",
                headers: {},
                canonParts: [],
                x_amz_headers: {},
                contentSha256: undefined,
                to_sign: undefined,
                stringToSign: undefined,
                computeContentMd5: false,
                extra_amz_headers:{}
            };

            if(_this.extra_amz_headers){
              Object.keys( _this.extra_amz_headers ).forEach(key=>{
                REQUEST.init.extra_amz_headers[key] =  _this.extra_amz_headers[key];
              });
            }

            REQUEST.send = {

            };

            function checkIsUploadedEarlier() {
                var uploadList = jnprDataObject.getFilesFor( appId, 'STATUS_UPLOADING' );
                return new Promise(
                    function( resolve, reject ) {
                        var found = false;
                        // First check the current file uploads
                        if ( uploadList.length > 0 ) {
                            alert( 'Aborting Upload! Same file is currently uploading' );
                            reject( false );
                            return;
                        }

                        var cookies = 'getUploadCookie' in _generalHelper ? _generalHelper.getUploadCookie() : '';
                        cookies = cookies.split( ";" );
                        var found = false;
                        for ( var key in cookies ) {
                            if ( cookies.hasOwnProperty( key ) ) {
                                var uploadObj = cookies[key].split( "=", 2 )[1];
                                try {
                                    uploadObj = JSON.parse( uploadObj );
                                    if ( uploadObj.name == file.file.name
                                        && ( uploadObj.lastModifiedDate == file.lastModified )
                                        && getCaseIdPath( uploadObj.key ) == getCaseIdPath( _this.objKey ) ) {
                                        // It was Uploaded earlier but failed
                                        found = true;
                                        function getParts( nextPartNumberMarker ) {

                                            REQUEST.parts = {
                                                _cr: "",
                                                key: "",
                                                path: "/" + uploadObj.key,
                                                data: undefined,
                                                query_string: nextPartNumberMarker > 0 ? ( "?uploadId="
                                                    + uploadObj.uploadId
                                                    + "&part-number-marker=" + nextPartNumberMarker )
                                                    : "?uploadId="
                                                    + uploadObj.uploadId,
                                                uploadId: uploadObj.uploadId,
                                                awsUrl: "https://" + _this.AWS_BUCKET
                                                + ".s3.amazonaws.com",
                                                method: "GET",
                                                headers: {},
                                                canonParts: [],
                                                x_amz_headers: {},
                                                contentSha256: undefined,
                                                to_sign: undefined,
                                                stringToSign: undefined,
                                                computeContentMd5: false
                                            };

                                            getPartsUploadedEarlier(
                                                nextPartNumberMarker )
                                                .then(
                                                function( xml ) {
                                                    var jsonObj = XML2JSON
                                                        .xml_str2json( xml );

                                                    Object.keys( jsonObj.ListPartsResult ).forEach( key => {
                                                        if ( key == "Part" ) {
                                                            val = jsonObj.ListPartsResult[key];
                                                            for ( var i = 0; i < val.length; i++ ) {
                                                                chunkArray[val[i].PartNumber] = {
                                                                    ETag: val[i].ETag,
                                                                    status: "COMPLETE",
                                                                    partNumber: val[i].PartNumber,
                                                                }
                                                            }
                                                        }
                                                    });

                                                    if ( jsonObj.ListPartsResult.IsTruncated == true ) {
                                                        getParts( jsonObj.ListPartsResult.NextPartNumberMarker );
                                                    } else {
                                                        _generalHelper
                                                            .removeUploadCookie( uploadObj.id );

                                                        objKey = uploadObj.key;
                                                        resolve( REQUEST.parts.uploadId );
                                                        return;
                                                    }
                                                });
                                        }

                                        getParts( 0 );
                                        break;
                                    }
                                } catch ( e ) {
                                    // do nothing and continue loop
                                }
                            }
                        }
                        if ( found == false )
                            reject( true );
                    });
            }

            function getPartsUploadedEarlier( nextPartNumberMarker ) {
                return new Promise(
                    function( resolve, reject ) {

                        doSignAuth( REQUEST.parts )
                            .then(
                            function( response ) {
                                if ( response == "ERROR" ) {
                                    failure();
                                    return;
                                }
                                REQUEST.parts.rfc210HMAC = response;
                                var params = {
                                    "uploadId=": REQUEST.parts.uploadId
                                };
                                if ( nextPartNumberMarker > 0 )
                                    params["&part-number-marker="] = nextPartNumberMarker;
                                xhr(
                                    ( REQUEST.parts.awsUrl +REQUEST.parts.path ),
                                    "GET",
                                    {
                                        "Authorization": authorizationString( REQUEST.parts ),
                                        "x-amz-date": REQUEST.parts.x_amz_headers["x-amz-date"],
                                        "x-amz-content-sha256": REQUEST.parts.payloadSha256
                                    }, params ).then(
                                    function( response ) {
                                        resolve( response );
                                    }, function( error ) {
                                        reject();
                                    });
                            }, function( error ) {
                            });
                    });

            }

            function initiateMultiPart() {
                return new Promise(
                    function( resolve, reject ) {

                        doSignAuth( REQUEST.init )
                            .then(
                            function( response ) {
                                if ( response == "ERROR" ) {
                                    failure();
                                    return;
                                }
                                REQUEST.init.rfc210HMAC = response;

                                var headers = {
                                    "Authorization": authorizationString( REQUEST.init ),
                                    "x-amz-date": REQUEST.init.x_amz_headers["x-amz-date"],
                                    "x-amz-content-sha256": REQUEST.init.payloadSha256
                                };

                                if(_this.extra_amz_headers){
                                  Object.keys( _this.extra_amz_headers ).forEach(key=>{
                                    headers[key] =  _this.extra_amz_headers[key];
                                  });
                                }

                                xhr(
                                    ( REQUEST.init.awsUrl + REQUEST.init.path ),
                                    "POST",
                                    headers,
                                    {
                                        "uploads": ""
                                    }).then( function( response ) {
                                        resolve( response );
                                    }, function( error ) {
                                        reject();
                                    });
                            }, function( error ) {
                            });
                    });
            }

            function chunkAndSendMultiPart() {
                new Promise( function( resolve, reject ) {

                    Promise.all( [sendMultiPart] ).then(
                        function( resposne ) {

                        }, function( error ) {
                            reject( error );
                        });

                }, function( error ) {

                });
            }

            function checkAndCreateMultiPart() {

                return new Promise( function( resolve, reject ) {
                    var length = chunkArray.length;

                    var xml = "<CompleteMultipartUpload>";
                    for ( var i = 1; i <= maxChunked; i++ ) {

                        if ( chunkArray[i].status == 'COMPLETE' ) {
                            xml = xml + "<Part><PartNumber>" + ( i )
                                + "</PartNumber><ETag>"
                                + ETAG + "</ETag></Part>";
                        } else {
                            // We have already gave a try to upload it 5 or
                            // more times
                            // console.log(i + "th Part not uploaded");
                            reject( i + "th Part not uploaded" );
                        }
                    }
                    xml = xml + "</CompleteMultipartUpload>";

                    REQUEST.complete.payload = xml;
                    resolve( xml );
                });
            }

            REQUEST.complete = {
                _cr: "",
                key: "",
                path: "/" + _this.objKey,
                data: undefined,
                query_string: "?uploadId=" + REQUEST.uploadId,
                awsUrl: "https://" + _this.AWS_BUCKET
                + ".s3.amazonaws.com",
                method: "POST",
                headers: {},
                canonParts: [],
                x_amz_headers: {},
                contentType: "application/xml; charset=UTF-8",
                contentSha256: undefined,
                to_sign: undefined,
                stringToSign: undefined,
                computeContentMd5: false
            };

            function completeMultiPart() {
                REQUEST.complete.path = "/" + _this.objKey;
                REQUEST.complete.query_string = "?uploadId="
                    + REQUEST.uploadId;

                doSignAuth( REQUEST.complete )
                    .then(
                    function( response ) {
                        if ( response == "ERROR" ) {
                            failure();
                            return;
                        }
                        REQUEST.complete.rfc210HMAC = response;
                        xhr(
                            ( REQUEST.complete.awsUrl + REQUEST.complete.path ),
                            "POST",
                            {
                                "Authorization": authorizationString( REQUEST.complete ),
                                "x-amz-date": REQUEST.complete.x_amz_headers["x-amz-date"],
                                "x-amz-content-sha256": REQUEST.complete.payloadSha256,
                                "Content-Type": REQUEST.complete.contentType
                            }, {
                                "uploadId=": REQUEST.uploadId
                            }, REQUEST.complete.payload )
                            .then(
                            function( response ) {
                                // REQUEST.uploadId =
                                // response.substring(response.search('<UploadId>')
                                // + 10 ,
                                // response.search('</UploadId>'));
                                if ( response
                                    .indexOf( "CompleteMultipartUploadResult" ) > 0 )
                                    finish( _this.objKey );
                                else {

                                    finish( "ERROR" );
                                }

                            }, function( error ) {
                            })
                    }, function( error ) {

                    });
            }

            function sendMultiPart( request ) {

                return new Promise(
                    function( resolve, reject ) {

                        var threadOccupied = null;
                        var timeIn = datetime( 0 );
                        for ( var i = 0; i < threadArray.length; i++ ) {
                            if ( !( threadArray[i].Occupied ) ) {
                                threadArray[i].Occupied = true;
                                threadOccupied = i;
                                break;
                            }
                        }
                        if ( checkIsCancelled() ) {
                            CANCELLED = true;
                            finish( "CANCELLED" );
                            return;
                        }
                        if ( request.status != "COMPLETE" ) {

                            getChunk( request.from, request.to )
                                .then(
                                function( response ) {
                                    request.payload = response;
                                    response = undefined;
                                    doSignAuth( request )
                                        .then(
                                        function( response ) {

                                            /*
                                             * if(retryUpload > 3){
                                             *
                                             * return; }
                                             */
                                            if ( response == "ERROR" ) {
                                                // do nothing for this
                                                // chunk, let it come
                                                // back in next upload
                                                request.status = "FAILED";
                                                threadArray[threadOccupied].Occupied = false;
                                                resolve();
                                                request.payload = undefined;
                                            } else {
                                                request.rfc210HMAC = response;
                                                xhr(
                                                    ( request.awsUrl + request.path ),
                                                    "PUT",
                                                    {
                                                        "Authorization": authorizationString( request ),
                                                        "x-amz-date": request.x_amz_headers["x-amz-date"],
                                                        "x-amz-content-sha256": request.payloadSha256,
                                                        "Content-MD5": request.md5_digest
                                                    },
                                                    {
                                                        "partNumber=": request.partNumber,
                                                        "&uploadId=": REQUEST.uploadId
                                                    }, request.payload )
                                                    .then(
                                                    function(
                                                        response ) {
                                                        if ( response == "ERROR" ) {
                                                            // do
                                                            // nothing
                                                            // for this
                                                            // chunk,
                                                            // let it
                                                            // come back
                                                            // in next
                                                            // upload
                                                            request.status = "FAILED";
                                                            threadArray[threadOccupied].Occupied = false;
                                                        } else {
                                                            request.ETag = response;
                                                            request.status = "COMPLETE";
                                                            var minutes = ( datetime( 0 ) - timeIn )
                                                                / ( 1000 * 60 );
                                                            updateProgressPopUp( threadOccupied );
                                                            threadArray[threadOccupied].Occupied = false;
                                                        }
                                                        resolve();
                                                        request.payload = undefined;
                                                    });

                                            }
                                        })
                                });
                        } else {
                            updateProgressPopUp( threadOccupied );
                            threadArray[threadOccupied].Occupied = false;
                            resolve();
                        }
                    });
            }

            function getUploadedFile( key ) {
                var fileObj = null;
                uploadList.forEach( upload => {
                    if ( upload.fileKey === _this.objKey )
                        fileObj = upload;
                });
                return fileObj;
            }


            function multiPartingUpload( response ) {

                REQUEST.uploadId = response;
                // To Update - UploadList needs to be in same format as our data
                getUploadedFile( _this.objKey )['uploadId'] = response;
                // uploadList[id]["uploadId"] = response;
                // uploadList[id]["key"] = _this.objKey;


                if ( 'createUploadCookie' in _generalHelper )
                    _generalHelper.createUploadCookie( id, JSON
                        .stringify( getUploadedFile( _this.objKey ) ), 1 );

                // The upload request is granted, lets create the
                // array and upload chunks
                var from = 0;
                var to = fixedChunk;
                var allUploaded = true;

                for ( var i = 1; i <= maxChunked; i++ ) {
                    if ( !chunkArray[i] ) {
                        chunkArray[i] = {
                            from: from,
                            to: ( to > file.file.size ? file.file.size : to ),
                            ETag: null,
                            status: "PENDING",
                            partNumber: i,
                            _cr: "",
                            key: "",
                            path: '/' + _this.objKey,
                            data: undefined,
                            payload: undefined,
                            query_string: "?partNumber=" + ( i )
                            + "&uploadId=" + REQUEST.uploadId,
                            awsUrl: "https://" + _this.AWS_BUCKET
                            + ".s3.amazonaws.com",
                            method: "PUT",
                            headers: {},
                            canonParts: [],
                            x_amz_headers: {},
                            contentSha256: "UNSIGNED-PAYLOAD",
                            to_sign: undefined,
                            stringToSign: undefined,
                            computeContentMd5: true,
                            md5_digest: undefined

                        };
                    }

                    from = to;
                    to = ( ( to + fixedChunk ) >= file.file.size ) ? ( file.file.size )
                        : ( to + fixedChunk );
                }


                function checkAllThreadsReleased() {
                    return new Promise( function( resolve, reject ) {
                        var released = true;
                        for ( var i = 0; i < threadArray.length; i++ ) {
                            if ( threadArray[i].Occupied ) {
                                released = false;
                                break;
                            }
                        }
                        if ( released ) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }

                function uploadFailedChunks() {
                    checkAllThreadsReleased().then(
                        function() {
                            retryUpload = retryUpload + 1;
                            chunkArray.current = 0;
                            chunksSent = 0;
                            initUpload();
                        }, function() {

                            // Its a genuine reject, do nothing
                        })
                }

                function completeUpload() {
                    if ( checkIsCancelled() ) {
                        CANCELLED = true;
                        finish( "CANCELLED" );
                        return;
                    }
                    checkAllThreadsReleased().then(
                        function() {
                            if ( !completingMultiPart ) {
                                completingMultiPart = true;
                                checkAndCreateMultiPart().then(
                                    function( response ) {
                                        completeMultiPart();
                                    }, function() {

                                        failure();
                                    });
                            }
                        });
                }



                function sendChunk( current ) {
                    sendMultiPart( chunkArray[chunkArray.current] )
                        .then(
                        function( response ) {
                            CANCELLED == false ? ( ( chunkArray
                                .increment() > maxChunked ) ? ( ( retryUpload < 10 ) ? uploadFailedChunks()
                                    : completeUpload() )
                                : sendChunk( chunkArray[chunkArray.current] ) )
                                : null;
                        });
                }

                function initUpload() {
                    var totalThreads = 2; // for large files, we should not give
                                          // 6, otherwise, the cpu is always
                                          // 100%, so reduce it here to 2
                    if ( maxChunked > totalThreads ) {
                        for ( var i = 0; i < totalThreads; i++ ) {
                            threadArray[i] = {
                                "Occupied": false,
                                timeInit: new Date().getTime()
                            };
                            sendChunk( chunkArray.increment() );
                        }
                    } else {
                        for ( var i = 0; i < 1; i++ ) {
                            threadArray[i] = {
                                "Occupied": false,
                                timeInit: new Date().getTime()
                            };
                            sendChunk( chunkArray.increment() );
                        }
                    }
                }

                initUpload();
            }

            initiateMultiPart().then( function( response ) {
                multiPartingUpload( getUploadId( response ) );
            })


            // checkIsUploadedEarlier().then( function( response ) {
            // multiPartingUpload( response );
            // }, function( result ) {
            // if ( result ) {
            // initiateMultiPart().then( function( response ) {
            // multiPartingUpload( getUploadId( response ) );
            // })
            // }
            // });

        });
    }

}

module.exports = JnprS3UploaderService;
