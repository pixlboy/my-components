let React = require( 'react' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let classNames = require( "classnames" );
let DataTableAction = require( '../flux/actions/DataTableActions' );
let DataTableStore = require( '../flux/stores/DataTableStore' );
let ReactDOM = require( 'react-dom' );
import ScrollBar from 'perfect-scrollbar';
import '../style/perfect-scrollbar.css';

let _ = require( 'underscore' );

var ConfigItem = React.createClass( {

    getInitialState: function() {
        return {
            showUpdateBtn: jnprDataTableObj.isConfigurationChanged( this.props.appId, ['colWidths', 'filterModel', 'sortModel'] ).changed
        };
    },

    _delete: function() {
        this.props.deleteHandler( this.props.subType );
    },
    _update: function() {
        this.props.updateHandler( this.props.subType );
        this._setUpdateBtnVisible();
    },
    _showme: function() {
        this.props.showConfigHandler( this.props.subType );
    },

    _changeDefault: function() {
        this.props.changeDefaultHandler( this.props.subType );
    },

    componentDidMount: function() {
        DataTableStore.addColumnFilterListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addColumnSorterListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addFiltersUpdates( this.props.appId, this._setUpdateBtnVisible );
        //DataTableStore.addFiltersReset(this.props.appId, this._setUpdateBtnVisible);
        DataTableStore.addColumnsUpdateListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addAccountsUpdates( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addColumnResizedHandler( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addMultiConfigWithNameSaved( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.addColumnReordered( this.props.appId, this._setUpdateBtnVisible );
    },

    componentWillUnmount: function() {

        DataTableStore.removeColumnFilterListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeColumnSorterListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeFiltersUpdates( this.props.appId, this._setUpdateBtnVisible );
        //DataTableStore.removeFiltersReset(this.props.appId, this._setUpdateBtnVisible1);
        DataTableStore.removeColumnsUpdateListener( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeAccountsUpdates( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeColumnResizedHandler( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeMultiConfigWithNameSaved( this.props.appId, this._setUpdateBtnVisible );
        DataTableStore.removeColumnReordered( this.props.appId, this._setUpdateBtnVisible );
    },

    /**
	 * noChangingDefault is passed from _showConfig below, that we do not want to show status updates
	 * Little trick here, when chnage config, multiple events will be dispatched, and teh udpate icon will appear, so let's add a flag to disable checking
	 * but here,we have a timeout to auto-clear this flag
	 */
    noCheckingingUpdate: false,
    _setUpdateBtnVisible: function( noDataReset, noChangingUpdate ) {
        if ( this.noCheckingingUpdate !== true && noChangingUpdate !== true ) {
            setTimeout( function() {
                this.setState( {
                    showUpdateBtn: jnprDataTableObj.isConfigurationChanged( this.props.appId, ['colWidths', 'filterModel', 'sortModel'] ).changed
                });
            }.bind( this ), 100 );
        } else {
            this.noCheckingingUpdate = true;
            setTimeout( function() {
                this.noCheckingingUpdate = false;
            }.bind( this ), 1000 );
        }
    },



    render: function() {
        var delBtn = null;
        var updateBtn = null;
        if ( this.props.subType.toLowerCase() !== 'default' ) {
            delBtn = <span className={classNames( {
                "delBtn": true,
                'R': 'mode' in jnprDataTableObj.config ? jnprDataTableObj.config.mode === 'R' : false
            }) }  onClick={this._delete}/>
            if ( this.props.value.current ) {
                if ( this.state.showUpdateBtn )
                    updateBtn = <span className={classNames( {
                        "updateBtn": true,
                        'R': 'mode' in jnprDataTableObj.config ? jnprDataTableObj.config.mode === 'R' : false
                    }) }  onClick={this._update}/>
                else
                    updateBtn = null;
            }
            else {
                updateBtn = null;
            }
        }
        var savingName = null;
        if ( this.props.subType.toLowerCase() === 'default' ) {
            savingName = 'System Default';
        } else {
            savingName = this.props.subType;
        }

        return <li>
            <span className={classNames(
                {
                    "favorite": this.props.value.default,
                    "favorite-o": !this.props.value.default,
                    'R': 'mode' in jnprDataTableObj.config ? jnprDataTableObj.config.mode === 'R' : false
                }

            ) } onClick={this._changeDefault} title='Set as my Default View'></span>
            <div className={classNames( this.props.value.current
                ? "default" : "regular" ) } onClick={this._showme}>
                {savingName}
            </div>
            {delBtn}
            {updateBtn}
        </li>
    }
});

var SaveButtonCell = React.createClass( {

    getInitialState: function() {
        return {
            availableConfigs: _.clone( jnprDataTableObj.getAvailableConfigsFor( this.props.appId ) )
        }
    },

    componentDidMount: function() {
        let node = ReactDOM.findDOMNode( this ).querySelectorAll( '.saveButtonOptions > ul' )[0];
        ScrollBar.initialize( node );
        ScrollBar.update( node );
        DataTableStore.addFiltersReset( this.props.appId, this._filterResetFromController );
        DataTableStore.addMultiConfigWithNameSaved( this.props.appId, this._configSaved );
        ReactDOM.findDOMNode( this ).focus();
        //save click outside funtionality added
        window.addEventListener( 'click', this._toggleSaveMenuOnClickOutside, false );
    },
    componentWillMount() {
        this.handleSearch = _.debounce( value => {
            ScrollBar.update( ReactDOM.findDOMNode( this ).querySelectorAll( '.saveButtonOptions > ul' )[0] );
        }, 600 );
    },
    componentWillUnmount: function() {
        let node = ReactDOM.findDOMNode( this ).querySelectorAll( '.saveButtonOptions > ul' )[0];
        ScrollBar.destroy( node );
        DataTableStore.removeFiltersReset( this.props.appId, this._filterResetFromController );
        DataTableStore.removeMultiConfigWithNameSaved( this.props.appId, this._configSaved );
        //save click outside funtionality added
        window.removeEventListener( 'click', this._toggleSaveMenuOnClickOutside, false );
    },
    componentDidUpdate() {
        let node = ReactDOM.findDOMNode( this ).querySelectorAll( '.saveButtonOptions > ul' )[0];
        ScrollBar.update( node )
    },
	
    _toggleSaveMenuOnClickOutside: function( event ) {
        var excludedElement = document.querySelector( ".saveButtonOptions" )
        var selectedElement = excludedElement ? excludedElement.contains( event.target ) : false;
        var delElement = ( event.target.nodeName === 'SPAN' ) && ( event.target.className === 'delBtn' );
        if ( !selectedElement && !delElement ) {
			this.props.hideSaveConfig(null);
        }
    },

    _configSaved: function() {
        this.setState( { availableConfigs: jnprDataTableObj.availableConfigs });
    },

    _filterResetFromController: function() {
        //now we need to set default config and the dispatch the events
        //also we only fetch if it is NOT sent from _showConfig() below
        if ( !this.fromShowConfig )
            setTimeout( function() {
                jnprDataTableObj.setDefaultConfigFor( this.props.appId, 'default' );
                DataTableAction.performCustomConfigurationChanged( this.props.appId );
                DataTableAction.performUpdateDefaultConfiguration( this.props.appId, 'default' );
            }.bind( this ), 50 );
        else
            this.fromShowConfig = false; //change it back to false for resettting purpose
    },

    _delete: function( key ) {
        var availableConfigs = this.state.availableConfigs;
        delete ( availableConfigs[key] );
        //setting default one to first one
        jnprDataTableObj.setAvailableConfigsFor( this.props.appId, availableConfigs );
        jnprDataTableObj.setDefaultConfigFor( this.props.appId, Object.keys( jnprDataTableObj.availableConfigs )[0] );
        this.setState( {
            availableConfigs: jnprDataTableObj.availableConfigs
        });
        DataTableAction.performDeleteConfiguration( this.props.appId, key );

        this._showConfig( Object.keys( jnprDataTableObj.availableConfigs )[0], true );

    },

    _update: function( key ) {
        var availableConfigs = this.state.availableConfigs;
        Object.keys( availableConfigs ).forEach( function( item ) {
            if ( item === key ) {
                availableConfigs[item].value = _.clone( jnprDataTableObj.getCustomConfigurationFor( this.props.appId ) );
            }
        }.bind( this ) );

        jnprDataTableObj.setAvailableConfigsNoCurrentChangeFor( this.props.appId, availableConfigs );
        this.setState( {
            availableConfigs: jnprDataTableObj.availableConfigs
        });
        DataTableAction.performUpdateConfiguration( this.props.appId, key );

        setTimeout( function() {
            jnprDataTableObj.setCustomConfigFor( this.props.appId, _.clone( this.state.availableConfigs[key].value ), key );
        }.bind( this ), 50 );
    },

    fromShowConfig: false, //this flag is used to prevent another call sent from _filterResetFromController() above, as when showConfig, we first call performFiltersReset() below, and
    //it is triggering the _filterResetFromController() method above, but we do NOT want to fetch data again
    _showConfig: function( key, noNotice ) {
        //reset filter first
        // once clicked, it will trigger filter reset events, and this is listened
        // in all the inputElement to reset its values
        //Second parameter is true, means, no need to refetch data here, just for UI purpose
        this.fromShowConfig = true;
        DataTableAction.performFiltersReset( this.props.appId, true, true );
        //putting a small delay here to let reset happen first, otherwise, influence each other
        setTimeout( function() {
            //if this is default, we need to add accountIds
            jnprDataTableObj.setCustomConfigFor( this.props.appId, _.clone( this.state.availableConfigs[key].value ), key, true );
            DataTableAction.performCustomConfigViewing( this.props.appId, key );
        }.bind( this ), 50 );
    },

    _changeDefaultHandler: function( key, noNotice ) {
        jnprDataTableObj.setDefaultConfigOnlyFor( this.props.appId, key );
        DataTableAction.performUpdateDefaultConfiguration( this.props.appId, key );
    },

    _onBlur: function() {
        //hookup for hiding self automatically
        //if (this.props.onBlur)
        //    this.props.onBlur();
    },

    render: function() {
        return (

            <div tabIndex="0" onBlur={this._onBlur} className={classNames( { 'saveButtonOptions': true, 'closed': this.props.panelClosed }) }>
                <div>Saved Views</div>
                <ul>
                    {Object.keys( this.state.availableConfigs ).map( key => {
                        return <ConfigItem key={key} subType={key} value={this.state.availableConfigs[key]} deleteHandler={this._delete} updateHandler={this._update} showConfigHandler={this._showConfig} changeDefaultHandler={this._changeDefaultHandler} appId={this.props.appId}/>;
                    }) }
                </ul>
            </div>

        );
    }
});

module.exports = SaveButtonCell;
