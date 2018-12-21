let React = require('react');
let DataTableStore = require('../flux/stores/DataTableStore');
let DataTableAction = require('../flux/actions/DataTableActions');
let ActionTypes = require('../flux/actions/ActionTypes');

var AccountChooser = React.createClass({
  
  getInitialState: function() {
    var accounts = [];
    
    if(this.props.selectedAccounts){
	this.props.selectedAccounts.map(function(item, i){
	     accounts.push(item);
	 });
    }else{
	 this.props.availableAccounts.map(function(item, i){
	     accounts.push(item.accountId+":"+item.accountName);
	 });
    }
    
    return {
      selectedAccounts: accounts
    };
    
  },
  
  accountChooserChanged: function(){
    var values = [];
    for(var i=0; i<this.refs.accountChooserSelect.options.length; i++){
      if(this.refs.accountChooserSelect.options[i].selected){
        values.push(this.refs.accountChooserSelect.options[i].value);
      }
    }
    this.setState({ selectedAccounts: values });
    this.props.callBack(values);
  },
  
  _autoComplete: function(){
      DataTableAction.performAutoCompleteAccout(this.props.appId, this.refs.txtSearch.value);
  },
  
  _checkAll: function(){
     var accounts=[];
     if(this.refs.chkAllAccounts.checked){
	 this.props.availableAccounts.map(function(item, i){
	     accounts.push(item.accountId+":"+item.accountName);
	 }); 
	 this.props.callBack(accounts);
     }
     this.setState({
	 selectedAccounts: accounts
     });
  },
  
  render: function(){
    return (
              <div>
              <label>
              	<input type='checkbox' ref="chkAllAccounts" onChange={this._checkAll}/>
        	Select all the {this.props.availableAccounts.length} accounts  
              </label>
              <input type="text" placeholder="search" ref="txtSearch" onChange={this._autoComplete}/>	
              <select multiple={true} value={this.state.selectedAccounts} className='columnChooserSelect'  ref='accountChooserSelect' onChange={this.accountChooserChanged}>
              {this.props.availableAccounts.map(function(object, i){
                return <option value={object.accountId+":"+object.accountName} key={i} >{object.accountName}({object.accountId})</option>;
              })}
              </select>
              </div>
	     
            
    );
  }
});

module.exports = AccountChooser;