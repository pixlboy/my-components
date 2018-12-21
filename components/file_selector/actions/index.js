import * as actionType from './ActionType';

export const fileSelected = (file, restrictions)=>{
    return {type: actionType.FILE_SELECTED, file: file, restrictions: restrictions}
}
export const removeFile = () => {
    return {type: actionType.FILE_REMOVE}
}
export const startProcessing = () => {
    return {type: actionType.START_PROCESSING}
}
export const finishedProcessing = () => {
    return {type: actionType.FINISHED_PROCESSING}
}
