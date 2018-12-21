const React = require("react");
import { Column, Cell, Table } from "fixed-data-table-2";

require("./style/fixed-data-table.css");
require("./style/jnpr-datatable.scss");

const HeaderCell = require("./comps/HeaderCell");
const ExpandableTextCell = require("./comps/ExpandableTextCell");
const ColumnChooser = require("./comps/ColumnChooser");
const MultiColumnFilter = require("./comps/MultiColumnFilter");
const DataTableControllerNgcsc = require("./comps/DataTableControllerNgcsc");
const DataTableMixins = require("./mixins/DataTableMixins");
const jnprDataTableObj = require("./data_object/DataTableObjectFactory").getDataTableObject();
const classNames = require("classnames");
const FooterController = require("./comps/FooterController");
const ExportComp = require("./comps/ExportComp");

const tableDOM = React.createClass({
    defaultProps: {
        appId: "app",
        hasAccIdCol: false,
        plain: true
    },

    mixins: [DataTableMixins],

    render: function() {
        const {
            originalDataList,
            dataList,
            availableColumns,
            selectedColumns,
            rowHeight,
            headerHeight,
            tableHeight,
            tableWidth,
            accountList,
            selectedAccounts,
            columnFilterable,
            totalFilters,
            availableVisibleColumns,
            availableFilterableColumns,
            hidingBottomIndicator,
            scrollToRow
        } = this.state;

        const {
            appId,
            nested,
            parentLineItem,
            parentHasArrowBtn,
            showFooterControls = true
        } = this.props;
        const { enableInAppDownload } = jnprDataTableObj.config || {};

        const tableClassName = classNames(
            "jnprDataTableContent",
            "jnprPlainDataTableContent_plain",
            "jnprDataTableContentFullWidth"
        );

        const _self = this;
        const styleName = "jnprDataTable_ngcsc";
        const tableMainClass = classNames({
            "jnprTbl-main": true,
            "table-full-width": true
        });

        let displayingClearBtn = null;
        if (columnFilterable) {
            displayingClearBtn = (
                <input
                    type="button"
                    className="clearAllFilters"
                    value="Clear All Filters"
                    onClick={this._filterReset}
                />
            );
        }

        let exportComp = null;
        if (enableInAppDownload) {
            exportComp = <ExportComp appId={appId} />;
        }

        //here, we need to load different table based on if it is right fixed or not
        let rightFixable = false;
        let columns = jnprDataTableObj.getConfigFor(appId).columns;

        Object.keys(columns).forEach(key => {
            if ("rightFixed" in columns[key] && columns[key].rightFixed) {
                rightFixable = true;
            }
        });

        if (nested) {
            return (
                <div
                    className={styleName}
                    ref="jnprDataTable"
                    id={`jnprDataTableContent_${appId}`}
                >
                    <div className="jnprTblCtrl-wrapper">
                        <div className={tableMainClass}>
                            {displayingClearBtn}
                            {exportComp}
                            <div
                                className={tableClassName}
                                ref="jnprDataTableContent"
                                style={{ height: tableHeight }}
                            >
                                <div style={{ height: "1px" }}> </div>
                                <table
                                    className={classNames({
                                        jnprPlainDataTable: true
                                    })}
                                    ref="jnprPlainDataTable"
                                    id={`table${appId}`}
                                >
                                    <thead>
                                        <tr>
                                            {Object.keys(selectedColumns).map(
                                                function(columnName, i) {
                                                    return (
                                                        <th
                                                            key={i}
                                                            ref="jnprPlainDataTableHeader"
                                                        >
                                                            <HeaderCell
                                                                columnName={
                                                                    columnName
                                                                }
                                                                columnFilterable={
                                                                    columnFilterable
                                                                }
                                                                column={
                                                                    selectedColumns[
                                                                        columnName
                                                                    ]
                                                                }
                                                                appId={appId}
                                                                showGlobalCheckbox={
                                                                    _self.state
                                                                        .showGlobalCheckbox
                                                                }
                                                                defaultGlobal={
                                                                    _self.state
                                                                        .defaultGlobal
                                                                }
                                                                parentLineItem={
                                                                    parentLineItem
                                                                }
                                                                parentHasArrowBtn={
                                                                    parentHasArrowBtn
                                                                }
                                                            />
                                                        </th>
                                                    );
                                                }
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={classNames({
                                            noneDisplay: dataList.length > 0
                                        })}
                                    >
                                        <tr className="noRecord">
                                            <td>
                                                <span>No Records Found</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody
                                        className={classNames({
                                            noneDisplay: dataList.length == 0
                                        })}
                                        style={{ maxHeight: tableHeight - 50 }}
                                    >
                                        {dataList.map(function(dataRow, i) {
                                            return (
                                                <tr
                                                    key={i}
                                                    className="jnprDataTablePlainTr"
                                                >
                                                    {Object.keys(
                                                        selectedColumns
                                                    ).map(function(
                                                        columnName,
                                                        j
                                                    ) {
                                                        return (
                                                            <td
                                                                key={j}
                                                                className={classNames(
                                                                    {
                                                                        ellipsis: !(
                                                                            dataList[
                                                                                i
                                                                            ][
                                                                                columnName
                                                                            ][
                                                                                "key"
                                                                            ] ===
                                                                            true
                                                                        )
                                                                    }
                                                                )}
                                                            >
                                                                <ExpandableTextCell
                                                                    columnConfig={
                                                                        selectedColumns[
                                                                            columnName
                                                                        ]
                                                                    }
                                                                    rowIndex={i}
                                                                    data={
                                                                        dataList
                                                                    }
                                                                    col={
                                                                        columnName
                                                                    }
                                                                    rowHeight={
                                                                        rowHeight
                                                                    }
                                                                    editable={
                                                                        selectedColumns[
                                                                            columnName
                                                                        ]
                                                                            .editable
                                                                    }
                                                                    changeValueHandler={
                                                                        _self._changeValueHandler
                                                                    }
                                                                    expandable={
                                                                        true
                                                                    }
                                                                    appId={
                                                                        appId
                                                                    }
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {showFooterControls ? (
                                <FooterController
                                    dataList={this.state.dataList}
                                    appId={appId}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className={styleName}
                    ref="jnprDataTable"
                    id={`jnprDataTableContent_${appId}`}
                >
                    <div className="jnprTblCtrl-wrapper">
                        <div className={tableMainClass}>
                            <div
                                className={classNames({
                                    noneDisplay: dataList.length > 0,
                                    noContentsTitle: dataList.length == 0
                                })}
                            >
                                <div className="noContentsTitle-icon" />
                                No Records Found
                            </div>
                            <div
                                className={classNames({
                                    noneDisplay: dataList.length == 0
                                })}
                            >
                                {exportComp}
                                <Table
                                    rowHeight={rowHeight}
                                    headerHeight={headerHeight}
                                    groupHeaderHeight={30}
                                    rowsCount={dataList.length}
                                    isColumnResizing={false}
                                    width={tableWidth}
                                    height={tableHeight}
                                    onColumnResizeEndCallback={
                                        this._onColumnResizeEndCallback
                                    }
                                    onScrollEnd={this._onScrollEndCallBack}
                                    onScrollStart={this._onScrollStartHanlder}
                                    scrollToRow={scrollToRow}
                                    rowClassNameGetter={this.rowClassNameGetter}
                                    onRowMouseEnter={this.onRowMouseEnter}
                                    onRowMouseLeave={this.onRowMouseLeave}
                                    appId={appId}
                                >
                                    {Object.keys(selectedColumns).map(function(
                                        columnName,
                                        i
                                    ) {
                                        return (
                                            <Column
                                                key={i}
                                                columnKey={columnName}
                                                header={
                                                    <HeaderCell
                                                        columnName={columnName}
                                                        columnFilterable={
                                                            columnFilterable
                                                        }
                                                        column={
                                                            selectedColumns[
                                                                columnName
                                                            ]
                                                        }
                                                        appId={appId}
                                                        showGlobalCheckbox={
                                                            _self.state
                                                                .showGlobalCheckbox
                                                        }
                                                        parentLineItem={
                                                            parentLineItem
                                                        }
                                                        parentHasArrowBtn={
                                                            parentHasArrowBtn
                                                        }
                                                        defaultGlobal={
                                                            _self.state
                                                                .defaultGlobal
                                                        }
                                                    />
                                                }
                                                cell={
                                                    <ExpandableTextCell
                                                        columnConfig={
                                                            selectedColumns[
                                                                columnName
                                                            ]
                                                        }
                                                        data={dataList}
                                                        col={columnName}
                                                        rowHeight={rowHeight}
                                                        editable={
                                                            selectedColumns[
                                                                columnName
                                                            ].editable
                                                        }
                                                        changeValueHandler={
                                                            _self._changeValueHandler
                                                        }
                                                        expandable={true}
                                                        appId={appId}
                                                        nested={nested}
                                                        showDetailCallBack={
                                                            _self._showDetailCallBack
                                                        }
                                                        hideDetailCallBack={
                                                            _self._hideDetailCallBack
                                                        }
                                                        checkHandler={
                                                            _self._checkHandler
                                                        }
                                                        showDetailExtraDataCallBack={
                                                            _self._showDetailExtraDataCallBack
                                                        }
                                                        extraDataCallBack={
                                                            _self._extraDataCallBack
                                                        }
                                                    />
                                                }
                                                width={jnprDataTableObj.getColumnWidth(
                                                    appId,
                                                    columnName
                                                )}
                                                isResizable={
                                                    selectedColumns[columnName]
                                                        .resizable == null
                                                        ? true
                                                        : selectedColumns[
                                                              columnName
                                                          ].resizable
                                                }
                                                minWidth={
                                                    selectedColumns[columnName]
                                                        .minWidth
                                                }
                                                flexGrow={
                                                    selectedColumns[columnName]
                                                        .flexGrows
                                                }
                                                fixedRight={
                                                    selectedColumns[columnName]
                                                        .rightFixed == null
                                                        ? false
                                                        : selectedColumns[
                                                              columnName
                                                          ].rightFixed
                                                }
                                            />
                                        );
                                    })}
                                </Table>
                            </div>
                            <div
                                id={`divCellClickDetailContent_${appId}`}
                                className="divCellClickDetailContent"
                            />
                            {showFooterControls ? (
                                <FooterController
                                    dataList={dataList}
                                    appId={appId}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            );
        }
    }
});

module.exports = tableDOM;
