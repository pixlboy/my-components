import * as actionType from '../actions/ActionType';
const confirmationpopReducer = (state={}, action) => {
    let newState;
    switch (action.type) {
        case actionType.BUTTON_CLICK:
            newState = Object.assign({}, state, {
                config:{
                    config:action.payload.config,
                    title:action.payload.config.title,
                    content:action.payload.config.content,
                    buttons:action.payload.config.buttons,
                    visible: action.payload.visible
             }
         });
        break;
        case actionType.SET_VISIBLE:
            newState = Object.assign({}, state, {
                visible: action.payload.visible,
            });
        break;
        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default confirmationpopReducer;
