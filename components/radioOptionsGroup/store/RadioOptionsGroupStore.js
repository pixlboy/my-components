import {setRadioButtonVal, setInitialState} from '../actions';
import RadioOptionsGroupReducer from '../reducers/RadioOptionsGroupReducer';

class RadioButtonStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
            value: ""
        }
        this._listeners = [];
        this._reducer = reducer;
    }

    getState() {
        return this._state;
    }

    dispatch(action): void {
        this._state = this._reducer(this._state, action);
        this._listeners.forEach((listener) => listener());
    }

    subscribe(listener) {
        this._listeners.push(listener);
        //this return is used for return unsubscrib call back for purpose of removing listeners
        return() => {
            getRadioButtonStore(this._appId)._listeners = getRadioButtonStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    setRadioButtonVal(val) {
        this.dispatch(setRadioButtonVal(val));
    }

    setInitialState(options) {
        this.dispatch(setInitialState(options));
    }

}
let radioButtonStore;
let getRadioButtonStore = function(appId) {
    if (!radioButtonStore) {
        radioButtonStore = {};
    }
    if (!(appId in radioButtonStore)) {
        radioButtonStore[appId] = new RadioButtonStore(appId, RadioOptionsGroupReducer);
    }
    return radioButtonStore[appId];
}

export default getRadioButtonStore;
