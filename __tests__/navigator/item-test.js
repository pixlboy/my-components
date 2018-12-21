'use strict';

jest.unmock('../../public/src/components/navigator/Item');
describe('Testing Navigator Item Class', ()=>{
  let Item = require('../../public/src/components/navigator/Item');
  it('should create Item object', ()=>{

    let navigatorOptions = require('../__mocks__/navigatorDataMock').getNavigatorItemsMock();
    expect(navigatorOptions.length>0).toBe(true);

    var item = new Item(navigatorOptions[0].title, navigatorOptions[0].active, 0);
    expect(item.title).toBe('step1');
    expect(item.active).toBe(true);
    expect(item.order).toBe(0);
  });
});
