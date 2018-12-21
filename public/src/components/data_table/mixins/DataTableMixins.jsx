let DataTableAction = require('../flux/actions/DataTableActions');
let EventTypes = require('../flux/actions/EventTypes');
let ActionTypes = require('../flux/actions/ActionTypes');
let DataTableStore = require('../flux/stores/DataTableStore');
var NestedContents = require('../comps/NestedContents');
let _ = require('underscore');
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

var DataTableMixins = {

    currentPage: 1,

    getInitialState: function () {
        this.currentPage = 1;

        // set initial number per page on loading
        if (jnprDataTableObj.config && jnprDataTableObj.config.initalNumberPerPage)
            this._currentNumPerPage = jnprDataTableObj.config.initalNumberPerPage;

        // now, we need to set appId to dbObject, and this will trigger
        // restoration
        jnprDataTableObj.appId = this.props.appId;
        // setting up caseManager link, passed for either staging or production
        // environment

        var passedObjectDataList = jnprDataTableObj.dataList || null;
        var passedObjectConfig = jnprDataTableObj.config || null;
        var actualDataList = JSON.parse(JSON.stringify(passedObjectDataList));

        // must set appId, as it is singleton and can be overwritten by other
        // instance
        jnprDataTableObj.appId = this.props.appId;
        var _this = this;
        // reason to get a little timeout here is if we have multiple table, due
        // to different response time, table data is screwed up. So a small
        // delay can help.
        // also there is no harm here, as there won't be change immediately
        // after table is created.
        setTimeout(function () {
            // we do not subscribe for nestedTable at all
            if (!('nestedContent' in _this.props)) {

                jnprDataTableObj.subscribeToExtraDataUpdateFor(_this.props.appId, function (data, type) {
                    setTimeout(() => {
                        DataTableAction.performNestedContentDataUpdated(_this.props.appId, data, type);
                    }, 0);

                });
            }

            // Subscribe to Data change
            jnprDataTableObj.subscribeToData(function (obj, editing) {
                _this._reloadDataForAllFromDataUpdate(obj, editing);
                _this.adjustTableHeight();
                DataTableAction.performVerticalScrollEnd(_this.props.appId, 0, 0);
            }.bind(_this));

            jnprDataTableObj.subscribeToConfig(function (configuration, appId) {
                _this._configChanged(configuration, appId);
            }.bind(_this));

            // Subscribe to column config value change
            jnprDataTableObj.subscribeToColumnConfig(function (column, prop) {
                _this._columnConfigChanged(column, prop)
            }.bind(_this));

            // Subscribe to customer configuration updates
            jnprDataTableObj.subscribeToCustomerConfig(function (key) {
                _this._customConfigurationChanged(false, key)
            }.bind(_this));

            jnprDataTableObj.subscribeToFilterObject(function (obj) {
                _this._filterCallBack(obj);
                _this._customConfigurationChanged(true);
            }.bind(_this));

            jnprDataTableObj.subscribeToHighlightedRows(function () {
                _this.adjustTableHeight();
            }.bind(_this));




        }, 'initialDelayForDatSubscribe' in this.props ? this.props.initialDelayForDatSubscribe : 1000);

        var processedConfig = this.processConfig(actualDataList,
            passedObjectConfig);
        processedConfig['originalDataList'] = JSON.parse(JSON.stringify(actualDataList));
        processedConfig['dataList'] = JSON.parse(JSON.stringify(actualDataList));
        processedConfig['tableMax'] = passedObjectConfig.closeLeftPanelBtn;
        // calculate the filterNumber when first loaded
        var totalFilters = 0;
        Object.keys(jnprDataTableObj.customConfiguration.filterModel).map(function (key) {
            if (Object.keys(jnprDataTableObj.customConfiguration.filterModel[key]).length > 0) {
                totalFilters++;
            }
        });
        processedConfig["totalFilters"] = totalFilters;
        return processedConfig;
    },

    _configChanged: function (newConfiguration, appId) {
        this.setState(this.processConfig([], newConfiguration, appId));
        this._updateWidth();
    },

    processConfig: function (dataList, passedObjectConfig, appId) {
        var rowHeight = passedObjectConfig.rowHeight || 50;
        var headerHeight = passedObjectConfig.headerHeight || 50;
        var tableHeight = passedObjectConfig.tableHeight || 500;
        var tableWidth = passedObjectConfig.tableWidth || 1000;
        var showGlobalCheckbox = passedObjectConfig.showGlobalCheckbox;
        var defaultGlobal = passedObjectConfig.defaultGlobal;
        var columnFilterable = passedObjectConfig.columnFilterable;
        var globalAutoComplete = passedObjectConfig.globalAutoComplete;
        var hidingBottomIndicator = passedObjectConfig.hidingBottomIndicator;
        var partialGlobal = 'partialGlobal' in passedObjectConfig ? passedObjectConfig.partialGlobal : false;

        var keys = [];
        var availableColumns = {};
        var availableVisibleColumns = {};
        var availableFilterableColumns = {};

        if (dataList.length > 0) {
            keys = Object.keys(dataList[0]);
        }
        // before we call available, let's assign appId again
        // in case it is overwritten by other instance
        if (appId) {
            jnprDataTableObj.appId = appId;
        } else {
            jnprDataTableObj.appId = this.props.appId;
        }

        return {
            availableColumns: jnprDataTableObj.availableColumns,
            selectedColumns: jnprDataTableObj.selectedColumns,
            rowHeight: rowHeight,
            headerHeight: headerHeight,
            tableHeight: tableHeight,
            tableWidth: tableWidth,
            columnFilterable: columnFilterable,
            showGlobalCheckbox: showGlobalCheckbox,
            defaultGlobal: defaultGlobal,
            globalAutoComplete: globalAutoComplete,
            totalFilters: 0,
            availableVisibleColumns: jnprDataTableObj.availableVisibleColumns,
            availableFilterableColumns: jnprDataTableObj.availableFilterableColumns,
            multipleConfigEnabled: 'multipleConfigEnabled' in passedObjectConfig ? passedObjectConfig.multipleConfigEnabled : false,
            checkBoxEnabled: passedObjectConfig.checkBoxEnabled || false,
            displayingActionButton: passedObjectConfig.displayingActionButton || false,
            displayingActionButtonOptionList: passedObjectConfig.displayingActionButtonOptionList || null,
            hidingBottomIndicator: passedObjectConfig.hidingBottomIndicator,
            scrollToRow: 0,
            controllerType: "Filter",
            showTimeZoneConfigBtnOptions: false,
            enableTimeZone: 'enableTimeZone' in passedObjectConfig ? passedObjectConfig.enableTimeZone : false,
            frozenColumns: this._getFrozenColumns(),
            partialGlobal: partialGlobal
        };
    },

    // having to put addedCheckbox here so that it will be pushed later
    _getFrozenColumns: function () {
        var list = jnprDataTableObj.getCustomConfigurationFor(this.props.appId)['frozenColumnKeyList'];
        if (list.length > 0) {
            list.push('addedCheckBox');
        }
        return list;
    },


    _onColumnResizeEndCallback: function (newColumnWidth, columnKey) {

        var selectedColumns = this.state.selectedColumns;
        selectedColumns[columnKey].width = newColumnWidth;

        jnprDataTableObj.setColumnWidth(this.props.appId, columnKey, newColumnWidth);
        jnprDataTableObj.setColumnWidth(this.props.appId, 'tableWidth', this.state.tableWidth);

        DataTableAction.performColumnResized(this.props.appId);

        // need to adjust the position to last step as we have to udpate width
        // first
        this.setState({
            selectedColumns: selectedColumns
        });
    },

    _onScrollEndCallBack: function (scrollX, scrollY) {
        if (Math.abs(scrollY - this.startY) > 10) {
            var totalHeight = this.state.rowHeight * (this.state.dataList.length - 1);
            var start = scrollY / totalHeight;
            var end = (scrollY + this.state.tableHeight) / totalHeight;
            DataTableAction.performVerticalScrollEnd(this.props.appId, start, end);

            // this is vertical scroll, otherwise, horizontal scrolling
            if (this.state.rowHeight * (this.state.dataList.length - 1) -
                this.state.tableHeight <= scrollY) {
                if (this.props.nextPageCallBack) {
                    this.setState({
                        scrollToRow: this.state.dataList.length + 1
                    });
                    this.props.nextPageCallBack(this.getCurrentPage());
                }
            }
        }

        if ('onScrollEndCallBack' in this.props) {
            this.props.onScrollEndCallBack();
        }
    },
    startX: 0,
    startY: 0,
    _onScrollStartHanlder: function (scrollX, scrollY) {
        if ((new Date().getTime() - this.showingAt) > 500) {
            jQuery('#divCellClickDetailContent_' + this.props.appId).css({ display: 'none' });
            DataTableAction.performCloseCellDetailPopup(this.props.appId, this.detailPopupColName);
            this.startX = scrollX;
            this.startY = scrollY;
        }
    },

    /**
     * dispatched by columnChooser select
     */
    updateSelectedColumns: function (columns) {
        // first, we have to save this into dataObject,
        jnprDataTableObj.setSelectedColumnKeys(columns, this.props.appId);
        this._columnReordered();
    },

    /**
     * This is triggered once left columnChooser columns are reordered
     */
    _columnReordered: function () {

        var config = jnprDataTableObj.config;
        var columnsPassed = config.columns;
        var newColumns = {};
        // we can now retrieve selectedColumnKeys, which is already sorted based
        // on
        // orderedKeyList
        // the dataObject orderedKeyList was updated already in the
        // multiSelectList
        // component
        jnprDataTableObj.selectedColumnKeys.forEach(function (column) {
            newColumns[column] = columnsPassed[column];
        });
        this.setState({
            selectedColumns: newColumns
        });
    },

    _getGlobal: function () {
        if (this.state.showGlobalCheckbox) {
            return this.refs.chkGlobal.checked ? true : false;
        } else {
            return this.state.defaultGlobal;
        }
    },

    _filterReset: function () {

        this._filterObj = {};
        this._setFilterNumber({}, true);
        // once clicked, it will trigger filter reset events, and this is
        // listened
        // in all the inputElement to reset its values
        DataTableAction.performFiltersReset(this.props.appId);
        // also needs to reset dataObject, so that no saved config here
        jnprDataTableObj.resetFilterSorter(this.props.appId);
        this.adjustTableHeight();
    },

    _filterResetFromController: function (noDataReset, noChangingDefault) {
        this._setFilterNumber({}, true);
        this.resetCurrentPage();
        this._filterObj = {};

        // also needs to reset dataObject, so that no saved config here
        jnprDataTableObj.resetFilterSorter(this.props.appId);

        if (noDataReset === true) {
            // no need to resetData, this is from config change, just want to
            // reset UI only
        } else {
            if (this._getGlobal()) {
                // update there, for resetting, we also need to pass default
                // sorter
                var config = jnprDataTableObj.getConfigFor(this.props.appId);
                var _this = this;
                if ('defaultSortField' in config && 'defaultSortOrder' in config) {
                    this._debounce(function () {
                        return _this.props.filterHandler(jnprDataTableObj.getBaseFilterFor(_this.props.appId, true), { key: config.defaultSortField, up: config.defaultSortOrder === 'asc' }, null, true);
                    });
                } else {
                    this._debounce(function () {
                        return _this.props.filterHandler(jnprDataTableObj.getBaseFilterFor(_this.props.appId, true));
                    });

                }
            } else {
                // no need to use base as if this is in-app filter, the original
                // data should be pre-filtered by baseFilter
                this.setState({
                    dataList: JSON.parse(JSON.stringify(this.state.originalDataList))
                });

                jnprDataTableObj.setProcessedDataListFor(this.props.appId, JSON.parse(JSON.stringify(this.state.originalDataList)));

            }
        }

        // now we need to set default config and the dispatch the events
        // this below detection is used to check if the config btn dom is
        // visible, if visible, we do not need to do same thing again
        if (!this.state.showSaveConfig && !noChangingDefault === true)
            setTimeout(function () {
                // now, let's udpate dataTable Object
                jnprDataTableObj.setDefaultConfigFor(this.props.appId, 'default');
                jnprDataTableObj.setCustomerConfigForOne(this.props.appId, jnprDataTableObj.getDefaultCustomConfigFor(this.props.appId));
                DataTableAction.performCustomConfigurationChanged(this.props.appId);
                this._defaultConfigCallBack('default');
            }.bind(this), 50);


        this.adjustTableHeight();

    },

    // set filters number here, needs to be called whenever calling filter
    // change
    _setFilterNumber: function (filterObj) {
        var totalFilters = 0;
        Object.keys(filterObj).map(function (key) {
            if (Object.keys(filterObj[key]).length > 0) {
                // let's first detect if this is accountFilter
                if (key === 'accountName' || key === 'accountId') {
                    // it is empty accountChooser, no filter
                } else {

                    if (!jnprDataTableObj.isCustomFilterBaseFilter(this.props.appId, key)) {
                        totalFilters++;
                    }
                }
            }
        }.bind(this));
        this.setState({ totalFilters: totalFilters });
        setTimeout(function () {
            DataTableAction.performTotalFitlerNumUpdate(this.props.appId, totalFilters);
        }.bind(this), 100);
        if ('showingInitialHiddenWhenFiltering' in jnprDataTableObj.config && jnprDataTableObj.config.showingInitialHiddenWhenFiltering) {
            this._updatingInitialHiddenForConfig(totalFilters);
        }
    },

    _updatingInitialHiddenForConfig: function (filterNumber) {
        jnprDataTableObj.appId = this.props.appId;
        // must have a timeout, so as to avoid dispatch during dispatch error
        setTimeout(function () {
            jnprDataTableObj.updateConfigInitialHidden(filterNumber == 0);
            DataTableAction.performFilterUpdatedCallBack(this.props.appId);
            // this one is important to show all the pre-selected columns
            // now, let's update state
            this.setState({
                availableColumns: jnprDataTableObj.availableColumns,
                selectedColumns: jnprDataTableObj.selectedColumns,
                availableVisibleColumns: jnprDataTableObj.availableVisibleColumns,
                availableFilterableColumns: jnprDataTableObj.availableFilterableColumns
            });
        }.bind(this), 150)
        this.lastFilterNumber = filterNumber;
    },

    _columnConfigChanged: function (column, prop) {
        setTimeout(function () {
            // now, let's update state
            this.setState({
                availableColumns: jnprDataTableObj.availableColumns,
                selectedColumns: jnprDataTableObj.selectedColumns,
                availableVisibleColumns: jnprDataTableObj.availableVisibleColumns,
                availableFilterableColumns: jnprDataTableObj.availableFilterableColumns
            });
        }.bind(this), 0)

    },

    _customConfigurationChanged: function (doNotReloadData, key) {
        this.setState({
            availableColumns: jnprDataTableObj.availableColumns,
            selectedColumns: jnprDataTableObj.selectedColumns,
            availableVisibleColumns: jnprDataTableObj.availableVisibleColumns,
            availableFilterableColumns: jnprDataTableObj.availableFilterableColumns,
            accountList: jnprDataTableObj.accountList || null,
            originalAccountList: jnprDataTableObj.accountList || null,
            selectedAccounts: jnprDataTableObj.allCustomConfigurations[this.props.appId].defaultSelectedAccountList || null
        });
        // 1. dispatch event to udpate UI
        DataTableAction.performCustomConfigurationChanged(this.props.appId);

        // 2. Now we need to fetch new results!
        if (doNotReloadData !== true) {
            var filterModel = _.clone(jnprDataTableObj.customConfiguration.filterModel);
            if (key === 'default') {
                filterModel['accountId'] = {
                    comp: "in",
                    value1: jnprDataTableObj.getAccountIds()
                }
            }
            this._reloadDataForAll(filterModel, jnprDataTableObj.customConfiguration.sortModel);
        }

    },


    // after editing cell value, we are assigning data back to table again, and
    // here, we need to reapply filter/sorter to display only filtered/sorted
    // data
    _reloadDataForAllFromDataUpdate: function (obj, editing) {
        //partial global here means we want to update data from external passed data, but still sort/filter inside
        if (this.state.partialGlobal) {
            // otherwise, jut paply data direclty, already filtered and sorted
            this.setState({
                originalDataList: JSON.parse(JSON.stringify(obj)),
                dataList: JSON.parse(JSON.stringify(obj))
            });
        } else {
            // this is from editing cell call back, then we have to reload all data
            // Or if this is NOT global, we also need to reload
            if (editing === true || !this._getGlobal()) {
                this.setState({
                    originalDataList: JSON.parse(JSON.stringify(obj))
                });
                setTimeout(() => {
                    // passing localOnly to true to prevent fetchHandler call back
                    this._reloadDataForAll(jnprDataTableObj.customConfiguration.filterModel, jnprDataTableObj.customConfiguration.sortModel, true);
                }, 0);
            } else {
                // otherwise, jut paply data direclty, already filtered and sorted
                this.setState({
                    originalDataList: JSON.parse(JSON.stringify(obj)),
                    dataList: JSON.parse(JSON.stringify(obj))
                });
            }
        }

    },


    _reloadDataForAll: function (filterObj, sortModel, localOnly) {
        this._setFilterNumber(filterObj);
        if (localOnly !== true && this._getGlobal()) {
            if (this.props.fetchHandler) {
                this.props.fetchHandler(jnprDataTableObj.addingBaseFilterFor(this.props.appId, filterObj), sortModel);
            }
        } else {
            // for in-app filter/sorter, we jsut do like below
            var tmpList = JSON.parse(JSON.stringify(this.state.originalDataList));
            Object.keys(filterObj).map(
                function (key) {
                    tmpList = this._filterData(tmpList, key,
                        filterObj[key].comp, filterObj[key].value1,
                        filterObj[key].value2 ? filterObj[key].value2
                            : null);
                }.bind(this));

            tmpList = this._sortDataList(tmpList, sortModel);

            this.setState({
                dataList: tmpList
            });
            this.adjustTableHeight();
            jnprDataTableObj.setProcessedDataListFor(this.props.appId, tmpList);
        }
    },

    _filterCallBack: function (filterObj, colObj, fromAccount) {
        filterObj = JSON.parse(JSON.stringify(filterObj));

        // for empty accounts setting, let's reset data to empty
        var emptyAccount = false;
        var havingAccount = false;
        var totalFilterFields = 0;

        // fixing here, if filterObj has no value, we then need to delete this
        // filter
        Object.keys(filterObj).map(key => {
            if (filterObj[key].comp === 'on' || filterObj[key].comp === 'onorbefore' || filterObj[key].comp === 'onorafter' || filterObj[key].comp === 'between') {
                // this is date, we need to check existence of it
                if (filterObj[key].comp === 'between') {
                    if (filterObj[key].value1 == null || filterObj[key].value2 == null) {
                        delete (filterObj[key]);
                    }
                } else {
                    if (filterObj[key].value1 == null) {
                        delete (filterObj[key]);
                    }
                }
            }

            if (filterObj[key].comp === '=' || filterObj[key].comp === '<=' || filterObj[key].comp === '>=' || filterObj[key].comp === '<>') {
                // this is date, we need to check existence of it
                if (filterObj[key].comp === '<>') {
                    if (filterObj[key].value1 == null || filterObj[key].value2 == null) {
                        delete (filterObj[key]);
                    }
                } else {
                    if (filterObj[key].value1 == null) {
                        delete (filterObj[key]);
                    }
                }
            }

            if (filterObj[key] && Object.keys(filterObj[key]).length == 0) {
                delete (filterObj[key]);
            }
        });

        Object.keys(filterObj).map(key => {
            totalFilterFields++;
            if (key === 'accountName' || key === 'accountId') {
                havingAccount = true;
                if (filterObj[key].value1.length == 0) {
                    if (!this.props.hasAccIdCol) {
                        // this is unselect account
                        emptyAccount = true;
                    }
                }
            }
        });

        // first: saving filterObj into dataTableObject
        jnprDataTableObj.filter(this.props.appId, filterObj);
        this.resetCurrentPage();

        if (emptyAccount) {
            this.setState({
                dataList: []
            });
            this._setFilterNumber(filterObj);
            if (this._getGlobal()) {
                var _this = this;
                if (this.props.filterHandler)
                    //here we need to convert filter dateString into timestamp
                    this._debounce(function () {
                        return _this.props.filterHandler(jnprDataTableObj.convertFilterToTimeStamp(_this.props.appId, jnprDataTableObj.addingBaseFilterFor(_this.props.appId, filterObj)), null, fromAccount);
                    });
            } else {
                var filteredResult = JSON.parse(JSON.stringify(this.state.originalDataList));
                Object.keys(filterObj).map(
                    function (key) {
                        filteredResult = this._filterData(filteredResult, key,
                            filterObj[key].comp, filterObj[key].value1,
                            filterObj[key].value2 ? filterObj[key].value2
                                : null);
                    }.bind(this));
                this.setState({
                    dataList: filteredResult
                });
                jnprDataTableObj.setProcessedDataListFor(this.props.appId, this._sortDataList(filteredResult, jnprDataTableObj.customConfiguration.sortModel));
                this.adjustTableHeight();
            }

        } else {
            // if we have account && more filters back or no account at all, we
            // set filterNumber
            // as it is possible we only choose account, but no filter passed
            // back yet from filterView
            // this is firstTime loading, we should not update filter number
            // then
            // if ( havingAccount && totalFilterFields > 1 || !havingAccount )
            this._setFilterNumber(filterObj);

            if (this._getGlobal()) {
                if (this.props.filterHandler) {
                    // updates here, we need to append accountInfo here

                    var noAccountTab = "noAccountTab" in jnprDataTableObj.config ? jnprDataTableObj.config.noAccountTab : false;

                    if (!('accountId' in filterObj) && !noAccountTab) {
                        var selectedAccounts = JSON.parse(JSON.stringify(jnprDataTableObj.getCustomConfigurationFor(this.props.appId).defaultSelectedAccountList));
                        var ids = [];
                        var tmp = [];
                        selectedAccounts.map(function (item) {
                            tmp = item.split(":");
                            ids.push(tmp[2]);
                        });
                        filterObj['accountId'] = {
                            comp: "in",
                            value1: ids
                        };
                    }
                    var _this = this;
                    this._debounce(function () {
                        return _this.props.filterHandler(jnprDataTableObj.convertFilterToTimeStamp(_this.props.appId, jnprDataTableObj.addingBaseFilterFor(_this.props.appId, filterObj)), null, fromAccount);
                    });
                }
            } else {

                var filteredResult = JSON.parse(JSON.stringify(this.state.originalDataList));
                Object.keys(filterObj).map(
                    function (key) {
                        filteredResult = this._filterData(filteredResult, key,
                            filterObj[key].comp, filterObj[key].value1,
                            filterObj[key].value2 ? filterObj[key].value2
                                : null);
                    }.bind(this));
                this.setState({
                    dataList: filteredResult
                });

                this._updateCustomComponents(filteredResult);

                jnprDataTableObj.setProcessedDataListFor(this.props.appId, this._sortDataList(filteredResult, jnprDataTableObj.customConfiguration.sortModel));
                this.adjustTableHeight();
            }

            // resetting the focus on the column header input when table is
            // re-rendered
            if (typeof colObj === 'object' && colObj != null)
                setTimeout(function () {
                    if (document.querySelector(".columnHeader_" + Object.keys(colObj)[0]))
                        document.querySelector(".columnHeader_" + Object.keys(colObj)[0]).focus();
                }, 100);
        }
    },

    _updateCustomComponents: function (filteredResult) {
        var _this = this;

        setTimeout(function () {

            let SingSelectStore = JnprCL.DropDownInputCompStore;
            let DatePickerStore = JnprCL.DatePickerStore;
            let CheckBoxStore = JnprCL.CheckBoxStore;

            //find columns having speical components
            let specialCompList = ['datepicker', 'checkbox', 'single_select'];
            let specialColInfo = [];
            Object.keys(_this.state.selectedColumns).forEach((colKey) => {
                if (_this.state.selectedColumns[colKey].hasOwnProperty('type') && _this.state.selectedColumns[colKey].hasOwnProperty('id')) {
                    if (_.contains(specialCompList, _this.state.selectedColumns[colKey]['type'])) {
                        specialColInfo.push(_.pick(_this.state.selectedColumns[colKey], 'type', 'id'));
                    }
                }
            });

            let propsAppID = _this.props.appId;
            // rerender each small components
            _.each(filteredResult, function (row, rowIdx) {
                _.each(specialColInfo, function (sCol) {
                    let compAppId = propsAppID + '_' + rowIdx + '_' + sCol['id'];
                    if (sCol['type'] === 'checkbox') {
                        CheckBoxStore(compAppId).setChecked(row[sCol['id']]['value']);
                    } else if (sCol['type'] === 'single_select') {
                        let selectedOpt = _.find(row[sCol['id']]['value'], function (opt) {
                            return opt['selected'];
                        });
                        if (selectedOpt) {
                            SingSelectStore(compAppId).setSelectedItemValue(selectedOpt['value']);
                        }else{
                            SingSelectStore(compAppId).setSelectedItemValue('');
                        }
                        //next we need to update disabled

                        var config = jnprDataTableObj.config;
                        var columnConfig = config.columns[sCol.id];
                        let defaultDisabled = false;
                        if ('defaultDisabledControlColumn' in columnConfig) {
                            defaultDisabled = row[columnConfig.defaultDisabledControlColumn].value;
                            SingSelectStore(compAppId).setDisabled(defaultDisabled);
                        }
                    } else if (sCol['type'] === 'datepicker') {
                        DatePickerStore(compAppId).setNewDate(row[sCol['id']]['value']);
                    }
                });
            });
        }, 0);
    },

    // method to be called by fitler/reloading
    _sortDataList: function (tmpList, sortModel) {

        var key = "";
        var up = true;

        if (sortModel && Object.keys(sortModel).length > 0) {
            key = sortModel.field;
            up = sortModel.up;
        } else if ('multipleConfigEnabled' in jnprDataTableObj.config && jnprDataTableObj.config.multipleConfigEnabled === true
            && 'defaultSortField' in jnprDataTableObj.config
            && 'defaultSortOrder' in jnprDataTableObj.config
        ) {
            key = jnprDataTableObj.config.defaultSortField;
            up = jnprDataTableObj.config.defaultSortOrder === 'asc' ? true : false;
        }

        if (key != "") {
            var tmp, bExchange;
            for (var i = 0; i < tmpList.length - 1; i++) {
                for (var j = i + 1; j < tmpList.length; j++) {

                    if (this.state.selectedColumns[key].type == 'datetime' || this.state.selectedColumns[key].type == 'customDate') {
                        var value_i = tmpList[i][key].value;
                        var value_j = tmpList[j][key].value;
                        //if this is dateString, we need to change to timestamp, ignore timezone, we just need to compare
                        if (!isNaN(value_i)) {
                            value_i = new Date(value_i).getTime()
                        }
                        if (!isNaN(value_j)) {
                            value_j = new Date(value_j).getTime()
                        }
                        if (up && value_i > value_j || !up && value_i < value_j) {
                            bExchange = true;
                        } else {
                            bExchange = false;
                        }

                    } else if (this.state.selectedColumns[key].integerSort === true) {

                        var v1 = tmpList[i][key].value == null ? 0 : Number(tmpList[i][key].value);
                        var v2 = tmpList[j][key].value == null ? 0 : Number(tmpList[j][key].value);

                        if (up && v1 > v2 || !up && v1 < v2) {
                            bExchange = true;
                        } else {
                            bExchange = false;
                        }

                    } else {
                        if (up && tmpList[i][key].value > tmpList[j][key].value || !up && tmpList[i][key].value < tmpList[j][key].value) {
                            bExchange = true;
                        } else {
                            bExchange = false;
                        }
                    }

                    if (bExchange) {
                        tmp = tmpList[i];
                        tmpList[i] = tmpList[j];
                        tmpList[j] = tmp;
                    }
                }
            }
        }

        return tmpList;

    },

    _filterData: function (dataList, key, comp, value1, value2) {
        if (comp == null) return dataList;
        var newmap = [];
        if (!(key in this.state.availableColumns)) return dataList;

        let type = this.state.availableColumns[key].type;
        var _this = this;
        const TZ = require('../services/TimeZoneService');
        var tz = new TZ();

        dataList.forEach(function (item) {
            if (type == 'datepicker') {
                //here we need to use timestamp to compare
                let columnConfig = jnprDataTableObj.config.columns[key];
                let format = columnConfig.format ? columnConfig.format : 'DD-MMM-YYYY';
                let timezone = columnConfig.timezone ? columnConfig.timezone : 'UTC';
                let itemDate = item[key].value;
                let item_ts = tz.convertDateTimeStringToTimeStampWithZone(itemDate, timezone, format);

                let t1 = tz.convertDateTimeStringToTimeStampWithZone(value1 + " 00:00:00", timezone, "YYYY-MM-DD HH:mm:ss");
                let t2 = tz.convertDateTimeStringToTimeStampWithZone(value1 + " 23:59:59", timezone, "YYYY-MM-DD HH:mm:ss");
                let t_end = tz.convertDateTimeStringToTimeStampWithZone(value2 + " 23:59:59", timezone, "YYYY-MM-DD HH:mm:ss");

                if (comp == 'onorbefore' && item_ts <= t2
                    || comp == 'onorafter' && item_ts >= t1
                    || comp == 'between' && item_ts >= t1 && item_ts <= t_end
                    || comp == 'on' && item_ts >= t1 && item_ts <= t2
                ) {
                    newmap.push(item);
                }

            } else if (type == 'single_select') {
                //selected format is value4&&value5
                var values = value1.split('&&');
                item[key].value.forEach(function (tmpItem) {
                    var exist = false;
                    values.forEach(function (value) {
                        if (tmpItem.value === value && tmpItem.selected) {
                            newmap.push(item);
                        }
                    });
                });
            } else if (type == 'checkbox') {
                //here value should be true&&false
                var values = value1.split('&&');
                var selected = false;
                values.forEach(function (value) {
                    value = value === 'true' ? true : false
                    if (item[key].value == value) {
                        newmap.push(item);
                    }
                });
            } else if (type == 'number') {
                if (comp == '<=' && item[key].value <= value1
                    || comp == '>=' && item[key].value >= value1
                    || comp == '<>' && item[key].value >= value1 && item[key].value <= value2
                    || comp == '=' && item[key].value == value1
                ) {
                    newmap.push(item);
                }
            }
            else if (type == 'customDate') {
                var item_ts;
                if (isNaN(item[key].value)) {
                    //this is date time string, convert to timestamp
                    item_ts = new Date(item[key].value).getTime();
                } else {
                    //timestamp, first convert to timezone string, then to timestamp again
                    var timeStr = tz.convertTimeStampForTimeZone(item[key].value, jnprDataTableObj.getTimeZoneFor(_this.props.appId));
                    item_ts = new Date(timeStr).getTime();
                }

                if (comp == 'onorbefore' && item_ts <= new Date(value1 + " 23:59:59").getTime()
                    || comp == 'onorafter' && item_ts >= new Date(value1 + " 00:00:00").getTime()
                    || comp == 'between' && item_ts >= new Date(value1 + " 00:00:00").getTime() && item_ts <= new Date(value2 + " 23:59:59").getTime()
                    || comp == 'on' && item_ts >= new Date(value1 + " 00:00:00").getTime() && item_ts <= new Date(value1 + " 23:59:59").getTime()
                ) {
                    newmap.push(item);
                }
            }
            else if (type === 'multilist' || type === 'multiHtml') {

                if (Array.isArray(value1)) {

                    var found = false;

                    if (value1.includes(item[key].value))
                        found = true;
                    else {
                        value1.forEach(val => {
                            if (item[key].value.includes(val))
                                found = true;
                        });
                    }
                    if (found)
                        newmap.push(item);

                } else {
                    let regexStr = '\\b' + value1.split('&&').join('\\b|\\b') + '\\b';   // b
                    // for
                    // word
                    // boundry
                    // i.e
                    // not
                    // to
                    // get
                    // "inactive"
                    // when
                    // serching
                    // for
                    // "active"
                    // //
                    let regextTester = new RegExp(regexStr, 'i');
                    if (regextTester.test(item[key].value)) {
                        newmap.push(item);
                    }
                }


            } else {

                if (comp == 'in') {
                    var exist = false;
                    // special treatment for accountName only, it is special,
                    // for accountChooser, we do not pass any acconts, so it is
                    // [], but we want to show all accounts in this case
                    if (key == 'accountId') {
                        // this update is used to do in app filter for account,
                        // now, original data is using accountId, but filter is
                        // using account uuid, in order to meet both, we need to
                        // modify accountIds
                        // including both uuid and accountid and then do
                        // comparation
                        var upgradedAccountIds = jnprDataTableObj.upgradeAccountIdsFor(this.props.appId, value1);
                        upgradedAccountIds.map(function (term) {
                            if ("value" in item[key] && item[key].value != null && term.toLowerCase().includes(item[key].value.toLowerCase()))
                                exist = true;
                        });

                    } else if (key === 'accountName' && value1.length == 0)
                        exist = true;
                    else
                        value1.map(function (term) {
                            if ("value" in item[key] && item[key].value != null && term.toLowerCase() === item[key].value.toLowerCase())
                                exist = true;
                        });
                    if (exist)
                        newmap.push(item);
                } else {

                    var emptyStrPtrn = /^(\s)*$/;

                    //only searching empty value -- then returns value having no value
                    if (emptyStrPtrn.test(value1)) {
                        if ("value" in item[key] && item[key].value != null) {
                            if (Array.isArray(value1))
                                value1 = value1.join(",");

                            if (comp == 'contains' && item[key] && item[key].value.trim() == '')
                                newmap.push(item);
                        }
                    } else {
                        if ("value" in item[key] && item[key].value != null && item[key].value != "") {

                            if (Array.isArray(value1))
                                value1 = value1.join(",");

                            if (comp == 'contains' && (item[key].value.toLowerCase().includes(value1.toLowerCase()) || value1.toLowerCase().includes(item[key].value.toLowerCase()))
                                || comp == 'equals' && item[key].value.toLowerCase() === value1.toLowerCase()
                                || comp == 'startswith' && item[key].value.toLowerCase().startsWith(value1.toLowerCase())
                                || comp == 'endswith' && item[key].value.toLowerCase().endsWith(value1.toLowerCase())
                                || comp == 'contains' && item[key] && value1 == ''
                            )
                                newmap.push(item);
                        }
                    }
                }
            }
        }.bind(this));

        return newmap;
    },

    dateConvert: function (dtString) {
        if (dtString == "") return "";

        if (isNaN(dtString)) {
            var myDtRe = /\d\d-\w\w\w-\d\d\d\d/;
            var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            var month, day, year;
            if (myDtRe.exec(dtString)) {
                month = months.indexOf(dtString.substr(3, 3).toLowerCase()) + 1;
                month = (month < 10 ? "0" : "") + month;
                day = dtString.substr(0, 2);
                year = dtString.substr(7, 4);
                return new Date(year + "-" + month + "-" + day).getTime();
            } else {
                return new Date(dtString).getTime();
            }
        } else {
            return new Date(parseInt(dtString)).getTime();
        }


    },

    _sortCallBack: function (key, up) {
        // first: saving sortBy into dataTableObject
        jnprDataTableObj.sortBy(this.props.appId, key, up);
        this.resetCurrentPage();

        if (this._getGlobal()) {
            if (this.props.sortHandler) {
                var _this = this;
                this._debounce(function () {
                    return _this.props.sortHandler(key, up);
                });
            }
        } else {

            var tmpList = JSON.parse(JSON.stringify(this.state.dataList));
            var tmp, changing = false;
            var dt1, dt2;

            for (var i = 0; i < tmpList.length - 1; i++) {
                for (var j = i + 1; j < tmpList.length; j++) {
                    changing = false;

                    if (this.state.selectedColumns[key].type == 'single_select') {
                        let selectedOpt1 = _.find(tmpList[i][key].value, function (opt) {
                            return opt['selected'];
                        });
                        let selectedOpt2 = _.find(tmpList[j][key].value, function (opt) {
                            return opt['selected'];
                        });
                        var v1 = selectedOpt1 ? selectedOpt1['value'] : '';
                        var v2 = selectedOpt2 ? selectedOpt2['value'] : '';

                    } else if (this.state.selectedColumns[key].integerSort === true) {
                        var v1 = tmpList[i][key].value == null ? 0 : Number(tmpList[i][key].value);
                        var v2 = tmpList[j][key].value == null ? 0 : Number(tmpList[j][key].value);
                    } else {
                        var v1 = tmpList[i][key].value == null ? "" : tmpList[i][key].value;
                        var v2 = tmpList[j][key].value == null ? "" : tmpList[j][key].value;
                    }

                    if (this.state.selectedColumns[key].type == 'datetime' || this.state.selectedColumns[key].type == 'customDate') {
                        dt1 = this.dateConvert(v1);
                        dt2 = this.dateConvert(v2);
                        if (up && dt1 > dt2
                            || !up && dt1 < dt2) {
                            changing = true;
                        }
                    } else {
                        if (up && v1 > v2 || !up && v1 < v2) {
                            changing = true;
                        }
                    }
                    if (changing) {
                        tmp = tmpList[i];
                        tmpList[i] = tmpList[j];
                        tmpList[j] = tmp;
                    }

                }
            }

            this.setState({
                dataList: tmpList
            });

            this._updateCustomComponents(tmpList);
            this.adjustTableHeight();
            jnprDataTableObj.setProcessedDataListFor(this.props.appId, tmpList);

            if (this.props.inAppSortHandler) {
                var _this = this;
                var sortedDataList = jnprDataTableObj.getProcessedDataListFor(this.props.appId);
                var totalDataListRecords = this.state.dataList.length;
                this._debounce(function () {
                    return _this.props.inAppSortHandler(key, up, sortedDataList, totalDataListRecords);
                });
            }

        }
    },

    _filterObj: {},

    _columnFilterCallBack: function (obj) {
        var _self = this;
        Object.keys(obj).map(function (key) {
            _self._filterObj[key] = obj[key];
        });

        this._filterCallBack(this._filterObj, obj);
    },

    _changeValueHandler: function (item, key, newValue) {
        jnprDataTableObj.updateCellDataFor(this.props.appId, item, key, newValue);
        if (this.props.changeValueHandler) {
            this.props.changeValueHandler(item, key, newValue);
        }
    },

    /**
     * Adding hook for changing table width on window resizing
     */

    running: false,
    componentDidMount: function () {
        var _self = this;
        if (this.props.nested) {
            this.running = true;
            setTimeout(function () {
                _self.running = false;
            }, 1000);
        }

        if (window.jQuery != null)
            // updated to make parent not moving
            jQuery('#jnprDataTableContent_' + this.props.appId).on('mousewheel', function (e) {
                var event = e.originalEvent,
                    d = event.wheelDelta || -event.detail;
                this.scrollTop += (d < 0 ? 1 : -1) * 30;
                e.preventDefault();
            });
        if (window.jQuery != null && !('noToolTip' in jnprDataTableObj.getConfigFor(this.props.appId) && jnprDataTableObj.getConfigFor(this.props.appId).noToolTip)) {
            jQuery(this.refs.jnprDataTable).tooltip({
                position: { my: "center top+10", at: "center" }
            });

        }

        // let's calculate the initial tableHeight

        this._currentNumPerPage = jnprDataTableObj.getNumPerPageFor(this.props.appId) > 0 ? jnprDataTableObj.getNumPerPageFor(this.props.appId) : this._currentNumPerPage;

        this.adjustTableHeight();


        var win = window;
        if (win.addEventListener) {
            win.addEventListener('resize', this._updateWidth, false);
        } else if (win.attachEvent) {
            win.attachEvent('onresize', this._updateWidth);
        } else {
            win.onresize = this._updateWidth;
        }

        this.resizeColumn();
        this.overflowScrolling();

        DataTableStore.addColumnFilterListener(this.props.appId, this._columnFilterCallBack);
        DataTableStore.addColumnSorterListener(this.props.appId, this._sortCallBack);
        DataTableStore.addColumnsUpdateListener(this.props.appId, this.updateSelectedColumns);
        DataTableStore.addAccountsUpdates(this.props.appId, this.accountSelectCallBack);
        DataTableStore.addFiltersUpdates(this.props.appId, this._filterCallBack);
        DataTableStore.addFiltersReset(this.props.appId, this._filterResetFromController);
        DataTableStore.addAutoCompleteAccounts(this.props.appId, this._autoCompleteAccounts);
        DataTableStore.addUpdatePagePerPage(this.props.appId, this._updateRecordsPerPage);
        DataTableStore.addColumnReordered(this.props.appId, this._columnReordered);
        DataTableStore.addCellClickParentCallBackHandler(this.props.appId, this._cellClicked);
        DataTableStore.addCustomConfigurationDefaultCallBackHandler(this.props.appId, this._defaultConfigCallBack);
        DataTableStore.addCustomConfigurationDeleteCallBackHandler(this.props.appId, this._deleteConfigCallBack);
        DataTableStore.addCustomConfigurationUpdateCallBackHandler(this.props.appId, this._updateConfigCallBack);
        DataTableStore.addActionButtonClickHandler(this.props.appId, this._actionButtonClickHandler);
        DataTableStore.addCustomConfigViewingHandler(this.props.appId, this._viewingConfigCallBack);
        // add checkall Listener
        DataTableStore.addCheckAllRowHandler(this.props.appId, this._checkAll);
        DataTableStore.addJumpToRow(this.props.appId, this._jumpToRow);

        DataTableStore.addChangeControllerType(this.props.appId, this._changeControllerType);

        DataTableStore.addFrozenColumnChanged(this.props.appId, this._changeColumnFrozen);

        if (!('nestedContent' in this.props)) {
            DataTableStore.addNestedNextPage(this.props.appId, this._addNestedNextPage);
            DataTableStore.addNestedSort(this.props.appId, this._addNestedSort);
            DataTableStore.addNestedFilter(this.props.appId, this._addNestedFilter)
        }

        DataTableStore.addCellActionClickHandler(this.props.appId, this._cellActionClickHandler);
        DataTableStore.addCellActionMouseOverHandler(this.props.appId, this._cellActionMouseOverHandler);
        DataTableStore.addCellActionMouseOutHandler(this.props.appId, this._cellActionMouseOutHandler);
        DataTableStore.addCellUpdateHandler(this.props.appId, this._addCellUpdateHandler);

        // set initial fitlers count, first set appId as it might be overwritten
        jnprDataTableObj.appId = this.props.appId;

        // now for plainTable and in-app application, such as workbench, they
        // are passing all the default data, no filter included, so, in this
        // case, we need to do filter after component mounted
        if (jnprDataTableObj.config.defaultGlobal === false)
            this._reloadDataForAll(jnprDataTableObj.customConfiguration.filterModel, jnprDataTableObj.customConfiguration.sortModel);
        window.addEventListener('keyup', this._closeToolTip, false);
        this._updateWidth();

    },

    _closeToolTip: function () {
        if (!('noToolTip' in jnprDataTableObj.getConfigFor(this.props.appId) && jnprDataTableObj.getConfigFor(this.props.appId).noToolTip)) {
            var dom;
            if (dom = document.getElementsByClassName('ui-tooltip')[0])
                dom.remove()
        }
    },

    overflowScrolling: function () {
        // only used for ngcsc dataTable
        if (this.props.nested)
            if (this.state.dataList.length > 0) {
                jQuery(this.refs.jnprPlainDataTable).prev('.floatThead-container').show();
                var maintable = jQuery(this.refs.jnprPlainDataTable);
                maintable.floatThead({
                    position: 'fixed',
                    scrollContainer: function (table) {
                        return table.closest('.jnprDataTableContent');
                    }
                });
                maintable.trigger('reflow');
            } else {
                jQuery(this.refs.jnprPlainDataTable).prev('.floatThead-container').hide();
            }
    },

    resizeColumn: function () {
        // only for ngcsc dataTable
        if (this.props.nested) {
            // destroy first, otherwise, resizable wil stop working in the
            // middle
            var _self = this;
            try {
                jQuery(".jnprPlainDataTable th").resizable("destroy");
            } catch (e) { }
            jQuery(".jnprPlainDataTable th").resizable({
                minWidth: 100,
                grid: [1, 10000],
                handles: "e",
                alsoResize: jnprDataTableObj.config.resizeMode ? (jnprDataTableObj.config.resizeMode === 'table' ? ('#table' + _self.props.appId) : 'column') : "column",
                create: function (event, ui) {
                    jQuery(event.target).find('.ui-resizable-e').css('cursor', 'col-resize');
                },
                stop: function (event, ui) {
                    _self.columnHeaderResized(ui.element.attr('data-columnname'), ui.size.width, jQuery(".jnprPlainDataTable").width());
                    _self.overflowScrolling();
                }
            });
        }
    },
    // now we need to save value into configuration
    columnHeaderResized: function (key, col_width, table_width) {
        jnprDataTableObj.setColumnWidth(this.props.appId, key, col_width);
        jnprDataTableObj.setColumnWidth(this.props.appId, 'tableWidth', table_width);
    },

    componentDidUpdate: function () {
        if (this.props.nested && !this.running) {
            this.resizeColumn();
            this.overflowScrolling();
        }

    },

    componentWillUnmount: function () {
        var win = window;
        if (win.removeEventListener) {
            win.removeEventListener('resize', this._updateWidth, false);
        } else if (win.detachEvent) {
            win.detachEvent('onresize', this._updateWidth);
        }

        if (this.props.destroy)
            this.props.destroy();
        DataTableStore.removeColumnFilterListener(this.props.appId, this._columnFilterCallBack);
        DataTableStore.removeColumnSorterListener(this.props.appId, this._sortCallBack);
        DataTableStore.removeColumnsUpdateListener(this.props.appId, this.updateSelectedColumns);
        DataTableStore.removeAccountsUpdates(this.props.appId, this.accountSelectCallBack);
        DataTableStore.removeFiltersUpdates(this.props.appId, this._filterCallBack);
        DataTableStore.removeFiltersReset(this.props.appId, this._filterResetFromController);
        DataTableStore.removeAutoCompleteAccounts(this.props.appId, this._autoCompleteAccounts);
        DataTableStore.removeUpdatePagePerPage(this.props.appId, this._updateRecordsPerPage);
        DataTableStore.removeColumnReordered(this.props.appId, this._columnReordered);
        DataTableStore.removeCellClickParentCallBackHandler(this.props.appId, this._cellClicked);
        DataTableStore.removeCustomConfigurationDefaultCallBackHandler(this.props.appId, this._defaultConfigCallBack);
        DataTableStore.removeCustomConfigurationDeleteCallBackHandler(this.props.appId, this._deleteConfigCallBack);
        DataTableStore.removeCustomConfigurationUpdateCallBackHandler(this.props.appId, this._updateConfigCallBack);
        // add checkall Listener
        DataTableStore.removeCheckAllRowHandler(this.props.appId, this._checkAll);
        DataTableStore.removeActionButtonClickHandler(this.props.appId, this._actionButtonClickHandler);
        DataTableStore.removeCustomConfigViewingHandler(this.props.appId, this._viewingConfigCallBack);
        DataTableStore.removeJumpToRow(this.props.appId, this._jumpToRow);
        // now we need to unsubstribe all the callBack handler from singleton
        // dataTableObject
        // jnprDataTableObj.unsubscribeAllFor( this.props.appId );
        DataTableStore.removeChangeControllerType(this.props.appId, this._changeControllerType);

        DataTableStore.removeFrozenColumnChanged(this.props.appId, this._changeColumnFrozen);

        if (!('nestedContent' in this.props)) {
            DataTableStore.removeNestedNextPage(this.props.appId, this._addNestedNextPage);
            DataTableStore.removeNestedSort(this.props.appId, this._addNestedSort);
            DataTableStore.removeNestedFilter(this.props.appId, this._addNestedFilter)
        }

        DataTableStore.removeCellActionClickHandler(this.props.appId, this._cellActionClickHandler);
        DataTableStore.removeCellActionMouseOverHandler(this.props.appId, this._cellActionMouseOverHandler);
        DataTableStore.removeCellActionMouseOutHandler(this.props.appId, this._cellActionMouseOutHandler);
        DataTableStore.removeCellUpdateHandler(this.props.appId, this._addCellUpdateHandler);
        jnprDataTableObj.cleanAllFor(this.props.appId);

        jQuery('#jnprDataTableContent_' + this.props.appId).off('mouseenter', function () {
            document.body.style.overflow = 'hidden';
        });
        jQuery('#jnprDataTableContent_' + this.props.appId).off('mouseleave', function () {
            document.body.style.overflow = 'auto';
        });
        window.removeEventListener('keyup', this._closeToolTip, false);

        if (!('noToolTip' in jnprDataTableObj.getConfigFor(this.props.appId) && jnprDataTableObj.getConfigFor(this.props.appId).noToolTip)) {
            jQuery(this.refs.jnprDataTable).tooltip('close').tooltip('destroy');
        }
    },

    _addCellUpdateHandler: function (rowIndex, columnId, data) {
        // let originalData = this.state.originalDataList;
        let originalData =  this.state.dataList;
        let updatedDataList = [];
        let columnType = this.state.selectedColumns[columnId].type;

        //update datalist with the selected values
        _.each(originalData, function (rowData, idx) {
            if (idx == rowIndex) {
                let obj = {};
                obj = rowData;

                if (columnType == 'datepicker') {
                    obj[columnId]['value'] = data['date'];
                } else if (columnType == 'checkbox') {
                    obj[columnId]['value'] = data;
                } else if (columnType == 'single_select') {
                    let updatedOpts = [];
                    _.each(obj[columnId]['value'], function (sOpt) {
                        if (sOpt['value'] == data) {
                            sOpt['selected'] = true;
                        } else {
                            sOpt['selected'] = false;
                        }
                        updatedOpts.push(sOpt);
                    });
                    obj[columnId]['value'] = updatedOpts;
                }

                updatedDataList.push(obj);

            } else {
                updatedDataList.push(rowData);
            }
        });

        // jnprDataTableObj.setDataListFor(this.props.appId, updatedDataList);
        this.setState({
            dataList: updatedDataList
        });
        this._updateCustomComponents(updatedDataList);
        var rows = jnprDataTableObj.getProcessedDataListFor(this.props.appId);
        if ('cellDataUpdateCallBackHandler' in this.props) {
            this.props.cellDataUpdateCallBackHandler(rows[rowIndex], columnId, data, rows);
        }
    },
    _cellActionMouseOverHandler: function (row, cell, item) {
        if ('cellActionMouseOverHandler' in this.props)
            this.props.cellActionMouseOverHandler(row, cell, item);
    },

    _cellActionMouseOutHandler: function (row, cell, item) {
        if ('cellActionMouseOutHandler' in this.props)
            this.props.cellActionMouseOutHandler(row, cell, item);
    },

    _cellActionClickHandler: function (row, cell, action) {
        if ('cellActionClickHandler' in this.props)
            this.props.cellActionClickHandler(row, cell, action);
    },

    _addNestedNextPage: function (type) {
        if ('nestedNextPageHandler' in this.props)
            this.props.nestedNextPageHandler(type, this.getCurrentPage());
    },

    _addNestedSort: function (type, key, up) {
        if ('nestedSortHandler' in this.props)
            this.props.nestedSortHandler(type, key, up);
    },

    _addNestedFilter: function (type, filterObject) {
        if ('nestedFilterHandler' in this.props)
            this.props.nestedFilterHandler(type, filterObject);
    },

    _changeControllerType: function (type) {

        if (type === 'Column' && 'title_column_option' in jnprDataTableObj.config)
            type = jnprDataTableObj.config['title_column_option'];
        if (type === 'Account' && 'title_account_option' in jnprDataTableObj.config)
            type = jnprDataTableObj.config['title_account_option'];
        if (type === 'Filter' && 'title_filter_option' in jnprDataTableObj.config)
            type = jnprDataTableObj.config['title_filter_option'];

        this.setState({
            controllerType: type
        });
    },

    _jumpToRow: function (jumpToRow) {
        this.setState({
            scrollToRow: jumpToRow
        });
    },

    _viewingConfigCallBack: function (subType) {
        this.setState({
            saveConfigBtnName: subType
        });
    },

    _changeDefaultCustomConfigHandler: function (subType) {
        if (this.props.defaultConfigHandler)
            this.props.defaultConfigHandler(subType);
    },

    _updateConfigCallBack: function (subType) {
        // must trygger this to save the columnResized value
        jnprDataTableObj.updateColumnWidthToCustomConfig(this.props.appId)
        if (this.props.saveConfigWithName)
            this.props.saveConfigWithName(subType, jnprDataTableObj.customConfiguration);
    },

    _defaultConfigCallBack: function (subType) {
        if (this.props.defaultConfigHandler)
            this.props.defaultConfigHandler(subType);
    },

    _deleteConfigCallBack: function (subType) {
        if (this.props.deleteConfigHandler)
            this.props.deleteConfigHandler(subType);
    },

    _cellClicked: function (data, cell) {
        if (this.props.cellClicked)
            this.props.cellClicked(data, cell);
    },

    _actionButtonClickHandler: function (data) {
        if (this.props.actionButtonClickHandler)
            this.props.actionButtonClickHandler(data);
    },


    // this is to check for all checkbox
    _checkAll: function (checked) {
        // for this method, we need to change all the data to checked value
        jnprDataTableObj.setCheckStatusForAll(this.props.appId, checked);
        // setting up state
        var list = this.state.dataList;
        list.forEach(function (item) {
            if(!(item.disabledCheckbox && item.disabledCheckbox.value)){
                item.checked = checked;
            }
            
        });
        var originalList = this.state.originalDataList;
        originalList.forEach(function (item) {
            if(!(item.disabledCheckbox && item.disabledCheckbox.value)){
                item.checked = checked;
            }
        });
        this.setState({
            dataList: list,
            originalList: originalList
        });
        this.adjustTableHeight();
        var _this = this;
        setTimeout(function () {
            DataTableAction.performCheckRowUpdated(this.props.appId);
            if (_this.props.checkBoxCallBackHandler) {
                _this.props.checkBoxCallBackHandler();
            }
        }.bind(this), 0);
    },

    _checkHandler: function (rowIndex, checked) {
        var list = this.state.dataList;
        // let's update originalData
        jnprDataTableObj.setCheckStatusForOne(this.props.appId, list[rowIndex], checked);
        // then update this particular record
        list[rowIndex].checked = checked;
        // next we need to set up the new dataList/OriginalDataList based on
        // user's check status
        this.setState({
            dataList: list,
            originalList: JSON.parse(JSON.stringify(jnprDataTableObj.dataList || null))
        });
        this.adjustTableHeight();
        DataTableAction.performCheckRowUpdated(this.props.appId);
    },

    // change tableHeight here
    _currentNumPerPage: 10,
    _updateRecordsPerPage: function (num, noSave) {
        // we need to get second row, as first row is the thead, second row is
        // more
        // accurate
        // also, giving some buffer
        if (this.props.nested)
            this.setState({ tableHeight: (this.refs.jnprPlainDataTable.rows[1].offsetHeight * num) + 51 });
        else {
            if (num == 50) {
                //if we have just 50 records, usually first page, then we need to reduce the table height a little so as to enforce the vertical scrol bar
                this.setState({ tableHeight: (this.state.rowHeight * num) + this.state.headerHeight - 20 });
            } else {
                this.setState({ tableHeight: (this.state.rowHeight * num) + this.state.headerHeight + 19 });
            }

        }
        this._currentNumPerPage = num;

        if (noSave !== true && this.props.updateNumPerPageHandler)
            this.props.updateNumPerPageHandler(num);
    },

    _unloadme: function () {
        if (this.props.destroy)
            this.props.destroy();
    },

    _updateWidth: function () {

        if (this.props.nested) {
            if ('jnprDataTableContent' in this.refs && 'offsetWidth' in this.refs.jnprDataTableContent)
                this.setState({
                    tableWidth: this.refs.jnprDataTableContent.offsetWidth
                });
        }
        else {
            if ('plain' in this.props && this.props.plain === true) {

                if ('jnprDataTable' in this.refs && 'offsetWidth' in this.refs.jnprDataTable && this.refs.jnprDataTable.offsetWidth > 0) {
                    this.setState({
                        tableWidth: this.refs.jnprDataTable.offsetWidth - 20
                    });
                } else {
                    setTimeout(function () {
                        if ('jnprDataTable' in this.refs && 'offsetWidth' in this.refs.jnprDataTable && this.refs.jnprDataTable.offsetWidth > 0)
                            this.setState({
                                tableWidth: this.refs.jnprDataTable.offsetWidth - 20
                            });
                    }.bind(this), 0);
                }
            } else {
                if ('jnprDataTableContent' in this.refs && 'offsetWidth' in this.refs.jnprDataTableContent)
                    //this small delay is making sure the horizontal scroller is gone in first loading
                    setTimeout(() => {
                        this.setState({
                            tableWidth: this.refs.jnprDataTableContent.offsetWidth - 10
                        });
                    }, 0);

            }
        }
    },

    _toggleTableWidth: function () {
        this.setState({
            tableMax: !this.state.tableMax
        });
        setTimeout(() => {
            this.overflowScrolling();
        }, 200);
    },

    _toggleTableWidthFB: function () {
        this.setState({
            tableMax: !this.state.tableMax
        });
        if (this.props.trackingEventHandler) {
            this.props.trackingEventHandler(EventTypes.PERFORM_TABLE_LEFT_PANEL, this.state.tableMax);
        }
        setTimeout((function () {
            this._updateWidth();
        }).bind(this), 0);
    },

    accountSelectCallBack: function (accounts) {

        var values = [];
        var ids = [];
        var names = [];
        var nameJoin = [];
        var tmp = [];
        accounts.map(function (item) {
            tmp = item.split(":");
            nameJoin = tmp.slice(1,-1);

            ids.push(tmp[tmp.length-1]);
            names.push(nameJoin.join(":"));
        });

        var currentFilterModel = JSON.parse(JSON.stringify(jnprDataTableObj.customConfiguration.filterModel));
        if (this._getGlobal()) {
            // using accountID
            currentFilterModel['accountId'] = {
                comp: "in",
                value1: ids
            };
        } else {
            // using accountname
            currentFilterModel['accountName'] = {
                comp: "in",
                value1: names
            };
        }
        this._filterCallBack(currentFilterModel, null, true);
        // write directly to user's configuration object
        jnprDataTableObj.setDefaultSelectedAccountList(accounts, this.props.appId);
    },

    _autoCompleteAccounts: function (term) {

        if (term == "") {
            list = this.state.originalAccountList;
        } else {
            if (this.state.globalAutoComplete) {
                if (this.props.accountSearchCallBack)
                    this.props.accountSearchCallBack(term);
            } else {
                var list = [];
                this.state.originalAccountList.map((account, i) => {
                    if (account.accountName.toLowerCase().includes(term) || account.accountId.toLowerCase().includes(term)) {
                        list.push(account);
                    }
                });
                this.setState({
                    accountList: list
                });
            }
        }
    },

    _addConfig: function (ev) {
        if (ev.type == 'click' || (ev.charCode == 13 && ev.type == 'keypress')) {
            if (this.refs.configName1.value.trim() == "") {
                alert("Please enter the name to save.");
            } else {
                // posting to api for adding this config
                if (this._saveConfigWithName) {
                    this._saveConfigWithName(this.refs.configName1.value.trim().toLowerCase()); // enforce
                    // the
                    // case
                    // to
                    // lower
                    // one
                    // to
                    // avoid
                    // any
                    // conflicts
                    // and
                    // duplicates
                    this.setState({
                        saveConfigBtnName: this.refs.configName1.value.trim().toLowerCase()
                    });
                }
                jQuery(".config-input").val("");
            }
        }
    },


    _saveConfig: function () {
        if (this.props.saveConfigCallBack)
            this.props.saveConfigCallBack(jnprDataTableObj.allCustomConfigurations);
    },

    _saveConfigWithName: function (name) {
        jnprDataTableObj.appId = this.props.appId;
        // must call this method to save resized size
        jnprDataTableObj.updateColumnWidthToCustomConfig(this.props.appId)
        if (this.props.saveConfigWithName)
            this.props.saveConfigWithName(name, jnprDataTableObj.customConfiguration);

        // now, let's udpate dataTable Object
        jnprDataTableObj.getAvailableConfigsFor(this.props.appId)[name] = {
            value: _.clone(jnprDataTableObj.customConfiguration), // must pass
            // copy of
            // the
            // project,
            // otherwise,
            // once
            // reset, it
            // will be
            // null
            default: false
        };
        jnprDataTableObj.setCurrentConfigFor(this.props.appId, name);
        DataTableAction.performMultiConfigWithNameSaved(this.props.appId, name);

    },

    _toggleSaveConfig: function (event) {
        if (event) {
            event.stopPropagation();
        }
        this.setState({
            showSaveBtnOptions: !this.state.showSaveBtnOptions
        });
        if (this.state.showSaveConfig) {
            this.setState({
                showSaveConfig: !this.state.showSaveConfig
            });
        }
    },

    _toggleSaveAs: function (event) {
        event.stopPropagation();
        this.setState({
            showSaveConfig: !this.state.showSaveConfig
        });
    },

    detailPopupColName: "",
    showingAt: 0,
    _showDetailCallBack: function (element, rowIndex, colName, expanded, offsetX, offsetY) {
        if (!expanded) {
            if (this.props.positionHandler) {
                this.props.positionHandler(element, '#divCellClickDetailContent_' + this.props.appId, offsetX, offsetY, expanded);
            } else {
                var offset = jQuery(element).offset();
                var posY = offset.top - jQuery(window).scrollTop();
                var posX = offset.left - jQuery(window).scrollLeft();
                jQuery('#divCellClickDetailContent_' + this.props.appId).css({
                    top: (posY + offsetY) + 'px',
                    left: (posX - offsetX) + 'px',
                    display: 'block'
                });
            }
            this.showingAt = new Date().getTime();

        } else {
            if ((new Date().getTime() - this.showingAt) > 500) {
                if (this.props.positionHandler) {
                    this.props.positionHandler(element, '#divCellClickDetailContent_' + this.props.appId, offsetX, offsetY, expanded);
                } else {
                    jQuery('#divCellClickDetailContent_' + this.props.appId).css({ display: 'none' });
                }

            }
        }
        this.detailPopupColName = colName;
    },

    adjustTableHeight: function () {
        // if this is plain table, then height is fixed
        if ('plain' in this.props && this.props.plain) {
            this.setState({ tableHeight: jnprDataTableObj.getConfigFor(this.props.appId).tableHeight });
        } else {
            setTimeout(function () {
                if (this.state.dataList.length > 0 && this.state.dataList.length < 10) {

                    if (this.props.nested)
                        this.setState({ tableHeight: (this.refs.jnprPlainDataTable.rows[1].offsetHeight * this.state.dataList.length) + 40 });
                    else {

                        this.setState({ tableHeight: (this.state.rowHeight * this.state.dataList.length) + this.state.headerHeight + 18 });
                    }

                } else if (this.state.dataList.length == 0) {
                    this.setState({ tableHeight: jnprDataTableObj.getConfigFor(this.props.appId).tableHeight });
                } else {
                    this._updateRecordsPerPage(this._currentNumPerPage, true);
                }
            }.bind(this), 0);
        }
    },

    _simpleSave: function () {
        this._saveConfigWithName("My Default");
    },

    _onSaveBtnBlur: function () {
        this.setState({
            showSaveBtnOptions: false,
            showSaveConfig: false
        });
    },

    _showDetailExtraDataCallBack: function (type, data) {
        if ('showDetailExtraDataCallBack' in this.props)
            this.props.showDetailExtraDataCallBack(type, data);
    },

    _extraDataCallBack: function (data) {
        if ('extraDataCallBack' in this.props)
            this.props.extraDataCallBack(data);
    },

    getCurrentPage: function () {
        var currentP = this.currentPage;
        this.currentPage++;
        return currentP;
    },

    resetCurrentPage: function () {
        this.currentPage = 1;
    },

    rowClassNameGetter: function (index) {
        var list = jnprDataTableObj.getProcessedDataListFor(this.props.appId);
        if ('rowClassNameGetter' in this.props) {
            return this.props.rowClassNameGetter(index, list);
        } else {
            if (jnprDataTableObj.isRowHighlighted(this.props.appId, index)) {
                return 'highlighted';
            } else {
                return '';
            }
        }
    },

    onRowMouseLeave: function (data, index) {
        if ('onRowMouseLeave' in this.props) {
            this.props.onRowMouseLeave(data, index);
        }
    },

    onRowMouseEnter: function (data, index) {
        if ('onRowMouseEnter' in this.props) {
            this.props.onRowMouseEnter(data, index);
        }
    },

    changeTimeZone: function (zone) {
        var subType = jnprDataTableObj.updateTimezoneFor(this.props.appId, zone);
        this._reloadDataForAll(jnprDataTableObj.customConfiguration.filterModel, jnprDataTableObj.customConfiguration.sortModel, true);

        if ('mode' in jnprDataTableObj.config && jnprDataTableObj.config.mode !== 'R') {
          if (jnprDataTableObj.isTimeZoneGlobalFor(this.props.appId)) {
            // this is global, we need to call different timeZone call back
            // url
            if ('updateGlobalTimeZone' in this.props) {
              this.props.updateGlobalTimeZone(zone.getAbbreviation());
            }
          } else if (this.props.saveConfigWithName) {
            this.props.saveConfigWithName(subType, jnprDataTableObj.customConfiguration);
          }
        }else if('mode' in jnprDataTableObj.config && jnprDataTableObj.config.mode === 'R'){

            if ('updateGlobalTimeZone' in this.props) {
              this.props.updateGlobalTimeZone(null, zone.getAbbreviation());
            }

        }

    },

    _changeColumnFrozen: function (subType) {
        if (this.props.saveConfigWithName)
            this.props.saveConfigWithName(subType, jnprDataTableObj.customConfiguration);
        // now we need to update column frozen state
        this.setState({
            frozenColumns: this._getFrozenColumns()
        })
    },

    _debounce: function (cb) {
        if (!this._functions) {
            this._functions = [];
        }
        this._functions.push(cb);

        if (!this._timeIds) {
            this._timeIds = [];
        }
        var _this = this;
        this._timeIds.push(
            setTimeout(function () {
                //when timeout happened, we need to run last function
                _this._functions.pop()();
                _this._functions = [];
                //and clear all the timeout
                _this._timeIds.forEach(function (timeId) {
                    clearTimeout(timeId);
                });
            }, 500)
        );
    },

    _subRowHeightGetter: function (index) {
        var list = jnprDataTableObj.getProcessedDataListFor(this.props.appId);
        if ('subRowHeightGetter' in this.props) {
            return this.props.subRowHeightGetter(index, list);
        } else {
            return null;
        }
    },

    _rowExpandedGetter: function ({ rowIndex, width, height}) {
        var list = jnprDataTableObj.getProcessedDataListFor(this.props.appId);
        if ('rowExpandedGetter' in this.props) {
            return this.props.rowExpandedGetter({ rowIndex, width, height, list });
        } else {
            return null;
        }
    }
};

module.exports = DataTableMixins;
