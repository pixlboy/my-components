import FileSelectorReducer from '../reducers/FileSelectorReducer';
import {fileSelected, removeFile, startProcessing, finishedProcessing} from '../actions';
import * as FileStatus from './Status';

class FileSelectorStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
            selectedFile: null,
            errors: [],
            status: FileStatus.EMPTY
        }
        this._listeners = [];
        this._reducer = reducer;
    }

    getState() {
        return this._state;
    }

    dispatch(action) : void {
        this._state = this._reducer(this._state, action);
        this._listeners.forEach((listener) => listener());
    }

    subscribe(listener) {
        this._listeners.push(listener);
        //this return is used for return unsubscrib call back for purpose of removing listeners
        return () => {
            getFileSelectorStore(this._appId)._listeners = getFileSelectorStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    selectFile(file, restrictions){
        this.dispatch(fileSelected(file, restrictions));
    }

    removeFile(){
        this.dispatch(removeFile());
    }

    startProcessing(){
        this.dispatch(startProcessing());
    }
    finishedProcessing(){
        this.dispatch(finishedProcessing());
    }
}
let fileSelectorStore;
let getFileSelectorStore = function(appId){
    if(!fileSelectorStore){
        fileSelectorStore = {};
    }
    if( !(appId in fileSelectorStore) ){
        fileSelectorStore[appId] = new FileSelectorStore(appId, FileSelectorReducer);
    }
    return fileSelectorStore[appId];
}

export default getFileSelectorStore;
