//jshint esversion: 6
import React from 'react';
import ReactDOM from 'react-dom';
import InputElement from './InputElement';
import DateElement from './DateElement';
import CheckboxGroupElement from './CheckboxGroupElement';
import DropdownElement from './DropdownElement';
import AutoCompleteSearchElement from './AutoCompleteSearchElement';
import NumberElement from './NumberElement';

import _ from 'underscore';
import { OrderedMap, Map } from 'immutable';
import ScrollBar from 'perfect-scrollbar';
import '../style/perfect-scrollbar.css';
import ClassNames from 'classnames';

let DataTableAction = require('../flux/actions/DataTableActions');
let ActionTypes = require('../flux/actions/ActionTypes');
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();
let DataTableStore = require('../flux/stores/DataTableStore');

var FilterView = React.createClass({

    // no need to put fiterQuery into state, it is heavy and causing state
    // update event to be dispatched for dateTime component
    filterQuery: {},

    // get the initial state
    getInitialState() {

        // before returning, we need to pre-populate the filterQuery based on
        // pre-saved configuration
        if (jnprDataTableObj.customConfiguration.filterModel && Object.keys(jnprDataTableObj.customConfiguration.filterModel).length > 0)
        this.filterQuery = _.clone(jnprDataTableObj.customConfiguration.filterModel); // using
        // object
        // copy
        // to
        // avoid
        // auto-updates
        // here
        else
        this.filterQuery = {};

        return {
            fields: OrderedMap(_.indexBy(this.processData(this.props.availableColumns, true), 'id')),
            isVisible: true,
            hideToggleText: 'hide',
            clearInputs: false,
            filterQuery: Map([]),
            selectedAccountNum: 1,
            filterCount: jnprDataTableObj.getCustomFilterCountFor(this.props.appId)
        };
    },
    //we only care initial options for auto-complete select status, for other senario, there won't be change
    processData: function(columns, initial) {

        var columns = _.filter(columns, item => item.filterable);
        var keys = Object.keys(columns);
        jnprDataTableObj.appId = this.props.appId;

        var columnsTransformed = keys.map(item => {
            var keyName = columns[item].id;
            return Object.assign(columns[item], {
                foundInSearch: true,
                filtered: (jnprDataTableObj.customConfiguration.filterModel[keyName] && Object.keys(jnprDataTableObj.customConfiguration.filterModel[keyName]).length > 0 && !jnprDataTableObj.isCustomFilterBaseFilter(this.props.appId, keyName)) ? true : false,
                filter: _.clone(jnprDataTableObj.customConfiguration.filterModel[keyName])
            });

        });
        return columnsTransformed;

    },
    // initialize perfect scrollbar
    componentDidMount() {
        // need to add this to listen the clear filter action from the button
        // above the table
        DataTableStore.addFiltersReset(this.props.appId, this._filterResetFromController);
        // adding customer configuration changing listener
        DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
        DataTableStore.addAccountSelectionChangedHandler(this.props.appId, this._customAccountSelectionChanged);
        DataTableStore.addTotalFilterChangedChangedHandler(this.props.appId, this._totalFilterUpdated);
        //update filterQuery for autoComplete default system
        DataTableStore.addAutoCompleteDefaultAllSelectOptions(this.props.appId, this._updateAutoCompleteFilerAllSelect);
    },

    resetting: false,
    /**
    * this flag is used to default number of filters to 0, as we do have base
    * filters, and base filters are saved in baseFilters and then assigned into
    * customerConfiguration throughresetFilterSorter So when
    * _customConfigChanged is triggered, the number of filters are always
    * considered getFilterCount() method using this flag to control total
    * number of filters inside the
    */
    //
    _filterResetFromController: function() {
        this.clearFilterNoReset();
    },

    _customConfigChanged: function() {
        if (jnprDataTableObj.customConfiguration.filterModel && Object.keys(jnprDataTableObj.customConfiguration.filterModel).length > 0)
        this.filterQuery = _.clone(jnprDataTableObj.customConfiguration.filterModel); // using
        // object
        // copy
        // to
        // avoid
        // auto-updates
        // here
        this.setState({
            fields: OrderedMap(_.indexBy(this.processData(jnprDataTableObj.availableFilterableColumns), 'id')),
        });
    },

    componentWillMount() {
        this.handleSearch = _.debounce(value => {
            let tester = new RegExp(value, 'gi');
            this.setState({
                fields: this.state.fields.map((field) => {
                    if (tester.test(field.title) === true) {
                        return Object.assign(field, {
                            foundInSearch: true
                        });
                    } else {
                        return Object.assign(field, {
                            foundInSearch: false
                        });
                    }
                })
            });

        }, 600);
    },

    componentWillUnmount() {

        DataTableStore.removeFiltersReset(this.props.appId, this._filterResetFromController);
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
        DataTableStore.removeAccountSelectionChangedHandler(this.props.appId, this._customAccountSelectionChanged);
        DataTableStore.removeTotalFilterChangedChangedHandler(this.props.appId, this._totalFilterUpdated);

        DataTableStore.removeAutoCompleteDefaultAllSelectOptions(this.props.appId, this._updateAutoCompleteFilerAllSelect);

    },

    _updateAutoCompleteFilerAllSelect(fieldName, filterObj) {
        this.filterQuery[fieldName] = filterObj;
    },

    _totalFilterUpdated: function(data){
        this.setState({filterCount: jnprDataTableObj.getCustomFilterCountFor(this.props.appId)});
    },

    _customAccountSelectionChanged: function(data){
        var selected = 0;
        var accountIds = [];
        data.forEach(function(item){
            selected+=item.selected?1:0;
            if(item.selected)
            accountIds.push( item.uuid );
        });
        this.setState({selectedAccountNum: selected});
        this.filterQuery['accountId'] = {
            comp: 'in',
            value1: accountIds
        };
    },

    clearFilterNoReset() {
        let updatedFields = this.state.fields.map(field => {
            if (field.type ==='autoCompleteSearch'){
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true,
                });
            }else if (field.type === 'text') {
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true,
                });
            } else if (field.type === 'html') {
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true,
                });
            } else if (field.type === 'customDate' || field.type === 'datepicker') {
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true,
                });
            }else if (field.type === 'groupedCheckBox') {
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true
                })
            } else if (field.type === 'multilist' || field.type === 'multiHtml' || field.type === 'single_select') {
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true
                })
            } else{
                return Object.assign(field, {
                    filtered: false,
                    foundInSearch: true
                })
            }
        });

        // reset the filterQuery
        this.filterQuery = {};
        this.setState({
            fields: updatedFields
        });
    },

    // clear all filters
    clearFilters() {
        // Clearing the value typed in search box
        if ("searchFiltersInput_" + this.props.appId in this.refs)
        this.refs["searchFiltersInput_" + this.props.appId].value = '';
        // new we need to dispatch filterRest using Flux
        // this event will be listened for checkbox
        // it is registered at componentDidMount of InputElement
        // Besides resetting checkbox, this event is also intercepted by the
        // DataTableMixins, to filter and empty filterObject {} to parent
        // handler
        DataTableAction.performFiltersReset(this.props.appId, null, null, true); //clearly indicate this is from reset click
    },

    searchFilters(ev) {
        let value = ev.target.value;
        this.handleSearch(value);
    },

    hideToggle() {
        let state = this.state;
        this.setState({
            isVisible: !state.isVisible,
            hideToggleText: !state.isVisible ? 'hide' : 'show'
        });
    },

    isDateObjValid: function(data){

        var valid = true;
        if (data.dataType === 'customDate') {
            if (data.comp === 'on' || data.comp === 'onorbefore' || data.comp === 'onorafter') {
                if (data.value[0].date == null || data.value[0].date == '')
                valid = false;
            } else {
                if (data.value[0].date == null || data.value[1].date == null || data.value[0].date == '' || data.value[1].date == '' )
                valid = false;
            }
        }

        return valid;
    },

    filterChanged(data) {

        let queryPart = null;
        let fields = this.state.fields;

        if(data.dataType ==='autoCompleteSearch'){
            //we need to de-duplicate and flattern data here
            //means if we have value to be value1,123 for first option and value2,123 for second option
            //then we just need to return value1,value2,123
            let values = [];
            data.value.map(e => e._value).forEach(value=>{
                let items = value.split(",");
                items.forEach(item=>{
                    if(values.indexOf(item)===-1){
                        values.push(item);
                    }
                });
            });

            queryPart = {
                comp: data.comp,
                value1: values
            };


        }else if (data.dataType === 'string') {
            queryPart = {
                comp: 'contains',
                value1: data.value
            };
            if (data.regExp !== undefined) {
                queryPart.regExp = data.regExp;
            }
        }else if(data.dataType === 'number'){
            if (data.comp === '=' || data.comp === '<=' || data.comp === '>=') {
                queryPart = {
                    comp: data.comp,
                    value1: data.value[0].data
                };
            } else {
                queryPart = {
                    comp: data.comp,
                    value1: data.value[0].data,
                    value2: data.value[1].data
                };
            }

        }else if (data.dataType === 'customDate' || data.dataType === 'datepicker') {
            if (data.comp === 'on' || data.comp === 'onorbefore' || data.comp === 'onorafter') {
                queryPart = {
                    comp: data.comp,
                    value1: data.value[0].date
                };
            } else {
                queryPart = {
                    comp: data.comp,
                    value1: data.value[0].date,
                    value2: data.value[1].date
                };
            }

        } else if (data.dataType === 'array') {
            queryPart = {
                comp: 'contains',
                value1: data.elements.map(e => e.id).join(',')
            };
        } else if (data.dataType === 'multilist' || data.dataType === 'multiHtml' || data.dataType === 'single_select' || data.dataType ==='checkbox') {
            queryPart = {
                comp: 'contains',
                value1: data.value
            }
        }

        if( data.dataType ==='autoCompleteSearch' ){
            this.setState({
                fields: fields.update(data.id, value => {
                    value.filtered = queryPart.value1.length>0;
                    value.value = queryPart.value1;
                    return value;
                })
            });

            if(queryPart.value1.length==0){
                delete (this.filterQuery[data.id])
            }else{
                this.filterQuery[data.id] = queryPart;
            }

        }else if ((data.dataType === 'string' && data.value === '') ||
        (data.dataType === 'array' && data.elements.length < 1)) {
            if (fields.has(data.id) === true) {
                this.setState({
                    fields: fields.update(data.id, value => {
                        value.filtered = false;
                        value.value = '';
                        return value;
                    }),
                    clearInputs: true,
                    foundInSearch: false,
                });
                this.filterQuery[data.id] = {};
            }
        } else if (data.dataType === 'string' && !!data.value) {
            this.setState({
                fields: fields.update(data.id, value => {
                    value.filtered = true;
                    value.value = '';
                    return value;
                })
            });
            this.filterQuery[data.id] = queryPart;
        } else if (data.dataType === 'number') {
            this.setState({
                fields: fields.update(data.id, value => {
                    value.filtered = true;
                    value.value = '';
                    return value;
                })
            });

            // fixing empty select issue here
            if ((queryPart.comp === '=' || queryPart.comp === '<=' || queryPart.comp === '>=') && queryPart.value1 == ''
            ||
            (queryPart.comp === '<>' && (queryPart.value1 == '' || queryPart.value2 == ''))
        ) {
            delete (this.filterQuery[data.id])
        } else {
            this.filterQuery[data.id] = queryPart;
        }

    }else if (data.dataType === 'customDate' || data.dataType === 'datepicker') {
        var filtered = true;
        if(data.dataType === 'customDate'){
            filtered=this.isDateObjValid(data);
        }
        this.setState({
            fields: fields.update(data.id, value => {
                value.filtered = filtered;
                value.value = '';
                return value;
            })
        });

        // fixing empty select issue here
        if ((queryPart.comp === 'on' || queryPart.comp === 'onorbefore' || queryPart.comp === 'onorafter') && queryPart.value1 == ''
        ||
        (queryPart.comp === 'between' && (queryPart.value1 == '' || queryPart.value2 == ''))
    ) {
        delete (this.filterQuery[data.id])
    } else {
        this.filterQuery[data.id] = queryPart;
    }

} else if (data.dataType === 'multilist' || data.dataType === 'multiHtml' || data.dataType === 'single_select' || data.dataType ==='checkbox') {

    setTimeout(function() {
        // giving a small timeout to allow the dataTableObjct fully
        // updated
        this.setState({
            fields: fields.update(data.id, value => {
                value.filtered = !!data.value && !jnprDataTableObj.isCustomFilterBaseFilter(this.props.appId, data.id);
                value.value = '';
                return value;
            }),
            clearInputs: true,
            foundInSearch: false
        });

    }.bind(this), 0);

    // fixing empty select issue here
    if (queryPart.value1 == '') {
        delete (this.filterQuery[data.id])
    } else {
        this.filterQuery[data.id] = queryPart;
    }

} else {
    this.filterQuery[data.id] = queryPart;
}

if (this.props.filterCallBack) {
    this.props.filterCallBack(this.filterQuery);
}
},



