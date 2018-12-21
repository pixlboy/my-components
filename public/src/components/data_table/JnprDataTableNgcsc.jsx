const React = require("react");
import { Column, Cell, Table } from "fixed-data-table-2";

const HeaderCell = require("./comps/HeaderCell");
const ActionButton = require("./comps/ActionButton");
const ExpandableTextCell = require("./comps/ExpandableTextCell");
const ColumnChooser = require("./comps/ColumnChooser");
const MultiColumnFilter = require("./comps/MultiColumnFilter");
const DataTableControllerNgcsc = require("./comps/DataTableControllerNgcsc");
const DataTableMixins = require("./mixins/DataTableMixins");
const jnprDataTableObj = require("./data_object/DataTableObjectFactory").getDataTableObject();
const ClassNames = require("classnames");
const FooterController = require("./comps/FooterController");
const SaveButtonConfig = require("./comps/SaveButtonConfig");
const DataTableStore = require("./flux/stores/DataTableStore");
const SaveButtonConfigConfirm = require("./comps/SaveButtonConfigConfirm");
const SaveConfigNotice = require("./comps/SaveConfigNotice");
const ExportComp = require("./comps/ExportComp");
const TimeZoneCompWrapper = require("./comps/TimeZoneWrapper");

const _ = require("underscore");

const FeatureTogglerService = require("../../feature-toggler/FeatureTogglerService");

