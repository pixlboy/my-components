let React = require( 'react' );
let DataTableStore = require( '../flux/stores/DataTableStore' );
let DataTableAction = require( '../flux/actions/DataTableActions' );
let ActionTypes = require( '../flux/actions/ActionTypes' );
let classNames = require( 'classnames' );
import { Checkbox } from 'react-mdl';
require( '../style/header-cell.scss' );
import _ from 'underscore';

let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();

let HeaderDatesPicker = require( './HeaderDatesPicker' );

var HeaderCell = React.createClass( {
    getInitialState: function() {

        return {
            up: this.getUpState(),
            filterShow: this.props.columnFilterable,
            comp: "",
            value1: this.getFilterValues().value1,
            value2: this.getFilterValues().value2,
            showToolTip: false,
            showParentToolTip: false,
            headerCheckBoxChecked: false
        }
    },


    getUpState: function() {
        //first step is to restore pre-saved status, true, false or null
        var up = null;
        //pass appId as it may be overwritten by other instance
        var customConfig = jnprDataTableObj.getCustomConfigurationFor( this.props.appId );

        if ( customConfig.sortModel && Object.keys( customConfig.sortModel ).length > 0 ) {
            if ( customConfig.sortModel.field === this.props.column.id ) {
                up = customConfig.sortModel.up;
            }
        } else {
            //if there is no sortModel, we then use default sort field here
            var config = jnprDataTableObj.getConfigFor( this.props.appId );
            if ( 'defaultSortField' in config && config.defaultSortField === this.props.column.id ) {
                up = ( 'defaultSortOrder' in config && config.defaultSortOrder === 'asc' ) ? true : false;
            }
        }
        return up;
    },

    getFilterValues: function() {

        var filterValue1 = "";
        var filterValue2 = "";
        var customConfig = jnprDataTableObj.getCustomConfigurationFor( this.props.appId );
        if ( 'filterModel' in customConfig && Object.keys( customConfig.filterModel ).length > 0 ) {
            Object.keys( customConfig.filterModel ).forEach( function( key ) {
                if ( key === this.props.column.id ) {
                    filterValue1 = customConfig.filterModel[key].value1;
                    if ( 'value2' in customConfig.filterModel[key] )
                        filterValue2 = customConfig.filterModel[key].value2;
                }
            }.bind( this ) );
        }
        return {
            value1: filterValue1,
            value2: filterValue2
        }
    },


    componentDidMount: function() {
        DataTableStore.addFiltersReset( this.props.appId, this._resetFilter );
        //this is the listener for other column to be sorted, when that column is sorted, thsi column should be resetted.
        //as we have only one column to be sortable
        DataTableStore.addColumnHeaderSorterReset( this.props.appId, this._resetHeaderSorter );
        DataTableStore.addCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
        DataTableStore.addColumnReordered( this.props.appId, this._columnReordered );
        DataTableStore.addCheckRowsUpdated(this.props.appId, this._changedSelectedRows);
    },

    componentWillUnmount: function() {
        DataTableStore.removeFiltersReset( this.props.appId, this._resetFilter );
        DataTableStore.removeColumnHeaderSorterReset( this.props.appId, this._resetHeaderSorter );
        DataTableStore.removeCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
        DataTableStore.removeColumnReordered( this.props.appId, this._columnReordered );
        DataTableStore.removeCheckRowsUpdated(this.props.appId, this._changedSelectedRows);
    },

    _columnReordered: function() {

        setTimeout( function() {
            var values = this.getFilterValues();
            this.setState( {
                up: this.getUpState(),
                value1: values.value1,
                value2: values.value2
            });
        }.bind( this ), 100 );
    },

    //once we load new custom configuration, we need to update the sort icon
    _customConfigChanged: function() {
        if ( jnprDataTableObj.customConfiguration.sortModel && Object.keys( jnprDataTableObj.customConfiguration.sortModel ).length > 0 ) {
            if ( this.props.columnName === jnprDataTableObj.customConfiguration.sortModel.field ){
                this.setState( {
                    up: jnprDataTableObj.customConfiguration.sortModel.up
                });
            }
        }
    },

    _resetHeaderSorter: function() {
        //for resetting filter, we must use default sort instead
        var config = jnprDataTableObj.getConfigFor( this.props.appId );
        var up = null;
        if ( 'defaultSortField' in config && 'defaultSortOrder' in config && config.defaultSortField === this.props.columnName ) {
            up = config.defaultSortOrder === 'asc';
        }

        this.setState( {
            up: null //once resetted, this one needs to change to null==> nutual
        });
    },

    _resetFilter: function() {
        //for resetting filter, we must use default sort instead
            var config = jnprDataTableObj.getConfigFor( this.props.appId );
            var up = null;
            if ( 'defaultSortField' in config && 'defaultSortOrder' in config && config.defaultSortField === this.props.columnName ) {
                    up = config.defaultSortOrder === 'asc';
                    setTimeout(function(){
                        this.setState( {
                            comp: "",
                            value1: "",
                            value2: "",
                            up: up
                        });
                    }.bind(this), 100);
            }else{
                 this.setState( {
                    comp: "",
                    value1: "",
                    value2: "",
                    up: up
                });
            }
    },

    _showFilter: function() {
        this.setState( {
            filterShow: !this.state.filterShow
        });
    },

    _getGlobal: function() {

        if ( this.props.showGlobalCheckbox ) {
            return this.refs.headerChkGlobal.checked ? true : false;
        } else {
            return this.props.defaultGlobal;
        }
    },

    _sortData: function() {
        //first step is to reset sorterIcon header for any other columns, if any other columns has been sorted, they need to change status to nutual
        DataTableAction.performColumsHeaderSortReset( this.props.appId );
        //just go true/false, no need to go nutual
        var status = this.state.up === null ? false : ( this.state.up === true ? false : true );

        this.setState( { up: status });
        DataTableAction.performColumnSorter( this.props.appId, this.props.columnName, status, this._getGlobal() );
    },

    value1SelectChanged: function() {

        this.setState( {
            value1: this.refs.value1.value
        });
        this._filter();
    },

    componentWillMount: function() {
        this._filter = _.debounce(() => {
            var obj = {};
            if ( this.props.column.type === 'customDate' ) {
                obj[this.props.columnName] = {
                    comp: this.state.comp,
                    value1: this.state.value1,
                    value2: this.state.value2
                }
            }
            if ( this.props.column.type === 'text' ) {
                obj[this.props.columnName] = {
                    comp: "contains",
                    value1: this.refs.value1.value
                }
            }
            if ( this.props.column.type === 'html' ) {
                obj[this.props.columnName] = {
                    comp: "contains",
                    value1: this.refs.value1.value
                }
            }
            if ( this.props.column.type === 'groupedCheckBox' || this.props.column.type === 'multilist' || this.props.column.type === 'multiHtml' ) {
                obj[this.props.columnName] = {
                    comp: "equals",
                    value1: this.refs.value1.value
                }
            }
            DataTableAction.performColumnFilter( this.props.appId, obj, this._getGlobal() );
        }, 800 );
    },

    dateUpdate: function( comp, dt1, dt2 ) {
        this.setState( {
            comp: comp,
            value1: dt1,
            value2: dt2
        });
        this._filter();
    },

    compChangedHandler: function() {
        this.setState( {
            comp: this.refs.comp.value
        });
        this._filter();
    },
    mouseEnterHandler: function() {
        this.setState( { showToolTip: true });
    },

    mouseLeaveHandler: function() {
        this.setState( { showToolTip: false });
    },
    mouseParentEnterHandler: function() {
        this.setState( { showParentToolTip: true });
    },

    mouseParentLeaveHandler: function() {
        this.setState( { showParentToolTip: false });
    },

    _checkAll: function(e) {
        DataTableAction.performCheckAllRows( this.props.appId,e.target.checked );
        this.setState( { headerCheckBoxChecked: e.target.checked });
    },

    _changedSelectedRows: function(e) {
        var selectedRowsCount = jnprDataTableObj.getCheckedRowsCountFor(this.props.appId);
        var totalDataList= jnprDataTableObj.getProcessedDataListFor(this.props.appId);

        this.setState( { headerCheckBoxChecked: totalDataList.length === selectedRowsCount });
    },

    render: function() {
        if ( this.props.column.type === 'addedCheckBox' ) {
            return (
                <div className="headercell-wrapper" >
                    <div className='headercell-title' >
                    <Checkbox
                           checked={this.state.headerCheckBoxChecked}
                           ref='checkAll'
                           onChange={this._checkAll}
                           id={ this.props.appId + '-rowselect-all' }    />
                    </div>
                </div>
            )
        } else {

            var sortable = null;
            var globalChecker = null;
            var filterable = null;
            var columnFilterController = null;
            var columnFilter = null;
            var parentLineItemValueComp = null;
            var toolTipComp = null;
            var toolTipParentComp = null;

            if ( this.state.showToolTip ) {
                toolTipComp = <div ref='tooltiptext' className='tooltiptext'>{this.props.column.title}</div>
            } else if ( this.state.showParentToolTip ) {
                toolTipParentComp = <div ref='tooltiptext' className='tooltiptext'>{this.props.column.title + ": " + this.props.parentLineItem[this.props.columnName]}</div>
            }

            if ( this.props.parentLineItem && this.props.columnName == this.props.parentHasArrowBtn ) {
                parentLineItemValueComp = <div className="header_parent_item" ref='tooltip' onMouseEnter={this.mouseParentEnterHandler} onMouseLeave={this.mouseParentLeaveHandler}>
                    <span className="header_parent_arrow"></span>
                    <span className="header_parent_ellipsis arrow_cell tooltip" title={this.props.column.title + ": " + this.props.parentLineItem[this.props.columnName]} >
                        {this.props.parentLineItem[this.props.columnName]}
                    </span>
                    {/*toolTipParentComp*/}
                </div>
            } else if ( this.props.parentLineItem ) {
                parentLineItemValueComp = <div className="header_parent_item" ref='tooltip' onMouseEnter={this.mouseParentEnterHandler} onMouseLeave={this.mouseParentLeaveHandler}>
                    <span className="header_parent_ellipsis tooltip"  title={this.props.column.title + ": " + this.props.parentLineItem[this.props.columnName]}>
                        {this.props.parentLineItem[this.props.columnName]}
                    </span>
                    {/*toolTipParentComp*/}
                </div>
            }

            if ( this.props.column.sortable ) {
                sortable = <span onClick={this._sortData}
                    className={
                        classNames( {
                            'sortIndicator': true,
                            'up': this.state.up === true,
                            'down': this.state.up === false,
                            'nutual': this.state.up === null
                        }) }
                    ref='headerSorter'></span>
            }

            if ( this.props.column.sortable || this.props.column.filterable ) {
                globalChecker = <span className={this.props.showGlobalCheckbox ? "" : "noneDisplay"}>[<input type='checkbox' ref='headerChkGlobal'/>]</span>;
            }

            if ( this.props.columnFilterable && this.props.column.filterable ) {
                // no need to show the filterController, always shows it, no need to hide it anymore.
                // columnFilterController = <span className='columnFilterIndicator' onClick={this._showFilter}>[=]</span>;
                if ( this.props.column.items )
                    columnFilter = <select ref="value1" value={this.state.value1} onChange={this.value1SelectChanged}>
                        <option value=""></option>
                        {
                            this.props.column.items.map( function( value, i ) {
                                return <option key={i} value={value.value}>{value.value}</option>
                            })
                        }
                    </select>
                else {
                    if ( this.props.column.type === "customDate" )
                        columnFilter = <HeaderDatesPicker appId={this.props.appId} id={this.props.columnName} column={this.props.column} dateUpdate={this.dateUpdate} comp={this.state.comp} value1={this.state.value1} value2={this.state.value2} />
                    if ( this.props.column.type === "text" )
                        columnFilter = <input type='text' ref="value1" className={"columnHeader_" + this.props.columnName} value={this.state.value1} onChange={this.value1SelectChanged}/>
                }
                if ( this.props.column.type === "html" ) {
                    columnFilter = <input type='text' ref="value1" className={"columnHeader_" + this.props.columnName}   value={this.state.value1} onChange={this.value1SelectChanged}/>
                }
            }
            return (
                <div className="headercell-wrapper" >
                    <div className='headercell-title' ref='tooltip' onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                        <span className='header_ellipsis tooltip' >
                            {this.props.column.title}
                        </span>
                        {sortable}
                    </div>
                    {globalChecker}
                    {columnFilterController}
                    <div className={this.state.filterShow ? 'headercell-filter' : 'noneDisplay'}  >
                        {columnFilter}
                    </div>
                    {parentLineItemValueComp}
                </div>
            );

        }


    }
});

module.exports = HeaderCell;
