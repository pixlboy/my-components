import * as actionType from './ActionType';

export const addCounter = function(stepValue){
    return {
        type: actionType.ADD_COUNTER,
        payload: stepValue
    }
}

export const removeCounter = function(stepValue){
    return {
        type: actionType.REMOVE_COUNTER,
        payload: stepValue
    }
}

export const changeStep = function(number){
    return {
        type: actionType.SET_STEP,
        payload: number
    }
}
