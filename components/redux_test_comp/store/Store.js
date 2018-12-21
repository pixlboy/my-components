import allReducers from '../reducers/allReducers';

import {addCounter} from '../actions';
import {removeCounter} from '../actions';
import {changeStep} from '../actions';

class Store{
  constructor(reducer) {
    this._state = {
      count: 0,
      step: 1
    };
    this._listeners = [];
    this._reducer = reducer;
  }

  getState(){
    return this._state;
  }

  dispatch(action): void {
    this._state = this._reducer(this._state,action);
    this._listeners.forEach((listener) => listener());
  }

  subscribe(listener){
    this._listeners.push(listener);
    //this return is used for return unsubscrib call back for purpose of removing listeners
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  addCounter(){
    this.dispatch(addCounter( this.getState().step ));
  }

  removeCounter(){
    this.dispatch(removeCounter( this.getState().step));
  }

  updateStep(stepValue){
    this.dispatch(changeStep( parseInt(stepValue)));
  }
}

var stores;
var getStore = function(appId){
  if(!stores){
    stores={};
  }
  if( !(appId in stores) ){
    stores[appId] = new Store(allReducers);
  }
  return stores[appId];
}

module.exports = getStore;
