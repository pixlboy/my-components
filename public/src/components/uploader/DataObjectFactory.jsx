let File = require( './file' );

class DataObject {

    constructor() {
        this._uploadFiles = {};
        this._uploadingRestrictions = {};
        this._postMandatoryConfigs = {};
        this._subscribers_filekey = {};
        this._subscribers_mandatory_configs = {};
        this._subscribers_progress = {}; // this one is used only be
        // progressBar, as when we close
        // progressBar, the listener will be
        // emptied, so we can not put more
        // listeners here
        this._subscribers_status = {}; // this one is used by listener from
        // Application, once progressBar is
        // closed, if we want to show user
        // status, we need to use this listener
        this._subscribers_start = {};
        this._subscribers_change_file_options = {};
        this._subscribers_current_filenames= {};
    }

    resetFilesFor( appId ) {
        if ( appId in this._uploadFiles )
        this._uploadFiles[appId] = [];
    }

    subscribeToFileCurrentNames(appId, cb){
        if ( !( appId in this._subscribers_current_filenames ) ){
            this._subscribers_current_filenames[appId] = {};
        }
        this._subscribers_current_filenames[appId] =  cb ;
    }

    triggerFileCurrentNames(appId, fileNameList){
        if ( appId in this._subscribers_current_filenames ){
            this._subscribers_current_filenames[appId](fileNameList);
        }
    }

    subscribeToFileOptions(appId, cb){
        if ( !( appId in this._subscribers_change_file_options ) )
        this._subscribers_change_file_options[appId] = {};
        this._subscribers_change_file_options[appId] =  cb ;
    }

    subscribeToFileKey( appId, cb ) {
        if ( !( appId in this._subscribers_filekey ) )
        this._subscribers_filekey[appId] = {};
        this._subscribers_filekey[appId] =  cb;
    }
    subscribeToManadatoryConfigs( appId, cb ) {
        if ( !( appId in this._subscribers_mandatory_configs ) )
        this._subscribers_mandatory_configs[appId] = {};
        this._subscribers_mandatory_configs[appId] =  cb;
    }

    subscribeToStatus( appId, cb ) {
        if ( !( appId in this._subscribers_status ) )
        this._subscribers_status[appId] = [];
        this._subscribers_status[appId].push( cb );
    }

    subscribeToProgress( appId, cb ) {
        if ( !( appId in this._subscribers_progress ) )
        this._subscribers_progress[appId] = [];
        this._subscribers_progress[appId].push( cb );
    }

    subscribeToStart( appId, cb ) {
        if ( !( appId in this._subscribers_start ) )
        this._subscribers_start[appId] = [];
        this._subscribers_start[appId].push( cb );
    }

    triggerFileUploadStart( appId ) {
        if ( !( appId in this._subscribers_start ) )
        this._subscribers_start[appId] = [];
        this._subscribers_start[appId].forEach( cb => {
            cb();
        });
    }

    unSubscribeToProgress( appId ) {
        this._subscribers_progress[appId] = [];
    }

    setFileOptionsFor(appId, fileOptions){
        if ( appId in this._subscribers_change_file_options )
        this._subscribers_change_file_options[appId](fileOptions);
    }

    setProgressFor( appId, err, fileObj ) {
        if ( !( appId in this._subscribers_progress ) )
        this._subscribers_progress[appId] = [];
        if ( !( appId in this._subscribers_status ) )
        this._subscribers_status[appId] = [];
        this._subscribers_progress[appId].forEach( cb => {
            cb( err, fileObj );
        });
        this._subscribers_status[appId].forEach( cb => {
            cb( err, fileObj );
        });
    }

    setRestrictionsFor( appId, obj ) {
        if ( !( appId in this._uploadingRestrictions ) )
        this._uploadingRestrictions[appId] = {};
        if ( 'maxFileCounts' in obj )
        this._uploadingRestrictions[appId]['maxFileCounts'] = obj['maxFileCounts'];
        if ( 'maxTotalFilesSize' in obj )
        this._uploadingRestrictions[appId]['maxTotalFilesSize'] = obj['maxTotalFilesSize'];
        if ( 'maxEachFileSize' in obj )
        this._uploadingRestrictions[appId]['maxEachFileSize'] = obj['maxEachFileSize'];
        if ( 'allowedFileTypes' in obj )
        this._uploadingRestrictions[appId]['allowedFileTypes'] = obj['allowedFileTypes'];
    }

    getRestrictionsFor( appId ) {
        if ( !( appId in this._uploadingRestrictions ) )
        this._uploadingRestrictions[appId] = {};
        return this._uploadingRestrictions[appId];
    }

