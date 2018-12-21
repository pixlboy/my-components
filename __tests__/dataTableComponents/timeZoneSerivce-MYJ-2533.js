'use strict';

jest.unmock('../../public/src/components/data_table/data_object/DataTableObjectFactory');

describe('sum', () => {
  
  let DataTableObjectFactory = require('../../public/src/components/data_table/data_object/DataTableObjectFactory');
  
  beforeAll(()=>{
  });
  
  it('convert timezone to millionseconds', () => {
    var dto = DataTableObjectFactory.getDataTableObject()
    expect( dto.getTimeZoneDiff('PST')['TotalMS'] ).toBe( -8*3600*1000  );
    expect( dto.getTimeZoneDiff('SAST')['TotalMS'] ).toBe( 2*3600*1000  );
    expect( dto.getTimeZoneDiff('IST')['TotalMS'] ).toBe( 5*3600*1000+30*60*1000  );
    expect( dto.getTimeZoneDiff('VET')['TotalMS'] ).toBe( -4*3600*1000-30*60*1000  );
  });
  
});