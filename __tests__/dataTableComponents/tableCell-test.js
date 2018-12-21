jest.unmock('../../public/src/components/data_table/comps/ExpandableTextCell');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ExpandableTextCellComp from '../../public/src/components/data_table/comps/ExpandableTextCell';
import test_helper from '../__helper__/test_helper';
import ibaseDataMock from '../__mocks__/ibaseDataMock';
import { Table, Column, Cell } from 'fixed-data-table-2';

import  DataTableObj from "../../public/src/components/data_table/data_object/DataTableObjectFactory";

var jnprDataTableObj = DataTableObj.getDataTableObject();

describe('<ExpandableTextCellComp />', ()=>{
  it('Renders a serialNumber cell in installbase table', ()=>{
    const renderer = TestUtils.createRenderer(); // shallow render

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    tableConfig.multipleConfigEnabled=true;
    var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
    var appId= 'ibase-cell-test';
    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;

  });

});
