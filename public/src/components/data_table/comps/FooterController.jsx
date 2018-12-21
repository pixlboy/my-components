let React = require('react');
let DataTableAction = require( '../flux/actions/DataTableActions' );
let jnprDataObject = require( '../data_object/DataTableObjectFactory' ).getDataTableObject();
let DataTableStore = require( '../flux/stores/DataTableStore' );
let TableScrollerPositioner = require( './TableScrollerPositioner' );
var footerController = React.createClass( {

    getInitialState: function() {
        return {
            grandTotal: jnprDataObject.grandTotalRecords,
            hidingBottomIndicator: jnprDataObject.config.hidingBottomIndicator
        }
    },

    //Dispatch event through FLux, and this event is intercepted and registerted by DataTableMixins.jsx, method: _updateRecordsPerPage()
    setRecordsPerPage: function() {
        DataTableAction.performUpdateRecordsPerPage( this.props.appId, this.refs.selPagePerPage.value );
    },

    componentDidMount: function() {
        jnprDataObject.subscribeToGrandTotal( function( num ) {
            this.setState( {
                grandTotal: num
            });
        }.bind( this ) );
    },


    render: function() {
        let optionValues = [10, 20, 30, 40, 50]
        let positioner = null;
        if ( !( 'hidingBottomPagePositioner' in jnprDataObject.config && jnprDataObject.config.hidingBottomPagePositioner ) ) {
            positioner = <TableScrollerPositioner appId={this.props.appId} />
        }

        let bottomIndicator = <div className='bottomIndicator'>
            <table>
                <tbody>
                    <tr>
                        <td className="left">
                            {positioner}
                        </td>
                        <td className="right">
                            <span className='tablerecords-wrapper'
                                style={{ marginRight: '10px' }}>
                                Total Records: {' '}
                                { this.state.grandTotal }
                            </span>
                            <span className='tablerecords-page-control'>
                                <span  style={{ marginRight: '10px' }}>Display</span>
                                <span className="select-wrapper">
                                    <select
                                        onChange={ this.setRecordsPerPage }
                                        ref="selPagePerPage"
                                        defaultValue = {jnprDataObject.getNumPerPageFor( this.props.appId ) }
                                        >
                                        {optionValues.map( function( val ) {
                                            return <option key={val} value={val} >{val}</option>;
                                        }.bind( this ) ) }
                                    </select>
                                    <span>per page</span>
                                </span>
                            </span>

                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

        if ( this.props.dataList.length ) {

            if ( this.state.hidingBottomIndicator ) {
                return null;
            } else {
                return ( bottomIndicator );
            }

        } else {
            return null;
        }

    }

});

module.exports = footerController;
