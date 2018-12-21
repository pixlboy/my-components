let
    DataTableAction = require( '../flux/actions/DataTableActions' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let MultiColumnsList = require( "../comps/MultiColumnsListChooser" );

var DataTableControllerMixins = {

    getInitialState: function() {
        return {
            tabType: 'filters',
            tabTypeName: 'Filter',
            columnFreezable: jnprDataTableObj.isColumnFreezableFor( this.props.appId )
        };
    },

    updateSelectedColumns: function( columns ) {
        DataTableAction.performColumnsUpdate( this.props.appId, columns );
    },

    _getGlobal: function() {
        if ( this.props.showGlobalCheckbox ) {
            return this.refs.chkGlobal.checked ? true : false;
        } else {
            return this.props.defaultGlobal;
        }
    },

    updateSelectedAccounts: function( accounts ) {
        DataTableAction.performAccountsUpdate( this.props.appId, accounts, this
            ._getGlobal() );
    },

    chooseTabTypeColumns: function() {
        if ( 'allowPopupColumnSelect' in jnprDataTableObj.config && jnprDataTableObj.config.allowPopupColumnSelect === true ) {
            //here, we need to show pop-up
            if ( document.querySelector( '#jnprPopUpDialog_' + this.props.appId ) )
                document.querySelector( '#jnprPopUpDialog_' + this.props.appId ).showModal();
        } else {
            this.setState( {
                tabType: 'columns'
            });
            this.setTabTypeName( 'Column' );
        }
    },

    closePopUpColumnChooser: function() {
        if ( document.querySelector( 'dialog' ) && document.querySelector( 'dialog' ).hasAttribute( 'open' ) )
            document.querySelector( 'dialog' ).close();
    },

    chooseTabTypeFilters: function() {
        this.setState( {
            tabType: 'filters'
        });
        this.setTabTypeName( 'Filter' );
    },
    chooseTabTypeAccounts: function() {

        this.setState( {
            tabType: 'accounts'
        });
        this.setTabTypeName( 'Account' );

    },
    setTabTypeName: function( str ) {

        if ( str === 'Column' && 'title_column_option' in jnprDataTableObj.config )
            str = jnprDataTableObj.config['title_column_option'];
        if ( str === 'Account' && 'title_account_option' in jnprDataTableObj.config )
            str = jnprDataTableObj.config['title_account_option'];
        if ( str === 'Filter' && 'title_filter_option' in jnprDataTableObj.config )
            str = jnprDataTableObj.config['title_filter_option'];

        this.setState( {
            tabTypeName: str
        });
        DataTableAction.performChangeControllerType( this.props.appId, str );
    },
    _filterCallBack: function( filterObj ) {
        DataTableAction.performFiltersUpdate( this.props.appId, filterObj, this
            ._getGlobal() );
    },
    _filterReset: function() {
        DataTableAction.performFiltersReset( this.props.appId );
    },
    toggleFreezeMe: function( item ) {
        var subType = jnprDataTableObj.updateFrozenKeyListFor( this.props.appId, item );
        setTimeout( function() {
            DataTableAction.performFrozenColumnsChanged( this.props.appId, subType );
        }.bind( this ), 0 );
    },

    componentDidMount: function() {
        //console.log('loaded it');
    }
};

module.exports = DataTableControllerMixins;
