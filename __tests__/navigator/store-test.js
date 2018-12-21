'use strict';

jest.unmock('../../public/src/components/navigator/Store');
describe('Navigator Store', ()=>{
  let StoreFactory = require('../../public/src/components/navigator/Store');
  it('Initial State to be 0', ()=>{
    let store = StoreFactory.getStore();
    expect(store.getState()).toBe(0);
  });

  it('change state', ()=>{
    let store = StoreFactory.getStore();
    expect(store.getState()).toBe(0);
    store.dispatch({type:'NAVIGATE', payload: 3 });
    expect(store.getState()).toBe(3);
    store.dispatch({type:'NAVIGATE', payload: 1 });
    expect(store.getState()).toBe(1);
    store.dispatch({type:'NAVIGATE', payload: 4 });
    expect(store.getState()).toBe(4);
  });

  it('checking subscribing function', ()=>{
    let store = StoreFactory.getStore();
    store.subscribe(()=>{
      expect(store.getState()).toBe(3);
    });
    store.dispatch({type:'NAVIGATE', payload: 3 });
    expect(store.getState()).toBe(3);
  });

  it('checking subscribing multiple function', ()=>{
    let store = StoreFactory.getStore();
    store.subscribe(()=>{
      expect(store.getState()).toBe(3);
    }, 'app1');
    store.subscribe(()=>{
      expect(store.getState()).toBe(4);
    }, 'app2');
    store.dispatch({type:'NAVIGATE', payload: 3 }, 'app1');
    store.dispatch({type:'NAVIGATE', payload: 4 }, 'app2');
  });

});
