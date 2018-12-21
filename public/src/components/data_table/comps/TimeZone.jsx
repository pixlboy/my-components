let React = require( 'react' );
let TZ = require( '../services/TimeZoneService' );
let ClassNames = require( 'classnames' );
let ReactDOM = require('react-dom');
import _ from 'underscore';
import ScrollBar from 'perfect-scrollbar';

var TimeZoneComp = React.createClass( {

    getInitialState: function() {
        this.timeZoneService = new TZ();
        return {
            timeZones: this.timeZoneService.getTimeZones()
        }
    },

    filter: function( ev ) {
        this.setState( {
            timeZones: this.timeZoneService.search( ev.target.value )
        });
        let value = ev.target.value;
        // delegate to handlesearch
        this.handleSearch(value);
    },

    chooseTimeZone: function( ev ) {
        this.setState( {
            selectedZone: ev.target.getAttribute( 'data-timezone' )
        });
        this.props.selectZone( this.timeZoneService.findTimezoneByAbbreviation( ev.target.getAttribute( 'data-timezone' ) ) );
    },

    componentDidMount: function() {
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.timezone')[0];
        ScrollBar.initialize( node );
        ScrollBar.update( node );
        var win = window;
        if ( win.addEventListener ) {
            win.addEventListener( 'click', this._toggleTimeZoneOnClickOutside, false );
        } else if ( win.attachEvent ) {
            win.attachEvent( 'onclick', this._toggleTimeZoneOnClickOutside );
        }
    },
    componentWillMount() {
        this.handleSearch = _.debounce( value => {
            ScrollBar.update( ReactDOM.findDOMNode( this ) );
        }, 500 );
    },
    componentWillUnmount: function() {
        // find this node on DOM and destroy the scrollbar
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.timezone')[0];
        ScrollBar.destroy(node);

        var win = window;
        if ( win.removeEventListener ) {
            win.removeEventListener( 'click', this._toggleTimeZoneOnClickOutside, false );
        } else if ( win.detachEvent ) {
            win.detachEvent( 'onclick', this._toggleTimeZoneOnClickOutside );
        }
    },
    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this).querySelectorAll('.timezone')[0];
        ScrollBar.update(node);
    },

    //toggle the timezone dropDown
    //when either not this whole block or not the toggle button
    _toggleTimeZoneOnClickOutside: function() {
        var excludedElement = document.querySelector( ".timezone-container" );
        var selectedElement = excludedElement ? excludedElement.contains( event.target ) : false;
        var toggleElement = $( event.target ).hasClass( 'btnToggleTimezone' );
        if ( !selectedElement && !toggleElement ) {
            this.props.close();
        }
    },

    render: function() {

        return (
            <section className='timezone-container'>
                <input type="text" placeholder="Search Time Zone" onChange={ this.filter }/>
                    <div className='timezone'>
                        <ul>
                            {this.state.timeZones.map(( zone, index ) => {
                                return <li key={index} className={ClassNames( { 'selected': this.state.selectedZone === zone.getAbbreviation() }) } data-timezone={zone.getAbbreviation()} onClick={this.chooseTimeZone}>{zone.getDisplayName()}</li>
                            }) }
                        </ul>
                    </div>
            </section>

        );
    }

});
module.exports = TimeZoneComp;
