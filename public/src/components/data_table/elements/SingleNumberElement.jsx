let React = require( 'react' );

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

    onChange1: function (e){
        this.setState({ value1: e.target.value });
        this.validateDataAndSubmit(e.target.value, this.state.value2 );
    },
    onChange2: function (e){
        this.setState({ value2: e.target.value });
        this.validateDataAndSubmit(this.state.value1, e.target.value );
    },
    clearData1: function() {
        this.setState( {
            value1: ""
        });
        this.checkAndSubmit( "", this.state.value2, true );
    },
    clearData2: function() {
        this.setState( {
            value2: ""
        });
        this.checkAndSubmit( this.state.value1, "", true );
    },

    validateDataAndSubmit: function( dt1, dt2, resetting ) {

        if ( this.props.range === '<>' ) {
            var goodToGo = true;

            if ( dt1 === '' || !isNaN(dt1)) {
                this.setState( {
                    value1_error: false
                });
            } else {
                goodToGo = false;
                this.setState( {
                    value1_error: true
                });
            }

            if ( dt2 === '' || !isNaN(dt2) ) {
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
            this.props.dataUpdate( dt1, dt2, resetting );

        } else {
            if ( dt1 === '' || !isNaN(dt1) ) {
                this.setState( {
                    value1_error: false
                });
                this.props.dataUpdate( dt1, null, resetting );
            } else {
                this.setState( {
                    value1_error: true
                });
            }
        }
    },

    componentDidMount: function() {

        DataTableStore.addFiltersReset( this.props.appId, this._filtersResetHandler );
        DataTableStore.addCustomConfigurationChangedCallBackHandler( this.props.appId, this._customConfigChanged );
        this.checkAndSubmit = _.debounce( this.validateDataAndSubmit, 0 );

    },

    componentWillUnmount: function(){
        DataTableStore.removeFiltersReset( this.props.appId, this._filtersResetHandler);
        DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged) ;
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

                <span onClick={this.clearData1} className={ ClassNames( { clearDate: true, hidden: !( this.state.value1 != null && this.state.value1.length > 0 ) }) } ><i className='material-icons'>close</i></span>
                <input type="text"
                    value={this.state.value1}
                    onChange={this.onChange1}
                    className= { ClassNames( { dateElementInput: true, error: this.state.value1_error }) }
                />

                <div className={ ClassNames( { hidden: !this.state.value1_error, errMsg: true }) }>Invalid Number Format</div>
                <div className={ ClassNames( { hidden: this.props.range !== '<>' }) }>
                    <div className='seperator'>To</div>
                    <span onClick={this.clearData2} className={ ClassNames( { clearDate: true, hidden: !( this.state.value2 != null && this.state.value2.length > 0 ) }) }><i className='material-icons'>close</i></span>
                    <input type="text"
                        onChange={this.onChange2}
                        className= { ClassNames( { dateElementInput: true, error: this.state.value2_error }) }
                        value = { this.state.value2 }/>
                    <div className={ ClassNames( { hidden: !this.state.value2_error, errMsg: true }) }>Invalid Number Format</div>
                </div>
            </div>
        );
    }

});

module.exports = SingleDateElement;
