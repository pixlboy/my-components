import * as actionType from '../actions/ActionType';
import RadioOptionsGroupService from '../services/RadioOptionsGroupService';

const RadioOptionsGroupReducer = (state = {}, action) => {
    let newState;
    let service = new RadioOptionsGroupService();
    switch (action.type) {

        case actionType.SET_INITIAL_STATE:
            var val = service.getSelectedRadioValue(action.payload);
            newState = Object.assign({}, state, {value: val});
            break;

        case actionType.SET_VAL:
            var val = service.setSelectedRadioValue(action.payload);
            newState = Object.assign({}, state, {value: val});
            break;

        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default RadioOptionsGroupReducer;
