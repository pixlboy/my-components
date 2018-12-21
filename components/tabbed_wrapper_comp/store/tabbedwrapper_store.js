import tabbedwrapperReducer from '../reducers/tabbedwrapperReducer';
import {tabClick} from '../actions';

class TabbedWrapperStore {

    constructor(appId, reducer) {
        this._appId = appId;
        this._state = {
            tabindex: 0,
            content: ""
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

    setContent(content, tabindex){
        this.dispatch(tabClick(content, tabindex));
    }

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            getTabbedWrapperStore(this._appId)._listeners = getTabbedWrapperStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

}
let tabbedWrapperStore;
let getTabbedWrapperStore = function(appId){
    if(!tabbedWrapperStore){
        tabbedWrapperStore = {};
    }
    if( !(appId in tabbedWrapperStore) ){
        tabbedWrapperStore[appId] = new TabbedWrapperStore(appId, tabbedwrapperReducer);
    }

    return tabbedWrapperStore[appId];
}
    module.exports = getTabbedWrapperStore;
