// jshint esversion: 6

// imports
import React from 'react';
import LabelElement from './LabelElement';
import InputElement from './InputElement';
import DropdownElement from './DropdownElement';
import _ from 'underscore';

let DataTableStore = require( '../flux/stores/DataTableStore' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let SingleDateElement = require( './SingleDateElement' );

//var jQuery = require('jquery');
//require('jquery-ui/ui/core');

var DateElement = React.createClass( {

    // initial state
    getInitialState() {
        return {
            filter: this.props.data.filter || {},
            defaultRange: 'on'
        };
    },

    handleDateRange( ev ) {
        var val = ev.target.value;
        this.setState( {
            defaultRange: val
        });
    },

    componentWillMount() {
        let cfg = jnprDataTableObj.customConfiguration;
        if ( cfg && cfg.hasOwnProperty( 'filterModel' ) && cfg.filterModel.hasOwnProperty( this.props.data.id ) ) {
            this.setState( {
                defaultRange: cfg.filterModel[this.props.data.id].comp
            })
        }
    },


    componentDidMount() {
        DataTableStore.addFiltersReset( this.props.appId, this._filtersResetHandler );
        DataTableStore.addCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
    },

    dt1: null,
    dt2: null,

    dateChangedUpdated: function( dt1, dt2, resetting ) {
        let type = this.state.defaultRange;
        this.dt1 = dt1;
        this.dt2 = dt2;
        this._handleDateUpdate( type, resetting );
    },
    
    //adding second parameter, resetting, if this comp is from resetting (delete date), we need to restore
    //for regular date change, there is no resetting, so we only call api if it is valid
    _handleDateUpdate: function( type, resetting ) {
        let filter = {};
        filter.comp = type;
        var bValid = false;
        if ( type === 'on' || type === 'onorbefore' || type === 'onorafter' ) {
            filter.value1 = this.dt1;
            if ( this.dt1 != null && this.dt1 != "" )
                bValid = true;
        } else if ( type === 'between' ) {
            filter.value1 = this.dt1;
            filter.value2 = this.dt2;
            if ( this.dt1 != null && this.dt1 != "" && this.dt2 != null && this.dt2 != "" )
                bValid = true;
        }
        this.setState( {
            filter: filter
        });
        if ( bValid || resetting ) {
            // pass it back to the parent
            this.props.inputChanged( {
                id: this.props.data.id,
                dataType: 'customDate',
                comp: type,
                value: [
                    {
                        id: 'startDate',
                        date: this.dt1
                    },
                    {
                        id: 'endDate',
                        date: this.dt2
                    }
                ]
            });
        }

    },

    _customConfigChanged: function() {
        //inside dateElement
        let model = jnprDataTableObj.customConfiguration.filterModel[this.props.data.id];
        if ( model ) {
            this.setState( {
                defaultRange: model.comp,
                filter: model
            });
        } else {
            this.setState( {
                defaultRange: 'on',
                filter: null
            });
        }
    },

    _filtersResetHandler() {
        this.dt1 = null;
        this.dt2 = null;
        this.setState( {
            filter: null,
            defaultRange: 'on'
        });
    },

    // react lifecycle
    componentWillUnmount() {
        DataTableStore.removeCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
    },

    dateDropDownChanged( data ) {
        this.setState( {
            defaultRange: data.value
        });
        this._handleDateUpdate( data.value );
    },

    render() {
        let label = null;
        let props = this.props.data;
        let datePicker = null;
        // // add label, if the title attribute is passed over
        if ( props.title ) {
            label = <LabelElement {...this.props}/>;
        }

        let dateDropDownItems = [{
            id: 'on',
            title: 'On',
            value: 'on'
        }, {
                id: 'onorafter',
                title: 'On Or After',
                value: 'onorafter'
            }, {
                id: 'onorbefore',
                title: 'On or Before',
                value: 'onorbefore'
            }, {
                id: 'between',
                title: 'Between',
                value: 'between'
            }];

        dateDropDownItems = dateDropDownItems.map( p => {
            if ( p.id === this.state.defaultRange ) {
                p.selected = true;
            }
            return p;
        });

        datePicker = <div className='rc-custom-datepicker-wrapper'>
            <DropdownElement
                appId= {this.props.appId}
                id={this.props.data.id}
                multiSelectMode={ false }
                willTriggerEvts={ true }
                title={ '' }
                inputChanged= {this.dateDropDownChanged}
                items={ dateDropDownItems } />
            <div className='datepicker-multi-main'>
                <SingleDateElement range={this.state.defaultRange} id={this.props.data.id} appId={this.props.appId} filter={this.state.filter} dateUpdate={this.dateChangedUpdated} />
            </div>
        </div>;

        return (
            <div
                className='rc-custom-datepicker'
                id={ 'rc-custom-datepicker' + props.id }>
                { label }
                { datePicker }
            </div>
        );
    }

});

module.exports = DateElement;
