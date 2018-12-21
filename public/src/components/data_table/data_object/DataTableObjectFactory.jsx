let _ = require( 'underscore' );
let TimeZoneService = require( '../services/TimeZoneService' );

class DataTableObj {
    constructor() {
        this._dataList = {};
        this._config = {};
        this._subscribers_dataList = {};
        this._subscribers_config = {};
        this._subscribers_column_config = {};
        this._subscribers_coustomer_config = {}; //subscriber to listen to customer configuration updates
        this._subscribers_grandTotal = {};
        this._availableColumns = {};
        this._subscribers_highlightedRows = {};
        this._grandTotalRecords = 0; // used to save grand total
        this._appId = ''; // used to save setting to local storage, same table
        // to be used multiple times
        this._customConfiguration = {}; //by default, it is empty object
        this._selectedColumns = {}; //retrieve selectedColumns
        this._availableConfigs = {}; //used to save available configs for each appId

        this._defaultConfigKeys = {}; //used to keep tract of default config key

        this._colWidths = {}; //used to save temparary colWidth for comp purpose
        this._baseFilters = {}; //used to pass base filter, and this filter will be added to filterObject

        this._subscribers_extra_data = {}; // used to save subscribers for cell click to get extra data
        this._subscribers_extra_data_update = {}; // used to save subscribers for cell click to get extra data

        this._extraData = {};
        this._additionalConfig = {};

        this._customToolTip = {}; // used to save customToolTip
        this._subscribers_open_custom_tooltip = {}; //subscribers for opening the tooltip
        this._subscribers_close_custom_tooltip = {}; //subscribeers for closing the tooltip

        this._subscribers_filterObject = {};
        this._accountList = {};
        this._subscribers_accountList = {};
        this._keyColumnName = {};
        this._listTypeColumns = {};
        this._passedOriginalList = {};
        this._processedDataList = {}; //used to save and then give external app to fetch the processed data from here

        this._highlightedRows = {}; //used to save highlighted rows, passed by external

        this._numPerPage = {};

        //we have two attributes here, one is for subsribers, one is for data
        this._susbcribers_bigcolumn_data = {};
        this._bigcolumn_options_data = {};

    }

    //retrieve data directly
    getBigColumnAutoCompleteData(appId, columnId){
        if( !(appId in this._bigcolumn_options_data)){
            this._bigcolumn_options_data[appId] = {};
        }
        if( !(columnId in this._bigcolumn_options_data[appId])){
            this._bigcolumn_options_data[appId][columnId] = {};
        }
        return this._bigcolumn_options_data[appId][columnId];
    }

    //subscribe to the data, this usually happened when data not there yet
    //logic please refer to Mixin.jsx from auto_complete component
    subscribeToBigColumnAutoCompleteData(appId, columnId, cb){
        if( !(appId in this._susbcribers_bigcolumn_data)){
            this._susbcribers_bigcolumn_data[appId] = {};
        }
        if( !(columnId in this._susbcribers_bigcolumn_data[appId])){
            this._susbcribers_bigcolumn_data[appId][columnId] = {};
        }
        this._susbcribers_bigcolumn_data[appId][columnId] = cb;
    }

    setBigColumnAutoCompleteData(appId, columnId, data){
        //first, we check subscribers, if subscribers is there already
        //that means auto complete component is rendered already, then we have to use call back here
        if(appId in this._susbcribers_bigcolumn_data && columnId in this._susbcribers_bigcolumn_data[appId]){
            this._susbcribers_bigcolumn_data[appId][columnId](data);
        } else {
            //otherwise, we keep the data in memory, waiting to be called and used directly here
            if( !(appId in this._bigcolumn_options_data)){
                this._bigcolumn_options_data[appId] = {};
            }
            if( !(columnId in this._bigcolumn_options_data[appId])){
                this._bigcolumn_options_data[appId][columnId] = {};
            }
            this._bigcolumn_options_data[appId][columnId] = data;
        }
    }

    unsubscribeAllFor( appId ) {
        delete this._subscribers_accountList[appId];
        delete this._subscribers_dataList[appId];
        delete this._subscribers_config[appId];
        delete this._subscribers_column_config[appId];
        delete this._subscribers_grandTotal[appId];
        delete this._subscribers_coustomer_config[appId];
        delete this._subscribers_extra_data[appId];
        delete this._subscribers_extra_data_update[appId];
        delete this._subscribers_filterObject[appId];
        delete this._subscribers_highlightedRows[appId];
        delete this._subscribers_open_custom_tooltip[appId];
        delete this._subscribers_close_custom_tooltip[appId];
        delete this._susbcribers_bigcolumn_data[appId];
        delete this._bigcolumn_options_data[appId];
    }

    cleanAllFor( appId ) {
        this.unsubscribeAllFor( appId );
        delete this._dataList[appId];
        delete this._config[appId];
        delete this._availableColumns[appId];
        delete this._customConfiguration[appId];
        delete this._selectedColumns[appId];
        delete this._availableConfigs[appId];
        delete this._colWidths[appId];
        delete this._baseFilters[appId];
        delete this._extraData[appId];
        delete this._additionalConfig[appId];
        delete this._accountList[appId];
        delete this._passedOriginalList[appId];
        delete this._processedDataList[appId];
        delete this._customToolTip[appId];
    }

    resetCustomConfigFor(appId){
      delete this._customConfiguration[appId];
    }

