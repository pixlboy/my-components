import confirmationpopReducer from '../reducers/confirmationpopReducer';
import {cancelPopUp, setVisible} from '../actions';

class ConfirmationPopStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
            config:{
                title: "",
                content: "",
                buttons: [0, "default content"],
                visible: false
            }
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

    setConfig(config){
        this.dispatch(cancelPopUp(config));
    }
    setVisible(visible){
        this.dispatch(setVisible(visible));
    }

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            getConfirmationPopStore(this._appId)._listeners = getConfirmationPopStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

}
let confirmationpopupStore;
let getConfirmationPopStore = function(appId){
    if(!confirmationpopupStore){
        confirmationpopupStore = {};
    }
    if( !(appId in confirmationpopupStore) ){
        confirmationpopupStore[appId] = new ConfirmationPopStore(appId, confirmationpopReducer);
    }

    return confirmationpopupStore[appId];
}
    module.exports = getConfirmationPopStore;
