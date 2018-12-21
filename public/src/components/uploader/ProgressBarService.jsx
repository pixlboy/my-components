var jnprDataObject = require( './DataObjectFactory' ).getDataObject();

var ProgressBarService = {

        getNoneExpiredFiles: function(appId){
            //return jnprDataObject.getFilesFor(appId); 
            return jnprDataObject.getFilesForNot(appId, 'STATUS_EXPIRED');
        }
        
};

module.exports = ProgressBarService;