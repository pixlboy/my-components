class FileSelectorService {

    constructor(restrictions) {
        this.restrictions = restrictions;
    }

    checkFileValidity(file){

        var errors = [];

        if(this.restrictions && 'allowedFileTypes' in this.restrictions){
            var exist = false;
            this.restrictions['allowedFileTypes'].forEach(type=>{
                exist = exist || (file.name.substr(file.name.lastIndexOf('.')+1).toLowerCase()===type.toLowerCase());
            });
            if(!exist){
                if('allowedFileTypesErrorMsg' in this.restrictions && !!this.restrictions.allowedFileTypesErrorMsg){
                    errors.push(this.restrictions.allowedFileTypesErrorMsg);
                }else{
                    errors.push(`File ${file.name} type is not accetable`);
                }
            }
        }
        if(this.restrictions && 'maxEachFileSize' in this.restrictions){
            if(file.size>this.restrictions['maxEachFileSize']){
                errors.push( `File ${file.name} has exceeded the max size allowed, which should be under ${parseInt( this.restrictions['maxEachFileSize'] ) / 1000} KB`);
            }
        }
        return errors;
    }
}
export default FileSelectorService;
