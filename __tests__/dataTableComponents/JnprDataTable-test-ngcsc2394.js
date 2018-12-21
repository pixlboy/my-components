jest.unmock('../../public/src/components/data_table/JnprDataTableNgcsc');


// window.jQuery=require('jquery');
// require('jquery-ui/ui/sortable')

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TableNgcscComp from '../../public/src/components/data_table/JnprDataTableNgcsc';
import ExpandableTextCell from '../../public/src/components/data_table/comps/ExpandableTextCell';
import HeaderCell from '../../public/src/components/data_table/comps/HeaderCell';
import test_helper from '../__helper__/test_helper';
import ibaseDataMock from '../__mocks__/ibaseDataMock';
import { Table, Column, Cell } from 'fixed-data-table-2';

import  DataTableObjectFactory from "../../public/src/components/data_table/data_object/DataTableObjectFactory";
require('material-design-lite/material');
var jnprDataTableObj = DataTableObjectFactory.getDataTableObject();


describe('Global/Local timeZone settings', ()=>{

    it('should use global timezone settings - ngcsc-2394', ()=>{

      var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
      var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
      var appId= 'table1';
      
      //default is PST, use it
      tableConfig['enableTimeZone'] = true;
      tableConfig['defaultTimeZone'] = 'PST';
      tableConfig['isGlobalTimeZone'] = true;
      
      jnprDataTableObj.setConfig(tableConfig, appId);
      jnprDataTableObj.dataList = ibaseData;
      jnprDataTableObj.grandTotalRecords = ibaseData.length;

      var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
      expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

      var timeZoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(table, 'btnToggleTimezone');
      
      //now change actual tz to EST, show it
      tableConfig['timeZone'] = 'EST';
      jnprDataTableObj.setConfig(tableConfig, appId);
      table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
        
      timeZoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(table, 'btnToggleTimezone');
      
      
      
      //now change actual tz to empty, show it
      tableConfig['timeZone'] = '';
      jnprDataTableObj.setConfig(tableConfig, appId);
      table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
        
      timeZoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(table, 'btnToggleTimezone');
      
    });
      
      
    it('should use local timezone settings - ngcsc-2394', ()=>{

        var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
        var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
        var appId= 'table1';
        
        //default is PST, use it
        tableConfig['enableTimeZone'] = true;
        tableConfig['defaultTimeZone'] = 'PST';
        tableConfig['isGlobalTimeZone'] = false;
        
        jnprDataTableObj.setConfig(tableConfig, appId);
        jnprDataTableObj.dataList = ibaseData;
        jnprDataTableObj.grandTotalRecords = ibaseData.length;

        var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
        expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

        var timeZoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(table, 'btnToggleTimezone');
        
        //now change actual tz to EST, show it
        //should be useless, as this is NOT global settings
        tableConfig['timeZone'] = 'EST';
        jnprDataTableObj.setConfig(tableConfig, appId);
        table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
        timeZoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(table, 'btnToggleTimezone');
        
        
        
      });
      

});
