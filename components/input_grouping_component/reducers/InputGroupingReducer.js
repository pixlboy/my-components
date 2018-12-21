import * as actionType from '../actions/ActionType';
import InputGroupingService from '../services/InputGroupingService';

const InputGroupingReducer = (state = {}, action) => {
    let newState;
    let service = new InputGroupingService();
    switch (action.type) {
        case actionType.SET_ITEMS:
            let error = service.checkStrLengthValidity(action.payload , action.maxTextLength);

            if(!error){
                var currentTextlength = service.getCount(action.payload);
                newState = Object.assign({}, state, {
                    currentTextlength: currentTextlength
                }); 
            }                
            break;

        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default InputGroupingReducer;
