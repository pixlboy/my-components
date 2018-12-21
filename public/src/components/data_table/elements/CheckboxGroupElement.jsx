/*jshint esversion: 6*/
import React from 'react';
import InputElement from './InputElement';
import LabelElement from './LabelElement';
import _ from 'underscore';

let DataTableStore = require('../flux/stores/DataTableStore');
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

var CheckboxGroupElement = React.createClass({

    getInitialState() {
        /**
         * WE have to set up initial state -checked or not here, as user may have already choosen some options,
         * so when restoring it back, we need to set up first, otherwise, it will be invalid.
         * Also removed facebook Map, it doesn't do anything, using regular object is good enough
         */
        var elements = {};
        if (this.props.data.filter && this.props.data.filter.value1 && this.props.data.filter.value1.split(',').length > 0) {
            var filteredObjs = this.props.data.filter.value1.split(',');
            for (var i = 0; i < filteredObjs.length; i++) {
                elements[filteredObjs[i]] = {
                    id: filteredObjs[i],
                    dataType: 'string',
                    checked: true
                }
            }
        }

        return {
            elements: elements
        };
    },

    shouldComponentUpdate() {
        return false;
    },

    componentDidMount: function() {
        //adding customer configuration changing listener
        DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
    },

    // Unregister the filersReset events to prevent the memory leak
    componentWillUnmount: function() {
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
    },
    
    //Once custom config is changed, we have to update the checkbox state so that it will be saved and then when user update checkbox, this value will be passed also
    _customConfigChanged: function() {
        var elements = {};
        Object.keys(jnprDataTableObj.customConfiguration.filterModel).forEach(key => {
            if (key === this.props.data.id && jnprDataTableObj.customConfiguration.filterModel[key] && jnprDataTableObj.customConfiguration.filterModel[key].value1) {
                var selectedValues = jnprDataTableObj.customConfiguration.filterModel[key].value1.split(",");
                selectedValues.forEach(val => {
                    elements[val] = {
                        id: val,
                        dataType: 'string',
                        checked: true
                    }
                });
            }
        });
        this.setState({
            elements: elements
        });
    },

    onCheckboxChanged(data) {
        //saving into the object
        this.state.elements[data.id] = data;
        var resultElements = [];
        //loop each object, and add that into the resultedElements if it is checked
        Object.keys(this.state.elements).forEach(function(key) {
            if (this.state.elements[key].checked) {
                resultElements.push(this.state.elements[key]);
            }
        }.bind(this));

        this.props.inputChanged({
            id: this.props.data.id,
            dataType: 'array',
            elements: resultElements
        });
    },

    render() {
        let label = null;
        if (this.props.data.title) {
            label = <LabelElement {...this.props}/>;
        }
        return (
            <div className='rc-checkbox-grp'>
                { label }
                <div className='rc-checkbox-wrapper'>
                    { this.props.data.elements.map((item) => {
                        return (<InputElement
                            appId={this.props.appId}
                            key={ _.uniqueId('rc-checkbox_item_') }
                            inputChanged={ this.onCheckboxChanged }
                            data={ { columnKey: this.props.data.id, value: item, type: 'checkbox', id: item, title: item, filter: this.props.data.filter } } />);
                    }) }
                </div>
            </div>
        );
    }
});

module.exports = CheckboxGroupElement;
