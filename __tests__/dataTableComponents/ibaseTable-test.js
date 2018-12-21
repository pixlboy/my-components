jest.unmock('../../public/src/components/data_table/JnprDataTableNgcsc');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TableNgcscComp from '../../public/src/components/data_table/JnprDataTableNgcsc';
import ExpandableTextCell from '../../public/src/components/data_table/comps/ExpandableTextCell';
import HeaderCell from '../../public/src/components/data_table/comps/HeaderCell';
import test_helper from '../__helper__/test_helper';
import ibaseDataMock from '../__mocks__/ibaseDataMock';
import ibaseContractHistoryDataMock from '../__mocks__/ibaseContractHistoryDataMock';
import {Table, Column, Cell} from 'fixed-data-table-2';
import _ from 'underscore';
import DataTableObj from "../../public/src/components/data_table/data_object/DataTableObjectFactory";
require('material-design-lite/material');
var jnprDataTableObj = DataTableObj.getDataTableObject();
describe('<TableNgcscComp />', () => {

    var tableConfig = ibaseDataMock.getMockedJnprDataTableObject().config;
    var ibaseData = ibaseDataMock.getMockedJnprDataTableObject().dateList.ibaseList;
    var appId = 'ibase-table-test';
    jnprDataTableObj.setConfig(tableConfig, appId);
    jnprDataTableObj.dataList = ibaseData;
    jnprDataTableObj.grandTotalRecords = ibaseData.length;

    var ibaseMainTableComp = TestUtils.renderIntoDocument(<TableNgcscComp appId='ibase-table-test'/>);
    var ibaseTable = TestUtils.renderIntoDocument(
        <Table
            rowHeight={tableConfig.rowHeight}
            headerHeight={tableConfig.headerHeight}
            groupHeaderHeight={30}
            rowsCount={ibaseData.length}
            isColumnResizing={false}
            width={tableConfig.tableWidth}
            height={tableConfig.tableHeight}
            appId={appId}
        >
            {Object.keys(tableConfig.columns).map(function(columnName, i) {
                return <Column
                    key={i}
                    columnKey={columnName}
                    header={<HeaderCell
                        columnName = {columnName}
                        columnFilterable = {false}
                        column = {
                            tableConfig.columns[columnName]
                        }
                        appId = {
                            appId
                        }
                        showGlobalCheckbox = {
                            false
                        }
                        defaultGlobal = {
                            true
                        }
                    />}
                    cell={<ExpandableTextCell
                        columnConfig = {
                        tableConfig.columns[columnName]
                        }
                        data = {
                            jnprDataTableObj.dataList
                        }
                        col = {
                            columnName
                        }
                        rowHeight = {
                            tableConfig.rowHeight
                        }
                        editable = {
                            tableConfig.columns[columnName].editable
                        }
                        expandable = {
                            true
                        }
                        appId = {
                            appId
                        }
                        nested = {
                            false
                        }
                        rowIndex = {
                            i
                        }
                    />}
                    width={2000}
                    isResizable={tableConfig.columns[columnName].resizable == null
                        ? true
                        : tableConfig.columns[columnName].resizable}
                    minWidth={tableConfig.columns[columnName].minWidth}
                    flexGrow={tableConfig.columns[columnName].flexGrows}
                    allowCellsRecycling={Object.keys(tableConfig.columns).length > 20
                        ? true
                        : false}
                />
            })}
        </Table>
    );

    var availableContractHistoryBtn = [];
    _.each(ibaseData, function(rowdata) {
        if (rowdata.hasOwnProperty('isIbParent') && rowdata.isIbParent) {
            if (rowdata.hasOwnProperty('materialItemCategory') && rowdata.materialItemCategory === 'Fixed Software') {
                if (rowdata.hasOwnProperty('contractID') && rowdata.contractID) {
                    availableContractHistoryBtn.push(rowdata);
                }

            } else {
                if (rowdata.hasOwnProperty('contractID') && rowdata.contractID) {
                    availableContractHistoryBtn.push(rowdata);
                }

            }
        } else {
            if (rowdata.hasOwnProperty('contractID') && rowdata.contractID) {
                availableContractHistoryBtn.push(rowdata);
            }

        }
    });

    var CHtableConfig = ibaseContractHistoryDataMock.getMockedCHDataTableObject().config;
    var CHData = ibaseContractHistoryDataMock.getMockedCHDataTableObject().dateList.contractsList;
    var CH_appId = 'ibContractHistoryTable_test';
    jnprDataTableObj.setConfig(CHtableConfig, CH_appId);
    jnprDataTableObj.dataList = CHData;
    jnprDataTableObj.grandTotalRecords = CHData.length;

    var contractHistoryTable = TestUtils.renderIntoDocument(
        <Table
        rowHeight={CHtableConfig.rowHeight}
        headerHeight={CHtableConfig.headerHeight}
        groupHeaderHeight={30}
        rowsCount={CHData.length}
        isColumnResizing={false}
        width={CHData.tableWidth}
        height={100}
        appId={CH_appId}>
            {Object.keys(CHtableConfig.columns).map(function(columnName, i) {
                return <Column
                    key={i}
                    columnKey={columnName}
                    header={<HeaderCell
                        columnName={ columnName }
                        columnFilterable={false }
                        column={CHtableConfig.columns[columnName]}
                        appId={ CH_appId}
                        showGlobalCheckbox={ false }
                        parentHasArrowBtn={false}
                        defaultGlobal={ true }
                    />}
                    cell={<ExpandableTextCell
                        columnConfig={ CHtableConfig.columns[columnName]}
                        data={ jnprDataTableObj.dataList}
                        col={ columnName }
                        rowHeight={ CHtableConfig.rowHeight }
                        editable={ CHtableConfig.columns[columnName].editable }
                        expandable={ true }
                        appId={CH_appId}
                        nested={false}
                        rowIndex = {i}
                    />}
                    width={2000}
                    isResizable={CHtableConfig.columns[columnName].resizable == null
                        ? true
                        : CHtableConfig.columns[columnName].resizable}
                    minWidth={CHtableConfig.columns[columnName].minWidth}
                    flexGrow={CHtableConfig.columns[columnName].flexGrows}
                    allowCellsRecycling={Object.keys(CHtableConfig.columns).length > 20
                        ? true
                        : false}
                />
            })}
        </Table>
    );


    it('Renders whole table', () => {
            expect(TestUtils.isCompositeComponent(ibaseTable)).toBeTruthy();
            //the number of rows
            var rows = TestUtils.scryRenderedDOMComponentsWithClass(ibaseTable, 'public_fixedDataTable_bodyRow');
            expect(rows.length).toBe(7);
    });

    it('checking hightlight row when click serial number', () => {//the number of clickable key columns
            var SNs = TestUtils.scryRenderedDOMComponentsWithClass(ibaseTable, 'cell tooltip clickbleCell');
            expect(SNs.length).toBe(7);

            //checking hightlighted rows
            TestUtils.Simulate.click(SNs[0]);
            expect(jnprDataTableObj._highlightedRows[appId].length > 0).toBeTruthy();
    });

    it('check contractHistory button count', () => {
            var availableContractHistoryBtnDom = TestUtils.scryRenderedDOMComponentsWithClass(ibaseTable, 'expandBtn');
            expect(availableContractHistoryBtnDom.length).toBe(availableContractHistoryBtn.length);
    });

    it('check if subscribing contract history data works ', () => {
          expect(TestUtils.isCompositeComponent(ibaseMainTableComp)).toBeTruthy();
            var availableContractHistoryBtnDom = TestUtils.scryRenderedDOMComponentsWithClass(ibaseTable, 'expandBtn');

            jnprDataTableObj.subscribeToExtraDataFor( appId, function( data ) {
                expect(data).not.toBe(null);
                // console.log('subscribeToExtraDataFor: '+ data);
            });

            var CHtableConfig = ibaseContractHistoryDataMock.getMockedCHDataTableObject().config;
            var CHData = ibaseContractHistoryDataMock.getMockedCHDataTableObject().dateList.contractsList;
            var detailConfigs = {};
            detailConfigs['contractsHistory'] = CHtableConfig;
            jnprDataTableObj.setAdditionalConfigFor(appId, 'detailConfigs', detailConfigs);

            //check if the jnprDataTableObj.subscribeToExtraDataFor works
            jnprDataTableObj.setExtraData(appId, CHData);

            jnprDataTableObj.unSubscribeToExtraDataFor( appId, function( data ) {
                // console.log('unSubscribeToExtraDataFor: '+ data);
            });

            //check if the jnprDataTableObj.unSubscribeToExtraDataFor works
            jnprDataTableObj.setExtraData(appId, CHData);


    });
    it('Rendering contract history table', () => {
        expect(TestUtils.isCompositeComponent(contractHistoryTable)).toBeTruthy();
        //the number of contract history rows
        var rows = TestUtils.scryRenderedDOMComponentsWithClass(contractHistoryTable, 'public_fixedDataTable_bodyRow');
        expect(rows.length).toBe(2);
        //the number of contract history columns
        var header = TestUtils.scryRenderedDOMComponentsWithClass(contractHistoryTable, 'fixedDataTableLayout_header');
        expect(header.length).toBe(1);

        var columns = header[0].children[0].children[1].children[0].children;
        expect(columns.length).toBe(8);

        _.each(columns, function(col){
            var titledom = col.children[1].children[0].children;
            // check sortable columns
            expect(titledom.length).toBe(1);
            expect(col.textContent).not.toBe(null);
        });
        var title = TestUtils.scryRenderedDOMComponentsWithClass(contractHistoryTable, 'headercell-title');
        expect(title.length).toBe(8);

        var sortableColumns  = TestUtils.scryRenderedDOMComponentsWithClass(contractHistoryTable, 'sortIndicator');
        expect(sortableColumns.length).toBe(0);

    });
});
