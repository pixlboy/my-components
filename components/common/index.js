export const trans = function(props, term) {
    let translatedResult;
    if (props.trans) {
        translatedResult = props.trans(term);
    }
    if (!translatedResult){
        translatedResult = term;
    }
    return translatedResult;
}
