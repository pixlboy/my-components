let React = require( 'react' );

//var jQuery = require('jquery');
//require('jquery-ui/ui/core');
//require('jquery-ui/ui/datepicker');

let ClassNames = require( 'classnames' );
let DataTableStore = require( '../flux/stores/DataTableStore' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let _ = require( 'underscore' );

var SingleDateElement = React.createClass( {


    // initial state
    getInitialState() {
        return {
            value1: this.props.filter && 'value1' in this.props.filter ? this.props.filter.value1 : "",
            value2: this.props.filter && 'value2' in this.props.filter ? this.props.filter.value2 : "",
            value1_error: false,
            value2_error: false
        };
    },

    dateChanged: function() {
        var dt1 = jQuery( this.refs.datePicker1 ).datepicker( {
            dateFormat: 'yy-mm-dd'
        }).val();

        var dt2 = jQuery( this.refs.datePicker2 ).datepicker( {
            dateFormat: 'yy-mm-dd'
        }).val();

        this.setState( {
            value1: dt1 ? dt1 : "",
            value2: dt2 ? dt2 : ""
        });

        this.validateDateAndSubmit( dt1, dt2 );
    },
    clearDate1: function() {
        this.setState( {
            value1: ""
        });
        this.checkAndSubmit( "", this.state.value2, true );
    },
    clearDate2: function() {
        this.setState( {
            value2: ""
        });
        this.checkAndSubmit( this.state.value1, "", true );
    },

    validateDateAndSubmit: function( dt1, dt2, resetting ) {

        var dateFormat = /\d{4}\-\d{2}-\d{2}/;
        if ( this.props.range === 'between' ) {
            var goodToGo = true;

            if ( dt1 === '' || dt1.match( /\d{4}\-\d{2}-\d{2}/ ) ) {
                this.setState( {
                    value1_error: false
                });
            } else {
                goodToGo = false;
                this.setState( {
                    value1_error: true
                });
            }

            if ( dt2 === '' || dt2.match( /\d{4}\-\d{2}-\d{2}/ ) ) {
                this.setState( {
                    value2_error: false
                });
            } else {
                goodToGo = false;
                this.setState( {
                    value2_error: true
                });
            }

            if ( goodToGo )
                this.props.dateUpdate( dt1, dt2, resetting );

        } else {
            if ( dt1 === '' || dt1.match( /\d{4}\-\d{2}-\d{2}/ ) ) {
                this.setState( {
                    value1_error: false
                });
                this.props.dateUpdate( dt1, null, resetting );
            } else {
                this.setState( {
                    value1_error: true
                });
            }
        }

    },

    componentWillUnmount: function() {
        jQuery( this.refs.datePicker1 ).datepicker( "destroy" );
        jQuery( this.refs.datePicker2 ).datepicker( "destroy" );
    },

    componentDidMount: function() {
        if ( window.jQuery != null )
            jQuery( this.refs.datePicker1 ).datepicker( {
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: '1996:2026',
                onClose: function() {
                    this.blur();
                },
                onSelect: this.dateChanged
            }
            );
        if ( window.jQuery != null )
            jQuery( this.refs.datePicker2 ).datepicker( {
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: '1996:2026',
                onClose: function() {
                    this.blur();
                },
                onSelect: this.dateChanged
            });

        DataTableStore.addFiltersReset( this.props.appId, this._filtersResetHandler );
        DataTableStore.addCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );

        this.checkAndSubmit = _.debounce( this.validateDateAndSubmit, 0 );

    },

    _filtersResetHandler: function() {
        this.setState( {
            value1: "",
            value2: "",
            value1_error: false,
            value2_error: false
        })
    },

    _customConfigChanged: function() {
        let model = jnprDataTableObj.customConfiguration.filterModel[this.props.id];
        if ( model ) {
            this.setState( {
                value1: model.value1 ? model.value1 : "",
                value2: model.value2 ? model.value2 : "",
                value1_error: false,
                value2_error: false
            })
        } else {
            this.setState( {
                value1: "",
                value2: "",
                value1_error: false,
                value2_error: false
            })
        }
    },

    render: function() {

        return (
            <div className='dateElements'>

                <span onClick={this.clearDate1} className={ ClassNames( { clearDate: true, hidden: !( this.state.value1 != null && this.state.value1.length > 0 ) }) } ><i className='material-icons'>close</i></span>
                <input type="text" ref='datePicker1' readOnly className= { ClassNames( { dateElementInput: true, error: this.state.value1_error }) }  value={ this.state.value1 } onChange={this.dateChanged}/>

                <div className={ ClassNames( { hidden: !this.state.value1_error, errMsg: true }) }>Invalid Date Format</div>
                <div className={ ClassNames( { hidden: this.props.range !== 'between' }) }>
                    <div className='seperator'>To</div>
                    <span onClick={this.clearDate2} className={ ClassNames( { clearDate: true, hidden: !( this.state.value2 != null && this.state.value2.length > 0 ) }) }><i className='material-icons'>close</i></span>
                    <input type="text" ref='datePicker2' readOnly className= { ClassNames( { dateElementInput: true, error: this.state.value2_error }) } value = { this.state.value2 }  onChange={this.dateChanged}/>
                    <div className={ ClassNames( { hidden: !this.state.value2_error, errMsg: true }) }>Invalid Date Format</div>
                </div>
            </div>
        );
    }

});

module.exports = SingleDateElement;