const tableDOM = React.createClass({
    defaultProps: {
        appId: "app",
        hasAccIdCol: false,
        plain: false
    },

    mixins: [DataTableMixins],

    closePanel: function() {
        this._toggleTableWidthFB();
    },

    getInitialState: function() {
        jnprDataTableObj.subscribeToAccountList(
            function(obj) {
                this.setState({
                    accountList: obj
                });
            }.bind(this)
        );

        var defaultView = null;
        var availableConfigs = jnprDataTableObj.getAvailableConfigsFor(
            this.props.appId
        );
        Object.keys(availableConfigs).forEach(function(key) {
            if (availableConfigs[key].current) defaultView = key;
        });
        return {
            num: 0,
            accountList: jnprDataTableObj.accountList || null,
            saveConfigBtnName: defaultView
                ? defaultView
                : "System Default View",
            originalAccountList: jnprDataTableObj.accountList || null,
            selectedAccounts:
                jnprDataTableObj.allCustomConfigurations[this.props.appId]
                    .defaultSelectedAccountList || null
        };
    },
    componentDidMount: function() {
        DataTableStore.addCheckRowsUpdated(
            this.props.appId,
            this._checkedRowsCallBack
        );

        if ("loaded" in this.props) this.props.loaded();
    },

    componentWillUnmount: function() {
        DataTableStore.removeCheckRowsUpdated(
            this.props.appId,
            this._checkedRowsCallBack
        );
    },

    _checkedRowsCallBack: function() {
        this.setState({
            num: jnprDataTableObj.getCheckedRowsCountFor(this.props.appId)
        });
        if (this.props.checkBoxCallBackHandler) {
            this.props.checkBoxCallBackHandler();
        }
    },

    render: function() {
        //totalfilter : the number of filtered ones.
        var {
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
            displayingActionButton,
            displayingActionButtonOptionList,
            multipleConfigEnabled,
            checkBoxEnabled,
            scrollToRow,
            enableTimeZone
        } = this.state;

        const { showFooterControls = true } = this.props;

        var noAccountTab =
            "noAccountTab" in jnprDataTableObj.config
                ? jnprDataTableObj.config.noAccountTab
                : false;
        var _self = this;
        var styleName = "jnprDataTable_ngcsc";
        var tableMainClass = ClassNames({
            "jnprTbl-main": true,
            "table-full-width": this.state.tableMax
        });
        var displayingActionBtn = null;
        var toggleSaveBtn = null;
        if (this.state.showSaveBtnOptions) {
            toggleSaveBtn = (
                <div className="toggleSaveBtn">
                    <span className="actions-icon up" />
                </div>
            );
        } else {
            toggleSaveBtn = (
                <div className="toggleSaveBtn">
                    <span className="actions-icon down" />
                </div>
            );
        }

        var saveConfigDom = null;
        var saveConfigBtn = (
            <button
                className={ClassNames({
                    "table-btn-control": true,
                    savebtn: true
                })}
                onClick={this._saveConfig}
            >
                save view
            </button>
        );

        if (this.state.showSaveConfig)
            saveConfigDom = (
                <SaveButtonConfig
                    appId={this.props.appId}
                    saveConfig={this._saveConfigWithName}
                    hideSaveConfig={this._toggleSaveConfig}
                />
            );
        if (multipleConfigEnabled)
            saveConfigBtn = (
                <button
                    className={ClassNames({
                        "table-btn-control": true,
                        savebtn: true
                    })}
                    onClick={this._toggleSaveConfig}
                >
                    save view
                    {toggleSaveBtn}
                </button>
            );

        var displayingActionBtn = null;

        if (checkBoxEnabled) {
            displayingActionBtn = (
                <div className="ActionRegion">
                    <ActionButton
                        appId={this.props.appId}
                        displayingActionButton={displayingActionButton}
                        displayingActionButtonOptionList={
                            displayingActionButtonOptionList
                        }
                    />
                    {/* <div className='selectedRows'>{this.state.num} selected</div> */}
                </div>
            );
        } else {
            displayingActionBtn = (
                <ActionButton
                    appId={this.props.appId}
                    displayingActionButton={displayingActionButton}
                    displayingActionButtonOptionList={
                        displayingActionButtonOptionList
                    }
                />
            );
        }

        var saveConfigDom = null;
        var saveButtonOptions = null;

        var saveNotice = <SaveConfigNotice appId={this.props.appId} />;
        var saveConfigBtn = null;
        var saveConfigBtnName =
            this.state.saveConfigBtnName === "default"
                ? "System Default View"
                : this.state.saveConfigBtnName;

        if (!this.props.simplifiedTable) {
            saveConfigBtn = (
                <button
                    className={ClassNames({
                        "table-btn-control": true,
                        savebtn: true,
                        closed: this.state.tableMax
                    })}
                    onClick={this._saveConfig}
                >
                    save view
                </button>
            );
        }

        var exportComp = null;

        if (
            "enableInAppDownload" in
                jnprDataTableObj.getConfigFor(this.props.appId) &&
            jnprDataTableObj.getConfigFor(this.props.appId).enableInAppDownload
        )
            exportComp = <ExportComp appId={this.props.appId} />;

        if (this.state.showSaveBtnOptions)
            if (
                "mode" in jnprDataTableObj.getConfigFor(this.props.appId) &&
                jnprDataTableObj.getConfigFor(this.props.appId).mode == "R"
            )
                saveButtonOptions = (
                    <ul
                        className={ClassNames({
                            ulSaveButtonDropDown: true,
                            ulSaveButtonDropDownClosed: this.state.tableMax
                        })}
                    >
                        {/*<li className='save' onClick={this._simpleSave}>Save View As My Default</li>*/}
                        <li className="save" onClick={this._toggleSaveAs}>
                            <SaveButtonConfig
                                appId={this.props.appId}
                                saveConfig={this._saveConfigWithName}
                                panelClosed={this.state.tableMax}
                                onBlur={this._onSaveBtnBlur}
                                hideSaveConfig={this._toggleSaveConfig}
                            />
                        </li>
                    </ul>
                );
            else
                saveButtonOptions = (
                    <ul
                        className={ClassNames({
                            ulSaveButtonDropDown: true,
                            ulSaveButtonDropDownClosed: this.state.tableMax
                        })}
                    >
                        {/*<li className='save' onClick={this._simpleSave}>Save View As My Default</li>*/}
                        <li className="save" onClick={this._toggleSaveAs}>
                            Save View
                            <div className="inputBox">
                                <input
                                    className="config-input"
                                    type="text"
                                    placeholder="Enter Name"
                                    ref="configName1"
                                    onKeyPress={this._addConfig}
                                />
                                <div
                                    className={ClassNames({
                                        addBtn: true,
                                        R:
                                            "mode" in jnprDataTableObj.config
                                                ? jnprDataTableObj.config
                                                      .mode === "R"
                                                : false
                                    })}
                                    onClick={this._addConfig}
                                />
                            </div>
                            <SaveButtonConfig
                                appId={this.props.appId}
                                saveConfig={this._saveConfigWithName}
                                panelClosed={this.state.tableMax}
                                onBlur={this._onSaveBtnBlur}
                                hideSaveConfig={this._toggleSaveConfig}
                            />
                        </li>
                    </ul>
                );

        if (this.state.showSaveConfig)
            saveConfigDom = (
                <SaveButtonConfig
                    appId={this.props.appId}
                    saveConfig={this._saveConfigWithName}
                    panelClosed={this.state.tableMax}
                    onBlur={this._onSaveBtnBlur}
                    hideSaveConfig={this._toggleSaveConfig}
                />
            );

        if (!this.props.simplifiedTable)
            if (multipleConfigEnabled)
                saveConfigBtn = (
                    <button
                        className={ClassNames({
                            "table-btn-control": true,
                            savebtn: true,
                            closed: this.state.tableMax
                        })}
                        onClick={this._toggleSaveConfig}
                    >
                        <span className="table-btn-ctrl-icon" />
                        <span
                            className="save-config-btn-name"
                            title={saveConfigBtnName}
                        >
                            {saveConfigBtnName}
                        </span>
                        {toggleSaveBtn}
                    </button>
                );

        if (
            "disableSaveConfigBtn" in jnprDataTableObj.config &&
            jnprDataTableObj.config.disableSaveConfigBtn
        )
            saveConfigBtn = null;

        var resetButton = null;

        if (totalFilters > 0)
            resetButton = (
                <button
                    className={ClassNames({
                        "table-btn-control-lnk": true,
                        "options-closed": this.state.tableMax
                    })}
                    onClick={this._filterReset}
                >
                    Reset Filters{" "}
                </button>
            );

        var timeZoneWrapper = null;
        if (enableTimeZone)
            timeZoneWrapper = (
                <TimeZoneCompWrapper
                    appId={this.props.appId}
                    changeTimeZone={this.changeTimeZone}
                />
            );

        var dataTableController = null;
        var starting = false;
        if (this.state.tableMax == false) {
            dataTableController = (
                <div className="jnprTblCtrl-wrapper open">
                    <DataTableControllerNgcsc
                        showAccTab={!this.props.simplifiedTable}
                        noAccountTab={noAccountTab}
                        availableColumns={availableVisibleColumns}
                        availableFilterableColumns={availableFilterableColumns}
                        selectedColumns={Object.keys(selectedColumns)}
                        availableAccounts={accountList}
                        selectedAccounts={selectedAccounts}
                        showGlobalCheckbox={this.state.showGlobalCheckbox}
                        defaultGlobal={this.state.defaultGlobal}
                        tableHeight={tableHeight}
                        defaultCtrlBtn={this.state.tableMax}
                        closePanel={this.closePanel}
                        appId={this.props.appId}
                    />
                </div>
            );
        } else {
            dataTableController = null;
        }

        //here, we need to load different table based on if it is right fixed or not
        var rightFixable = false;
        var columns = jnprDataTableObj.getConfigFor(this.props.appId).columns;
        Object.keys(columns).forEach(key => {
            if ("rightFixed" in columns[key] && columns[key].rightFixed) {
                rightFixable = true;
            }
        });

        if (this.props.nested)
            return (
                <div className={styleName} ref="jnprDataTable">
                    <div
                        className={
                            this.state.tableMax
                                ? "jnprTblCtrl-wrapper closed"
                                : "jnprTblCtrl-wrapper open"
                        }
                    >
                        <DataTableControllerNgcsc
                            showAccTab={!this.props.simplifiedTable}
                            noAccountTab={noAccountTab}
                            availableColumns={availableVisibleColumns}
                            availableFilterableColumns={
                                availableFilterableColumns
                            }
                            selectedColumns={Object.keys(selectedColumns)}
                            availableAccounts={accountList}
                            selectedAccounts={selectedAccounts}
                            showGlobalCheckbox={this.state.showGlobalCheckbox}
                            defaultGlobal={this.state.defaultGlobal}
                            defaultCtrlBtn={this.state.tableMax}
                            closePanel={this.closePanel}
                            tableHeight={tableHeight}
                            appId={this.props.appId}
                        />
                    </div>
                    <div className={tableMainClass}>
                        <div className="options-button">
                            <button
                                className={ClassNames({
                                    "table-btn-control": true,
                                    "main-options": true,
                                    closed: this.state.tableMax
                                })}
                            >
                                <span
                                    className="options-icon"
                                    onClick={this._toggleTableWidthFB}
                                />
                                {this.state.controllerType} Options
                            </button>
                            {saveConfigBtn}
                            {saveButtonOptions}
                            {saveConfigDom}
                            {displayingActionBtn}
                            {resetButton}
                            {exportComp}
                            {saveNotice}
                        </div>
                        <div
                            className={
                                this.state.tableMax
                                    ? "jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth"
                                    : "jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth"
                            }
                            ref="jnprDataTableContent"
                            id={"jnprDataTableContent_" + this.props.appId}
                            style={{ height: tableHeight }}
                        >
                            <div
                                className={ClassNames({
                                    noneDisplay: dataList.length > 0,
                                    noContentsTitle: dataList.length == 0
                                })}
                            >
                                No Records Found
                            </div>
                            <table
                                className={ClassNames({
                                    jnprPlainDataTable: true,
                                    noneDisplay: dataList.length == 0
                                })}
                                ref="jnprPlainDataTable"
                                id={"table" + this.props.appId}
                                style={{
                                    width:
                                        jnprDataTableObj.getColumnWidth(
                                            this.props.appId,
                                            "tableWidth"
                                        ) == null
                                            ? "100%"
                                            : jnprDataTableObj.getColumnWidth(
                                                  this.props.appId,
                                                  "tableWidth"
                                              ) + "px"
                                }}
                            >
                                <thead>
                                    <tr>
                                        {Object.keys(selectedColumns).map(
                                            function(columnName, i) {
                                                return (
                                                    <th
                                                        key={i}
                                                        ref="jnprPlainDataTableHeader"
                                                        data-columnname={
                                                            columnName
                                                        }
                                                        style={{
                                                            width:
                                                                jnprDataTableObj.getColumnWidth(
                                                                    _self.props
                                                                        .appId,
                                                                    columnName
                                                                ) + "px",
                                                            minWidth: availableColumns[
                                                                columnName
                                                            ].key
                                                                ? "158px"
                                                                : "90px"
                                                        }}
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
                                                            appId={
                                                                _self.props
                                                                    .appId
                                                            }
                                                            showGlobalCheckbox={
                                                                _self.state
                                                                    .showGlobalCheckbox
                                                            }
                                                            defaultGlobal={
                                                                _self.state
                                                                    .defaultGlobal
                                                            }
                                                        />
                                                    </th>
                                                );
                                            }
                                        )}
                                    </tr>
                                </thead>
                                <tbody style={{ maxHeight: tableHeight - 50 }}>
                                    {dataList.map(function(dataRow, i) {
                                        return (
                                            <tr
                                                key={i}
                                                className="jnprDataTablePlainTr"
                                            >
                                                {Object.keys(
                                                    selectedColumns
                                                ).map(function(columnName, j) {
                                                    return (
                                                        <td
                                                            key={j}
                                                            className={ClassNames(
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
                                                                data={dataList}
                                                                col={columnName}
                                                                rowHeight={
                                                                    rowHeight
                                                                }
                                                                editable={
                                                                    selectedColumns[
                                                                        columnName
                                                                    ].editable
                                                                }
                                                                changeValueHandler={
                                                                    _self._changeValueHandler
                                                                }
                                                                expandable={
                                                                    true
                                                                }
                                                                nested={
                                                                    _self.props
                                                                        .nested
                                                                }
                                                                appId={
                                                                    _self.props
                                                                        .appId
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
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <SaveButtonConfigConfirm ref="saveButtonConfigConfirm" />
                        {showFooterControls ? (
                            <FooterController
                                dataList={this.state.dataList}
                                appId={this.props.appId}
                            />
                        ) : null}
                    </div>
                </div>
            );
        else
            return (
                <div className={styleName} ref="jnprDataTable">
                    {dataTableController}
                    <div className={tableMainClass}>
                        <div className="options-button">
                            <button
                                className={ClassNames({
                                    "table-btn-control": true,
                                    "main-options": true,
                                    closed: this.state.tableMax
                                })}
                                onClick={this._toggleTableWidthFB}
                            >
                                <span className="options-icon" />
                                {this.state.controllerType} Options
                            </button>
                            {saveConfigBtn}
                            {saveButtonOptions}
                            {displayingActionBtn}
                            {/*resetButton*/}
                            {exportComp}
                            {timeZoneWrapper}
                            {saveNotice}
                        </div>

                        <div
                            className={
                                this.state.tableMax
                                    ? "jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth"
                                    : "jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth"
                            }
                            ref="jnprDataTableContent"
                            id={"jnprDataTableContent_" + this.props.appId}
                            style={{ height: tableHeight }}
                        >
                            <div
                                className={ClassNames({
                                    noneDisplay: dataList.length > 0,
                                    noContentsTitle: dataList.length == 0
                                })}
                            >
                                <div className="noContentsTitle-icon" />
                                <span>No Records Found</span>
                            </div>

                            <div
                                className={ClassNames({
                                    noneDisplay: dataList.length == 0
                                })}
                            >
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
                                    subRowHeightGetter={
                                        this._subRowHeightGetter
                                    }
                                    rowExpanded={this._rowExpandedGetter}
                                    appId={this.props.appId}
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
                                                        appId={
                                                            _self.props.appId
                                                        }
                                                        showGlobalCheckbox={
                                                            _self.state
                                                                .showGlobalCheckbox
                                                        }
                                                        parentLineItem={
                                                            _self.props
                                                                .parentLineItem
                                                        }
                                                        parentHasArrowBtn={
                                                            _self.props
                                                                .parentHasArrowBtn
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
                                                        appId={
                                                            _self.props.appId
                                                        }
                                                        nested={
                                                            _self.props.nested
                                                        }
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
                                                    _self.props.appId,
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
                                                fixed={_self.state.frozenColumns.includes(
                                                    columnName
                                                )}
                                                allowCellsRecycling={
                                                    Object.keys(selectedColumns)
                                                        .length > 20
                                                        ? true
                                                        : false
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
                                id={
                                    "divCellClickDetailContent_" +
                                    this.props.appId
                                }
                                className="divCellClickDetailContent"
                            />
                        </div>
                        {showFooterControls ? (
                            <FooterController
                                dataList={this.state.dataList}
                                appId={this.props.appId}
                            />
                        ) : null}
                    </div>
                </div>
            );
    }
});
module.exports = tableDOM;
