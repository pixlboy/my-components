/**
 * File fields: file (File) lastModified,lastModifiedDate,name,size,type,webkitRelativePath
 * Extra Fields: status, uploaded, id, fileKey
 */


class File {

    /**
     * Stats
     * {
            speed: 70343222.003493043, // avgSpeedBytesPerSecond,
            readableSpeed: "703 Kb",
            loaded: 7034333 // Bytes loaded since the last call
        }
     */

    //'STATUS_CHOOSEN'. 'STATUS_UPLOADING',  'STATUS_COMPLETED','STATUS_FAILED', 'STATUS_EXPIRED', 'STATUS_CANCELED'; This status is used to remove it
    constructor( fileObj ) {
        this['file'] = fileObj;
        this['status'] = 'STATUS_CHOOSEN';
        this['uploaded'] = 0;
        this['stats'] = null;
        this['id'] = Math.floor( Math.random() * 100000 );
        this['fileKey'] = '';
    }
}

module.exports = File;
