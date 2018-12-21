let React = require( 'react' );
let ClassNames = require( 'classnames' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
import { Textfield, Checkbox } from 'react-mdl';
var dataTableActions = require( '../flux/actions/DataTableActions' );

var MultiColumnsListItem = React.createClass( {

    toggle: function( e ) {
        if ( e.target.tagName === 'LI' ) {
            if ( 'toggle' in this.props ) {
                this.props.toggle( this.props.item );
            }
        }
    },

    freezeMe: function() {
        if ( 'toggleFreezeMe' in this.props ) {
            this.props.toggleFreezeMe( this.props.item )
        }

    },

    render: function() {
        var freezableCheckbox = null;
        if ( this.props.columnFreezable )
            freezableCheckbox = <span className="spanFreezeColumn">
                <Checkbox
                    checked={ jnprDataTableObj.isColumnFrozen( this.props.appId, this.props.item.id ) }
                    onChange={this.freezeMe}
                    />
            </span>;

        return <li className={ ClassNames( { selected: this.props.selected }) } onClick={this.toggle}>
            {this.props.item.title}
            {freezableCheckbox}
        </li>
    }

});

var MultiColumnsList = React.createClass( {

    processData: function( inputObj ) {
        if ( Array.isArray( inputObj ) ) {
            if ( inputObj.includes( 'addedCheckBox' ) )
                inputObj = inputObj.splice( 1 );
        } else {
            if ( 'addedCheckBox' in inputObj )
                delete ( inputObj['addedCheckBox'] )
        }
        return inputObj;
    },

    getInitialState: function() {
        return {
            selectedItems: this.processData( jnprDataTableObj.getSelectedColumnKeysFor( this.props.appId ) ),
            availableItems: this.props.items
        };
    },

    componentDidMount: function() {
        this.enableSortableUL();
        var win = window;
        if ( win.addEventListener ) {
            win.addEventListener( 'click', this._togglePopUpOnClickOutside, false );
        } else if ( win.attachEvent ) {
            win.attachEvent( 'onclick', this._togglePopUpOnClickOutside );
        }
    },

    componentWillUnmount: function() {
        var win = window;
        if ( win.removeEventListener ) {
            win.removeEventListener( 'click', this._togglePopUpOnClickOutside, false );
        } else if ( win.detachEvent ) {
            win.detachEvent( 'onclick', this._togglePopUpOnClickOutside );
        }
    },

    _togglePopUpOnClickOutside: function( event ) {
        var excludedElement = document.querySelector( ".listWrapper" );
        var selectedElement = excludedElement ? excludedElement.contains( event.target ) : false;
        var toggleElement = $( event.target ).hasClass( 'columnSelectToggleLi' );
        if ( !selectedElement && !toggleElement ) {
            this.props.close();
        }
    },

    enableSortableUL: function() {
        //making multiSelectList sortable
        var self = this;
        if ( window.jQuery != null )
            jQuery( this.refs.multiselectList ).sortable( {
                startPos: null,
                endPos: null,
                start: function( event, ui ) {
                    this.startPos = ui.item.index();
                },
                stop: function( event, ui ) {
                    this.endPos = ui.item.index();
                    jnprDataTableObj.appId = self.props.appId;
                    //1. update the dataTableObject orderedList position
                    jnprDataTableObj.swapKeyList( this.startPos, this.endPos );
                    //2. Now let's trigger the flux events.
                    dataTableActions.performColumsReordered( self.props.appId );
                }
            }).disableSelection();
    },

    disableSortableUL: function() {
        if ( window.jQuery != null )
            if ( jQuery( this.refs.multiselectList ).hasClass( 'ui-sortable' ) )
                jQuery( this.refs.multiselectList ).sortable( "destroy" );

    },

    close: function() {
        this.props.close();
    },

    toggle: function( item ) {
        //if this is stiky column, do nothing here
        if ( 'sticky' in item && item.sticky === true ) {
            return;
        }

        var updatedList = [];
        var currentSelectedItems = this.state.selectedItems;
        if ( currentSelectedItems.includes( item.id ) ) {
            //we need to remove
            currentSelectedItems.map( key => {
                if ( key !== item.id ) {
                    updatedList.push( key );
                }
            });
            currentSelectedItems = updatedList;
        } else {
            currentSelectedItems.push( item.id );
        }
        currentSelectedItems = this.processData( currentSelectedItems );

        this.setState( {
            selectedItems: currentSelectedItems
        });

        this.props.callBack( currentSelectedItems );
    },

    toggleFreezeMe: function( item ) {
        if ( 'toggleFreezeMe' in this.props )
            this.props.toggleFreezeMe( item )
    },
    toggleAll: function( e ) {
        var selectedItems = [];

        if ( e.target.checked ) {
            Object.keys( this.props.items ).map( function( key, index ) {
                selectedItems.push( key );
            });
        } else {
            //keep sticky column
            Object.keys( this.props.items ).map( function( key ) {
                if ( 'sticky' in this.props.items[key] && this.props.items[key].sticky === true )
                    selectedItems.push( key );
            }.bind( this ) );
        }
        selectedItems = this.processData( selectedItems );
        this.setState( {
            selectedItems: selectedItems
        });
        this.props.callBack( selectedItems );
    },

    filterColumns: function( e ) {
        var newItems = {};
        if ( e.target.value == '' ) {
            newItems = this.props.items;
        } else {
            Object.keys( this.props.items ).map( function( key ) {
                if ( this.props.items[key].title.toLowerCase().includes( e.target.value.toLowerCase() ) )
                    newItems[key] = this.props.items[key];

            }.bind( this ) );
        }
        this.setState( {
            availableItems: newItems
        });

        //when user are filtering, we should now allow sorting, we only allow sorting if there are no column filtering
        this.disableSortableUL();
        if ( Object.keys( this.props.items ).length === Object.keys( newItems ).length ) {
            this.enableSortableUL();
        }
    },

    render: function() {

        return <div className='listWrapper'>
            <div className='divControllerWrapper'>
                <Checkbox
                    className="chkSelAllBox"
                    label={'Select All'}
                    onChange={this.toggleAll}
                    id="chkSelectAllColumn_{this.props.appId}"    />
                <Textfield
                    className="searchColBox"
                    id="txtSearchColBox_{this.props.appId}"
                    onChange={this.filterColumns}
                    label="Filter Columns"
                    floatingLabel={true}
                    />

                <span className="clearFix" />

            </div>
            <i className="material-icons" onClick={this.close}>close</i>
            <ul ref='multiselectList'>
                {Object.keys( this.state.availableItems ).map( function( key, index ) {

                    if ( key in this.props.items )
                        return <MultiColumnsListItem
                            appId={this.props.appId}
                            key={index}
                            item={this.props.items[key]}
                            selected = {this.state.selectedItems.includes( key ) }
                            toggle = {this.toggle}
                            toggleFreezeMe={this.toggleFreezeMe}
                            columnFreezable={ 'freezable' in this.state.availableItems[key] ? this.state.availableItems[key].freezable : false  }
                            />
                }.bind( this ) ) }
            </ul>
        </div>
    }
});
module.exports = MultiColumnsList;
