
class DatePickerStore {

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
            getDatePickerStore(this._appId)._listeners = getDatePickerStore(this._appId)._listeners.filter(l => l !== listener);
        };
    }

    setNewDate(dateString) {
        this.dispatch(dateString);
    }

}
let datePickerStore;
let getDatePickerStore = function(appId){
    if(!datePickerStore){
        datePickerStore = {};
    }
    if( !(appId in datePickerStore) ){
        datePickerStore[appId] = new DatePickerStore(appId);
    }
    return datePickerStore[appId];
}

export default getDatePickerStore;
