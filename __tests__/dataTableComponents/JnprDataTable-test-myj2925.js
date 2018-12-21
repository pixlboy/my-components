jest.unmock('../../public/src/components/data_table/JnprDataTableNgcsc');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TableNgcscComp from '../../public/src/components/data_table/JnprDataTableNgcsc';
import test_helper from '../__helper__/test_helper';
import ibaseDataMock from '../__mocks__/cellEditingDataMock-2925';
import { Table, Column, Cell } from 'fixed-data-table-2';

import  DataTableObjectFactory from "../../public/src/components/data_table/data_object/DataTableObjectFactory";
require('material-design-lite/material');
var jnprDataTableObj = DataTableObjectFactory.getDataTableObject();


import * as timer from '../__helper__/timer';

describe('<TableNgcscComp />', ()=>{

  it('should display same datalist after fitler - in app search', ()=>{
    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
    var appId= 'table1';

    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;
    
    var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
    expect(TestUtils.isCompositeComponent(table)).toBeTruthy();
    
    var rows = TestUtils.scryRenderedDOMComponentsWithClass(table, 'fixedDataTableRowLayout_rowWrapper');
    var originalCount = rows.length;
    expect(originalCount).toBe(8);
    
    // we need to give timetout here, as subscription is asynchronous
    return timer.default(1).then( ()=>{
      
      jnprDataTableObj.setFilterObjectFor(appId,
          {
           materialItemCategory: {
             comp: "contains",
             value1: "Premium Config Sys"
           }
          });
      
      var rows = TestUtils.scryRenderedDOMComponentsWithClass(table, 'fixedDataTableRowLayout_rowWrapper');
      var originalCount = rows.length;
      expect(originalCount).toBe(3);
      
      jnprDataTableObj.updateCellDataFor( appId, {}, 'productName', 'nameHere' );
      var rows = TestUtils.scryRenderedDOMComponentsWithClass(table, 'fixedDataTableRowLayout_rowWrapper');
      var originalCount = rows.length;
      expect(originalCount).toBe(3);
      
    });
  });
  
  it('should display same datalist after fitler - global search', ()=>{

      
      var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
      tableConfig.defaultGlobal = true;
      var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
      var appId= 'table1';

      jnprDataTableObj.setConfig(tableConfig, appId);
      jnprDataTableObj.dataList = ibaseData;
      jnprDataTableObj.grandTotalRecords = ibaseData.length;
      
      var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
      expect(TestUtils.isCompositeComponent(table)).toBeTruthy();
      
      var rows = TestUtils.scryRenderedDOMComponentsWithClass(table, 'fixedDataTableRowLayout_rowWrapper');
      var originalCount = rows.length;
      expect(originalCount).toBe(8);
      
      // we need to give timetout here, as subscription is asynchronous
      return timer.default(0).then( ()=>{
        
        jnprDataTableObj.updateCellDataFor( appId, {}, 'productName', 'nameHere' );
        var rows = TestUtils.scryRenderedDOMComponentsWithClass(table, 'fixedDataTableRowLayout_rowWrapper');
        var originalCount = rows.length;
        expect(originalCount).toBe(8);
      
      });
  
    });


});
