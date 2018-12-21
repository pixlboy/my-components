let React = require('react');
import {Table, Column, Cell} from 'fixed-data-table-2';

require('./style/fixed-data-table.css');
require('./style/jnpr-datatable.scss');

let HeaderCell = require('./comps/HeaderCell');
let ExpandableTextCell = require('./comps/ExpandableTextCell');
let ColumnChooser = require('./comps/ColumnChooser');
let MultiColumnFilter = require('./comps/MultiColumnFilter');
let DataTableController = require('./comps/DataTableController');
let DataTableMixins = require('./mixins/DataTableMixins');
let FooterController = require('./comps/FooterController');

let ClassName = require('classnames');

let tableDOM =  React.createClass({

    defaultProps:{
        appId: "app",
        hasAccIdCol: false
    },

  mixins: [DataTableMixins],
  render: function(){

    var {originalDataList, dataList, availableColumns, selectedColumns, rowHeight,headerHeight,tableHeight, tableWidth, columnFilterable } = this.state;
    var _self = this;
    var styleName = "jnprDataTable";
    if(this.props.styleType){
	styleName+="_"+this.props.styleType;
    }

    if( this.props.nested )
      return (
              <div className={styleName} ref='jnprDataTable'>
              <div className={this.state.tableMax?'noneDisplay':''}>
              <DataTableController availableColumns={availableColumns}
              selectedColumns={Object.keys(selectedColumns)}
              showGlobalCheckbox={this.state.showGlobalCheckbox}
              defaultGlobal={this.state.defaultGlobal}
              appId={this.props.appId}
              />
              </div>
              <div>
              <div className='options-button'>
                  <input type='button' value={this.state.tableMax?"Restore":"Expand"} onClick={this._toggleTableWidth} />
                  <input type='button' value="Clear All Filters" onClick={this._filterReset}/>
                  <input type='button' value="save" onClick={this._saveConfig} />
                  <input type='button' value="Unload me" onClick={this._unloadme} />
              </div>

              <div className={this.state.tableMax? 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth':'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth' } ref='jnprDataTableContent' style={{height: tableHeight}}>
              <div className={ ClassName({ 'noneDisplay': dataList.length>0, 'noContentsTitle':  dataList.length==0 }) } >No Content to Display!</div>
              <table className={ClassName({ 'jnprPlainDataTable': true, 'noneDisplay': dataList.length==0 }) } ref='jnprPlainDataTable'>
              	<thead>
                    <tr>
                    {
                      Object.keys(selectedColumns).map(function(columnName,i){
                        return <th key={i} ref="jnprPlainDataTableHeader" >
                                <HeaderCell  columnName={columnName}
                                columnFilterable= {columnFilterable}
                                column={selectedColumns[columnName]}
                                appId={_self.props.appId}
                                showGlobalCheckbox={_self.state.showGlobalCheckbox}
                                defaultGlobal={_self.state.defaultGlobal}
                                />
                        	</th>
                      })
                    }
                    </tr>
                  </thead>
                  <tbody style={{maxHeight: tableHeight-50}}>
                  {
                    dataList.map(function(dataRow, i){
                      return <tr key={i} className='jnprDataTablePlainTr'>
                      {
                        Object.keys(selectedColumns).map(function(columnName,j){
                          return <td key={j} >
                          	<ExpandableTextCell
                                  	columnConfig={selectedColumns[columnName]}
                                  	rowIndex={i}
                                  	data={dataList}
                                  	col={columnName}
                                  	rowHeight={rowHeight}
                                  	editable={selectedColumns[columnName].editable}
                                  	changeValueHandler={_self._changeValueHandler}
                          		expandable={true}
                          		appId={_self.props.appId}
                          	/>
                          </td>
                        })
                      }
                      </tr>
                    })
                  }
                </tbody>
              </table>

              </div>
              <FooterController dataList={this.state.dataList} appId={this.props.appId}/>
              </div>
            </div>

              )
    else
      return (
              <div className='jnprDataTable' ref='jnprDataTable'>
              	<div className={this.state.tableMax?'noneDisplay':''}>
                    <DataTableController availableColumns={availableColumns}
                    selectedColumns={Object.keys(selectedColumns)}
                    appId={this.props.appId}
                    showGlobalCheckbox={this.state.showGlobalCheckbox}
                    defaultGlobal={this.state.defaultGlobal}
                    />
                </div>

                <div>
               <div>
                <input type='button' value={this.state.tableMax?"Restore":"Expand"} onClick={this._toggleTableWidthFB} />
                <input type='button' value="save" onClick={this._saveConfig} />
                <input type='button' value="Clear All Filters"  onClick={this._filterReset}/>
                </div>
                <div className={this.state.tableMax? 'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentFullWidth':'jnprDataTableContent jnprPlainDataTableContent jnprDataTableContentPartWidth' } ref='jnprDataTableContent' style={{height: tableHeight}}>
                <div className={ ClassName({ 'noneDisplay': dataList.length>0, 'noContentsTitle': dataList.length==0 }) } >No Records</div>
                <div className={ClassName({ 'noneDisplay': dataList.length==0 }) } >

                <Table
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    groupHeaderHeight={30}
                    rowsCount={dataList.length}
                    isColumnResizing={false}
                    width={tableWidth}
                    height={tableHeight}
                    onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                    onScrollEnd = {this._onScrollEndCallBack}
                  >


                  { Object.keys(selectedColumns).map(function(columnName,i){
                    return <Column
                                  key={i}
                                  columnKey={columnName}
                                  header={ <HeaderCell  columnName={columnName}
                                                        columnFilterable= {columnFilterable}
                                                	column={selectedColumns[columnName]}
                                  			appId={_self.props.appId}
                                                        showGlobalCheckbox={_self.state.showGlobalCheckbox}
                                                        defaultGlobal={_self.state.defaultGlobal}
                                  />}
                                  cell={<ExpandableTextCell
                                	columnConfig={selectedColumns[columnName]}
                                  	data={dataList}
                                  	col={columnName}
                                  	rowHeight={rowHeight}
                                  	editable={selectedColumns[columnName].editable}
                                  	changeValueHandler={_self._changeValueHandler}
                                  	expandable={false}
                                  	appId={_self.props.appId}
                                  	/>}
                                  width={selectedColumns[columnName].width}
                                  isResizable={true}
                                  flexGrow={ selectedColumns[columnName].flexGrows }
                                  />

                 }
                )}

                    </Table>
                </div>
                </div>
                <FooterController dataList={this.state.dataList} appId={this.props.appId}/>
              </div>


              </div>
      )
  }
});
module.exports = tableDOM;
