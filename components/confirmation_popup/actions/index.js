import * as actionType from './ActionType';

export const cancelPopUp = (config) => {
    return {type: actionType.BUTTON_CLICK, payload:{ config:{title:config.title, content:config.content, buttons: config.buttons}, visible:config.visible } }
}

export const setVisible = (visible) => {
    return {type:actionType.SET_VISIBLE, payload:{visible:visible} }
}
