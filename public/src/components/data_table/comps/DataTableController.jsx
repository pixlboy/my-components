let React = require('react');
let ColumnChooser = require('./ColumnChooser');
let MultiColumnFilter = require('./MultiColumnFilter');
let DataTableControllerMixins = require('./../mixins/DataTableControllerMixins');

var Controller = React.createClass({
  mixins: [DataTableControllerMixins],	
  render: function(){
    return (
            <div className='jnprDataTableController'>
            <ul> 
              <li onClick={this.chooseTabTypeColumns} className={this.state.tabType=="columns"?"selected":"unselected"}>Columns</li>
              <li onClick={this.chooseTabTypeFilters} className={this.state.tabType=="filters"?"selected":"unselected"}>Filters</li>
            </ul>
            <div className={this.state.tabType=="columns"?"":"noneDisplay"}>
             <ColumnChooser ref='jnprDataTableColumnChooser' 
              availableColumns={this.props.availableColumns} 
              selectedColumns={this.props.selectedColumns}
              callBack={this.updateSelectedColumns}
             />
            </div>
            <div className={this.state.tabType=="filters"?"":"noneDisplay"}>
              <MultiColumnFilter availableColumns={this.props.availableColumns} filterCallBack={this._filterCallBack} filterReset={this._filterReset}/>
            </div>
            
            <div className={this.props.showGlobalCheckbox?"":"noneDisplay"}>
             Global: <input type="checkbox" ref="chkGlobal"/>
            </div>
           
        	
           </div>
            
    );
  }
});

module.exports = Controller;