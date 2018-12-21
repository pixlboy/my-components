import * as actionType from './ActionType';

export const setRadioButtonVal = function(val) {
    return {type: actionType.SET_VAL, payload: val}
}

export const setInitialState = function(options) {
    return {type: actionType.SET_INITIAL_STATE, payload: options}
}
