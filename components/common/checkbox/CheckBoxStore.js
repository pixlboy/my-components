class CheckBoxStore {

    constructor(appId) {
        this._appId = appId;
        this._listeners = [];
    }

    dispatch(dt) {
        this._listeners.forEach((listener) => listener(dt));
    }

    subscribe(listener) {
        this._listeners.push(listener);
        //this return is used for return unsubscrib call back for purpose of removing listeners
        return () => {
            getCheckBoxStore(this._appId)._listeners = getCheckBoxStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    setChecked(checked) {
        this.dispatch(checked);
    }

}
let checkBoxStore;
let getCheckBoxStore = function(appId){
    if(!checkBoxStore){
        checkBoxStore = {};
    }
    if( !(appId in checkBoxStore) ){
        checkBoxStore[appId] = new CheckBoxStore(appId);
    }
    return checkBoxStore[appId];
}

export default getCheckBoxStore;
