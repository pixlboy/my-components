let navigateAction = {
  type:'NAVIGATE',
  payload: 0
}

let reducer = (action)=>{
  if(action.type=='NAVIGATE'){
    return action.payload;
  }
  return "";
}

class Store{

  constructor(reducer) {
    this._state = 0;
    this._listeners = {};
    this._reducer = reducer;
  }
  getState(){
    return this._state;
  }

  dispatch(action, appId): void {
    this._state = this._reducer(action);
    if(!(appId in this._listeners)){
      this._listeners[appId]=[];
    }
    this._listeners[appId].forEach((listener: ListenerCallback) => listener());
  }

  subscribe(listender, appId){
    if(!(appId in this._listeners)){
      this._listeners[appId]=[];
    }
    this._listeners[appId].push(listender);
  }
}

var StoreFactory = {
  store: null,
  getStore: function(){
    if(this.store==null){
      this.store = new Store(reducer);
    }
    return this.store;
  }
}

module.exports = StoreFactory;
