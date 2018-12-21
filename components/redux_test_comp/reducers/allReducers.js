import * as actionType from '../actions/ActionType';

const allReducers = (state={}, action)=>{
    let newState;
    switch(action.type){
        case actionType.ADD_COUNTER:
        newState = Object.assign({}, state, { count: state.count+ action.payload});
        break;
        case actionType.REMOVE_COUNTER:
        newState=Object.assign({}, state, { count: state.count - action.payload});
        break;
        case actionType.SET_STEP:
        newState=Object.assign({}, state, {step: action.payload});
        break;
        default:
        newState = Object.assign({}, state);
    }
    return newState;
}

export default  allReducers;
