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


describe('<TableNgcscComp />', ()=>{
  it('Should hide save view input box if the mode is R, and should show it if mode is R/W', ()=>{

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
    var appId= 'table';

    tableConfig.mode='R';

    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;

    var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table" />);
    expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

    var dropDownComp = TestUtils.scryRenderedDOMComponentsWithClass(table, 'ulSaveButtonDropDown');
    expect(dropDownComp.length).toBe(0);

    var saveConfigBtn = TestUtils.findRenderedDOMComponentWithClass(table, 'table-btn-control savebtn');
    TestUtils.Simulate.click(saveConfigBtn);
    dropDownComp = TestUtils.findRenderedDOMComponentWithClass(table, 'ulSaveButtonDropDown');
    expect(dropDownComp.tagName.toLowerCase()).toBe('ul');

    // there should be no config-input
    var intpuBoxes = TestUtils.scryRenderedDOMComponentsWithClass(table, 'config-input');
    expect(intpuBoxes.length).toBe(0);


    tableConfig.mode='R/W';

    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;

    var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table" />);
    expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

    var dropDownComp = TestUtils.scryRenderedDOMComponentsWithClass(table, 'ulSaveButtonDropDown');
    expect(dropDownComp.length).toBe(0);

    var saveConfigBtn = TestUtils.findRenderedDOMComponentWithClass(table, 'table-btn-control savebtn');
    TestUtils.Simulate.click(saveConfigBtn);
    dropDownComp = TestUtils.findRenderedDOMComponentWithClass(table, 'ulSaveButtonDropDown');
    expect(dropDownComp.tagName.toLowerCase()).toBe('ul');
    // there should be only one config-input
    var intpuBoxes = TestUtils.scryRenderedDOMComponentsWithClass(table, 'config-input');
    expect(intpuBoxes.length).toBe(1);

  });


});
