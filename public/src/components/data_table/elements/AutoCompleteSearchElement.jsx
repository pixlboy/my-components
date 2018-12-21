import React from 'react';
import AutoCompleteComponent from '../../auto_complete/AutoCompleteComp';
import LabelElement from './LabelElement';
import classNames from 'classnames';
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

var AutoCompleteSearchElement = React.createClass({

  onChangeSelect(options){
    this.props.inputChanged({
      dataType: 'autoCompleteSearch',
      value: options,
      comp: 'in',
      id: this.props.data.id
    });
  },

  render(){
    //we need to adjust the default selection status of items
    //if this is systemDefault, we set default selected to true
    var items = this.props.data.items;
    var defaultSelected = false
    if(jnprDataTableObj.customConfiguration.systemDefault){
      defaultSelected = true;
    }
    items.forEach(item=>{
      item.selected = defaultSelected;
    });


    return (
      <div className= {classNames({ 'autoCompleteSearch': true})}>
        <AutoCompleteComponent
        title= {this.props.data.title}
        appId = {this.props.appId} //appId
        options={items} //passing all the options
        onChangeSelect = {this.onChangeSelect}
        id={this.props.data.id} //passing columnId as key
        compAppId = {this.props.appId+ '_'+ this.props.data.id}
        />
      </div>
    );
  }
});
module.exports = AutoCompleteSearchElement;