    //detecting if the pre-saved config is empty or not, this is causing a very werid situation
    //for some table, if user did not orderthe column, then the orderedKey is empty, in this case
    //if we just pass it back to _customConfiguration directly, it will overwrite the field to
    //empty, so when user re-order the columns, the result is empty.
    //by detecting here, we will ONLY overwriting the field value that is NOT empty
    setCustomerConfigForOne( appId, customConfig ) {

        this.initializeConfig( appId );

        if ( customConfig && 'orderedKeyList' in customConfig && customConfig.orderedKeyList.length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].orderedKeyList = customConfig.orderedKeyList;
        }
        if ( customConfig && 'frozenColumnKeyList' in customConfig && customConfig.frozenColumnKeyList.length >= 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].frozenColumnKeyList = customConfig.frozenColumnKeyList;
        }
        if ( customConfig && 'selectedColumnKeys' in customConfig && customConfig.selectedColumnKeys.length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].selectedColumnKeys = customConfig.selectedColumnKeys;
        }
        if ( customConfig && 'defaultSelectedAccountList' in customConfig && customConfig.defaultSelectedAccountList.length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].defaultSelectedAccountList = customConfig.defaultSelectedAccountList;
        } else {
            //if  there are no accoutns, we assign empty here
            this._customConfiguration[appId].defaultSelectedAccountList = [];
        }
        if ( customConfig && 'colWidths' in customConfig && Object.keys( customConfig.colWidths ).length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].colWidths = customConfig.colWidths;
            this._colWidths[appId] = customConfig.colWidths;
        } else {
            this._colWidths[appId] = {};
            this._customConfiguration[appId].colWidths = {};
        }
        if ( customConfig && 'sortModel' in customConfig && Object.keys( customConfig.sortModel ).length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].sortModel = customConfig.sortModel;
        }
        if ( customConfig && 'filterModel' in customConfig && Object.keys( customConfig.filterModel ).length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].filterModel = customConfig.filterModel;
        }
        if ( customConfig && 'timezone' in customConfig && Object.keys( customConfig.timezone ).length > 0 && appId in this._customConfiguration ) {
            this._customConfiguration[appId].timezone = customConfig.timezone;
        }
        if ( customConfig && 'systemDefault' in customConfig && appId in this._customConfiguration ) {
          this._customConfiguration[appId].systemDefault = customConfig.systemDefault;
        }else{
          this._customConfiguration[appId].systemDefault = false;
        }




        //after setting customerConfig, we need to restore initialHiddenField
        //only update if we do have this config to be true
        if ( appId in this._config && 'showingInitialHiddenWhenFiltering' in this._config[appId] && this._config[appId].showingInitialHiddenWhenFiltering && appId in this._customConfiguration ) {
            var hidden = true;
            //if we do have filerModel, then no need to hide
            //Updated on Sep 27, we need to skip accounts as filterModel, if there are ONLY accounts, we will treat is as NO filter.
            if ( Object.keys( this._customConfiguration[appId].filterModel ).length > 0 ) {
                if ( Object.keys( this._customConfiguration[appId].filterModel ).length === 1 & Object.keys( this._customConfiguration[appId].filterModel ).includes( 'accounts' ) )
                    hidden = false;
            }
            //resetting config setting here
            Object.keys( this._config[appId].columns ).forEach( function( key ) {
                if ( key in this._config[appId].columns && 'initialHidden' in this._config[appId].columns[key] ) {
                    this._config[appId].columns[key].initialHidden = hidden;
                }
            }.bind( this ) );
            //after we change this
            var currentOrderedKeyList = this._customConfiguration[appId].orderedKeyList;
            this._customConfiguration[appId].orderedKeyList = [];
            currentOrderedKeyList.forEach( function( key ) {
                if ( !( key in this._config[appId].columns && 'hidden' in this._config[appId].columns[key] && this._config[appId].columns[key].hidden === true ) &&
                    !( key in this._config[appId].columns && 'initialHidden' in this._config[appId].columns[key] && this._config[appId].columns[key].initialHidden === true )
                ) {
                    this._customConfiguration[appId].orderedKeyList.push( key );
                }
            }.bind( this ) );

            var currrentSelectedColumnKeys = this._customConfiguration[appId].selectedColumnKeys;
            this._customConfiguration[appId].selectedColumnKeys = [];
            currrentSelectedColumnKeys.forEach( function( key ) {
                if ( !( key in this._config[appId].columns && 'hidden' in this._config[appId].columns[key] && this._config[appId].columns[key].hidden === true ) &&
                    !( key in this._config[appId].columns && 'initialHidden' in this._config[appId].columns[key] && this._config[appId].columns[key].initialHidden === true )
                ) {
                    this._customConfiguration[appId].selectedColumnKeys.push( key );
                }
            }.bind( this ) );
        }
    }

    /**
     * used to change customer config on the fly
     * key is passed from SaveButtonConfig, line 200, we are changing config, but do not want to change default
     * Update on Feb.28th, adding enforcingAccounts parameter, if there are NO accounts,
     * we need to add it here, so that external api can get correct data
     */
    setCustomConfigFor( appId, customConfig, key, enforcingAccounts ) {

        //if no customConfig passed, then we need to use current available config to populate customer config
        //useful by timeZone select
        if ( customConfig == null || Object.keys( customConfig ).length == 0 ) {
            var availableConfigs = this.getAvailableConfigsFor( appId );
            Object.keys( availableConfigs ).forEach( key => {
                if ( availableConfigs[key].default === true )
                    customConfig = availableConfigs[key].value;
            })
        }

        if ( enforcingAccounts === true ) {
            customConfig = this.addingAccountsIntoCustomConfigurationFor( appId, customConfig );
        }

        //must pass cloned copy, otherwisw, updating customerConfig will also cause available configs to be updated
        this.setCustomerConfigForOne( appId, JSON.parse( JSON.stringify( customConfig ) ) );
        //now we need to change current setting here
        if ( key ) {
            Object.keys( this._availableConfigs[appId] ).forEach( function( k ) {
                if ( k === key ) {
                    this._availableConfigs[appId][k]['current'] = true;
                } else {
                    this._availableConfigs[appId][k]['current'] = false;
                }
            }.bind( this ) );
        }
        //once update customer configuration, we need to trigger callbacks
        this._subscribers_coustomer_config[this._appId].forEach( function( cb ) {
            cb( key );
        });
    }

    getColumnWidth( appId, key ) {
        this.initializeConfig( appId );
        //first, retrieve from tempary columWidth
        if ( key in this._colWidths[appId] ) {
            return this._colWidths[appId][key];
        } else {
            //if none exist, from custom configuration
            if ( key in this._customConfiguration[this._appId].colWidths ) {
                return this._customConfiguration[this._appId].colWidths[key];
            } else {
                if ( key == 'tableWidth' ) {
                    return null;
                } else {
                    //  console.log(this.config.columns[key], key);
                    if ( this.config.columns[key].width ) {
                        return this.config.columns[key].width;
                    } else {
                        return 100;
                    }
                }
            }
        }
    }

    getColumnMinWidth( appId, key ) {
        this.initializeConfig( appId );
        if ( key in this._customConfiguration[this._appId].colWidths ) {
            return this._customConfiguration[this._appId].colWidths[key];
        } else {
            if ( key == 'tableWidth' ) {
                return null;
            } else {
                //  console.log(this.config.columns[key].minWidth, key);
                if ( this.config.columns[key].minWidth ) {
                    return this.config.columns[key].minWidth;
                } else {
                    return 60;
                }
            }
        }
    }

    setColumnWidth( appId, key, width ) {
        this.initializeConfig( appId );
        //settting width to temp object for later compare purpose
        this._colWidths[appId][key] = width;
    }

    /**
     * The purpose for this method is to move the tempSaved colWidth into customConfiguraiton, so that it can be persisted
     */
    updateColumnWidthToCustomConfig( appId ) {
        this.initializeConfig( appId );
        Object.keys( this._colWidths[appId] ).forEach( key => {
            this._customConfiguration[appId].colWidths[key] = this._colWidths[appId][key];
        });
    }

    getSelectedColumnKeysFor( appId ) {
        this._appId = appId;
        return this.selectedColumnKeys;
    }

    /**
     * not returning original selectedColumnKey selectedColumnKey needs to be
     * sorted on user's reordering result
     *
     */
    get selectedColumnKeys() {

        this.initializeConfig( this._appId );
        // if there are NO orderedKeyList, that means, no reorder yet, then just
        // return original
        var columns = [];
        if ( this._customConfiguration[this._appId].orderedKeyList.length == 0 ) {
            columns = this._customConfiguration[this._appId].selectedColumnKeys;
        } else {
            // now there are orderedKeyList, we need to sort selecteKeyList
            // based on orderedKeyList order
            // looping orderedKeyList first, that is ALL the keys in order
            this._customConfiguration[this._appId].orderedKeyList.forEach( function( key ) {
                if ( this._customConfiguration[this._appId].selectedColumnKeys.includes( key ) )
                    columns.push( key );
            }.bind( this ) );
        }
        //if we added checkBox, we then always need to include here
        if ( 'checkBoxEnabled' in this.config && this.config.checkBoxEnabled === true ) {
            columns.unshift( 'addedCheckBox' );
        }
        return columns;
    }

    setSelectedColumnKeys( list, appId ) {
        this.initializeConfig( appId );
        this._customConfiguration[appId].selectedColumnKeys = list;
        this.fakeColumnWidthUpdate();
    }

    setDefaultSelectedAccountList( list, appId ) {
        this.initializeConfig( appId );
        this._customConfiguration[appId].defaultSelectedAccountList = list;
        this.fakeColumnWidthUpdate();
    }
    //this one is used for detecting purpose, as columns change is very difficult to detect based on hiding/initialHidding etc, so we fake the columnWidth for this one
    fakeColumnWidthUpdate() {
        var colWidths = JSON.parse( JSON.stringify( this._customConfiguration[this._appId].colWidths ) );
        if ( 'fake' in colWidths ) {
            this._colWidths[this._appId].fake = this._colWidths[this._appId].fake + 1;
            colWidths.fake = colWidths.fake + 1;
        } else {
            this._colWidths[this._appId]['fake'] = 0;
            colWidths['fake'] = 0;
        }
        this._customConfiguration[this._appId].colWidths = colWidths;
    }

    set availableColumns( columns ) {
        this.initializeConfig( this._appId );
        this._availableColumns[this._appId] = columns;
    }

    /**
     * we need to sort the available columns here reason to put here is if we
     * put in swap function, there might not be the column list yet, or when we
     * restore from memory there is no columnList yet, so the safest position is
     * to implement in the getter
     */
    get availableColumns() {
        var availableColumns = {};
        if ( this._customConfiguration[this._appId].orderedKeyList.length > 0 ) {
            // if there is already orderedKeyList setting, we need to change
            // order of the columns based on the order of keyList
            this._customConfiguration[this._appId].orderedKeyList.forEach( function( key ) {
                // looping for each key in order
                Object.keys( this._availableColumns[this._appId] ).map( function( itemKey ) {
                    // and looping for each columns, here key should be the same
                    // as orderedKeyList item
                    if ( itemKey == key ) {
                        // assign to the columns object
                        availableColumns[key] = this._availableColumns[this._appId][itemKey];
                    }
                }.bind( this ) );
            }.bind( this ) );
            //for newly added column, let's check here
            //because user may have already saved configuration and we added new columns, so do a quick check here
            Object.keys( this.config.columns ).forEach( function( key ) {
                //here we must skip list type, as it is NOT included in the available columns for displaying purpose
                if ( !this._customConfiguration[this._appId].orderedKeyList.includes( key ) && this.config.columns[key].type !== 'list' ) {
                    availableColumns[key] = this._availableColumns[this._appId][key];
                }
            }.bind( this ) );
        } else {
            availableColumns = this._availableColumns[this._appId];
        }

        return JSON.parse( JSON.stringify( availableColumns ) );
    }

    /**
     * setter and getter of selectedColumns
     */
    set selectedColumns( columns ) {
        this.initializeConfig( this._appId );
        this._selectedColumns[this._appId] = columns;
    }

    get selectedColumns() {
        var selectedColumns = {};

        //first, let's decide if this is checkBoxEnabled, if so, we need to add teh column here
        if ( 'checkBoxEnabled' in this.config && this.config.checkBoxEnabled === true ) {
            selectedColumns['addedCheckBox'] = this.getCheckBoxColumnConfig();
        }

        //having to pause a little bit time here
        var now = new Date().getTime();
        while ( new Date().getTime() < now + 400 ) { /* do nothing */ }

        //if there are no selectedCoumnKeys
        if ( this._customConfiguration[this._appId].selectedColumnKeys.length == 0 ) {
            // update here
            // if we have already pre-saved selectedColumnKeys in storage, then do
            // not use default, otherwise, let's retrieve from localStorage data and
            // populate here
            var keys = Object.keys( this.config.columns );
            keys.forEach( function( key ) {
                if ( key in this._config[this._appId].columns && 'defaultColumn' in this._config[this._appId].columns[key] ) {
                    if ( this._config[this._appId].columns[key]['defaultColumn'] ) {
                        if ( 'hidden' in this._config[this._appId].columns[key] && this._config[this._appId].columns[key].hidden === true ||
                            'initialHidden' in this._config[this._appId].columns[key] && this._config[this._appId].columns[key].initialHidden === true
                        ) {
                            //this is hidden field, no show
                        } else
                            selectedColumns[key] = this._config[this._appId].columns[key];
                    }
                }
            }.bind( this ) );
        } else {
            //updated here to set selectedColumns to be in sync with orderedKeyKey
            var customConfig = this.customConfiguration;
            customConfig.orderedKeyList.forEach( function( key ) {
                if ( customConfig.selectedColumnKeys.includes( key ) ) {
                    if ( key in this.config.columns && 'hidden' in this.config.columns[key] && this.config.columns[key].hidden === true ) {
                        //this is hidden field, no show
                    } else
                        selectedColumns[key] = this.config.columns[key];
                }
            }.bind( this ) );
        }

        return JSON.parse( JSON.stringify( selectedColumns ) );
    }

    /**
     * Some columns are hidden, such as accontId, accountName, if config.hidden==true, then do not show
     */
    get availableVisibleColumns() {
        var availableVisibleColumns = {};
        //first getting all available columns
        var availableColumns = this.availableColumns;
        Object.keys( availableColumns ).map( function( itemKey ) {
            if (  itemKey in this.config.columns && 'hidden' in this.config.columns[itemKey] && this.config.columns[itemKey].hidden === true ||
                'initialHidden' in this.config.columns[itemKey] && this.config.columns[itemKey].initialHidden === true
            ) {
                //this is hidden column, skip
            } else {
                availableVisibleColumns[itemKey] = availableColumns[itemKey];
            }
        }.bind( this ) );
        return JSON.parse( JSON.stringify( availableVisibleColumns ) );
    }

    /**
     * availableColumns is already only showing non-hidden, but we do want to show all filterable columns
     * so it will be in filter
     */
    get availableFilterableColumns() {
        var columns = {};
        Object.keys( this.config.columns ).map( function( key ) {
            if ( this.config.columns[key].filterable )
                columns[key] = this.config.columns[key];
        }.bind( this ) );
        return JSON.parse( JSON.stringify( columns ) );
    }

    setDataListFor( appId, list ) {
        this._appId = appId;
        this.dataList = list;
    }

    setDataListForFromEditing( appId, list ) {
        this.editing = true;
        this._appId = appId;
        this.dataList = list;
    }


    getConfigFor( appId ) {
        this.initializeConfig( appId );
        return this.config;
    }

    set customConfiguration( config ) {
        // after setting, we need to initialize it
        this.initializeConfig( this._appId );
        this._customConfiguration[this._appId] = config;
    }

    get customConfiguration() {
        this.initializeConfig( this._appId );
        return this._customConfiguration[this._appId];
    }

    getCustomConfigurationFor( appId ) {
        this.initializeConfig( appId );
        return this.customConfiguration;
    }

    //get all the customer configuration for saving purpose
    get allCustomConfigurations() {
        return this._customConfiguration;
    }
    //this is to set all the customerConfiguration, for all the apps
    set allCustomConfigurations( config ) {
        Object.keys( config ).map( appId => {
            this.setCustomerConfigForOne( appId, config[appId] );
        });
    }

    //used to generate default option, we must give some pre-selected fields, otherwise, column sort failed
    getDefaultCustomConfigFor( appId ) {
        var orderedKeyList = [];
        var selectedColumnKeys = [];
        Object.keys( this._config[appId].columns ).forEach( key => {
            orderedKeyList.push( key );
            if ( 'defaultColumn' in this._config[appId].columns[key] && this._config[appId].columns[key].defaultColumn )
                selectedColumnKeys.push( key );
        });
        return {
            orderedKeyList: orderedKeyList,
            selectedColumnKeys: selectedColumnKeys,
            sortModel: {},
            filterModel: JSON.parse( JSON.stringify( this.getBaseFilterFor( appId ) ) ),
            //adding accountlist here as that is appId specific field
            defaultSelectedAccountList: [],
            colWidths: {},
            timezone: this.config.defaultTimeZone || "PST",
            frozenColumnKeyList: [],
            systemDefault: true
        }
    }

    set availableConfigs( configs ) {
        //set the default option here
        //having to check if default is already set, if none, this is first time setting, otherwise, we need to skip it
        //otherwise, state will be out of control
        if ( !( 'default' in this._availableConfigs[this._appId] ) ) {
            this._availableConfigs[this._appId]['default'] = { value: this.getDefaultCustomConfigFor( this._appId ), default: false, current: false };
        }

        var defaultKey = "";
        var havingDefault = false;
        var _this = this;
        Object.keys( configs ).map( key => {
            //at this step, we need to modify orderedKeyList as user may have changed the config already

            var orderedKeyList = configs[key].value.orderedKeyList;
            var currentConfigColumnKeys = Object.keys(_this.config.columns);
            currentConfigColumnKeys.forEach(key=>{
                if(orderedKeyList.indexOf(key)==-1){
                    orderedKeyList.push(key);
                }
            });
            configs[key].value.orderedKeyList = orderedKeyList;

            this._availableConfigs[this._appId][key] = configs[key];
            if ( configs[key].default ) {
                havingDefault = true;
                defaultKey = key;
                //no need to change the current flag if this is just change default, used by saveButtonConfig=>setDefaultConfigOnlyFor
                if ( _this.setDefaultConfigOnly !== true ) {
                    configs[key]['current'] = true;
                }
            } else {
                if ( _this.setDefaultConfigOnly !== true ) {
                    configs[key]['current'] = false;
                }
            }
        });
        if ( !havingDefault ) {
            this._availableConfigs[this._appId]['default']['default'] = true;
            if ( this.setDefaultConfigOnly !== true )
                this._availableConfigs[this._appId]['default']['current'] = true;
            defaultKey = 'default';
        }
        //let's set default key
        this.setDefaultKeyFor( this._appId, defaultKey );
    }

    get availableConfigs() {
        return this._availableConfigs[this._appId];
    }

    setAvailableConfigsFor( appId, configs ) {
        this._availableConfigs[appId] = {};
        this.initializeConfig( appId );
        this.availableConfigs = configs;
    }

    setAvailableConfigsNoCurrentChangeFor( appId, configs ) {
        this.setDefaultConfigOnly = true;
        this.availableConfigs = configs;
        this.setDefaultConfigOnly = false;
    }

    getAvailableConfigsFor( appId ) {
        this.initializeConfig( appId );
        return this.availableConfigs;
    }

    setDefaultKeyFor( appId, key ) {
        this.initializeConfig( appId );
        this.defaultKey = key;
    }

    getCurrentKeyFor( appId ) {
        var key = "default";
        Object.keys( this.getAvailableConfigsFor( appId ) ).forEach( function( k ) {
            if ( this._availableConfigs[appId][k].current ) {
                key = k;
            }
        }.bind( this ) );
        return key;
    }

    getDefaultKeyFor( appId ) {
        this.initializeConfig( appId );
        return this.defaultKey;
    }

    set defaultKey( key ) {
        this._defaultConfigKeys[this._appId] = key;
    }

    get defaultKey() {
        return this._defaultConfigKeys[this._appId];
    }

    /**
     * Function to set default configuration, there is only one default, so we need to reset all others to false
     */
    setDefaultConfigFor( appId, name ) {
        var avalableConfigs = this.getAvailableConfigsFor( appId );
        Object.keys( avalableConfigs ).map( key => {
            if ( key === name ) {
                avalableConfigs[key].default = true;
            } else {
                avalableConfigs[key].default = false;
            }
        });
        //setting default config key here
        this._defaultConfigKeys[appId] = name;
        this.setAvailableConfigsFor( appId, avalableConfigs );
    }

    setCurrentConfigFor( appId, name ) {
        var avalableConfigs = this.getAvailableConfigsFor( appId );
        Object.keys( avalableConfigs ).map( key => {
            if ( key === name ) {
                avalableConfigs[key].current = true;
            } else {
                avalableConfigs[key].current = false;
            }
        });
        this.setDefaultConfigOnly = true;
        this.setAvailableConfigsFor( appId, avalableConfigs );
        this.setDefaultConfigOnly = false;
    }

    /**
     * Here we do NOT want to change 'current' setting for each config, only the default setting is changed
     */
    setDefaultConfigOnlyFor( appId, name ) {
        this.setDefaultConfigOnly = true;
        this.setDefaultConfigFor( appId, name );
        this.setDefaultConfigOnly = false;
    }


    set baseFilters( filterObj ) {
        this._baseFilters[this._appId] = filterObj;
    }
    get baseFilters() {
        return this._baseFilters[this._appId];
    }
    setFilterObjectFor( appId, filterObj ) {
        this._customConfiguration[appId]['filterModel'] = filterObj;
        this._subscribers_filterObject[appId].forEach( function( cb ) {
            cb( filterObj );
        });
    }
    subscribeToFilterObject( subscriber ) {
        this._subscribers_filterObject[this._appId].push( subscriber );
    }


    setBaseFilterFor( appId, filterObj ) {
        this.initializeConfig( appId );
        this.baseFilters = filterObj;

        //assign baseFilter to fitlerModel
        Object.keys( filterObj ).forEach( key => {
            this._customConfiguration[appId]['filterModel'][key] = filterObj[key];
        });

        //now, we need to force the config for the column of filter to be not filterable
        /*Object.keys(filterObj).forEach(key => {
          if(key in this._config[appId].columns)
            this._config[appId].columns[key]['filterable'] = false;
        });
        */
    }
    getBaseFilterFor( appId, fromReset ) {
        this.initializeConfig( appId );
        //combining the selected accounts here
        var accounts = null;
        var noAccountTab = "noAccountTab" in this.config ? this.config.noAccountTab : false;
        if (!noAccountTab) {
            accounts = JSON.parse(JSON.stringify(this.accountList));
        }
        var baseFilters = JSON.parse( JSON.stringify( this.baseFilters ) );
        if ( fromReset ) {
            if (accounts != null &&  accounts.length > 0 ) {
                var ids = [];
                var tmp = [];
                accounts.map( function( item ) {
                    ids.push( item.uuid );
                });
                baseFilters["accountId"] = {
                    comp: "in",
                    value1: ids
                };
            }
        }

        return baseFilters;
    }

    getAccountIds() {
        var accounts = JSON.parse( JSON.stringify( this.accountList ) );
        var ids = [];
        if (accounts && accounts.length > 0 )
            accounts.map( function( item ) {
                ids.push( item.uuid );
            });
        return ids;
    }

    set grandTotalRecords( num ) {
        this._grandTotalRecords = num;
        // once set total number, we need to trigger the callback here
        this._subscribers_grandTotal[this._appId].forEach( function( cb ) {
            cb( num );
        });
    }

    setGrandTotalRecordsFor( appId, num ) {
        this._appId = appId;
        this.grandTotalRecords = num;
    }

    get grandTotalRecords() {
        return this._grandTotalRecords;
    }

    setExtraData( appId, data ) {
        this._appId = appId;
        this._extraData[this._appId] = data;
        this._subscribers_extra_data[appId].forEach( function( cb ) {
            cb( data );
        });
    }

    setExtraDataUpdate( appId, data, type ) {
        this._appId = appId;
        this._extraData[this._appId] = data;
        this._subscribers_extra_data_update[appId].forEach( function( cb ) {
            cb( data , type);
        });
    }

    setOpenCustomToolTip(appId, data){
        this._appId = appId;
        this._customToolTip[this._appId] = data;
        this._subscribers_open_custom_tooltip[appId].forEach( function(cb){
            cb( data );
        });
    }

    setCloseCustomToolTip(appId){
        this._appId = appId;
        this._subscribers_close_custom_tooltip[appId].forEach( function(cb){
            cb();
        });
    }

    getExtraDataFor( appId ) {
        return this._extraData[this._appId];
    }

    /**
     * setting appId will trigger customeConfig restoration And this appId is
     * set inside getInitialState() of dataTableMixin
     */
    set appId( appId ) {
        this._appId = appId;
        // after setting, we need to initialize it
        this.initializeConfig( appId );
    }
    get appId() {
        return this._appId;
    }

    set dataList( list ) {

        if ( !Array.isArray( list ) )
            return;

        this._passedOriginalList[this._appId] = list;
        // need to process list here, move list field onto primaryKey field
        var tmpList = [];
        var tmpObj = {};
        var obj = {};
        var total = 0;
        if ( list === undefined || list === null )
            list = [];

        if ( 'noDataProcessing' in this.config && this.config.noDataProcessing === true ) {
            tmpList = list;
        } else {

            // loop all the item
            for ( var i = 0; i < list.length; i++ ) {
                tmpObj = {};
                // loop all the keys
                if ( list[i] )
                    for ( var j = 0; j < Object.keys( list[i] ).length; j++ ) {
                        var key = Object.keys( list[i] )[j];
                        if ( key == this._keyColumnName[this._appId] ) {
                            // if this is key columns
                            obj = {};
                            total = 0;
                            for ( var k = 0; k < this._listTypeColumns[this._appId].length; k++ ) {
                                var listColumnKey = this._listTypeColumns[this._appId][k];
                                var columnConfig = this.config.columns[listColumnKey];
                                var subKeysArray = Object.keys( list[i][listColumnKey] );
                                for ( var l = 0; l < subKeysArray.length; l++ ) {
                                    var childrenElements = list[i][listColumnKey][subKeysArray[l]] ? list[i][listColumnKey][subKeysArray[l]].split( ',' ) : [];
                                    var childrenList = [];
                                    var link = null;

                                    childrenElements.forEach( function( item ) {
                                        if ( subKeysArray[l] == 'prIds' ) {
                                            link = ( 'prSearchLink' in this.config ? this.config.prSearchLink : '' ) + escape( item );
                                        }
                                        if ( subKeysArray[l] == 'kbIds' ) {
                                            link = ( 'kbSearchLink' in this.config ? this.config.kbSearchLink : '' ) + escape( item );
                                        }
                                        childrenList.push( {
                                            title: item,
                                            link: link
                                        });
                                    }.bind( this ) );
                                    obj[subKeysArray[l]] = {
                                        children: childrenList,
                                        config: this.config.columns[listColumnKey].children[subKeysArray[l]]
                                    };
                                    total += obj[subKeysArray[l]].children.length;
                                }
                            }

                            //special requirement for srId, case-table, we need to link it to caseManager
                            var link = null;
                            //special reqirement for contractId
                            var disableLink = false;

                            if ( key == 'srId' && !this.config.columns[key].sendClickToParent ) {
                                link = this.config.caseManagerLink + '/cmdetails/' + list[i][key];
                            }
                            if ( key == 'kbId' ) {
                                link = ( 'kbSearchLink' in this.config ? this.config.kbSearchLink : '' ) + escape( list[i][key].substring( 0, 2 ) != 'KB' ? 'KB' + list[i][key] : list[i][key] );
                            }
                            if ( key == 'prId' ) {
                                link = ( 'prSearchLink' in this.config ? this.config.prSearchLink : '' ) + escape( list[i][key] );
                            }
                            //detect if contractId has child items
                            if ( key == 'contractId' && list[i]['hasLineItems'] == false ) {
                                disableLink = true;
                            }
                            // special requirement for 'contractID' flag from /ibase api
                            if ( key == 'serialNumber' && list[i]['contractID'] ) {
                                link = list[i]['serialNumber'];
                            }
                            //special requirement for 'isIbParent' flag from /ibase api
                            var ibParents = null;
                            // var parentSerialNumber = null;
                            if ( key == 'serialNumber' ) {
                                ibParents = false;
                                if ( list[i].hasOwnProperty( 'isIbParent' ) && list[i]['isIbParent'] ) {
                                    ibParents = true;
                                }
                            }

                            tmpObj[key] = {
                                key: true,
                                value: list[i][key],
                                disableLink: disableLink,
                                ibParents: ibParents,
                                link: link, //adding link to each object, so that we can link it in UI
                                children: obj,
                                totalChildren: total
                            };
                        } else {
                            if ( !this._listTypeColumns[this._appId].includes( key ) ) {
                                tmpObj[key] = {
                                    key: false,
                                    value: list[i][key]
                                };
                            }
                        }
                    }
                //now we need to check if any field not existing in api, but in configuration
                //loop all the config column keys, compare with keys of this object, and then set it up
                Object.keys( this.config.columns ).map( function( key ) {
                    if ( !Object.keys( tmpObj ).includes( key ) )
                        tmpObj[key] = {
                            key: false,
                            value: ''
                        };
                }
                );
                
                if(list[i].checked){
                    tmpObj['checked'] = list[i].checked;
                }else{
                    //  this.getCurrentCheckedStatusFor(this._appId, list[i][this._keyColumnName[this._appId]]);
                    //give checked to default - false for all records
                    tmpObj['checked'] = this.getCurrentCheckedStatusFor( this._appId, list[i][this._keyColumnName[this._appId]] ); // false;
                }
                
                tmpList.push( tmpObj );
            }
        }

        // need to process list here, move list field onto primaryKey field
        this._dataList[this._appId] = tmpList;
        //we only want to dispatch event for a certain app instance
        this._subscribers_dataList[this._appId].forEach( function( cb ) {
            cb( tmpList, this.editing );
            this.editing = false;
        }.bind(this));
        //whenever we processed data, we need to assign to the copy as below
        this.processedDataList = tmpList;
    }

    /**
     * logic for controlling checked or not
     */
    setCheckStatusForAll( appId, checked ) {
        this._appId = appId;
        this._dataList[appId].forEach( function( item ) {
            if(!(item.disabledCheckbox && item.disabledCheckbox.value)){
                item.checked = checked;
            }
        });
    }
    setCheckStatusForOne( appId, object, checked ) {
        this._appId = appId;
        this._dataList[appId].forEach( function( item ) {
            var tmp1 = item[this._keyColumnName[appId]].value;
            var tmp2 = object[this._keyColumnName[appId]].value;
            if ( tmp1 === tmp2 ) {
                item.checked = checked;
            }
        }.bind( this ) );
    }

    getCurrentCheckedStatusFor( appId, keyVal ) {
        var bChecked = false;
        for ( var i = 0; i < this._dataList[appId].length; i++ ) {
            if ( this._dataList[appId][i][this._keyColumnName[appId]].value === keyVal ) {
                bChecked = this._dataList[appId][i].checked === true ? true : false;
                break;
            }
        }
        return bChecked;
    }

    /**
     * return all the selected rows to the user
     */
    getCheckedRowsFor( appId ) {
        var rows = [];
        //here, we need to follow the sorted/filtered result, no need to give original data
        this.processedDataList.forEach( function( item ) {
            for ( var i = 0; i < this._dataList[appId].length; i++ ) {
                if ( item[this._keyColumnName[appId]].value === this._dataList[appId][i][this._keyColumnName[appId]].value
                    && this._dataList[appId][i].checked
                ) {
                    rows.push( this._convertData( item ) );
                    break;
                }
            }
        }.bind( this ) );
        return rows;
    }

    _convertData( object ) {
        var obj = {};
        Object.keys( object ).map( key => {
            if ( key !== 'addedCheckBox' && key !== 'checked' )
                obj[key] = object[key].value;
        });
        return obj;
    }

    /**
     * get all the numbers for selected rows
     */
    getCheckedRowsCountFor( appId ) {
        var count = 0;
        this._dataList[appId].forEach( function( item ) {
            if ( item.checked )
                count++;
        });
        return count;
    }

    setAdditionalConfigFor( appId, childId, config ) {
        this._additionalConfig[appId] = {};
        this._additionalConfig[appId][childId] = config;
    }

    getAdditionalConfigFor( appId, childId ) {
        return this._additionalConfig[appId][childId];
    }
    set config( config ) {
        var _self = this;
        Object.keys( config.columns ).map(( key, i ) => {
            if ( 'key' in config.columns[key] && config.columns[key].key )
                _self._keyColumnName[_self._appId] = key;
            if ( config.columns[key]['type'] == 'list' ) {
                _self._listTypeColumns[_self._appId].push( key );
            } else {
                // skip list type as availableColumns, for column chooser
                _self._availableColumns[_self._appId][key] = config.columns[key];
                // we need to save keys into a list, for the purpose of column reordering
                //also here we need to skip the hidden columns
                if ( !( key in config.columns && 'hidden' in config.columns[key] && config.columns[key].hidden === true ) &&
                    !( 'initialHidden' in config.columns[key] && config.columns[key].initialHidden === true )
                ) {
                    _self._customConfiguration[_self._appId]['orderedKeyList'].push( key );
                    // also put by default the selected columns
                    if ( config.columns[key].defaultColumn ) {
                        if ( _self._appId )
                            _self._customConfiguration[_self._appId]['selectedColumnKeys'].push( key );
                    }
                }
            }
        });
        //first, let's decide if this is checkBoxEnabled, if so, we need to add teh column here
        if ( 'checkBoxEnabled' in config && config.checkBoxEnabled === true ) {
            config.columns['addedCheckBox'] = this.getCheckBoxColumnConfig();
        }

        this._config[this._appId] = config;
        this._subscribers_config[this._appId].forEach( function( cb ) {
            cb( config, this._appId );
        }.bind( this ) );
    }

    updateConfigInitialHidden( visible ) {
        //if having baseFilters, we then always force showing it
        var currentConfig = JSON.parse( JSON.stringify( this.config ) );
        var filterModel = this.customConfiguration.filterModel;

        //let's detect if customFilter only contains the initialHidden fields or not
        var headerFilersOnly = true;
        Object.keys( filterModel ).forEach( key => {
            if ( key !== 'accountId'  && currentConfig.columns[key])
                headerFilersOnly = headerFilersOnly && !( "initialHidden" in currentConfig.columns[key] );
            //this is a little hack, DO NOT set initialHidden for none-header item at all so that we can use this to detect if this is header or not
            //the value of initialHidden is always changing, so if we set initial hidden on header item,  then screw up
            //                headerFilersOnly = headerFilersOnly && ( "initialHidden" in currentConfig.columns[key] && currentConfig.columns[key].initialHidden === false
            //                    || !( "initialHidden" in currentConfig.columns[key] ) );
        });

        //If this is for filtering show purpose, used by contract/contractItem table
        if ( 'showingInitialHiddenWhenFiltering' in currentConfig && currentConfig.showingInitialHiddenWhenFiltering ) {
            Object.keys( currentConfig.columns ).forEach( function( key ) {
                //if this is non-visible, we always hide them
                if ( visible === true ) { //visible==true means we want to hide it
                    if ( currentConfig.columns[key] && "initialHidden" in currentConfig.columns[key] )
                        currentConfig.columns[key].initialHidden = visible;
                } else {
                    //if this is to display, we need to show depending on the filter
                    //if user filters include fields other than the header items , we change its visibility
                    if ( currentConfig.columns[key] && "initialHidden" in currentConfig.columns[key] ) {
                        if ( !headerFilersOnly ) { //if include more than headers only, we need to show
                            currentConfig.columns[key].initialHidden = false;
                        } else { //if header filter only, we need to hide
                            currentConfig.columns[key].initialHidden = true;
                        }
                    }
                }
            });

            //better reset configSettings as config has changed already
            this._listTypeColumns[this._appId] = [];
            this._availableColumns[this._appId] = {};
            this._customConfiguration[this._appId]['orderedKeyList'] = [];
            //remove this as it is influence initial checking to detect if user selected any columns
            //this._customConfiguration[this._appId]['selectedColumnKeys'] = [];
            this.config = currentConfig;

        }

    }

    initializeConfig( appId ) {



        /**
         * Update: As this object is singleton, it is possible that multiple tables exsits together
         * so we have to use appId as key, so that there is NO influence between each table instance
         *
         * this variable is used to save user's customized configuration, it
         * includes all the info 1. orderedKeyList 2. selectedColumnKeys 3.
         * sortModel 4. filterModel These must be the same as api request
         * format, so that we can easily perform in-app save and out-app save
         */

        if ( appId ) {

            this._appId = appId;

            if ( !( appId in this._numPerPage ) ) {
                this._numPerPage[appId] = 10;
            }

            if ( !( appId in this._accountList ) ) {
                this._accountList[appId] = [];
            }

            if ( !( appId in this._subscribers_accountList ) ) {
                this._subscribers_accountList[appId] = [];
            }

            if ( !( appId in this._keyColumnName ) ) {
                this._keyColumnName[appId] = "";
            }

            if ( !( appId in this._listTypeColumns ) ) {
                this._listTypeColumns[appId] = [];
            }

            if ( !( appId in this._passedOriginalList ) ) {
                this._passedOriginalList[appId] = {};
            }

            if ( !( appId in this._processedDataList ) )
                this._processedDataList[appId] = {};

            //initialize highlighted rows, by default, no highlighted rows
            if ( !( appId in this._highlightedRows ) )
                this._highlightedRows[appId] = [];

            //need different configKeys for different appId
            if ( !( appId in this._defaultConfigKeys ) ) {
                this._defaultConfigKeys[appId] = "";
            }

            //need different dataList with appId
            if ( !( appId in this._dataList ) ) {
                this._dataList[appId] = [];
            }
            //need to have config for different appId
            if ( !( appId in this._config ) ) {
                this._config[appId] = {};
            }

            if ( !( appId in this._customConfiguration ) ) {
                this._customConfiguration[appId] = {};
            }

            //we are also doing subscriber, as subscriber may listen to different appId
            if ( !( appId in this._subscribers_dataList ) )
                this._subscribers_dataList[appId] = [];

            //we are also doing subscriber, as subscriber may listen to different appId
            if ( !( appId in this._subscribers_config ) )
                this._subscribers_config[appId] = [];

            if ( !( appId in this._subscribers_column_config ) )
                this._subscribers_column_config[appId] = [];

            if ( !( appId in this._subscribers_coustomer_config ) )
                this._subscribers_coustomer_config[appId] = [];

            if ( !( appId in this._subscribers_highlightedRows ) )
                this._subscribers_highlightedRows[appId] = [];


            //we are also doing subscriber, as subscriber may listen to different appId
            if ( !( appId in this._subscribers_grandTotal ) )
                this._subscribers_grandTotal[appId] = [];

            if ( !( appId in this._availableColumns ) )
                this._availableColumns[appId] = {};

            //used to save selectedColumns
            if ( !( appId in this._selectedColumns ) )
                this._selectedColumns[appId] = {};

            if ( !( appId in this._availableConfigs ) )
                this._availableConfigs[appId] = {};

            //initiate colWidth object
            if ( !( appId in this._colWidths ) )
                this._colWidths[appId] = {};

            //initiate base filters
            if ( !( appId in this._baseFilters ) )
                this._baseFilters[appId] = {};

            if ( !( appId in this._subscribers_extra_data ) )
                this._subscribers_extra_data[appId] = [];

            if ( !( appId in this._subscribers_extra_data_update ) )
                this._subscribers_extra_data_update[appId] = [];

            if ( !( appId in this._extraData ) )
                this._extraData[appId] = null;

            if ( !( appId in this._customToolTip ) )
                this._customToolTip[appId] = null;

            if ( !( appId in this._subscribers_open_custom_tooltip ) )
                this._subscribers_open_custom_tooltip[appId] = [];

            if ( !( appId in this._subscribers_close_custom_tooltip ) )
                this._subscribers_close_custom_tooltip[appId] = [];


            if ( !( appId in this._additionalConfig ) )
                this._additionalConfig[appId] = {};

            if ( !( appId in this._subscribers_filterObject ) )
                this._subscribers_filterObject[appId] = [];

            if ( Object.keys( this._customConfiguration[appId] ).length == 0 )
                //if config does not exist, let's initialize them
                this._customConfiguration[appId] = {
                    orderedKeyList: [],
                    selectedColumnKeys: [],
                    sortModel: {},
                    filterModel: {},
                    //adding accountlist here as that is appId specific field
                    defaultSelectedAccountList: [],
                    colWidths: {},
                    frozenColumnKeyList: []
                };
        }
    }

    isRowHighlighted( appId, index ) {
        if ( this._dataList[appId].length > 0 ) {
            return this._highlightedRows[appId].includes( this._dataList[appId][index][this._keyColumnName[appId]].value );
        } else {
            return false;
        }
    }

    setHighlightedRows( appId, rows ) {
        this.initializeConfig( appId );
        this._highlightedRows[appId] = rows;
        this._subscribers_highlightedRows[this._appId].forEach( function( cb ) {
            cb();
        });
    }

    getHighlightedRowsFor( appId ) {
        return this._highlightedRows[appId];
    }

    setNumPerPageFor( appId, num ) {
        this.initializeConfig( appId );
        this._numPerPage[appId] = num;
    }

    getNumPerPageFor( appId ) {
        this.initializeConfig( appId );
        return this._numPerPage[appId];
    }

    set processedDataList( list ) {
        this._processedDataList[this._appId] = JSON.parse( JSON.stringify( list ) );
    }

    get processedDataList() {
        return this._processedDataList[this._appId];
    }

    setProcessedDataListFor( appId, list ) {
        this._appId = appId;
        this.processedDataList = list;
    }
    getProcessedDataListFor( appId ) {
        this._appId = appId;
        var rows = [];
        //here, we need to follow the sorted/filtered result, no need to give original data
        this.processedDataList.forEach( function( item ) {
            rows.push( this._convertData( item ) );
        }.bind( this ) );
        // if (rows.length == 0) {
        //    this._dataList[appId].forEach(function(item) {
        //       rows.push(this._convertData(item));
        //   }.bind(this));
        //  }
        return rows;
    }

    compareObject( obj1, obj2 ) {
        if ( Array.isArray( obj1 ) && Array.isArray( obj2 ) ) {
            var contains = true;
            obj1.forEach( item => {
                if ( !obj2.includes( item ) )
                    contains = false;
            });
            return contains;
        } else {
            for ( var p in obj1 ) {
                //Check property exists on both objects
                if ( obj1.hasOwnProperty( p ) !== obj2.hasOwnProperty( p ) ) return false;
                switch ( typeof ( obj1[p] ) ) {
                    //Deep compare objects
                    case 'object':
                        if ( !this.compareObject( obj1[p], obj2[p] ) ) return false;
                        break;
                    //Compare values
                    default:
                        if ( obj1[p] != obj2[p] ) return false;
                }
            }
            return true;
        }
    }

    //third parameter is unique to the requirement of expired contract table
    //which means when uer is searching,we need to hide location, when user reset, we need to show location
    setConfig( config, appId, fromExternalCallBack ) {

        if ( fromExternalCallBack ) {
          //keep original config passed by external app, because current config already has initialHidden changed, so can not be used to check if headerFilterOnly or not
          var originalConfig = JSON.parse( JSON.stringify( config ) );

          //this is again, only used by expired contract table, so we need to use own config
          //the reason is when filtering, we already changed initialHidden value, if we use external data directly,
          //the initialHidden value we changed will be overwritten.
          var currentConfig = this.config;
          var filterModel = this.customConfiguration.filterModel;

          }else{
              this.cleanAllFor( appId );
              this.resetCustomConfigFor(appId);
          }


        this.initializeConfig( appId );

        if ( fromExternalCallBack ) {

            //let's detect if customFilter only contains the initialHidden fields or not
            var headerFilersOnly = true;
            Object.keys( filterModel ).forEach( key => {
                if ( key !== 'accountId' )
                    headerFilersOnly = headerFilersOnly && ( originalConfig.columns[key] && "initialHidden" in originalConfig.columns[key] && originalConfig.columns[key].initialHidden === false
                        || !( originalConfig.columns[key] && "initialHidden" in originalConfig.columns[key] ) );
            });

            if ( 'showingInitialHiddenWhenFiltering' in currentConfig && currentConfig.showingInitialHiddenWhenFiltering ) {
                if ( this.compareObject( this._customConfiguration[appId]['filterModel'], this._baseFilters[appId] ) ) {
                    //this is only base, means it is reset
                    currentConfig.columns['locationName_locationAccId']['hidden'] = false;
                } else {
                    if ( !headerFilersOnly )
                        //this is search
                        currentConfig.columns['locationName_locationAccId']['hidden'] = true;
                    else
                        currentConfig.columns['locationName_locationAccId']['hidden'] = false; //we need to set it as in some senario, this hidden is already changed to true due to search, so we need to change it back
                }
            }

            this._listTypeColumns[this._appId] = [];
            this._availableColumns[this._appId] = {};
            this._customConfiguration[this._appId]['orderedKeyList'] = [];
            this._customConfiguration[this._appId]['selectedColumnKeys'] = [];
            this.config = currentConfig;
            require( '../flux/actions/DataTableActions' ).performCustomConfigurationChanged( this._appId,  fromExternalCallBack);
        } else {
            this.config = config;
        }
    }

    get dataList() {
        return this._dataList[this._appId];
    }
    get config() {
        return JSON.parse( JSON.stringify( this._config[this._appId] ) );
    }

    set accountList( list ) {
        this._accountList[this._appId] = list;
        this._subscribers_accountList[this._appId].forEach( function( cb ) {
            cb( list );
        });
    }

    setAccountListFor( appId, list ) {
        this._appId = appId;
        this.accountList = list;
    }

    get accountList() {
        return this._accountList[this._appId];
    }


    /**
     * Used by user to remove one record from dataList and let dataTable reflect the update
     */
    removeRecord( recordKeyValue ) {
        var index = 0;
        this._passedOriginalList[this._appId].forEach( item => {
            if ( this._keyColumnName[this._appId] in item && item[this._keyColumnName[this._appId]] === recordKeyValue ) {
                this._passedOriginalList[this._appId].splice( index, 1 );
            }
            index++;
        });
        this.dataList = this._passedOriginalList[this._appId];
    }

    removeRecordFor( appId, recordKeyValue ) {
        this._appId = appId;
        this.removeRecord( recordKeyValue );
    }

    get passedOriginalList() {
        return this._passedOriginalList[this._appId];
    }

    updateCellData( obj, field, newValue ) {
        var index = 0;
        this._passedOriginalList[this._appId].forEach( item => {
            if ( this._keyColumnName[this._appId] in item && this._keyColumnName[this._appId] in obj && item[this._keyColumnName[this._appId]] === obj[this._keyColumnName[this._appId]].value ) {
                this._passedOriginalList[this._appId][index][field] = newValue;
            }
            index++;
        });
        this.setDataListForFromEditing(this._appId, this._passedOriginalList[this._appId]);
    }

    updateCellDataFor( appId, obj, field, newValue ) {
        this._appId = appId;
        this.updateCellData( obj, field, newValue );
    }

    getCheckBoxColumnConfig() {
        return {
            width: 40,
            flexGrows: 0,
            id: "addedCheckBox",
            type: "addedCheckBox",
            resizable: false
        };
    }



    subscribeToAccountList( subscriber ) {
        this._subscribers_accountList[this._appId].push( subscriber );
    }

    resetSubscribers() {
        this._subscribers_config = {};
        this._subscribers_dataList = {};
        this._subscribers_grandTotal = {};
        this._subscribers_column_config = {};
        this._subscribers_coustomer_config = {};
        this._subscribers_extra_data = {};
        this._subscribers_extra_data_update = {};
        this._subscribers_highlightedRows = {};
        this._subscribers_open_custom_tooltip = {};
        this._subscribers_close_custom_tooltip = {};
    }

    /**
     * Calculate the total fitlers, logic here is to get rid of base filter (system filter) and not considering it as customFitler
     */
    getCustomFilterCountFor( appId ) {
        var count = 0;
        Object.keys( this._customConfiguration[appId].filterModel ).forEach( function( key ) {
            if ( 'allowAccountInFilterNumber' in this.getConfigFor( appId ) && this.getConfigFor( appId )['allowAccountInFilterNumber'] === true ) {
                if ( !this.isCustomFilterBaseFilter( appId, key ) ) {
                    count++;
                }
            } else {
                if ( key != 'accountId' && key != 'accountName' ) {
                    if ( !this.isCustomFilterBaseFilter( appId, key ) ) {
                        count++;
                    }
                }
            }



        }.bind( this ) );
        return count;
    }
    /**
     * checking to see if this customFilter is baseFilter(System Filter)
     */

    areTwoArrayEqual( array1, array2 ) {

        if ( !Array.isArray( array2 ) && array2.indexOf( '&&' ) > 0 ) {
            array2 = array2.split( '&&' );
        }
        //for large quantity, do not compare, as that is very bad in performance
        if(array1.length>5000) return array1.length === array2.length;

        var result = true;
        for ( var i = 0; i < array1.length; i++ ) {
            var found = false;
            for ( var j = 0; j < array2.length; j++ ) {
                if ( array1[i] === array2[j] ) {
                    found = true;
                    break;
                }
            }
            if ( !found ) {
                result = false;
                break;
            }
        }

        if ( result === false )
            return false;

        for ( var i = 0; i < array2.length; i++ ) {
            var found = false;
            for ( var j = 0; j < array1.length; j++ ) {
                if ( array2[i] === array1[j] ) {
                    found = true;
                    break;
                }
            }
            if ( !found ) {
                result = false;
                break;
            }
        }

        return result;
    }

    isCustomFilterBaseFilter( appId, key ) {
        var bBase = false;
        if ( key in this._baseFilters[appId] && key in this._customConfiguration[appId].filterModel ) {
            //need to detect array and compare it here
            if ( this._baseFilters[appId][key].value1 != null && Array.isArray( this._baseFilters[appId][key].value1 ) &&
                this._customConfiguration[appId].filterModel[key].value1 != null ) {
                bBase = this.areTwoArrayEqual( this._baseFilters[appId][key].value1, this._customConfiguration[appId].filterModel[key].value1 );
            }
            else {
                if ( 'value2' in this._baseFilters[appId][key] && this._baseFilters[appId][key].value2 != null && 'value1' in this._baseFilters[appId][key] && this._baseFilters[appId][key].value1 === this._customConfiguration[appId].filterModel[key].value1
                    && this._baseFilters[appId][key].value2 === this._customConfiguration[appId].filterModel[key].value2
                    || this._baseFilters[appId][key].value2 == null && this._baseFilters[appId][key].value1 === this._customConfiguration[appId].filterModel[key].value1
                ) {
                    bBase = true;
                }
            }
        }
        return bBase;
    }


    /**
     * saving/create sorter configuration up: true|false field: name of column
     */
    sortBy( appId, field, up ) {
        this._customConfiguration[appId].sortModel = {
            field: field,
            up: up
        };
    }

    appendBaseFiltersFor( appId ) {
        Object.keys( this.getBaseFilterFor( appId ) ).forEach( key => {
            this._customConfiguration[appId].filterModel[key] = JSON.parse( JSON.stringify( this.getBaseFilterFor( appId )[key] ) );
        });
    }

    /**
     * adding filter { key:{ comp:"in"|"bewteen"|"contains", value1: xxxx
     * value2: yyy } }
     */
    filter( appId, filterObj ) {
        //resetting current filters
        this._customConfiguration[appId].filterModel = {};
        Object.keys( filterObj ).map( function( passedKey ) {
            this._customConfiguration[appId].filterModel[passedKey] = filterObj[passedKey];
        }.bind( this ) );
    }

    /**
     * Needs to clear the filter and sorter
     */
    resetFilterSorter( appId ) {
        //resetting back to baseFilterModel
        //no need to prepopulate baseFilter here
        //this._customConfiguration[appId].filterModel = JSON.parse(JSON.stringify(this.getBaseFilterFor(appId)));

        //we need to keep filterModel for accout selection
        this._customConfiguration[appId].filterModel = {};
        if ( 'defaultSortField' in this._config[appId] && 'defaultSortOrder' in this._config[appId] ) {
            this._customConfiguration[appId].sortModel = {
                field: this._config[appId].defaultSortField,
                sort: this._config[appId].defaultSortOrder
            };

        } else {
            this._customConfiguration[appId].sortModel = {};
        }
    }

    addingBaseFilterFor( appId, filterObj ) {
        var baseFilter = JSON.parse( JSON.stringify( this.getBaseFilterFor( appId ) ) );
        var resultFilter = JSON.parse( JSON.stringify( filterObj ) );

        Object.keys( baseFilter ).forEach( key => {
            //if key does NOT exist, we then overwrite it using baseFilter, if key exists already, we then do NOT touch it
            if ( !( key in resultFilter ) )
                resultFilter[key] = baseFilter[key];
        });

        return resultFilter
    }


    convertFilterToTimeStamp( appId, filterObj ){

      //1. get zone
      var timezone = this.getTimeZoneFor(appId);
      const TZ = require( '../services/TimeZoneService' );
      var tz = new TZ();
      var _this = this;
      Object.keys(filterObj).forEach(key=>{
        //here, we only change if data value is number
        if( (filterObj[key].comp=='on' || filterObj[key].comp=='onorbefore'
          || filterObj[key].comp=='onorafter' ||  filterObj[key].comp=='between')
          /*&& !isNaN(_this._dataList[appId][0][key].value )*/
        ){
          if(filterObj[key].comp=='on'){
            filterObj[key].comp='between';
            var value1 = filterObj[key]['value1'];
            filterObj[key]['value1']= tz.convertDateTimeStringToTimeStampWithZone(value1+' 00:00:00', timezone);
            filterObj[key]['value2']= tz.convertDateTimeStringToTimeStampWithZone(value1+' 23:59:59', timezone);
          }else if(filterObj[key].comp=='onorbefore'){
            filterObj[key]['value1']= tz.convertDateTimeStringToTimeStampWithZone( filterObj[key]['value1']+' 23:59:59', timezone);
          }else if(filterObj[key].comp=='onorafter'){
            filterObj[key]['value1']= tz.convertDateTimeStringToTimeStampWithZone(filterObj[key]['value1']+' 00:00:00', timezone);
          }else{
            filterObj[key]['value1']= tz.convertDateTimeStringToTimeStampWithZone(filterObj[key]['value1']+' 00:00:00', timezone);
            filterObj[key]['value2']= tz.convertDateTimeStringToTimeStampWithZone(filterObj[key]['value2']+' 23:59:59', timezone);
          }
        }
      });
      return filterObj;
    }

    //this method will compare these fields only to see if there are any updates
    isConfigurationChanged( appId, fields ) {
        var compareObject = function( obj1, obj2, key ) {
            if ( Array.isArray( obj1 ) && Array.isArray( obj2 ) ) {
                var contains = true;
                obj1.forEach( item => {
                    if ( !obj2.includes( item ) )
                        contains = false;
                });
                if ( key != 'colWidths' ) //for colWidth, obj1 is smaller or equal, so do not check if obj2 contains obj1
                    obj2.forEach( item => {
                        if ( !obj1.includes( item ) )
                            contains = false;
                    });

                return contains;
            } else {
                for ( var p in obj1 ) {
                    //Check property exists on both objects
                    if ( obj1.hasOwnProperty( p ) !== obj2.hasOwnProperty( p ) ) return false;
                    switch ( typeof ( obj1[p] ) ) {
                        //Deep compare objects
                        case 'object':
                            if ( !compareObject( obj1[p], obj2[p] ) ) return false;
                            break;
                        //Compare values
                        default:
                            if ( obj1[p] != obj2[p] ) return false;
                    }
                }

                return true;
            }

        }

        //let's only compare filterObj here
        var equal = true;
        var _this = this;
        fields.forEach( field => {
            var obj1 = JSON.parse( JSON.stringify( _this.customConfiguration[field] ) );
            if ( field == 'colWidths' ) {
                obj1 = _this._colWidths[_this._appId];
            }
            if ( obj1 && Object.keys( obj1 ).length == 0 ) {
                //this means there is NO customFiguration yet, no need to check
            } else {
                if ( field === 'sortModel' && 'defaultSortField' in _this.config && obj1.field === _this.config.defaultSortField && 'defaultSortOrder' in _this.config && obj1.sort === _this.config.defaultSortOrder ) {
                    //if this is sortModel comparation, we need to make sure it is not default
                    //then compare with defaultSortField/defaultSortOrder
                } else {
                    //having to check current Config exists
                    if ( _this.getCurrentKeyFor( appId ) && _this.getCurrentKeyFor( appId ) in _this.getAvailableConfigsFor( appId )
                        && _this.getAvailableConfigsFor( appId )[_this.getCurrentKeyFor( appId )].value
                        && field in _this.getAvailableConfigsFor( appId )[_this.getCurrentKeyFor( appId )].value ) {
                        //defaultKey exists and also in avaiable configs
                        var obj2 = JSON.parse( JSON.stringify( _this.getAvailableConfigsFor( appId )[_this.getCurrentKeyFor( appId )].value[field] ) );

                        //keyLength not same, not equal
                        if ( Object.keys( obj1 ).length != Object.keys( obj2 ).length ) {
                            equal = false;
                        } else if ( !compareObject( obj1, obj2, field ) ) {
                            equal = false;
                        }
                    } else {
                        //this means current Config does not exist for the key, mostly it is for default
                        if ( obj1 && Object.keys( obj1 ).length > 0 ) {
                            equal = false;
                        }
                    }
                }
            }
        });

        return {
            changed: !equal,
            subType: this.getCurrentKeyFor( appId )
        };
    }



    subscribeToConfig( subscriber ) {
        this._subscribers_config[this._appId].push( subscriber );
    }

    //we need to subscribe to each individual table
    subscribeToData( subscriber ) {
        this._subscribers_dataList[this._appId].push( subscriber );
    }

    subscribeToGrandTotal( subscriber ) {
        this._subscribers_grandTotal[this._appId].push( subscriber );
    }

    subscribeToColumnConfig( subscriber ) {
        this._subscribers_column_config[this._appId].push( subscriber );
    }

    subscribeToHighlightedRows( subscriber ) {
        this._subscribers_highlightedRows[this._appId].push( subscriber );
    }

    subscribeToCustomerConfig( subscriber ) {
        this._subscribers_coustomer_config[this._appId].push( subscriber );
    }

    subscribeToExtraDataFor( appId, subscriber ) {
        this._appId = appId;
        this._subscribers_extra_data[this._appId].push( subscriber );
    }

    unSubscribeToExtraDataFor( appId ) {
        this._subscribers_extra_data[appId] = [];
    }

    subscribeToExtraDataUpdateFor( appId, subscriber ) {
        this._appId = appId;
        this._subscribers_extra_data_update[this._appId].push( subscriber );
    }

    unSubscribeToExtraDataUpdateFor( appId ) {
        this._subscribers_extra_data_update[appId] = [];
    }

    subscribeToOpenCustomTooltip(appId, subscriber){
        this._appId = appId;
        this._subscribers_open_custom_tooltip[this._appId].push(subscriber);
    }
    unSubscribeOpenCustomTooltip(){
        this._subscribers_open_custom_tooltip[this._appId] = [];
    }
    subscribeToCloseCustomTooltip(appId, subscriber){
        this._appId = appId;
        this._subscribers_close_custom_tooltip[this._appId].push(subscriber);
    }
    unSubscribeCloseCustomTooltip(appId){
        this._subscribers_close_custom_tooltip = [];
    }

    /**
     * this method is used to swap column reorder from - starting position to -
     * ending position just need to splice the from item and insert into to
     * position
     */
    swapKeyList( from, to ) {
        var currentList = this._customConfiguration[this._appId]['orderedKeyList'];
        if ( currentList.length > 0 ) {
            currentList.splice( to, 0, currentList.splice( from, 1 )[0] );
        }
        this._customConfiguration[this._appId]['orderedKeyList'] = currentList;
        this.fakeColumnWidthUpdate();
    }

    updateTableColumnConfigFor( appId, column, prop, value ) {
        this.initializeConfig( appId );
        if ( appId in this._config && column in this._config[appId].columns && prop in this._config[appId].columns[column] ) {
            this._config[appId].columns[column][prop] = value;
            this._subscribers_column_config[appId].forEach( function( cb ) {
                cb( column, prop );
            });
        }
    }

    isTimeZoneGlobalFor( appId ) {
        var currentConfig = this.getConfigFor( appId );
        if ( 'isGlobalTimeZone' in currentConfig && currentConfig.isGlobalTimeZone === true ) {
            return true;
        } else {
            return false
        }
    }

    updateTimezoneFor( appId, zone ) {
        if ( this.isTimeZoneGlobalFor( appId ) ) {
            //this is global timezone solution, do not need to update customConfiguration
            this._config[appId]['timeZone'] = zone.getAbbreviation();
        } else {
            var subType = "";
            Object.keys( this.getAvailableConfigsFor( appId ) ).forEach( key => {
                if ( this.getAvailableConfigsFor( appId )[key].current ) {
                    this.getAvailableConfigsFor( appId )[key].value['timezone'] = zone.getAbbreviation();
                    subType = key;
                }
            });
            //now we still need to update customConfig
            this.setCustomerConfigForOne( appId, JSON.parse( JSON.stringify( this.getAvailableConfigsFor( appId )[subType].value ) ) );
            return subType;
        }
    }

    updateFrozenKeyListFor( appId, column ) {

        var subType = "";
        var newResults = [];
        Object.keys( this.getAvailableConfigsFor( appId ) ).forEach( key => {
            if ( this.getAvailableConfigsFor( appId )[key].current ) {
                if ( 'frozenColumnKeyList' in this.getAvailableConfigsFor( appId )[key].value ) {
                    var frozenColumnKeyList = this.getAvailableConfigsFor( appId )[key].value['frozenColumnKeyList'];
                    if ( frozenColumnKeyList.includes( column.id ) ) {
                        frozenColumnKeyList.splice( frozenColumnKeyList.indexOf( column.id ), 1 );
                    } else {
                        frozenColumnKeyList.push( column.id );
                    }
                    newResults = frozenColumnKeyList;
                } else {
                    newResults = [column.id];
                }
                this.getAvailableConfigsFor( appId )[key].value['frozenColumnKeyList'] = newResults;
                subType = key;
            }
        });

        //now we still need to update customConfig
        this.setCustomerConfigForOne( appId, JSON.parse( JSON.stringify( this.getAvailableConfigsFor( appId )[subType].value ) ) );
        return subType;
    }

    isColumnFreezableFor( appId ) {
        var freezable = false;
        var columns = this.getConfigFor( appId ).columns;
        Object.keys( columns ).map( key => {
            freezable = freezable || ( 'freezable' in columns[key] && columns[key].freezable === true ) ? true : false;
        });
        return freezable;
    }

    getFrozenColumnsFor( appId ) {
        return this.getCustomConfigurationFor( appId )['frozenColumnKeyList'];
    }

    isColumnFrozen( appId, columnKey ) {
        return this.getFrozenColumnsFor( appId ).includes( columnKey );
    }

    getTimeZoneFor( appId ) {
        var currentConfig = this.getConfigFor( appId );
        var tz = "PST";
        if ( 'isGlobalTimeZone' in currentConfig && currentConfig.isGlobalTimeZone === true ) {
            //this is globalTimeZone, using passed default Only
            if ( 'timeZone' in currentConfig && currentConfig.timeZone.length > 0 )
                tz = currentConfig.timeZone
            else if ( 'defaultTimeZone' in currentConfig && currentConfig.defaultTimeZone.length > 0 )
                tz = currentConfig.defaultTimeZone;
        } else {
            //otherwise, we need to use each view to save tz
            if ( this.customConfiguration && this.customConfiguration.timezone && this.customConfiguration.timezone.length > 0 )
                tz = this.customConfiguration.timezone;
            else if ( 'defaultTimeZone' in currentConfig && currentConfig.defaultTimeZone.length > 0 )
                tz = currentConfig.defaultTimeZone;
        }
        return tz;
    }

    setGlobalTimeZoneFor( appId, zoneName ) {
        this._config[appId]['timeZone'] = zoneName;
    }

    addingAccountsIntoCustomConfigurationFor( appId, filterObject ) {
        if ( 'filterModel' in filterObject && 'accountId' in filterObject.filterModel ) {
            return filterObject;
        } else {
            //if accountTab existed
            if(!this.config.noAccountTab){
                var accountIds = [];
                this.accountList.forEach( function( account ) {
                    accountIds.push( account.uuid );
                });
                filterObject.filterModel['accountId'] = {
                    comp: 'in',
                    value1: accountIds
                }
            }
            return filterObject;
        }
    }

    upgradeAccountIdsFor( appId, accountIds ) {
        var accountIdsUpgraded = [];
        accountIds.forEach( function( accountId ) {
            this._accountList[appId].forEach( function( account ) {
                if ( account.uuid == accountId || account.id == accountId )
                    accountIdsUpgraded.push( account.uuid + ":" + account.accountId );
            }.bind( this ) );
        }.bind( this ) );
        return accountIdsUpgraded;
    }

    getTimeZoneDiff( zoneName ) {
        return new TimeZoneService().getTimezoneOffsetByName( zoneName );
    }

}

var DataTableObjectFactory = {
    dataTableObject: null,
    getDataTableObject: function() {
        if ( this.dataTableObject == null ) {
            this.dataTableObject = new DataTableObj();
            this.dataTableObject.resetSubscribers();
        }
        return this.dataTableObject;
    }
}

module.exports = DataTableObjectFactory;
