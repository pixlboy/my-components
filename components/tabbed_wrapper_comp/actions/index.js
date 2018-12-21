import * as actionType from './ActionType';

export const tabClick = (content, tabindex) => {
    return {type: actionType.TAB_CLICKED, payload:{content: content, tabindex: tabindex} }
}