render() {
    let props = this.props;
    let wrapperClass = ClassNames({
        'rc-filter-wrapper': true
    });
    let showHideToggle = null;
    let leftPanelHeight = this.props.tableHeight - 30; // + 45;
    if ('tableHeight' in jnprDataTableObj.getConfigFor(this.props.appId)
    && jnprDataTableObj.getConfigFor(this.props.appId).tableHeight > 0
    && this.props.tableHeight + 45 < jnprDataTableObj.getConfigFor(this.props.appId).tableHeight) {
        leftPanelHeight = jnprDataTableObj.getConfigFor(this.props.appId).tableHeight - 30; // +
        // 45;
    }

    if (!this.props.hidingSelectItemsToggle && this.state.filterCount > 0) {
        showHideToggle = <span
            className='rc-hide-filter'
            onClick={ this.hideToggle }>{ this.state.hideToggleText }</span>
        }
        var addSearchWindow = null;
        { /* searchbox wrapper */ }
        if (!this.props.hidingSearchWindow) {
            addSearchWindow =
            <div className='rc-search-filters'>
                <input
                    type='text'
                    placeholder='Search Filters'
                    ref = {'searchFiltersInput_' + this.props.appId}
                    onChange={ this.searchFilters } />
                </div>
            }

            var noAccountReminder = null;
            if(this.state.selectedAccountNum==0)
            noAccountReminder=<div style={{padding: "5px"}}>No accounts are selected</div>;

            return (
                <section
                    className='rc-filter-view'
                    style={ { height: leftPanelHeight } }>
                    { /* control to clear all filters */ }
                    <div className='rc-filter-control-wrapper'>
                        {noAccountReminder}
                        <span className='rc-filter-stat' style={{ display: 'block' }}>{ this.state.filterCount } Filters are applied.</span>
                        <span
                            className='rc-clear-filters'
                            onClick={ this.clearFilters }>
                            clear all
                        </span>
                        {addSearchWindow}
                        {/*
                            * <div className='rc-search-filters'> <input type='text'
                            * placeholder='Search Filters' ref =
                            * {'searchFiltersInput_' + this.props.appId} onChange={
                            * this.searchFilters } /> </div>
                            */}
                            { /*
                                * control to display the currently selected filters and
                                * to hide the filter section
                                */ }
                                <div className='rc-filter-control'>

                                    { showHideToggle }
                                </div>
                            </div>
                            { /* filters start here */ }
                            <div className={ wrapperClass }>
                                { _.map(this.state.fields.toJS(), (column, index) => {
                                    let element = null;
                                    let isFoundInSearch = false;

                                    if(column.type==='number'){
                                        element = <NumberElement
                                            appId={ this.props.appId }
                                            key={ 'number-' + column.id }
                                            data={ { id: column.id, title: column.title, filter: column.filter } }
                                            inputChanged={ this.filterChanged }
                                        />;
                                    }else if (column.type === 'autoCompleteSearch') {
                                        element = <AutoCompleteSearchElement
                                            appId={ this.props.appId }
                                            key={ 'autoCompleteSearch' + column.id }
                                            data={ column }
                                            inputChanged={ this.filterChanged }
                                        />;
                                    }else if (column.type === 'customDate' || column.type === 'datepicker') {
                                        element = <DateElement
                                            appId={ this.props.appId }
                                            key={ 'date-element' + column.id }
                                            inputChanged={ this.filterChanged }
                                            data={ { id: column.id, title: column.title, filter: column.filter } }
                                        />;
                                    } else if (column.type === 'groupedCheckBox') {
                                        // passing appId to prevent the events being
                                        // listened by other
                                        // components in the different compomnet instane in
                                        // the same
                                        // page
                                        // used for filterReset purpose
                                        element = <CheckboxGroupElement
                                            appId={ this.props.appId }
                                            key={ 'groupedCheckBox' + column.id }
                                            inputChanged={ this.filterChanged }
                                            data={ { elements: column.items, id: column.id, title: column.title, filter: column.filter } }
                                        />;
                                    } else if (column.type === 'multilist' || column.type === 'multiHtml' || column.type=='single_select' || column.type=='checkbox') {
                                        element = <DropdownElement
                                            appId={ this.props.appId}
                                            type={column.type}
                                            key={ column.type +'_' + column.id }
                                            multiSelectMode={ true }
                                            inputChanged={ this.filterChanged}
                                            id={ column.id }
                                            willTriggerEvts={ true }
                                            title={ column.title }
                                            items={ column.items }
                                        />;
                                    } else {
                                        let value = this.state.fields.get(column.id).value;
                                        element = <InputElement
                                            appId={ this.props.appId }
                                            data={ Object.assign(column, {
                                                value
                                            }) }
                                            inputChanged={ this.filterChanged }
                                            key={ 'input-ele' + column.id } />;
                                        }

                                        let isFiltered = false;
                                        if (this.state.fields.has(column.id)) {
                                            let field = this.state.fields.get(column.id);
                                            isFiltered = field.filtered;
                                            isFoundInSearch = field.foundInSearch;
                                        }

                                        let filterClass = ClassNames({
                                            'rc-table-filtersection': true,
                                            'selected': isFiltered,
                                            'visible': this.state.isVisible ? true : !isFiltered,
                                            'not-searched': !isFoundInSearch
                                        });
                                        return (<div
                                            className={ filterClass }
                                            id= { 'rc-filter-section-' + column.id }
                                            key={ 'rc-filter-section-' + column.id }>
                                            { element }
                                        </div>);
                                    }) }
                                </div>
                            </section>
                        );
                    }
                });

                module.exports = FilterView;
