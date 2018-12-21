import * as actionType from '../actions/ActionType';
const tabbedWrapperReducer = (state={}, action) => {
    let newState;
    switch (action.type) {
        case actionType.TAB_CLICKED:
            newState = Object.assign({}, state, {
                tabindex:action.payload.tabindex,
                content:action.payload.content
            });
        break;
        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default tabbedWrapperReducer;
