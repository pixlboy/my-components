let React = require('react');
//var jQuery = require('jquery');
//require('jquery-ui/ui/core');
//require('jquery-ui/ui/datepicker');
let ClassNames = require('classnames');

let DataTableStore = require('../flux/stores/DataTableStore');
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();

var HeaderDatesPickerElement = React.createClass({

    getInitialState() {
        return {
            comp: this.props.comp,
            value1: this.props.value1?this.props.value1:"",
            value2: this.props.value2?this.props.value2:""
        };
    },


    getFilterValues: function() {

        var filterValue1 = "";
        var filterValue2 = "";
        var comp ='on';
        var customConfig = jnprDataTableObj.getCustomConfigurationFor( this.props.appId );
        if ( 'filterModel' in customConfig && Object.keys( customConfig.filterModel ).length > 0 ) {
            Object.keys( customConfig.filterModel ).forEach( function( key ) {
                if ( key === this.props.column.id ) {
                    comp = customConfig.filterModel[key].comp;
                    filterValue1 = customConfig.filterModel[key].value1;
                    if ( 'value2' in customConfig.filterModel[key] )
                        filterValue2 = customConfig.filterModel[key].value2;
                }
            }.bind( this ) );
        }
        return {
            comp: comp,
            value1: filterValue1,
            value2: filterValue2
        }
    },

    
    dateChanged: function() {
        var dt1 = jQuery(this.refs.datePicker1).datepicker({
            dateFormat: 'yy-mm-dd'
        }).val();

        var dt2 = jQuery(this.refs.datePicker2).datepicker({
            dateFormat: 'yy-mm-dd'
        }).val();

        if (this.refs.dateSel.value === 'between') {
            if (dt1 && dt2) {
                this.props.dateUpdate(this.refs.dateSel.value, dt1, dt2);
            }
        } else {
            if (dt1) {
                this.props.dateUpdate(this.refs.dateSel.value, dt1);
            }
        }

        this.setState({
            value1: dt1 ? dt1 : "",
            value2: dt2 ? dt2 : ""
        })
       
    },

    componentDidMount: function() {

        jQuery(this.refs.datePicker1).datepicker({
            dateFormat: "yy-mm-dd",
            onClose: function() {
                this.blur();
            },
            onSelect: this.dateChanged
        }
        );

        jQuery(this.refs.datePicker2).datepicker({
            dateFormat: "yy-mm-dd",
            onClose: function() {
                this.blur();
            },
            onSelect: this.dateChanged
        });
        DataTableStore.addFiltersReset(this.props.appId, this._filtersResetHandler);
        DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
        
          var values = this.getFilterValues();
          this.setState( {
              comp: values.comp,
              value1: values.value1,
              value2: values.value2
          });
    },

    
    _filtersResetHandler: function() {
        this.setState({
            comp: 'on',
            value1: "",
            value2: ""
        })
    },

    _customConfigChanged: function() {
        let model = jnprDataTableObj.customConfiguration.filterModel[this.props.id];
        if (model) {
            this.setState({
                comp: model.comp ? model.comp : 'on',
                value1: model.value1 ? model.value1 : "",
                value2: model.value2 ? model.value2 : ""
            })
        } else {
            this.setState({
                comp: 'on',
                value1: "",
                value2: ""
            })
        }
    },

    componentWillUnmount: function() { 
        jQuery(this.refs.datePicker1).datepicker("destroy");
        jQuery(this.refs.datePicker2).datepicker("destroy");
        DataTableStore.removeFiltersReset(this.props.appId, this._filtersResetHandler);
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
        
    },

    changeDateSel: function() {

        this.setState({
            comp: this.refs.dateSel.value
        });

        this.dateChanged();

    },

    render: function() {

        return <span className='headerDatesPicker'>
            <select ref='dateSel' value={this.state.comp} onChange={this.changeDateSel}>
                <option value='on'>On</option>
                <option value='onorbefore'>On or Before</option>
                <option value='onorafter'>On or After</option>
                <option value='between'>Between</option>
            </select>
            <input type="text" ref='datePicker1' value={ this.state.value1 }  onChange={this.dateChanged}/>
            <span className = { ClassNames({ hidden: this.state.comp !== 'between' }) }> 
                To: 
                <input type="text" ref='datePicker2' value={ this.state.value2 }  onChange={this.dateChanged}/> 
            </span>

        </span>;
    }
});
module.exports = HeaderDatesPickerElement;