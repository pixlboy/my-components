let UploaderService = require( './UploaderService' );
let NISTUploaderService = require( './NISTUploaderService' );
let uploaderDataObject = require( './DataObjectFactory' ).getDataObject();
var UploaderMixin = {

    getDefaultProps: function() {
        return {
            appId: "app",
            logging:false
        }
    },

    getInitialState: function() {
        return {
            errors: []
        }
    },

    componentDidMount: function() {
        if(this.props.generalUploader){
            NISTUploaderService.setGenericCofigsFor( this.props.appId, this.props );
            uploaderDataObject.subscribeToManadatoryConfigs( this.props.appId, function() {
                //trigger uploader start event
                if('onUploadStart' in this.props)
                    this.props.onUploadStart();
                //now we need to auto-trigger the subscribers for Starting the progress bar
                uploaderDataObject.triggerFileUploadStart(this.props.appId);
                NISTUploaderService.nistFileUpload(this.props.appId, this.props.logging);
            }.bind( this ) );

            uploaderDataObject.subscribeToFileOptions( this.props.appId, function(fileOptions) {
              NISTUploaderService.updateGenericFileOptionsFor(this.props.appId, fileOptions);
            }.bind(this));

            uploaderDataObject.subscribeToFileCurrentNames(this.props.appId, function(fileNames){
                NISTUploaderService.updateCurrentFileNames(this.props.appId, fileNames);
            }.bind(this));

        }else{
            UploaderService.setCofigsFor( this.props.appId, this.props );
            uploaderDataObject.subscribeToFileKey( this.props.appId, function() {
                //trigger uploader start event
                if('onUploadStart' in this.props)
                    this.props.onUploadStart();
                //now we need to auto-trigger the subscribers for Starting the progress bar
                uploaderDataObject.triggerFileUploadStart(this.props.appId);
                UploaderService.fileUpload(this.props.appId, this.props.logging);
            }.bind( this ) );

            uploaderDataObject.subscribeToFileOptions( this.props.appId, function(fileOptions) {
              UploaderService.updateFileOptions(this.props.appId, fileOptions);
            }.bind(this));

            uploaderDataObject.subscribeToFileCurrentNames(this.props.appId, function(fileNames){
                UploaderService.updateCurrentFileNames(this.props.appId, fileNames);
            }.bind(this));

        }
    },

    // _openAttach: function() {
    //     this.refs['SelectFile_' + this.props.appId].click();
    // },

    _openAttach: function _openAttach(cb) {
        var _this = this;
        if ('onUploadButtonHit' in this.props) {
            this.props.onUploadButtonHit(function(readOnlyFlag){
                if(!readOnlyFlag) {
                    _this.refs['SelectFile_' + _this.props.appId].click();
                }
            });
        } else {
            _this.refs['SelectFile_' + _this.props.appId].click();
        }
        
    },

    _fileSelected: function() {

        var files = [];
        for ( var i = 0; i < this.refs['SelectFile_' + this.props.appId].files.length; i++ ) {
            files.push( this.refs['SelectFile_' + this.props.appId].files[i] );
        }
        //now we need to clean the files
        this.refs['SelectFile_' + this.props.appId].value = null;

        if(this.props.generalUploader){
            var errors = NISTUploaderService.checkUploadedFilesFor( this.props.appId, files, this.props.info);
            if ( errors.length > 0 ) {
                this.setState( {
                    errors: errors
                });
                //let's reset files here
                NISTUploaderService.resetFilesFor(this.props.appId);
            } else {
                this.setState( {
                    errors: []
                });
                //upload here
                //step 1. getUpdateConfigs
                if ( 'onUpdateConfigs' in this.props )
                    this.props.onUpdateConfigs( NISTUploaderService.getFilesFor( this.props.appId, 'STATUS_CHOOSEN' ) );
            }
        }else{
            var errors = UploaderService.checkUploadedFilesFor( this.props.appId, files );
            if ( errors.length > 0 ) {
                this.setState( {
                    errors: errors
                });
                //let's reset files here
                UploaderService.resetFilesFor(this.props.appId);
            } else {
                this.setState( {
                    errors: []
                });
                //upload here
                //step 1. getUploadFileKeys
                if ( 'onUploadKeys' in this.props )
                    this.props.onUploadKeys( UploaderService.getFilesFor( this.props.appId, 'STATUS_CHOOSEN' ) );
            }
        }

    }
}

module.exports = UploaderMixin;
