import * as actionType from './ActionType';

export const setItems = function(str , maxTextLength) {
    return {type: actionType.SET_ITEMS, payload: str , maxTextLength: maxTextLength}
}

