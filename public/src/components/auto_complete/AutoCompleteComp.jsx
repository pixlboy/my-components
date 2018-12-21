let React = require('react');

let AutoCompleteMixin = require('./Mixin');
let ClassNames = require( 'classnames' );
let _ = require( 'underscore' );
import { Checkbox } from 'react-mdl';

require( './auto_complete.scss' );

let AutoCompleteComponent = React.createClass({

  mixins: [AutoCompleteMixin],

  render:function(){

    var selectedTitles  = [];
    _.each(this.state.selectedOptions, function(item){
      selectedTitles.push(item.title);
    });

    var autoCompletedTitle = null;
    if(selectedTitles.length>0){
      if(this.state.selectedOptions.length == this.props.options.length){
        autoCompletedTitle = 'All Selected';
      }else{
        autoCompletedTitle = selectedTitles.join(', ');
      }
    }

    var compDropDown = null;
    var wrapperId = 'autoComplete-dropdown-wrapper-'+ this.props.compAppId;
    var autoCompleteId = 'autoComplete-'+ this.props.compAppId;
    var searchInputId = 'autoComplete-search-'+ this.props.compAppId;
    if(this.state.showDropDown)
      compDropDown = <div className="autoComplete-wrapper">
                        <section className='autoComplete-container'>
                            <input type="text" className='autoComplete-search' id={searchInputId}
                            defaultValue={this.state.searchTerm} placeholder="Search..."  onChange={ this.filter }/>
                            <div className="autoComplete-header">
                              <Checkbox
                              checked = { this.state.checkedAll }
                              className='multiselect-selectall-btn'
                              label={'Select All'}
                              onChange={this.selectAll}
                              />
                              </div>
                            <div className="autoComplete-ulWrapper" id={wrapperId}>
                                <ul  className='autoComplete-options'>
                                {this.state.paginationedOptions.map((option, index) => {
                                   return <li key={index}
                                       value={option.value}
                                       data-selectedIndex={index}
                                       onClick={this.toggleItem}
                                       className={ClassNames( { 'selected': option.selected }) }>
                                     <span className={ClassNames( { 'selectedIcon': true, "auto_complete_hide":!option.selected }) }></span>
                                     <span className="title">
                                       {option.title}
                                     </span>

                                     </li>;
                                 })}
                                </ul>
                              </div>
                        </section>
                    </div>;

    return (
      <div>
        <div className='filterTitle'>{this.props.title} <span className="ac-indicator">{this.state.selectedOptions.length} selected</span></div>
        <div className="autoComplete" id={autoCompleteId}>
            <div className="autoComplete-title" onClick={this.toggleDropDown}>
            <div className="ac-selected-content">{autoCompletedTitle}</div>
              <span className={ClassNames({"actions-icon":true, "down":!this.state.showDropDown, "up":this.state.showDropDown})}  ></span>
            </div>
            {compDropDown}
        </div>
        </div>

    );
  }
});


module.exports = AutoCompleteComponent;
