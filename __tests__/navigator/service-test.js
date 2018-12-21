'use strict';

jest.unmock('../../public/src/components/navigator/Service');
describe('Testing Navigator Service Class', ()=>{
  let Service = require('../../public/src/components/navigator/Service');
  let navigatorOptions = require('../__mocks__/navigatorDataMock').getNavigatorItemsMock();

  it('Test setting items', ()=>{
    var service = new Service();
    service.items =  JSON.parse(JSON.stringify(navigatorOptions)) ;
    expect( service.items.length>1 ).toBe(true);
    expect(service.items[0].title ).toBe('step1');
    expect(service.items[0].active ).toBe(true);
    expect(service.items[0].order ).toBe(0);
    expect(service.items[0].current ).toBe(false);

    expect(service.items[1].title ).toBe('step2');
    expect(service.items[1].active ).toBe(true);
    expect(service.items[1].order ).toBe(1);
    expect(service.items[1].current ).toBe(true);

    expect(service.items[2].title ).toBe('step3');
    expect(service.items[2].active ).toBe(false);
    expect(service.items[2].order ).toBe(2);
    expect(service.items[2].current ).toBe(false);

    expect(service.items[3].title ).toBe('step4');
    expect(service.items[3].active ).toBe(false);
    expect(service.items[3].order ).toBe(3);
    expect(service.items[3].current ).toBe(false);

  });

  it('should normalize the active state, no active item after any inactive ones', ()=>{

    var service = new Service();
    var items = JSON.parse(JSON.stringify(navigatorOptions)) ;
    items[3].active=true;
    service.items =  items;
    expect( service.items.length>1 ).toBe(true);

    //now, let's make error by setting last one to be active
    expect( service.items.length>1 ).toBe(true);
    expect(service.items[0].title ).toBe('step1');
    expect(service.items[0].active ).toBe(true);
    expect(service.items[0].order ).toBe(0);

    expect(service.items[1].title ).toBe('step2');
    expect(service.items[1].active ).toBe(true);
    expect(service.items[1].order ).toBe(1);

    expect(service.items[2].title ).toBe('step3');
    expect(service.items[2].active ).toBe(false);
    expect(service.items[2].order ).toBe(2);

    expect(service.items[3].title ).toBe('step4');
    expect(service.items[3].active ).toBe(false);
    expect(service.items[3].order ).toBe(3);

  });

  it('checking clickable setting here, for clickable, only all active ones + the next inactive item is clickable', ()=>{
    var service = new Service();
    var items = JSON.parse(JSON.stringify(navigatorOptions)) ;
    items[3].active=true;
    service.items = items;
    service.clickable = true;

    //now, let's make error by setting last one to be active
    expect( service.items.length>1 ).toBe(true);
    expect(service.items[0].title ).toBe('step1');
    expect(service.items[0].active ).toBe(true);
    expect(service.items[0].order ).toBe(0);
    expect(service.items[0].clickable ).toBe(true);

    expect(service.items[1].title ).toBe('step2');
    expect(service.items[1].active ).toBe(true);
    expect(service.items[1].order ).toBe(1);
    expect(service.items[1].clickable ).toBe(true);

    expect(service.items[2].title ).toBe('step3');
    expect(service.items[2].active ).toBe(false);
    expect(service.items[2].order ).toBe(2);
    expect(service.items[2].clickable ).toBe(true);

    expect(service.items[3].title ).toBe('step4');
    expect(service.items[3].active ).toBe(false);
    expect(service.items[3].order ).toBe(3);
    expect(service.items[3].clickable ).toBe(false);

  });

});
