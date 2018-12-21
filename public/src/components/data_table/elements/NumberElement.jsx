import React from 'react';
import DropdownElement from './DropdownElement';
import LabelElement from './LabelElement';
let SingleNumberElement = require( './SingleNumberElement' );

let DataTableStore = require( '../flux/stores/DataTableStore' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();

var NumberElement = React.createClass( {

    // initial state
    getInitialState() {
        return {
            filter: this.props.data.filter || {},
            defaultRange: '='
        };
    },

    num1: null,
    num2: null,

    //adding second parameter, resetting, if this comp is from resetting (delete date), we need to restore
    //for regular date change, there is no resetting, so we only call api if it is valid
    _handleDataUpdate: function( type, resetting ) {
        let filter = {};
        filter.comp = type;
        var bValid = false;
        if ( type === '=' || type === '<=' || type === '>=' ) {
            filter.value1 = this.num1;
            if ( this.num1 != null && this.num1 != "" )
            bValid = true;
        } else if ( type === '<>' ) {
            filter.value1 = this.num1;
            filter.value2 = this.num2;
            if ( this.num1 != null && this.num1 != "" && this.num2 != null && this.num2 != "" )
            bValid = true;
        }
        this.setState( {
            filter: filter
        });
        if ( bValid || resetting ) {
            // pass it back to the parent
            this.props.inputChanged( {
                id: this.props.data.id,
                dataType: 'number',
                comp: type,
                value: [
                    {
                        id: 'startNumber',
                        data: this.num1
                    },
                    {
                        id: 'endNumber',
                        data: this.num2
                    }
                ]
            });
        }
    },

    componentDidMount() {
        DataTableStore.addFiltersReset( this.props.appId, this._filtersResetHandler );
        DataTableStore.addCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
    },

    _filtersResetHandler(){
        this.num1 = null;
        this.num2 = null;
        this.setState({
            filter: null,
            defaultRange: '='
        });
    },
    _customConfigChanged(){
        //inside dateElement
        let model = jnprDataTableObj.customConfiguration.filterModel[this.props.data.id];
        if ( model ) {
            this.setState( {
                defaultRange: model.comp,
                filter: model
            });
        } else {
            this.setState( {
                defaultRange: '=',
                filter: null
            });
        }
    },
    dataChangedUpdated(data1, data2, resetting){
        let type = this.state.defaultRange;
        this.num1 = data1;
        this.num2 = data2;
        this._handleDataUpdate( type, resetting );
    },

    valueDropDownChanged(data){
        this.setState( {
            defaultRange: data.value
        });
        this._handleDataUpdate( data.value );
    },

    render() {

        let label = null;
        let props = this.props.data;
        let datePicker = null;
        // // add label, if the title attribute is passed over
        if ( props.title ) {
            label = <LabelElement {...this.props}/>;
        }

        let numberDropDownItems = [
            {
                id: '=',
                title: 'Equal To',
                value: '='
            }, {
                id: '<=',
                title: 'Less Than or Equal To',
                value: '<='
            }, {
                id: '>=',
                title: 'Greater Than or Equal To',
                value: '>='
            }, {
                id: '<>',
                title: 'Between',
                value: '<>'
            }
        ];

        numberDropDownItems = numberDropDownItems.map( p => {
            if ( p.id === this.state.defaultRange ) {
                p.selected = true;
            }
            return p;
        });

        let valuePicker = <div className='rc-custom-datepicker-wrapper'>
            <DropdownElement
                appId= {this.props.appId}
                id={this.props.data.id}
                multiSelectMode={ false }
                willTriggerEvts={ true }
                title={ '' }
                inputChanged= {this.valueDropDownChanged}
                items={ numberDropDownItems }
            />
            <div className='datepicker-multi-main'>
                <SingleNumberElement range={this.state.defaultRange} id={this.props.data.id} appId={this.props.appId} filter={this.state.filter} dataUpdate={this.dataChangedUpdated} />
            </div>
        </div>;

        return (
            <div className='rc-custom-datepicker'
                id={ 'rc-custom-datepicker' + props.id }
                >
                    { label }
                    {valuePicker}</div>
            )

        }

    });
    module.exports = NumberElement;
