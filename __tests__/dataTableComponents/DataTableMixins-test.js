'use strict';

jest.unmock('../../public/src/components/data_table/mixins/DataTableMixins');
describe('Test Data Table Mixin', ()=>{
  
  const Mixin = require('../../public/src/components/data_table/mixins/DataTableMixins');
  
  it('should convert date - dateConvert()', ()=>{
    var ts = new Date().getTime();
    expect(Mixin.dateConvert(''+ts)).toBe(ts);
    expect(Mixin.dateConvert(ts)).toBe(ts);
    expect(Mixin.dateConvert('2014-03-11 10:25:59')).toBe(1394558759000);
  });
  
  
});
