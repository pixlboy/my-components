//jshint esversion:6
//
import React from 'react';
import jQuery from 'jquery';
import ClassNames from 'classnames';
import _ from 'underscore';
let DataTableStore = require('../flux/stores/DataTableStore');
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

require('../style/dropdown.scss');

var DropdownElement = React.createClass({

    getInitialState() {
        if (this.props.multiSelectMode) {
            this.props.items.unshift({
                id: 'all',
                title: 'All',
                selected: false,
                value: null
            });
        }

        let items = this.props.items;
        return {
            id: this.props.id,
            title: this.props.title,
            items: items,
            isMenuVisible: false,
            multiSelectMode: this.props.multiSelectMode,
            willTriggerEvts: this.props.willTriggerEvts,
            multiselectAllSelected: true
        };
    },

    toggleMenu() {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible
        })
    },

    componentDidUpdate() {
        let node = this.refs.MenuWrapper;
        let node_2 = this.refs.MenuValueHolder;
        if (this.state.isMenuVisible) {
            node.style.width = (node_2.offsetWidth + 16) + 'px';
            node.focus();
        }
    },

    componentWillUnmount() {
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
    },

    handleSelectAll() {
        let newSelectionState = !this.state.multiselectAllSelected;
        let items = this.state.items.map(m => {
            if (m.id !== 'all') {
                m.selected = newSelectionState;
            }
            return m;
        });

        let value = '';
        if (newSelectionState) {
            value = this.state.items.filter(p => p.id !== 'all').map(m => m.value).join('&&');
        } else {
            value = '';
        }

        this.props.inputChanged({
            id: this.state.id,
            dataType: 'multilist',
            value: value
        });

        this.setState({
            multiselectAllSelected: newSelectionState,
            items: items
        });
    },

    handleMenuItem(ev) {
        let items = [];
        if (this.props.multiSelectMode) {
            items = this.state.items.map(item => {
                if (item.id === ev.target.getAttribute('data-id')) {
                    if (!item.hasOwnProperty('selected')) {
                        item.selected = true;
                    } else {
                        item.selected = !item.selected;
                    }
                }
                return item;
            })
        } else {
            items = this.state.items.map(item => {
                if (item.id === ev.target.getAttribute('data-id')) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
                return item;
            })
        }

        this.setState({
            items: items,
            isMenuVisible: this.props.multiSelectMode
        });
        this.props.inputChanged({
            id: this.state.id,
            dataType: this.props.type,
            value: this.state.items.filter(i => i.selected).map(m => m.value).join('&&')
        });

    },

    componentDidMount() {
        let node = this.refs.MenuWrapper;
        let _this = this;

        node.addEventListener('blur', () => {
            _this.setState({
                isMenuVisible: false
            });
        });

        this.updateCheckboxStatus();
        DataTableStore.addFiltersReset(this.props.appId, this._filtersResetHandler);
        if (this.props.willTriggerEvts) {
            DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
        }
    },

    _customConfigChanged() {
        this.updateCheckboxStatus();
    },

    updateCheckboxStatus: function() {

      //make sure we need to update this after we reset
      setTimeout(function(){

        let id = this.state.id;
        let cfg = jnprDataTableObj.customConfiguration;
        let val = [];
        let items = [];

        if (cfg && cfg.hasOwnProperty('filterModel') && cfg.filterModel.hasOwnProperty(id) && cfg.filterModel[id].value1) {
            let val = cfg.filterModel[id].value1;
            if (this.props.multiSelectMode) {
                items = this.state.items.map(i => {
                    if (val.indexOf(i.value) > -1) {
                        i.selected = true;
                    } else {
                        //if not there, we need to set selected to false
                        i.selected = false;
                    }
                    return i;
                });
            } else {
                let comp = cfg.filterModel[id].comp
                items = this.state.items.map(i => {
                    if (comp === i.value) {
                        i.selected = true;
                    }
                    return i;
                });
            }
            this.setState({
                items: items
            })
        } else {
          //if no filter passed, we just emulate the filterResetHandler
          this._filtersResetHandler();
        }
      }.bind(this), 0);
    },

    _filtersResetHandler() {
       var allIncluded = this.state.items.filter(f=>f.id==='all').length>0;
       if(allIncluded){
         //select all, but not the first one
         this.setState({
           items: this.state.items.map(i => {
             if(i.id!=='all')
               i.selected = true;
             else
               i.selected = false;
             return i;
           })
        });

       }else{
         //pre-select first one
         this.state.items.forEach( (item, index)=>{
           if(index==0){
             item.selected=true;
           }else{
             item.selected=false;
           }
         });
         this.setState({
           items: this.state.items
         });
       }
    },

    render() {
        let selectAllMenuItemClass = ClassNames({
            'selected': this.state.items.filter(f => f.id !== 'all').every(i => i.selected)
        });
        let elements = this.state.items.map(item => {
            let menuItemClass = ClassNames({
                'selected': item.hasOwnProperty('selected') && item.selected
            })
            if (item.id === 'all') {
                return <li
                    key={ item.id + this.props.id /*+ '-'+ Math.random()*10000000*/ }
                    data-id={ item.id }
                    onClick={ this.handleSelectAll }
                    className={ selectAllMenuItemClass }>
                    { item.title }
                </li>;
            } else {
                return <li
                    key={ item.id + this.props.id + '-'+ Math.random()*10000000 }
                    data-id={ item.id }
                    onClick={ this.handleMenuItem }
                    className={ menuItemClass }>
                    { item.title }
                </li>;
            }
        });

        let menuClass = ClassNames({
            'open': this.state.isMenuVisible,
            'rc-filter-dropdown-menu-wrapper': true
        });

        let chevronClass = ClassNames({
            'open': this.state.isMenuVisible,
            'rc-filter-dropdown-ico': true
        })

        let title = null;
        if (!!this.state.title) {
            title = <span className='rc-filter-dropdown-title'>{ this.state.title }</span>;
        }

        let dropdownTitle = null;
        if (this.state.multiSelectMode && this.state.items.length - 1 == this.state.items.filter(i => i.selected).length) {
                dropdownTitle = 'All Selected';
        }else{
            dropdownTitle = this.state.items.filter(i => i.selected).map(o => o.title).join(', ');
        }

        return (<div className='rc-filter-dropdown-container'>
            { title }
            <div className='rc-filter-dropdown-menu-value-holder'>
                <div
                    className='rc-filter-dropdown-menu-value'
                    onClick={ this.toggleMenu }
                    ref="MenuValueHolder">
                    {dropdownTitle}
                </div>
                <div
                    className={ chevronClass }
                    onClick={ this.toggleMenu }></div>
            </div>
            <div
                className={ menuClass }
                tabIndex="1"
                ref="MenuWrapper">
                <ul className='rc-filter-dropdown-menu'>
                    { elements }
                </ul>
            </div>
        </div>);
    }

});

module.exports = DropdownElement;
