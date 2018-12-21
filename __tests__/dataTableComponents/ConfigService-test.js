'use strict';

jest.unmock('../../public/src/components/data_table/services/ConfigServices');

describe('Test Config Services', ()=>{
  
  let configService = require('../../public/src/components/data_table/services/ConfigServices');
  
  
  it('should check plus sign availability - show it', ()=>{
    
    var rowData = {
        rma_id: {
          value: "abc"
        },
        create_dt: {
          value: "12344"
        },
        having_extra_data:{
          value: true
        }
    };
    
    var colName = 'rma_id';
    var tableConfig = {
        extraDataControllerColumn:'having_extra_data',
        columns:{
          rma_id:{
            key:  true
          },
          having_extra_data:{
            key: false
          }
        }
    };
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(true);
   
   
  });
  
  it('should check plus sign availability - no extra data, hide it', ()=>{
    var rowData = {
        rma_id: {
          value: "abc"
        },
        having_extra_data:{
          value: false
        }
    };
    
    var colName = 'rma_id';
    var tableConfig = {
        extraDataControllerColumn:'having_extra_data',
        columns:{
          rma_id:{
            key:  true
          },
          having_extra_data:{
            key: false
          }
        }
    };
    
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(false);
    
  });
  
  it('should check plus sign availability - Other column, none-key, hide it', ()=>{
    var rowData = {
        rma_id: {
          value: "abc"
        },
        having_extra_data:{
          value: true
        },
        create_dt:{
          value: "2017-12-01"
        }
    };
    
    var colName = 'create_dt';
    var tableConfig = {
        extraDataControllerColumn:'having_extra_data',
        columns:{
          rma_id:{
            key:  true
          },
          create_dt:{
            key: false
          },
          having_extra_data:{
            key: false
          }
        }
    };
   
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(false);
    colName = 'rma_id';
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(true);
    
  });
  
  it('should check plus sign availability - Other column, none-key, show it', ()=>{
    var rowData = {
        rma_id: {
          value: "abc"
        },
        having_extra_data:{
          value: true
        },
        create_dt:{
          value: "2017-12-01"
        }
    };
    
    var colName = 'create_dt';
    var tableConfig = {
        extraDataControllerColumn:'having_extra_data',
        extraDataShowingColumns: ['create_dt'],
        columns:{
          rma_id:{
            key:  true
          },
          create_dt:{
            key: false
          },
          having_extra_data:{
            key: false
          }
        }
    };
   
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(true);
    colName = 'rma_id';
    expect(configService.checkPlusSignAvailability(rowData, colName, tableConfig)).toBe(false);
    
  });

  
})