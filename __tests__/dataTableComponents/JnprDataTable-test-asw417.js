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


  it('should popup column chooser instead of long scrolling - AS417', ()=>{

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
    var appId= 'table';

    tableConfig.allowPopupColumnSelect=true;

    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;

    var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table" />);
    expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

    var headerSelectors = TestUtils.scryRenderedDOMComponentsWithClass(table, 'jnprDataTableControls');
    expect(headerSelectors[0].children.length).toBe(3);
    // aside=>nav=>ul=>li
    var columnli = headerSelectors[0].children[1].children[0].children[1]
    expect( columnli.tagName.toLowerCase()).toBe('li');

    // before click now checking its visibility
    // now click this li
    TestUtils.Simulate.click(columnli);
    var popUpComp = TestUtils.findRenderedDOMComponentWithClass(table, 'jnprColumnDialog');

    var divListWrapper = popUpComp.children[0];
    expect(test_helper.getStyleClassesFromClassList(divListWrapper.classList).includes('listWrapper')).toBeTruthy();
    expect(divListWrapper.children.length).toBe(3);


    var checkAllBox = divListWrapper.children[0].children[0].children[0];
    var searchInput = divListWrapper.children[0].children[1].children[0];

    expect(checkAllBox.tagName).toBe('INPUT');
    expect(test_helper.getStyleClassesFromClassList(checkAllBox.classList).includes('mdl-checkbox__input')).toBeTruthy();

    expect(searchInput.tagName).toBe('INPUT');
    expect(test_helper.getStyleClassesFromClassList(searchInput.classList).includes('mdl-textfield__input')).toBeTruthy();

    var closeIcon = divListWrapper.children[1];
    expect(closeIcon.tagName).toBe('I');
    expect(test_helper.getStyleClassesFromClassList(closeIcon.classList).includes('material-icons')).toBeTruthy();

    var columnListUL = divListWrapper.children[2];
    expect(columnListUL.tagName).toBe('UL');
    expect(columnListUL.children.length>0).toBeTruthy();

    // testing searching function here
    searchInput.value = "Serial";
    TestUtils.Simulate.change(searchInput);
    expect(columnListUL.children.length).toBe(1);

    searchInput.value = "FAKEDCOLUMNS";
    TestUtils.Simulate.change(searchInput);
    expect(columnListUL.children.length).toBe(0)

    // now, we need to restore options
    searchInput.value = "";
    TestUtils.Simulate.change(searchInput);
    expect(columnListUL.children.length>0).toBeTruthy();

    // check select all checkbox here
    TestUtils.Simulate.change(checkAllBox, {"target": {"checked": true}});
    for(var i=0; i<columnListUL.children.length; i++){
      expect(columnListUL.children[i].tagName).toBe('LI');
      expect(test_helper.getStyleClassesFromClassList(columnListUL.children[i].classList).includes('selected')).toBeTruthy();
    }

    TestUtils.Simulate.change(checkAllBox, {"target": {"checked": false}});
    for(var i=0; i<columnListUL.children.length; i++){
      expect(columnListUL.children[i].tagName).toBe('LI');
      if(i==0){
        // first one is sticky, so it must be selected
        expect(test_helper.getStyleClassesFromClassList(columnListUL.children[i].classList).includes('selected')).toBeTruthy();
      }else{
        expect(test_helper.getStyleClassesFromClassList(columnListUL.children[i].classList).includes('selected')===false).toBeTruthy();
      }
    }
  });


});
