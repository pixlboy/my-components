import { setItems} from '../actions';
import InputGroupingReducer from '../reducers/InputGroupingReducer';

class InputGroupingStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
        currentTextlength: 0
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
            getInputGroupingStore(this._appId)._listeners = getInputGroupingStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    setItems(str , maxTextLength) {
        this.dispatch(setItems(str , maxTextLength));
    }

}
let inputGroupingStore;
let getInputGroupingStore = function(appId){
    if(!inputGroupingStore){
        inputGroupingStore = {};
    }
    if( !(appId in inputGroupingStore) ){
        inputGroupingStore[appId] = new InputGroupingStore(appId, InputGroupingReducer);
    }
    return inputGroupingStore[appId];
}

export default getInputGroupingStore;
