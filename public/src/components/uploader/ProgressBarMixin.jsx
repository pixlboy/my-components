let uploaderDataObject = require( './DataObjectFactory' ).getDataObject();
let ProgressBarService = require( './ProgressBarService' );

var ProgressBarMixin = {

    getDefaultProps: function() {
        return {
            appId: "app",
            monitorAppId: "app"
        }
    },

    getInitialState: function() {
        return {
            files: []
        }
    },

    componentDidMount: function() {
        uploaderDataObject.subscribeToProgress( this.props.monitorAppId, function( err, fileObj ) {
            this._updateProgress( err, fileObj );
        }.bind( this ) );
        this._updateProgress();
    },

    componentWillUnmount: function() {
        //before destroy, we need to unsubscribe listender here
        uploaderDataObject.unSubscribeToProgress( this.props.monitorAppId );
    },

    close: function() {
        if ( 'onClose' in this.props )
            this.props.onClose();
    },

    _updateProgress: function( err, fileObj ) {
        var files = ProgressBarService.getNoneExpiredFiles( this.props.monitorAppId );
        if ( files.length == 0 ) {
            //now, we need to self-destroy
            if(err !== "FAILED"){
                this.close();
            }
        } else
            this.setState( {
                files: files
            });
    }

};
module.exports = ProgressBarMixin;