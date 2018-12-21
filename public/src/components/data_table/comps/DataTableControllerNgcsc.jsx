//jshint esversion: 6
const React = require( 'react' );
const ColumnChooser = require( './ColumnChooser' );
const MultiColumnFilter = require( './MultiColumnFilter' );
const MultiselectList = require( './MultiselectList' );
const FilterView = require( '../elements/FilterView' );
const AccountChooser = require( './AccountChooser' );
const DataTableControllerMixins = require( './../mixins/DataTableControllerMixins' );
const ClassNames = require( 'classnames' );
const MultiColumnsList = require( "./MultiColumnsListChooser" );
const DialogPolyfill = require('dialog-polyfill');

require( '../style/ngcsc-datatable.scss' );


const Controller = React.createClass( {

    mixins: [DataTableControllerMixins],
    getInitialState: function() {

        return {
        }
    },

    componentDidMount: function() { 
         var dialogElement = document.querySelector('#jnprPopUpDialog_' + this.props.appId);
        if(dialogElement!== null){
            DialogPolyfill.registerDialog(dialogElement);
        }
    },
    showAccountTab: function() {
        const {showAccTab, noAccountTab = false} = this.props;
        if(!noAccountTab){
            if(showAccTab){
                return (
                        <li 
                            onClick={ this.chooseTabTypeAccounts }
                            className={ ClassNames( {
                                'selected': this.state.tabType == 'accounts',
                                'unselected': this.state.tabType != 'accounts',
                            })}>
                            Accounts
                        </li>
                );
            }
        }
        return null;
    },
    showAccountTabContent: function() {
        const { showAccTab, noAccountTab = false, tableHeight, availableAccounts, selectedAccounts, appId } = this.props;

         if(!noAccountTab){
            if(showAccTab){
                return (
                        <div className={ this.state.tabType == 'accounts' ? '' : 'noneDisplay' }>
                            <MultiselectList
                                tabType="accounts"
                                tableHeight={tableHeight + 30}
                                ref='jnprDataTableAccountChooser'
                                items={availableAccounts}
                                sortable={false}
                                keyID='accountId'
                                hidingSearchWindow = {false}
                                hidingSelectItemsToggle = {false}
                                searchOn={['accountId', 'accountName']}
                                listitemDisplayFormat={['accountName', 'accountId']}
                                outputFormatKeys={['accountId', 'accountName', 'uuid']}
                                outputFormatdelimiter=':'
                                selectedItems={selectedAccounts}
                                callBack={this.updateSelectedAccounts}
                                appId={appId}
                                columnFreezable={false}
                                />
                        </div>
                    )
            }
        }
        return null;
    },

    render: function() {
        return (
            <section className='jnprDataTableControls-wrapper'>
                <aside className='jnprDataTableControls'>
                    <div className='jnprDataTableControlsHeader'>
                        <div className='jnprDataTableControlsTitleWrapper' onClick={this.props.closePanel}>
                            <i className='jnprDataTableControlsMenu fa fa-bars'></i>
                            <span className='jnprDataTableControlsMenuTitle'>{this.state.tabTypeName} Options</span>
                        </div>
                        <div
                            className={ ClassNames( {
                                'jnprDataTableControlsBtn': true,
                                'close': this.props.defaultCtrlBtn,
                            }) }>
                        </div>
                    </div>
                    <nav>
                        <ul>
                            {this.showAccountTab()}
                            <li
                                onClick={ this.chooseTabTypeColumns }
                                className={ ClassNames( {
                                    'columnSelectToggleLi': true,
                                    'selected': this.state.tabType == 'columns',
                                    'unselected': this.state.tabType != 'columns',
                                    'noneDisplay': this.props.showColumnsTab === false
                                }) }>
                                Columns
                            </li>
                            <li
                                onClick={ this.chooseTabTypeFilters }
                                className={ ClassNames( {
                                    'selected': this.state.tabType == 'filters',
                                    'unselected': this.state.tabType != 'filters',
                                    'noneDisplay': this.props.showFiltersTab === false
                                }) }>
                                Filters
                            </li>
                        </ul>
                    </nav>
                    <div className='jnprDataTableControls-section'>
                        {this.showAccountTabContent()}
                        <div className={ this.state.tabType == 'columns' ? '' : 'noneDisplay' }>
                            <MultiselectList
                                tabType="columns"
                                tableHeight={this.props.tableHeight + 30}
                                ref='jnprDataTableColumnChooser'
                                items={ this.props.availableColumns }
                                hidingSearchWindow = {true}
                                hidingSelectItemsToggle = {true}
                                sortable={true}
                                keyID='id'
                                searchOn={['title']}
                                listitemDisplayFormat={['title']}
                                outputFormatKeys={['id']}
                                outputFormatdelimiter=','
                                selectedItems={this.props.selectedColumns}
                                callBack={ this.updateSelectedColumns }
                                appId={ this.props.appId }
                                columnFreezable={this.state.columnFreezable}
                                toggleFreezeMe={this.toggleFreezeMe}
                                />
                        </div>


                        <div className={ this.state.tabType == 'filters' ? '' : 'noneDisplay' }>
                            <FilterView
                                hidingSearchWindow= {true}
                                hidingSelectItemsToggle = {true}
                                tableHeight={this.props.tableHeight + 30}
                                availableColumns={ this.props.availableFilterableColumns }
                                appId={ this.props.appId }
                                filterCallBack={ this._filterCallBack }
                                filterReset={ this._filterReset }
                                keyId = {this.props.keyId}
                            />
                        </div>
                    </div>
                </aside>
                    <dialog id={'jnprPopUpDialog_' + this.props.appId} className='jnprColumnDialog mdl-dialog'>
                        <MultiColumnsList
                        appId= {this.props.appId}
                        items= {this.props.availableColumns}
                        selectedItems= {this.props.selectedColumns}
                        close ={this.closePopUpColumnChooser}
                        callBack={this.updateSelectedColumns}
                        toggleFreezeMe={this.toggleFreezeMe}
                        />
                    </dialog>
            </section>
        );
    }
});

module.exports = Controller;
