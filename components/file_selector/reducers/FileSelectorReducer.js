import * as actionType from '../actions/ActionType';
import FileSelectorService from '../services/FileSelectorService';
import * as FileStatus from '../store/Status';

const FileSelectorReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case actionType.FILE_SELECTED:
            let service = new FileSelectorService(action.restrictions);
            let errors = service.checkFileValidity(action.file);
            if (errors.length > 0) {
                newState = Object.assign({}, state, {
                    selectedFile: null,
                    errors: errors,
                    status: FileStatus.EMPTY
                });
            } else {
                newState = Object.assign({}, state, {
                    selectedFile: action.file,
                    errors: [],
                    status: FileStatus.READY
                });
            }
            break;
        case actionType.FILE_REMOVE:
            newState = Object.assign({}, state, {
                selectedFile: null,
                errors: [],
                status: FileStatus.EMPTY
            });
            break;
        case actionType.START_PROCESSING:
            newState = Object.assign({}, state, {status: FileStatus.PROCESSING});
            break;
        case actionType.FINISHED_PROCESSING:
            newState = Object.assign({}, state,
                {
                    status: FileStatus.EMPTY,
                    selectedFile: null,
                    errors:[]
                });
            break;
        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default FileSelectorReducer;
