let React = require( 'react' );
import { Column, Cell, Table } from 'fixed-data-table-2';
var ClassNames = require( 'classnames' );

require( './style/fixed-data-table.css' );
require( './style/jnpr-datatable.scss' );

let HeaderCell = require( './comps/HeaderCell' );
let ActionButton = require( './comps/ActionButton' );
let ExpandableTextCell = require( './comps/ExpandableTextCell' );
let ColumnChooser = require( './comps/ColumnChooser' );
let MultiColumnFilter = require( './comps/MultiColumnFilter' );
let DataTableControllerNgcsc = require( './comps/DataTableControllerNgcsc' );
let DataTableMixins = require( './mixins/DataTableMixins' );
let jnprDataTableObj = require( "./data_object/DataTableObjectFactory" ).getDataTableObject();
let ClassName = require( 'classnames' );
let FooterController = require( './comps/FooterController' );
let DataTableStore = require( './flux/stores/DataTableStore' );
let SaveButtonConfig = require( './comps/SaveButtonConfig' );
let SaveButtonConfigConfirm = require( './comps/SaveButtonConfigConfirm' );
let ExportComp = require( './comps/ExportComp' );

let tableDOM = React.createClass( {

    defaultProps:{
        appId: "app",
        hasAccIdCol: false,
        plain: false
    },

    mixins: [DataTableMixins],

    
    closePanel: function() {
        this._toggleTableWidthFB();
    },


    getInitialState: function() {

        jnprDataTableObj.subscribeToAccountList( function( obj ) {
            this.setState( {
                accountList: obj
            });
        }.bind( this ) );

        return {
            num: 0,
            accountList: jnprDataTableObj.accountList || null,
            originalAccountList: jnprDataTableObj.accountList || null,
            selectedAccounts: jnprDataTableObj.allCustomConfigurations[this.props.appId].defaultSelectedAccountList || null
        }
    },
    componentDidMount: function() {
        DataTableStore.addCheckRowsUpdated( this.props.appId, this._checkedRowsCallBack );
        if(this.props.checkBoxCallBackHandler){
            this.props.checkBoxCallBackHandler();
        }
    },

    componentWillUnmount: function() {
        DataTableStore.removeCheckRowsUpdated( this.props.appId, this._checkedRowsCallBack );

    },

    _checkedRowsCallBack: function() {
        this.setState( {
            num: jnprDataTableObj.getCheckedRowsCountFor( this.props.appId )
        });
    },

    render: function() {

        var {originalDataList, dataList, availableColumns, selectedColumns, rowHeight, headerHeight, tableHeight, tableWidth, accountList, selectedAccounts, columnFilterable, totalFilters, availableVisibleColumns, availableFilterableColumns, displayingActionButton, displayingActionButtonOptionList, multipleConfigEnabled, checkBoxEnabled, scrollToRow} = this.state;
        var _self = this;
        var styleName = "jnprDataTable_ngcsc";
        var tableMainClass = ClassNames( {
            'jnprTbl-main': true,
            'table-full-width': this.state.tableMax
        });
        var displayingActionBtn = null;
        var toggleSaveBtn = null;

        if ( this.state.showSaveConfig ) {
            toggleSaveBtn = <div className='toggleSaveBtn'><span className='actions-icon up'></span></div>
        } else {
            toggleSaveBtn = <div className='toggleSaveBtn'><span className='actions-icon down'></span></div>
        }

        var saveConfigDom = null;
        var saveButtonOptions = null;

        var saveConfigBtn = <button
            className={
                ClassNames( {
                    'table-btn-control': true,
                    'savebtn': true,
                    'closed': this.state.tableMax
                })
            }
            onClick={ this._saveConfig } >save
        </button>

        if ( this.state.showSaveBtnOptions ) {
            saveButtonOptions = <ul className={ClassNames( { "ulSaveButtonDropDown": true, 'ulSaveButtonDropDownClosed': this.state.tableMax }) } >
                <li className='save' onClick={this._simpleSave}>Save Table View</li>
                <li className='save' onClick={this._toggleSaveAs}>Saved Filters <span className="saveViewAs"></span> </li>
            </ul>;
        }

        if ( this.state.showSaveConfig )
            saveConfigDom = <SaveButtonConfig appId={this.props.appId}
                saveConfig={this._saveConfigWithName}
                panelClosed={this.state.tableMax}
				hideSaveConfig={this._toggleSaveConfig}
                />

        if ( multipleConfigEnabled )
            saveConfigBtn = <button
                className={
                    ClassNames( {
                        'table-btn-control': true,
                        'savebtn': true,
                        'closed': this.state.tableMax
                    })
                }
                onClick={ this._toggleSaveConfig }>save
                {toggleSaveBtn}
            </button>
        var displayingActionBtn = null;
        if ( checkBoxEnabled ) {
            displayingActionBtn = <div className="ActionRegion"><div className='selectedRows'>{this.state.num} selected</div><ActionButton appId={this.props.appId} displayingActionButton={displayingActionButton} displayingActionButtonOptionList={displayingActionButtonOptionList}/></div>
        } else {
            displayingActionBtn = <ActionButton appId={this.props.appId} displayingActionButton={displayingActionButton} displayingActionButtonOptionList={displayingActionButtonOptionList}/>
        }

        var exportComp = null;
        if ( 'enableInAppDownload' in jnprDataTableObj.config && jnprDataTableObj.config.enableInAppDownload ) {
            exportComp = <ExportComp appId={this.props.appId}/>
        }

      //here, we need to load different table based on if it is right fixed or not
        var rightFixable = false;
        var columns = jnprDataTableObj.getConfigFor(this.props.appId).columns;
        Object.keys(columns).forEach(key=>{
          if('rightFixed' in columns[key] && columns[key].rightFixed){
            rightFixable = true;
          }
        });

        if ( this.props.nested )
            return (
                <div
                    className={ styleName }
                    ref='jnprDataTable'>
                    <div className={ tableMainClass }>
                        <div className='options-button'>
                            <button
                                className={
                                    ClassNames( {
                                        'table-btn-control': true,
                                        closed: this.state.tableMax
                                    })
                                }
                                onClick={ this._toggleTableWidth } ><span className='options-icon'></span>options</button>
                            {saveConfigBtn}
                            {saveConfigDom}
                            {exportComp}
                            <button
                                className={
                                    ClassNames( {
                                        'table-btn-control-lnk': true,
                                        'options-closed': this.state.tableMax
                                    })
                                }
                                onClick={ this._filterReset } >clear all filters ( {totalFilters}) </button>
                            {displayingActionBtn}
                        </div>
                        <div
                            className={ this.state.tableMax ? 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth' : 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth' }
                            ref='jnprDataTableContent'
                            id={'jnprDataTableContent_' + this.props.appId  }
                            style={ { height: tableHeight } }>
                            <div className={ ClassName( {
                                'noneDisplay': dataList.length > 0,
                                'noContentsTitle': dataList.length == 0
                            }) }>
                                No Records Found
                            </div>
                            <table
                                className={ ClassName( {
                                    'jnprPlainDataTable': true,
                                    'noneDisplay': dataList.length == 0
                                }) }
                                ref='jnprPlainDataTable'>
                                <thead>
                                    <tr>
                                        { Object.keys( selectedColumns ).map( function( columnName, i ) {
                                            return <th
                                                key={ i }
                                                ref="jnprPlainDataTableHeader">
                                                <HeaderCell
                                                    columnName={ columnName }
                                                    columnFilterable={ columnFilterable }
                                                    column={ selectedColumns[columnName]}
                                                    appId={ _self.props.appId }
                                                    showGlobalCheckbox={ _self.state.showGlobalCheckbox }
                                                    defaultGlobal={ _self.state.defaultGlobal } />
                                            </th>
                                        }) }
                                    </tr>
                                </thead>
                                <tbody style={ { maxHeight: tableHeight - 50 } }>
                                    { dataList.map( function( dataRow, i ) {
                                        return <tr
                                            key={ i }
                                            className='jnprDataTablePlainTr'>
                                            { Object.keys( selectedColumns ).map( function( columnName, j ) {
                                                return <td key={ j } className='ellipsis'>
                                                    <ExpandableTextCell
                                                        columnConfig={ selectedColumns[columnName]}
                                                        rowIndex={ i }
                                                        data={ dataList }
                                                        col={ columnName }
                                                        rowHeight={ rowHeight }
                                                        editable={ selectedColumns[columnName].editable }
                                                        changeValueHandler={ _self._changeValueHandler }
                                                        expandable={ true }
                                                        appId={ _self.props.appId }
                                                        checkHandler = {_self._checkHandler}/>
                                                </td>
                                            }) }
                                        </tr>
                                    }) }
                                </tbody>
                            </table>
                        </div>
                        <FooterController
                            dataList={ this.state.dataList }
                            appId={ this.props.appId } />
                    </div>
                    <div className={ ClassNames( {
                        'jnprTblCtrl-wrapper closed': this.state.tableMax,
                        'jnprTblCtrl-wrapper open': !this.state.tableMax,
                        'noneDisplay': this.props.hideControls
                    }) }>
                        <DataTableControllerNgcsc showAccTab={false}
                            showFiltersTab={true}
                            showColumnsTab={true}
                            availableColumns={ availableVisibleColumns }
                            availableFilterableColumns={availableFilterableColumns}
                            selectedColumns={ Object.keys( selectedColumns ) }
                            availableAccounts={ accountList }
                            selectedAccounts={ selectedAccounts }
                            showGlobalCheckbox={ this.state.showGlobalCheckbox }
                            defaultGlobal={ this.state.defaultGlobal }
                            tableHeight= {tableHeight}
                            appId={ this.props.appId } />
                    </div>
                </div>
            )
        else
            return (
                <div
                    className={ styleName }
                    ref='jnprDataTable'>
                    <div className={ this.state.tableMax ? 'jnprTblCtrl-wrapper closed' : 'jnprTblCtrl-wrapper open' }>
                        <DataTableControllerNgcsc showAccTab={false}
                            showFiltersTab={true}
                            showColumnsTab={true}
                            availableColumns={ availableVisibleColumns }
                            availableFilterableColumns={availableFilterableColumns}
                            selectedColumns={ Object.keys( selectedColumns ) }
                            availableAccounts={ accountList }
                            selectedAccounts={ selectedAccounts }
                            showGlobalCheckbox={ this.state.showGlobalCheckbox }
                            defaultGlobal={ this.state.defaultGlobal }
                            tableHeight= {tableHeight}
                            closePanel={ this.closePanel }
                            appId={ this.props.appId } />
                    </div>
                    <div className={ tableMainClass }>
                        <div className='options-button'>
                            <button
                                className={
                                    ClassNames( {
                                        'table-btn-control': true,
                                        'main-options': true,
                                        closed: this.state.tableMax
                                    })
                                }
                                onClick={ this._toggleTableWidthFB } ><span className='options-icon'></span>options</button>



                            {saveConfigBtn}
                            {saveButtonOptions}
                            {saveConfigDom}
                            {exportComp}
                            <button
                                className={
                                    ClassNames( {
                                        'table-btn-control-lnk': true,
                                        'options-closed': this.state.tableMax
                                    })
                                }
                                onClick={ this._filterReset } >clear all filters ( {totalFilters}) </button>
                            {displayingActionBtn}
                        </div>
                        <div  className={ this.state.tableMax ? 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth' : 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth' }
                            ref='jnprDataTableContent'
                            id={'jnprDataTableContent_' + this.props.appId  }
                            style={ { height: tableHeight } }>
                            <div className={ ClassName( {
                                'noneDisplay': dataList.length > 0,
                                'noContentsTitle': dataList.length == 0
                            }) }>
                                No Records Found
                            </div>
                            <Table
                                rowHeight={ rowHeight }
                                headerHeight={ headerHeight }
                                groupHeaderHeight={ 30 }
                                rowsCount={ dataList.length }
                                isColumnResizing={ false }
                                width={ tableWidth }
                                height={ tableHeight }
                                onColumnResizeEndCallback={ this._onColumnResizeEndCallback }
                                onScrollEnd={ this._onScrollEndCallBack }
                                scrollToRow = {scrollToRow}
                                rowClassNameGetter = {this.rowClassNameGetter}
                                onRowMouseEnter = {this.onRowMouseEnter}
                                onRowMouseLeave = {this.onRowMouseLeave}
                                appId={ this.props.appId }>
                                { Object.keys( selectedColumns ).map( function( columnName, i ) {

                                    return <Column
                                        key={ i }
                                        columnKey={ columnName }
                                        header={ <HeaderCell
                                            columnName={ columnName }
                                            columnFilterable={ columnFilterable }
                                            column={ selectedColumns[columnName]}
                                            appId={ _self.props.appId }
                                            showGlobalCheckbox={ _self.state.showGlobalCheckbox }
                                            defaultGlobal={ _self.state.defaultGlobal } /> }
                                        cell={ <ExpandableTextCell
                                            columnConfig={ selectedColumns[columnName]}
                                            data={ dataList }
                                            col={ columnName }
                                            rowHeight={ rowHeight }
                                            editable={ selectedColumns[columnName].editable }
                                            changeValueHandler={ _self._changeValueHandler }
                                            expandable={ false }
                                            appId={ _self.props.appId }
                                            checkHandler = {_self._checkHandler}
                                            showDetailExtraDataCallBack = {_self._showDetailExtraDataCallBack}
                                            extraDataCallBack = {_self._extraDataCallBack}
                                            /> }
                                        width={  jnprDataTableObj.getColumnWidth( _self.props.appId, columnName ) }
                                        isResizable={ selectedColumns[columnName].resizable == null ? true : selectedColumns[columnName].resizable  }
                                        minWidth={ selectedColumns[columnName].minWidth }
                                        flexGrow={ selectedColumns[columnName].flexGrows }
                                        fixedRight={ selectedColumns[columnName].rightFixed==null?false:selectedColumns[columnName].rightFixed}
                                        />

                                }
                                ) }
                            </Table>
                        </div>
                        <FooterController
                            dataList={ this.state.dataList }
                            appId={ this.props.appId } />
                    </div>

                </div>
            )
    }
});
module.exports = tableDOM;
