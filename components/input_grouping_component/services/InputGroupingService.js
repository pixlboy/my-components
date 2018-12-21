class InputGroupingService {

     getCount(str) {
        var currentTextlength = 0;
        currentTextlength = str.length;
        return currentTextlength;
    }
    
    checkStrLengthValidity(str , maxTextLength){
        var error = false;
        error = (str.length > maxTextLength) ?  true : false;
        return error;

    }
}
export default InputGroupingService;
