/*jshint esversion: 6*/
let ReactDOM = require('react-dom');
import React from 'react';
import classNames from 'classnames';
import _ from 'underscore';
import { Checkbox } from 'react-mdl';
import ScrollBar from 'perfect-scrollbar';

var dataTableObject = require('../data_object/DataTableObjectFactory').getDataTableObject();
var dataTableActions = require('../flux/actions/DataTableActions');

let DataTableStore = require('../flux/stores/DataTableStore');

var MultiselectList = React.createClass({

    getInitialState() {
        // store the items in ordered map to preserve state
        this.dispatchSelectedAccountNum();
        return {
            data: this.processData(this.props.items, this.props.selectedItems),
            toggleListText: 'hide',
            hideSelectedItems: false,
            columnFreezable: this.props.columnFreezable
        };
    },

    dispatchSelectedAccountNum: function () {
        setTimeout(function () {
            if (this.props.tabType === 'accounts') {
                dataTableActions.performAccountSelectChanged(this.props.appId, this.state.data);
            }
        }.bind(this), 0);
    },


    processData: function (columns, selectedItems) {

        if (columns == null)
            columns = {};

        //first, we need to remove "addedCheckBox", as that is added for checkbox purpose only
        if (selectedItems.includes('addedCheckBox')) {
            selectedItems = selectedItems.splice(1);
        }
        if ('addedCheckBox' in columns) {
            delete (columns['addedCheckBox']);
        }

        let keys = Object.keys(columns);
        let transfColumns = keys.map((key, index) => {
            /**
             * First step is to restore the preselected rows. the logis is to loop all the selectedItems
             * compare with each record, based on the outputFormatKeys, if anyone existes, then it is selected
             * Here, the passed items is an array ,like this:
             *  ["0100172289:NET ONE SYSTEMS CO., LTD:b5e860e6-cf1b-11e5-a1bd-005056a9381b"]
             *  so we have to split it into subArray, then check if it includes the designed cell value
             */
            var items;
            var selected = false;
            //by default, we want all the accounts to be selected (visual effect only)
            if (this.props.tabType === 'accounts' && selectedItems.length == 0) {
                selected = true;
            } else
                selectedItems.map(function (item) {
                    items = item.split(this.props.outputFormatdelimiter);
                    this.props.outputFormatKeys.map(function (subKey) {
                        if (items.includes(columns[key][subKey])) {
                            selected = true;
                        }
                    }.bind(this));
                }.bind(this));

            return Object.assign({}, columns[key], {
                // items are not selected by default
                // test
                selected: selected,
                // items are visible by default
                visible: true,
                key: key
            });
        });

        return transfColumns;
    },

    // initialize perfect scrollbar :: react lifecycle
    componentDidMount() {
        // find this node on DOM and init the scrollbar
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0];
        ScrollBar.initialize(node);
        ScrollBar.update(node);
        //making multiSelectList sortable
        var self = this;
        //here since we are using this comp for both accounts and columns, they need to dispatch different event, so checking here
        if (window.jQuery != null && this.props.tabType === 'columns' && this.props.sortable)
            jQuery(this.refs.multiselectList).sortable({
                startPos: null,
                endPos: null,
                start: function (event, ui) {
                    this.startPos = ui.item.index();
                },
                stop: function (event, ui) {
                    this.endPos = ui.item.index();
                    //after drop stopped, we need to swap the position in the clumnList

                    //before, let's set appId in case it has been overwritten by other instance
                    dataTableObject.appId = self.props.appId;
                    //1. update the dataTableObject orderedList position
                    dataTableObject.swapKeyList(this.startPos, this.endPos);
                    //2. Now let's trigger the flux events.
                    dataTableActions.performColumsReordered(self.props.appId);
                }
            }).disableSelection();

        if (this.props.tabType === 'columns' && 'showingInitialHiddenWhenFiltering' in dataTableObject.config && dataTableObject.config.showingInitialHiddenWhenFiltering) {
            //needs to control show/hide columns
            DataTableStore.addFilterUpdateShowHiddenCallBackHandler(this.props.appId, this._updateColumnsCallBack);
        }
        if (this.props.tabType === 'columns')
            DataTableStore.addFiltersReset(this.props.appId, this._resetFiltersForColumns);

        DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);

    },

    _accountFilterReset: function () {
        //clearing the checkbox and also do not dispatch any events
        this.performSelectAll(false, false);
    },

    _resetFiltersForColumns: function () {
        var visibleColumnKeys = Object.keys(dataTableObject.availableVisibleColumns);
        var keys = [];
        let data = this.state.data.map((item) => {
            if ('sticky' in item && item.sticky === true) {
                keys.push(item.key);
            }
            else {
                if (!('initialHidden' in item)) {
                    keys.push(item.key);
                }
            }
        });
        setTimeout(function () {
            this.props.callBack(keys);
        }.bind(this), 0);
    },

    // destroy the scrollbar :: react lifecylce
    componentWillUnmount() {
        // find this node on DOM and destroy the scrollbar
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0];
        ScrollBar.destroy(node);
        //must destroy multiSelect sortable
        if (jQuery(this.refs.multiselectList).hasClass('ui-sortable')) {
            jQuery(this.refs.multiselectList).sortable("destroy");
        }

        DataTableStore.removeFilterUpdateShowHiddenCallBackHandler(this.props.appId, this._updateColumnsCallBack);
        DataTableStore.removeFiltersReset(this.props.appId, this._resetFiltersForColumns);
        //need to add this to listen the clear filter action from the button above the table
        DataTableStore.removeFiltersReset(this.props.appId, this._accountFilterReset);
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
    },

    bCustomConfigChanged: false,
    _customConfigChanged: function () {
        //flag used to control if we need to run _updateColumnsCallBack
        //if we do not set, when user reorder the column and save into config,
        //after reloading config, the new order is not restored, so we need to disable it
        this.bCustomConfigChanged = true;
        setTimeout(function () { this.bCustomConfigChanged = false }.bind(this), 1000);

        if (this.props.tabType === 'columns') {
            //must put a small reset to empty, otherwise, the order will be last reordered, not updated one
            this.setState({
                data: []
            });
            setTimeout(function () {
                this.setState({
                    data: this.processData(dataTableObject.availableVisibleColumns, Object.keys(dataTableObject.selectedColumns))
                });
                this.dispatchSelectedAccountNum();
            }.bind(this), 50)
        }
        if (this.props.tabType === 'accounts') {
            this.setState({
                data: []
            });
            setTimeout(function () {
                this.setState({
                    data: this.processData(dataTableObject.accountList, dataTableObject.allCustomConfigurations[this.props.appId].defaultSelectedAccountList || null)
                });
                this.dispatchSelectedAccountNum();
            }.bind(this), 50);
        }
    },
    //once we update filters, we have to control if we need to show all columns or partial columns
    _updateColumnsCallBack: function () {
        setTimeout(function () {
            if (!this.bCustomConfigChanged) {
                dataTableObject.appId = this.props.appId;
                this.setState({
                    data: this.processData(dataTableObject.availableVisibleColumns, dataTableObject.customConfiguration.selectedColumnKeys)
                });
                this.dispatchSelectedAccountNum();
            }
        }.bind(this), 100);
    },

    // react lifecycle
    componentWillMount() {
        // using debounce to give some time for the search to kick in
        this.handleSearch = _.debounce(value => {
            // create regex tester to test for the search term
            // change the visibility to false for items failing the tester
            var results = [];
            let data = this.state.data.map(item => {
                var visible = false;
                this.props.searchOn.forEach(key => {
                    if (item[key] && item[key].toLowerCase().includes(value.toLowerCase())) {
                        visible = true;
                    }
                });
                return Object.assign(item, {
                    visible: visible
                });
            });
            // update the state
            this.setState({
                data
            });
            this.dispatchSelectedAccountNum();
            // update the scrollbar
            ScrollBar.update(ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0]);
        }, 500);
    },
    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0];
        ScrollBar.update(node)
    },


    // searches the list
    searchList(ev) {
        let value = ev.target.value;
        // delegate to handlesearch
        this.handleSearch(value);
    },

    // selects all items in the list
    selectAll(ev) {
        //we need to dispatch, so passing true
        this.performSelectAll(ev.target.checked, true);
    },
    /**
     * All SelectAll login is here
     * Params:
     * checked: true|false, wither to check or uncheck checkbox
     * dispatch: true|false, whether dispatching event or just checking checkbox status
     */
    performSelectAll: function (checked, dispatch) {
        let data = {};
        // select all items
        if (checked) {
            data = this.state.data.map(item => {
                return Object.assign({}, item, {
                    selected: true
                });
            });
        } else {
            // deselect all items
            data = this.state.data.map(item => {
                //If this is configured as sticky, we then always make it selected
                var s = false;
                if ("sticky" in item && item.sticky === true) {
                    s = true;
                }
                return Object.assign({}, item, {
                    selected: s
                });
            });
        }
        // update the state
        this.setState({
            data
        });
        // update scrollbar
        ScrollBar.update(ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0]);
        this.dispatchSelectedAccountNum();

        if (dispatch) {
            if (this.props.tabType == 'accounts') {
                var results = [];
                this.state.data.map(o => {
                    if (checked)
                        results.push(this.props.outputFormatKeys.map(j => o[j]).join(this.props.outputFormatdelimiter));
                });
                this.props.callBack(results);
            } else {
                this.props.callBack(data.filter(o => o.selected).map(k => k.key));
            }
        }
    },

    // handle item selection(toggle) on the list
    itemSelected(key, synthEvent, r) {
        if (synthEvent.target.classList.contains('mdl-checkbox')) return; //this is checkbox click

        let data = this.state.data.map((item) => {
            if (item.key === key) {
                if ('sticky' in item && item.sticky === true)
                    return item;
                else
                    return Object.assign(item, {
                        selected: !item.selected
                    });
            } else {
                return item;
            }
        });
        // update the state
        this.setState({
            data: data
        });
        this.dispatchSelectedAccountNum();

        // notify the parent component
        let result = this.state.data.filter(i => i.selected).map(o => {
            return this.props.outputFormatKeys.map(j => o[j]).join(this.props.outputFormatdelimiter);
        });

        this.props.callBack(result);
    },

    // shows/hides selected items on the list
    toggleList() {
        let state = this.state;
        this.setState({
            hideSelectedItems: !state.hideSelectedItems,
            toggleListText: state.hideSelectedItems ? 'hide' : 'show'
        });
        // update scrollbar
        ScrollBar.update(ReactDOM.findDOMNode(this).querySelectorAll('.multiselect-list-control-content')[0]);
    },

    toggleFreezeMe(item) {
        if ('toggleFreezeMe' in this.props)
            this.props.toggleFreezeMe(item)
    },

    // react lifecycle
    render() {
        let state = this.state;
        let data = state.data;
        let selectedCount = data.filter(i => i.selected).length;
        let selectAllUncheck = selectedCount < data.length;
        let selectItemsToggleEle = null;

        //compare the passed tableHeight, it is variable based on the initial record number
        let leftPanelHeight = this.props.tableHeight - 30;// + 45;
        if ('tableHeight' in dataTableObject.getConfigFor(this.props.appId)
            && dataTableObject.getConfigFor(this.props.appId).tableHeight > 0
            && this.props.tableHeight + 45 < dataTableObject.getConfigFor(this.props.appId).tableHeight) {
            leftPanelHeight = dataTableObject.getConfigFor(this.props.appId).tableHeight - 30;// + 45;
        }

        if (!this.props.hidingSelectItemsToggle && selectedCount > 0) {
            selectItemsToggleEle = <span
                onClick={this.toggleList}
                className='multiselect-list-toggle'>{this.state.toggleListText}</span>;
        }
        var addSearchWindow = null;
        { /* searchbox wrapper */ }
        if (!this.props.hidingSearchWindow) {
            addSearchWindow =
                <div className='multiselect-searchbox-wrapper'>
                    <input
                        type='text'
                        placeholder={'search ' + this.props.tabType}
                        className='multiselect-searchbox'
                        onChange={this.searchList} />
                </div>;
        }
        return (
            /* main wrapper */
            <section
                className='multiselect-list-wrapper'
                style={{ height: leftPanelHeight }}>
                <div className='multiselect-list-control'>
                    { /* select all control wrapper*/}
                    <div className='multiselect-selectall-wrapper'>
                        <span title="Fix the columns by Checking below boxes"
                            className={classNames({
                                "lockColumnIcon": this.state.columnFreezable,
                                "nonlockColumnIcon": !this.state.columnFreezable
                            })} />
                        <Checkbox
                            className='multiselect-selectall-btn'
                            label={'Select All'}
                            checked={!selectAllUncheck}
                            onChange={this.selectAll}
                            id={this.props.appId + this.props.keyID + 'multiselect-all'} />
                        <span className='multiselect-list-count'>{data.filter(item => item.selected).length} selected</span>

                    </div>
                    {addSearchWindow}
                    { /* list stats */}
                    <div className='multiselect-list-stat'>
                        {selectItemsToggleEle}
                    </div>
                </div>


                <div className={'multiselect-list-control-content '}
                    style={{ height: this.props.hidingSearchWindow ? leftPanelHeight - 45 : leftPanelHeight - 120 }}>
                    <ul
                        ref="multiselectList"
                        className={classNames({
                            'multiselect-list': true,
                            'visible': state.showList
                        })}>
                        {data.map(item => {
                            let listItemClass = classNames({
                                'visible': item.visible,
                                'multiselect-list-item': true,
                                'selected': item.selected
                            });
                            if ((this.state.hideSelectedItems && !item.selected) ||
                                (!this.state.hideSelectedItems)) {
                                return <li
                                    className={listItemClass}
                                    key={'multiselect-list-item-' + item.key}
                                    onClick={this.itemSelected.bind(null, item.key)}>
                                    <span className={classNames({ spanFreezeColumn: this.state.columnFreezable, spanNoneFreezeColumn: !this.state.columnFreezable, hiddenFreezeCol: !('freezable' in item && item['freezable'] === true) })}>

                                        <Checkbox
                                            checked={dataTableObject.isColumnFrozen(this.props.appId, item.id)}
                                            onChange={this.toggleFreezeMe.bind(null, item)}
                                            id={"checkbox_" + item.key} />

                                    </span>
                                    <span className={classNames({ 'selectIndicator': true, 'selected': item.selected, 'nonFreezableCol': !this.state.columnFreezable })}></span>
                                    <span
                                        className='multiselect-list-item-txt'
                                        key={'multiselect-list-item-txt' + item.key}
                                        title={this.props.listitemDisplayFormat.map(i => item[i]).join(' - ')}>{this.props.listitemDisplayFormat.map(i => item[i]).join(' - ')}</span>
                                </li>
                            }
                        })}
                    </ul>
                </div>
            </section>
        );
    }
});

module.exports = MultiselectList;
