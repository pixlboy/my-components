let React = require( 'react' );
let TimeZoneComp = require( './TimeZone' );
let TZ = require( '../services/TimeZoneService' );
let ClassNames = require( 'classnames' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let DataTableStore = require( '../flux/stores/DataTableStore' );

var TimeZoneWrapperComp = React.createClass( {

    getTimeZone: function() {
        return jnprDataTableObj.getTimeZoneFor(this.props.appId);
    },

    getInitialState: function() {
        if ( this.props.mockedDataTableObject )
            jnprDataTableObj = this.props.mockedDataTableObject;
        return {
            showTimeZoneConfigBtnOptions: false,
            selectedZone: new TZ().findTimezoneByAbbreviation( this.getTimeZone() )
        }
    },

    selectZone: function( zone ) {
        this.setState( {
            selectedZone: zone
        });
        this.closeTimeZone();

        if ( this.props.changeTimeZone )
            this.props.changeTimeZone( zone )

    },

    closeTimeZone: function() {
        this.setState( {
            showTimeZoneConfigBtnOptions: false
        });
    },

    _toggleTimezoneConfig: function( event ) {
        event.stopPropagation();
        this.setState( {
            showTimeZoneConfigBtnOptions: !this.state.showTimeZoneConfigBtnOptions
        });
    },

    componentDidMount: function() {
        DataTableStore.addCustomConfigViewingHandler( this.props.appId, this._customerConfigChanged );
    },

    componentWillUnmount: function() {
        DataTableStore.removeCustomConfigViewingHandler( this.props.appId, this._customerConfigChanged );
    },

    _customerConfigChanged: function() {
        this.setState( {
            selectedZone: new TZ().findTimezoneByAbbreviation( this.getTimeZone() )
        });
    },

    render: function() {
        var timeZoneOptions = null;
        if ( this.state.showTimeZoneConfigBtnOptions )
            timeZoneOptions = <div className={ClassNames( { "ulTimezoneButtonDropDown": true }) }>
                <TimeZoneComp selectZone={this.selectZone} close={this.closeTimeZone}></TimeZoneComp>
            </div>;
        return (

            <span className='timezoneWrapper'>
                <button type='button' className={
                    ClassNames( {
                        'btnToggleTimezone': true,
                        'table-btn-control': true,
                        'savebtn': true
                    })
                }
                    onClick={ this._toggleTimezoneConfig } >
                    <span className='table-btn-ctrl-icon-clock'></span>
                    {this.state.selectedZone.getDisplayName()}
                    <span className={ClassNames( {
                        'actions-icon': true,
                        'down': !this.state.showTimeZoneConfigBtnOptions,
                        'up': this.state.showTimeZoneConfigBtnOptions
                    }) }></span>
                </button >
                {timeZoneOptions}
            </span> )
    }

});

module.exports = TimeZoneWrapperComp;
