import dropDownInputReducers from '../reducers/dropDownInputReducers';
import {setItems} from '../actions';
import {fitlerItems} from '../actions';
import {setInitialState} from '../actions';
import {setSelectedItem} from '../actions';
import {setDropDownStatus} from '../actions';
import {setError} from '../actions';
import {setMultiSelectedItem} from '../actions';
import {setDisabled} from '../actions';
class DropDownInputStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
            originalItems: [],
            items: [],
            disabled: false,
            selectedItem: null,
            showDropDown: false,
            searchTerm: "",
            error: false ,//this is used for display error styles, if user input term is invalid, then we need to show error state
            passedProps: {} //this is used to pass back the props
        };
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
            getDropDownInputStore(this._appId)._listeners = getDropDownInputStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    //Start app specific methods here
    setItems(items) {
        this.dispatch(setItems(items));
    }
    setInitialState(options) {
        this.dispatch(setInitialState(options));
    }

    filterItems(term) {
        this.dispatch(fitlerItems(term));
    }
    setSelectedItemValue(value) {
        this.dispatch(setSelectedItem(value));
    }
    setMultiSelectedItem(item) {
        this.dispatch(setMultiSelectedItem(item));
    }
    setDropDown(open) {
        this.dispatch(setDropDownStatus(open));
    }
    setError(error) {
        this.dispatch(setError(error));
    }
    setPassedProps(props){
        getDropDownInputStore(this._appId)._state['passedProps'] = props;
    }
    setDisabled(disabled){
        this.dispatch(setDisabled(disabled));
    }
}

var dropDownInputStores;
var getDropDownInputStore = function(appId) {
    if (!dropDownInputStores) {
        dropDownInputStores = {};
    }
    if (!(appId in dropDownInputStores)) {
        dropDownInputStores[appId] = new DropDownInputStore(appId, dropDownInputReducers);
    }
    return dropDownInputStores[appId];
}

export default getDropDownInputStore;
