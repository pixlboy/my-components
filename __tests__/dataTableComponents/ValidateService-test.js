'use strict';

jest.unmock('../../public/src/components/data_table/services/ValidateService');
describe('Test ValidateService', ()=>{
  
  let validateService = require('../../public/src/components/data_table/services/ValidateService');
  
  it('should check time validation', ()=>{
    expect( validateService.validateTime('test123') ).toBe(false);
    expect( validateService.validateTime('test123:123') ).toBe(false);
    expect( validateService.validateTime('test123:123:1234') ).toBe(false);
    expect( validateService.validateTime('25:00:00') ).toBe(false);
    expect( validateService.validateTime('20:61:00') ).toBe(false);
    expect( validateService.validateTime('20:60:61') ).toBe(false);
    
    expect( validateService.validateTime('12:00:00') ).toBe(true);
    expect( validateService.validateTime('23:59:59') ).toBe(true);
    expect( validateService.validateTime('00:00:00') ).toBe(true);
    expect( validateService.validateTime('10:10:10') ).toBe(true);
    
  });
  
});
