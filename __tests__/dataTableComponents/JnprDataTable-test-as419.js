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

    it('should freeze columns - AS419', ()=>{

      var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
      var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
      var appId= 'table1';

      tableConfig.allowPopupColumnSelect=false;
      tableConfig.columns.serialNumber['freezable'] = true;
      tableConfig.columns.productName['freezable'] = true;

      jnprDataTableObj.setConfig(tableConfig, appId);
      jnprDataTableObj.dataList = ibaseData;
      jnprDataTableObj.grandTotalRecords = ibaseData.length;

      jnprDataTableObj.setCustomerConfigForOne('table1', { frozenColumnKeyList: ["serialNumber"] });


      var table =  TestUtils.renderIntoDocument(<TableNgcscComp  appId="table1" />);
      expect(TestUtils.isCompositeComponent(table)).toBeTruthy();

      var headerSelectors = TestUtils.scryRenderedDOMComponentsWithClass(table, 'jnprDataTableControls');
      expect(headerSelectors[0].children.length).toBe(3);
      // aside=>nav=>ul=>li
      expect(headerSelectors[0].children[1].tagName).toBe('NAV');
      expect(headerSelectors[0].children[1].children[0].tagName).toBe('UL');
      var columnli = headerSelectors[0].children[1].children[0].children[1];
      expect( columnli.tagName).toBe('LI');
      expect( columnli.textContent).toBe('Columns');
      //let's click this li
      TestUtils.Simulate.click(columnli);

      //now, checking columns section as below
      var controllerSection = TestUtils.scryRenderedDOMComponentsWithClass(table, 'jnprDataTableControls-section');
      expect(controllerSection[0].children.length).toBe(3);
      var accountSection = controllerSection[0].children[0];
      var columnSection = controllerSection[0].children[1];
      var filterSection = controllerSection[0].children[2];

      expect(test_helper.getStyleClassesFromClassList(accountSection.classList).includes('noneDisplay')).toBe(true);
      expect(test_helper.getStyleClassesFromClassList(columnSection.classList).includes('noneDisplay')).toBe(false);
      expect(test_helper.getStyleClassesFromClassList(filterSection.classList).includes('noneDisplay')).toBe(true);

      //1. find out the lock icon
      var columnController_lockIcon = columnSection.children[0].children[0].children[0].children[0];
      var columnsList =  TestUtils.scryRenderedDOMComponentsWithClass(table, 'multiselect-list-control-content')[1];
      //2. checking visibility - icon
      expect(test_helper.getStyleClassesFromClassList(columnController_lockIcon.classList).includes('lockColumnIcon')).toBe(true);
      //3. check colmnList
      expect(test_helper.getStyleClassesFromClassList(columnsList.classList).includes('multiselect-list-control-content')).toBe(true);
      var columnListUL = columnsList.children[0];
      expect(columnListUL.tagName).toBe('UL');
      var firstLi = columnListUL.children[0];
      expect(firstLi.tagName).toBe('LI');
      expect(firstLi.children.length).toBe(3);

      var secondLi = columnListUL.children[1];
      var thirdLi = columnListUL.children[2];

      var frozenSpan1ST = firstLi.children[0];
      var frozenSpan2ND = secondLi.children[0];
      var frozenSpan3RD = thirdLi.children[0];

      expect(frozenSpan1ST.tagName).toBe('SPAN');
      expect(test_helper.getStyleClassesFromClassList(frozenSpan1ST.classList).includes('spanFreezeColumn')).toBe(true);
      expect(test_helper.getStyleClassesFromClassList(frozenSpan1ST.classList).includes('hiddenFreezeCol')).toBe(false);
      var frozenSpan1ST_chkbox = frozenSpan1ST.children[0].children[0];
      expect(frozenSpan1ST_chkbox.tagName).toBe('INPUT');
      expect(frozenSpan1ST_chkbox.checked).toBeTruthy();

      expect(frozenSpan2ND.tagName).toBe('SPAN');
      expect(test_helper.getStyleClassesFromClassList(frozenSpan2ND.classList).includes('spanFreezeColumn')).toBe(true);
      expect(test_helper.getStyleClassesFromClassList(frozenSpan2ND.classList).includes('hiddenFreezeCol')).toBe(false);
      var frozenSpan2ND_chkbox = frozenSpan2ND.children[0].children[0];
      expect(frozenSpan2ND_chkbox.tagName).toBe('INPUT');
      expect(frozenSpan2ND_chkbox.checked).toBe(false);

      expect(frozenSpan3RD.tagName).toBe('SPAN');
      expect(test_helper.getStyleClassesFromClassList(frozenSpan3RD.classList).includes('spanFreezeColumn')).toBe(true);
      expect(test_helper.getStyleClassesFromClassList(frozenSpan3RD.classList).includes('hiddenFreezeCol')).toBe(true);
      var frozenSpan3RD_chkbox = frozenSpan3RD.children[0].children[0];
      expect(frozenSpan3RD_chkbox.tagName).toBe('INPUT');
      expect(frozenSpan3RD_chkbox.checked).toBe(false);

    });


});