    getCurrentUploadFilesFor( appId ) {
        if ( !( appId in this._uploadFiles ) )
        this._uploadFiles[appId] = [];
        return this._uploadFiles[appId];
    }

    getFilesFor( appId, status ) {
        return this.getCurrentUploadFilesFor( appId ).filter( file => {
            if ( status )
            return file['status'] == status;
            else
            return true;
        });
    }

    getFilesForNot( appId, status ) {
        return this.getCurrentUploadFilesFor( appId ).filter( file => {
            return file['status'] !== status;
        });
    }

    // here we only adding key to waiting files
    setFileKeysAndConfigFor( appId, keysAndConfigs ) {
        var files = this.getFilesFor( appId, 'STATUS_CHOOSEN' );
        if ( keysAndConfigs.length != files.length )
        console.log( 'error, not enough keys' );
        else {
            for ( var i = 0; i < files.length; i++ ){
                files[i]['fileKey'] = keysAndConfigs[i].path;
                files[i]['configs'] = keysAndConfigs[i].configs;
            }
            // once we set all fileKey, we need to trigger the subscribers
            this._subscribers_filekey[appId]();
        }
    }

    getPostMandatoryConfigs(appId) {
        if ( !( appId in this._postMandatoryConfigs ) )
        this._postMandatoryConfigs[appId] = [];
        return this._postMandatoryConfigs[appId];
    }

    setPostMandatoryConfigs(appId, data) {
        if ( !( appId in this._postMandatoryConfigs ) )
        this._postMandatoryConfigs[appId] = {};
        if ( 'uploaderUrlList' in data )
        this._postMandatoryConfigs[appId]['uploaderUrlList'] = data['uploaderUrlList'];
        if ( 'customHeaders' in data )
        this._postMandatoryConfigs[appId]['customHeaders'] = data['customHeaders'];

        this._subscribers_mandatory_configs[appId]();
    }


    checkUploadedFilesFor( appId, files, info ) {
        var restrictions = this.getRestrictionsFor( appId );
        var errors = [];

        if ( 'maxFileCounts' in this.getRestrictionsFor( appId ) )
        if ( this.getFilesForNot( appId, 'STATUS_EXPIRED' ).length + files.length > this.getRestrictionsFor( appId )['maxFileCounts'] )
        errors.push( "Max of " + this.getRestrictionsFor( appId )['maxFileCounts'] + " simultaneous uploads are allowed. Please reduce the number." )

        var totalUploadFileSize = 0;

        if ( this.getFilesForNot( appId, 'STATUS_EXPIRED' ).length > 0 )
        this.getFilesForNot( appId, 'STATUS_EXPIRED' ).forEach( file => {
            totalUploadFileSize += file.size;
        });

        if ( errors.length == 0 )
        files.forEach( file => {

            // if(file.size>1000000000 && files.length>1)
            // errors.push('You can only upload one big file (1GB or above) at one time.');

            totalUploadFileSize += file.size;

            // check each fileSize
            if ( 'maxEachFileSize' in this.getRestrictionsFor( appId ) && file.size > this.getRestrictionsFor( appId )['maxEachFileSize'] )
            errors.push( 'File ' + file.name + ' has exceeded the max size allowed, which should be under ' + parseInt( this.getRestrictionsFor( appId )['maxEachFileSize'] ) / 1000 + "KB" );
            // check the fileType
            if ( 'allowedFileTypes' in this.getRestrictionsFor( appId ) ) {
                var exist = false;
                this.getRestrictionsFor( appId )['allowedFileTypes'].forEach( type => {
                    exist = exist || file.type.includes( type );
                });
                if ( !exist )
                errors.push( 'File ' + file.name + ' type is not accetable' );
            }
        });

        // now, we need to check fileSize, only one big file is allowed




        // finally, check totalFileSize
        if ( 'maxTotalFilesSize' in this.getRestrictionsFor( appId ) && totalUploadFileSize > this.getRestrictionsFor( appId )['maxTotalFilesSize'] )
        errors.push( 'Total File Size is too big, should be below ' + parseInt( this.getRestrictionsFor( appId )['maxTotalFilesSize'] ) / 1000 + 'kb' );
        if ( errors.length == 0 )
        files.forEach( file => {
            if(info){
                file['info'] = info;
            }
            this._uploadFiles[appId].push( new File( file ) );
        });

        return errors;

    }
}


var DataObjectFactory = {
    dataObject: null,
    getDataObject: function() {
        if ( this.dataObject == null ) {
            this.dataObject = new DataObject();
        }
        return this.dataObject;
    }
}

module.exports = DataObjectFactory;
