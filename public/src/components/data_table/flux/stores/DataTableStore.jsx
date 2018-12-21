var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../actions/ActionTypes');
var EventEmitter = require('events').EventEmitter;

EventEmitter.prototype.setMaxListeners(0);

var assign = require('object-assign');

const
RESET_COLUMN_FILTERS = 'reset_column_filters';
const
PERFORM_COLUMN_FILTER = 'PERFORM_COLUMN_FILTER';
const
PERFORM_COLUMN_SORTER = 'PERFORM_COLUMN_SORT';
const
PERFORM_COLUMN_CHOOSER = 'PERFORM_COLUMN_CHOOSER';
const
PERFORM_ACCOUNT_CHOOSER = 'PERFORM_ACCOUNT_CHOOSER';
const
PERFORM_FILTERS_UPDATE = 'PERFORM_FILTERS_UPDATE';
const
PERFORM_FILTERS_RESET = 'PERFORM_FILTERS_RESET';
const
PERFORM_AUTO_COMPLETE_ACCOUTS = 'PERFORM_AUTO_COMPLETE_ACCOUTS';
const
TABLE_RECORDS_PER_PAGE = 'TABLE_RECORDS_PER_PAGE';
const
COLUMN_REORDERED = 'COLUMN_REORDERED';
const
COLUMN_HEADER_SORTER_RESET = 'COLUMN_HEADER_SORTER_RESET';
const
CELL_CLICK_PARENT_CALLBACK = 'CELL_CLICK_PARENT_CALLBACK';
const
COLUMN_HEADER_RESIZED = 'COLUMN_HEADER_RESIZED';
const
FILTER_UPDATED_CHANGE_HIDDEN = 'FILTER_UPDATED_CHANGE_HIDDEN';
const
CUSTOM_CONFIGURATION_CHNAGED = 'CUSTOM_CONFIGURATION_CHNAGED';
const
CUSTOM_CONFIGURATION_DEFAULT = 'CUSTOM_CONFIGURATION_DEFAULT';
const
CUSTOM_CONFIGURATION_DELETE = 'CUSTOM_CONFIGURATION_DELETE';
const
CUSTOM_CONFIGURATION_UPDATE = 'CUSTOM_CONFIGURATION_UPDATE';
const
CLOSE_CELL_DETAIL_POPUP = 'CLOSE_CELL_DETAIL_POPUP';
const
CHECK_ALL_ROWS = 'CHECK_ALL_ROWS';
const
CHECK_ROWS_UPDATED = 'CHECK_ROWS_UPDATED';
const
COLUMN_RESIZED = 'COLUMN_RESIZED';
const
MULTI_CONFIG_WITH_NAME_SAVED = 'MULTI_CONFIG_WITHNAME_SAVED';
const
ACTION_BUTTON_CLICKED_OPENCASES = 'ACTION_BUTTON_CLICKED_OPENCASES';
const
CUSTOM_CONFIGURATION_CREATED = 'CUSTOM_CONFIGURATION_CREATED';
const
CUSTOM_CONFIGURATION_VIEWING = 'CUSTOM_CONFIGURATION_VIEWING';
const
ACCOUNT_SELECT_CHANGED = 'ACCOUNT_SELECT_CHANGED';
const
TOTAL_FILTER_NUM_UPDATE = 'TOTAL_FILTER_NUM_UPDATE';
const
VERTICAL_SCROLL_END = 'VERTICAL_SCROLL_END';
const
JUMP_TO_ROW = 'JUMP_TO_ROW';
const
CHNAGE_CONTROLLER_TYPE = 'CHNAGE_CONTROLLER_TYPE';
const
FROZEN_COLUMN_UPDATE = 'FROZEN_COLUMN_UPDATE';
const
NESTED_CONTENT_TAB_CHANGED = 'NESTED_CONTENT_TAB_CHANGED';
const
NESTED_CONTENT_NEXT_PAGE = 'NESTED_CONTENT_NEXT_PAGE';
const
NESTED_CONTENT_DATAUPDATED = 'NESTED_CONTENT_DATAUPDATED';
const
NESTED_CONTENT_SORT = 'NESTED_CONTENT_SORT';
const
NESTED_CONTENT_FILTER = 'NESTED_CONTENT_FILTER';
const
CELL_ACTION_CLICK_PARENT_CALLBACK = 'CELL_ACTION_CLICK_PARENT_CALLBACK';
const
UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL='UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL';
const CELL_ACTION_MOUSE_OVER = 'CELL_ACTION_MOUSE_OVER';
const CELL_ACTION_MOUSE_OUT = 'CELL_ACTION_MOUSE_OUT';
const CELL_DATA_UPDATE = 'CELL_DATA_UPDATE';

var DataTableStore = assign(
    {},
    EventEmitter.prototype,
    {

      addColumnFilterListener : function(appId, callback) {
        this.on(PERFORM_COLUMN_FILTER + '_' + appId, callback);
      },
      removeColumnFilterListener : function(appId, callback) {
        this.removeListener(PERFORM_COLUMN_FILTER + '_' + appId, callback);
      },
      emitDoColumnFilter : function(appId, filterObj, global) {
        this.emit(PERFORM_COLUMN_FILTER + '_' + appId, filterObj, global);
      },

      addColumnSorterListener : function(appId, callback) {
        this.on(PERFORM_COLUMN_SORTER + '_' + appId, callback);
      },
      removeColumnSorterListener : function(appId, callback) {
        this.removeListener(PERFORM_COLUMN_SORTER + '_' + appId, callback);
      },
      emitDoColumnSorter : function(appId, columnName, up, global) {
        this.emit(PERFORM_COLUMN_SORTER + '_' + appId, columnName, up, global);
      },

      addColumnsUpdateListener : function(appId, callback) {
        this.on(PERFORM_COLUMN_CHOOSER + '_' + appId, callback);
      },
      removeColumnsUpdateListener : function(appId, callback) {
        this.removeListener(PERFORM_COLUMN_CHOOSER + '_' + appId, callback);
      },
      emitColumnChooserUpdates : function(appId, columns) {
        this.emit(PERFORM_COLUMN_CHOOSER + '_' + appId, columns);
      },

      addAccountsUpdates : function(appId, callback) {
        this.on(PERFORM_ACCOUNT_CHOOSER + '_' + appId, callback);
      },
      removeAccountsUpdates : function(appId, callback) {
        this.removeListener(PERFORM_ACCOUNT_CHOOSER + '_' + appId, callback);
      },
      emitAccountChooserUpdates : function(appId, accounts, global) {
        this.emit(PERFORM_ACCOUNT_CHOOSER + "_" + appId, accounts, global);
      },

      addFiltersUpdates : function(appId, callback) {
        this.on(PERFORM_FILTERS_UPDATE + "_" + appId, callback);
      },
      removeFiltersUpdates : function(appId, callback) {
        this.removeListener(PERFORM_FILTERS_UPDATE + "_" + appId, callback);
      },
      emitFiltersUpdates : function(appId, filtersObj, global) {
        this.emit(PERFORM_FILTERS_UPDATE + "_" + appId, filtersObj, global);
      },
      addFiltersReset : function(appId, callback) {
        this.on(PERFORM_FILTERS_RESET + "_" + appId, callback);
      },
      removeFiltersReset : function(appId, callback) {
        this.removeListener(PERFORM_FILTERS_RESET + "_" + appId, callback);
      },
      emitFiltersReset : function(appId, noDataReset, noChangingDefault,
          fromResetClick) {
        this.emit(PERFORM_FILTERS_RESET + "_" + appId, noDataReset,
            noChangingDefault, fromResetClick);
      },

      addAutoCompleteAccounts : function(appId, callback) {
        this.on(PERFORM_AUTO_COMPLETE_ACCOUTS + "_" + appId, callback);
      },
      removeAutoCompleteAccounts : function(appId, callback) {
        this.removeListener(PERFORM_AUTO_COMPLETE_ACCOUTS + "_" + appId,
            callback);
      },
      emitAutoCompleteAccounts : function(appId, term) {
        this.emit(PERFORM_AUTO_COMPLETE_ACCOUTS + "_" + appId, term);
      },
      addUpdatePagePerPage : function(appId, callback) {
        this.on(TABLE_RECORDS_PER_PAGE + "_" + appId, callback);
      },
      removeUpdatePagePerPage : function(appId, callback) {
        this.removeListener(TABLE_RECORDS_PER_PAGE + "_" + appId, callback);
      },
      emitUpdatePagePerPage : function(appId, num) {
        this.emit(TABLE_RECORDS_PER_PAGE + "_" + appId, num);
      },
      addColumnReordered : function(appId, callback) {
        this.on(COLUMN_REORDERED + "_" + appId, callback);
      },
      removeColumnReordered : function(appId, callback) {
        this.removeListener(COLUMN_REORDERED + "_" + appId, callback);
      },
      emitColumnReordered : function(appId) {
        this.emit(COLUMN_REORDERED + "_" + appId);
      },

      addColumnHeaderSorterReset : function(appId, callback) {
        this.on(COLUMN_HEADER_SORTER_RESET + "_" + appId, callback);
      },
      removeColumnHeaderSorterReset : function(appId, callback) {
        this.removeListener(COLUMN_HEADER_SORTER_RESET + "_" + appId, callback);
      },
      emitColumnHeaderSorterReset : function(appId) {
        this.emit(COLUMN_HEADER_SORTER_RESET + "_" + appId);
      },

      addCellClickParentCallBackHandler : function(appId, callback) {
        this.on(CELL_CLICK_PARENT_CALLBACK + "_" + appId, callback);
      },
      removeCellClickParentCallBackHandler : function(appId, callback) {
        this.removeListener(CELL_CLICK_PARENT_CALLBACK + "_" + appId, callback);
      },
      emitCellClickParentCallback : function(appId, data, cell) {
        this.emit(CELL_CLICK_PARENT_CALLBACK + "_" + appId, data, cell);
      },

      addFilterUpdateShowHiddenCallBackHandler : function(appId, callback) {
        this.on(FILTER_UPDATED_CHANGE_HIDDEN + "_" + appId, callback);
      },
      removeFilterUpdateShowHiddenCallBackHandler : function(appId, callback) {
        this.removeListener(FILTER_UPDATED_CHANGE_HIDDEN + "_" + appId,
            callback);
      },

      emitFilterUpdateShowHidden : function(appId) {
        this.emit(FILTER_UPDATED_CHANGE_HIDDEN + "_" + appId);
      },

      addCustomConfigurationChangedCallBackHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_CHNAGED + "_" + appId, callback);
      },
      removeCustomConfigurationChangedCallBackHandler : function(appId,
          callback) {
        this.removeListener(CUSTOM_CONFIGURATION_CHNAGED + "_" + appId,
            callback);
      },
      emitCustomConfigurationChanged : function(appId, fromExternalCallBack) {
        this.emit(CUSTOM_CONFIGURATION_CHNAGED + "_" + appId, fromExternalCallBack);
      },

      addCustomConfigurationDefaultCallBackHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_DEFAULT + "_" + appId, callback);
      },
      removeCustomConfigurationDefaultCallBackHandler : function(appId,
          callback) {
        this.removeListener(CUSTOM_CONFIGURATION_DEFAULT + "_" + appId,
            callback);
      },
      emitCustomConfigurationDefault : function(appId, subType, noNotice) {
        this
            .emit(CUSTOM_CONFIGURATION_DEFAULT + "_" + appId, subType, noNotice);
      },

      addCustomConfigurationDeleteCallBackHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_DELETE + "_" + appId, callback);
      },
      removeCustomConfigurationDeleteCallBackHandler : function(appId, callback) {
        this
            .removeListener(CUSTOM_CONFIGURATION_DELETE + "_" + appId, callback);
      },
      emitCustomConfigurationDelete : function(appId, subType) {
        this.emit(CUSTOM_CONFIGURATION_DELETE + "_" + appId, subType);
      },

      addCustomConfigurationUpdateCallBackHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_UPDATE + "_" + appId, callback);
      },
      removeCustomConfigurationUpdateCallBackHandler : function(appId, callback) {
        this
            .removeListener(CUSTOM_CONFIGURATION_UPDATE + "_" + appId, callback);
      },
      emitCustomConfigurationUpdate : function(appId, subType) {
        this.emit(CUSTOM_CONFIGURATION_UPDATE + "_" + appId, subType);
      },

      addCloseCellDetailPopup : function(appId, callback) {
        this.on(CLOSE_CELL_DETAIL_POPUP + "_" + appId, callback);
      },
      removeCloseCellDetailPopup : function(appId, callback) {
        this.removeListener(CLOSE_CELL_DETAIL_POPUP + "_" + appId, callback);
      },
      emitCloseCellDetailPopup : function(appId, colName) {
        this.emit(CLOSE_CELL_DETAIL_POPUP + "_" + appId, colName);
      },

      addCheckAllRowHandler : function(appId, callback) {
        this.on(CHECK_ALL_ROWS + "_" + appId, callback);
      },
      removeCheckAllRowHandler : function(appId, callback) {
        this.removeListener(CHECK_ALL_ROWS + "_" + appId, callback);
      },
      emitCheckAllRows : function(appId, checked) {
        this.emit(CHECK_ALL_ROWS + "_" + appId, checked);
      },

      addCheckRowsUpdated : function(appId, callback) {
        this.on(CHECK_ROWS_UPDATED + "_" + appId, callback);
      },
      removeCheckRowsUpdated : function(appId, callback) {
        this.removeListener(CHECK_ROWS_UPDATED + "_" + appId, callback);
      },
      emitCheckRowsUpdated : function(appId) {
        this.emit(CHECK_ROWS_UPDATED + "_" + appId);
      },

      addColumnResizedHandler : function(appId, callback) {
        this.on(COLUMN_RESIZED + "_" + appId, callback);
      },
      removeColumnResizedHandler : function(appId, callback) {
        this.removeListener(COLUMN_RESIZED + "_" + appId, callback);
      },
      emitColumnResized : function(appId) {
        this.emit(COLUMN_RESIZED + "_" + appId);
      },

      addMultiConfigWithNameSaved : function(appId, callback) {
        this.on(MULTI_CONFIG_WITH_NAME_SAVED + "_" + appId, callback);
      },
      removeMultiConfigWithNameSaved : function(appId, callback) {
        this.removeListener(MULTI_CONFIG_WITH_NAME_SAVED + "_" + appId,
            callback);
      },
      emitMultiConfigWithNameSaved : function(appId, subType) {
        this.emit(MULTI_CONFIG_WITH_NAME_SAVED + "_" + appId, subType);
      },

      addActionButtonClickHandler : function(appId, callback) {
        this.on(ACTION_BUTTON_CLICKED_OPENCASES + "_" + appId, callback);
      },
      removeActionButtonClickHandler : function(appId, callback) {
        this.removeListener(ACTION_BUTTON_CLICKED_OPENCASES + "_" + appId,
            callback);
      },
      emitActionButtonClicked : function(appId, data) {
        this.emit(ACTION_BUTTON_CLICKED_OPENCASES + "_" + appId, data);
      },

      addCustomConfigCreatedHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_CREATED + "_" + appId, callback);
      },
      removeCustomConfigCreatedHandler : function(appId, callback) {
        this.removeListener(CUSTOM_CONFIGURATION_CREATED + "_" + appId,
            callback);
      },
      emitCustomConfigCreated : function(appId, subType) {
        this.emit(CUSTOM_CONFIGURATION_CREATED + "_" + appId, subType);
      },

      addCustomConfigViewingHandler : function(appId, callback) {
        this.on(CUSTOM_CONFIGURATION_VIEWING + "_" + appId, callback);
      },

      removeCustomConfigViewingHandler : function(appId, callback) {
        this.removeListener(CUSTOM_CONFIGURATION_VIEWING + "_" + appId,
            callback);
      },

      emitCustomConfigViewing : function(appId, data) {
        this.emit(CUSTOM_CONFIGURATION_VIEWING + "_" + appId, data);
      },

      addAccountSelectionChangedHandler : function(appId, callback) {
        this.on(ACCOUNT_SELECT_CHANGED + "_" + appId, callback);
      },

      removeAccountSelectionChangedHandler : function(appId, callback) {
        this.removeListener(ACCOUNT_SELECT_CHANGED + "_" + appId, callback);
      },

      emitAccountSelectedChanged : function(appId, data) {
        this.emit(ACCOUNT_SELECT_CHANGED + "_" + appId, data);
      },

      addTotalFilterChangedChangedHandler : function(appId, callback) {
        this.on(TOTAL_FILTER_NUM_UPDATE + "_" + appId, callback);
      },

      removeTotalFilterChangedChangedHandler : function(appId, callback) {
        this.removeListener(TOTAL_FILTER_NUM_UPDATE + "_" + appId, callback);
      },

      emitTotalFilterChanged : function(appId, data) {
        this.emit(TOTAL_FILTER_NUM_UPDATE + "_" + appId, data);
      },

      addVerticalScrollEnd : function(appId, callback) {
        this.on(VERTICAL_SCROLL_END + "_" + appId, callback);
      },

      removeVerticalScrollEnd : function(appId, callback) {
        this.removeListener(VERTICAL_SCROLL_END + "_" + appId, callback);
      },

      emitVerticalScrollEnd : function(appId, start, end) {
        this.emit(VERTICAL_SCROLL_END + "_" + appId, start, end);
      },

      addJumpToRow : function(appId, callback) {
        this.on(JUMP_TO_ROW + "_" + appId, callback);
      },
      removeJumpToRow : function(appId, callback) {
        this.removeListener(JUMP_TO_ROW + "_" + appId, callback);
      },
      emitJumpToROW : function(appId, jumpToRow) {
        this.emit(JUMP_TO_ROW + "_" + appId, jumpToRow);
      },

      addChangeControllerType : function(appId, callback) {
        this.on(CHNAGE_CONTROLLER_TYPE + "_" + appId, callback);
      },
      removeChangeControllerType : function(appId, callback) {
        this.removeListener(CHNAGE_CONTROLLER_TYPE + "_" + appId, callback);
      },
      emitChangeControllerTypes : function(appId, type) {
        this.emit(CHNAGE_CONTROLLER_TYPE + "_" + appId, type);
      },

      addFrozenColumnChanged : function(appId, callback) {
        this.on(FROZEN_COLUMN_UPDATE + "_" + appId, callback);
      },
      removeFrozenColumnChanged : function(appId, callback) {
        this.removeListener(FROZEN_COLUMN_UPDATE + "_" + appId, callback);
      },
      emitFrozenColumnChanged : function(appId, subType) {
        this.emit(FROZEN_COLUMN_UPDATE + "_" + appId, subType);
      },

      addNestedTabChanged : function(appId, callback) {
        this.on(NESTED_CONTENT_TAB_CHANGED + "_" + appId, callback);
      },
      removeNestedTabChanged : function(appId, callback) {
        this.removeListener(NESTED_CONTENT_TAB_CHANGED + "_" + appId, callback);
      },
      emitNestedTabChanged : function(appId, tabName) {
        this.emit(NESTED_CONTENT_TAB_CHANGED + "_" + appId, tabName);
      },

      addNestedNextPage : function(appId, callback) {
        this.on(NESTED_CONTENT_NEXT_PAGE + "_" + appId, callback);
      },

      removeNestedNextPage : function(appId, callback) {
        this.removeListener(NESTED_CONTENT_NEXT_PAGE + "_" + appId, callback);
      },

      emitNestedNextPage : function(appId, type) {
        this.emit(NESTED_CONTENT_NEXT_PAGE + "_" + appId, type);
      },

      addNestedContentDataUpdated : function(appId, callback) {
        this.on(NESTED_CONTENT_DATAUPDATED + "_" + appId, callback);
      },

      removeNestedContentDataUpdated : function(appId, callback) {
        this.removeListener(NESTED_CONTENT_DATAUPDATED + "_" + appId, callback);
      },

      emitNestedContentDataUpdated : function(appId, data, type) {
        this.emit(NESTED_CONTENT_DATAUPDATED + "_" + appId, data, type);
      },

      addNestedSort : function(appId, callback) {
        this.on(NESTED_CONTENT_SORT + "_" + appId, callback);
      },

      removeNestedSort : function(appId, callback) {
        this.removeListener(NESTED_CONTENT_SORT + "_" + appId, callback);
      },

      emitNestedSort : function(appId, type, key, up) {
        this.emit(NESTED_CONTENT_SORT + "_" + appId, type, key, up);
      },

      addNestedFilter : function(appId, callback) {
        this.on(NESTED_CONTENT_FILTER + "_" + appId, callback);
      },

      removeNestedFilter : function(appId, callback) {
        this.removeListener(NESTED_CONTENT_FILTER + "_" + appId, callback);
      },
      emitNestedFilter : function(appId, type, filterObject) {
        this.emit(NESTED_CONTENT_FILTER + "_" + appId, type, filterObject);
      },

      addCellActionClickHandler : function(appId, callback) {
        this.on(CELL_ACTION_CLICK_PARENT_CALLBACK + "_" + appId, callback);
      },

      removeCellActionClickHandler : function(appId, callback) {
        this.removeListener(CELL_ACTION_CLICK_PARENT_CALLBACK + "_" + appId,
            callback);
      },
      emitCellActionClickParentCallback : function(appId, data, cell, action) {
        this.emit(CELL_ACTION_CLICK_PARENT_CALLBACK + "_" + appId, data, cell,
            action);
      },

      addAutoCompleteDefaultAllSelectOptions : function(appId, callback) {
        this.on(UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL + "_" + appId, callback);
      },

      removeAutoCompleteDefaultAllSelectOptions : function(appId, callback) {
        this.removeListener(UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL + "_" + appId,
            callback);
      },

      emitAutoCompleteDefaultAllSelectOptions:function(appId, fieldName, filterObj){
        this.emit(UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL + "_" + appId, fieldName, filterObj);
      },

      addCellActionMouseOverHandler : function(appId, callback) {
        this.on(CELL_ACTION_MOUSE_OVER + "_" + appId, callback);
      },

      removeCellActionMouseOverHandler : function(appId, callback) {
        this.removeListener(CELL_ACTION_MOUSE_OVER + "_" + appId,
            callback);
      },

      emitCellActionMouseOver: function(appId, data, cell, item){
          this.emit(CELL_ACTION_MOUSE_OVER + "_" + appId, data, cell, item);
      },

      addCellActionMouseOutHandler : function(appId, callback) {
        this.on(CELL_ACTION_MOUSE_OUT + "_" + appId, callback);
      },

      removeCellActionMouseOutHandler : function(appId, callback) {
        this.removeListener(CELL_ACTION_MOUSE_OUT + "_" + appId,
            callback);
      },
      emitCellActionMouseOut: function(appId, data, cell, item){
          this.emit(CELL_ACTION_MOUSE_OUT + "_" + appId, data, cell, item);
      },

      addCellUpdateHandler : function(appId, callback) {
        this.on(CELL_DATA_UPDATE + "_" + appId, callback);
      },
      removeCellUpdateHandler : function(appId, callback) {
        this.removeListener(CELL_DATA_UPDATE + "_" + appId, callback);
      },
      emitCellDataUpdate: function(appId, rowIndex, columnId, data){
          this.emit(CELL_DATA_UPDATE + "_" + appId, rowIndex, columnId, data);
      }

    });

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch (action.actionType) {
  case ActionTypes.COLUMN_FILTER:
    DataTableStore.emitDoColumnFilter(action.appId, action.filterObj,
        action.global);
    break;
  case ActionTypes.COLUMN_SORTER:
    DataTableStore.emitDoColumnSorter(action.appId, action.columnName,
        action.up, action.global);
    break;
  case ActionTypes.COLUMN_CHOOSER_UPDATE:
    DataTableStore.emitColumnChooserUpdates(action.appId, action.columns);
    break;
  case ActionTypes.ACCOUNT_CHOOSER_UPDATE:
    DataTableStore.emitAccountChooserUpdates(action.appId, action.accounts,
        action.global);
    break;
  case ActionTypes.FILTERS_UPDATE:
    DataTableStore.emitFiltersUpdates(action.appId, action.filtersObj,
        action.global);
    break;
  case ActionTypes.FILTERS_RESET:
    DataTableStore.emitFiltersReset(action.appId, action.noDataReset,
        action.noChangingDefault, action.fromResetClick);
    break;
  case ActionTypes.AUTO_COMPLETE_ACCOUNTS:
    DataTableStore.emitAutoCompleteAccounts(action.appId, action.term);
    break;
  case ActionTypes.TABLE_RECORDS_PER_PAGE:
    DataTableStore.emitUpdatePagePerPage(action.appId, action.num);
    break;
  case ActionTypes.COLUMN_REORDERED:
    DataTableStore.emitColumnReordered(action.appId);
    break;
  case ActionTypes.COLUMN_HEADER_SORTER_RESET:
    DataTableStore.emitColumnHeaderSorterReset(action.appId);
    break;
  case ActionTypes.CELL_CLICK_PARENT_CALLBACK:
    DataTableStore.emitCellClickParentCallback(action.appId, action.data,
        action.cell);
    break;
  case ActionTypes.CELL_ACTION_CLICK_PARENT_CALLBACK:
    DataTableStore.emitCellActionClickParentCallback(action.appId, action.data,
        action.cell, action.action);
    break;
  case ActionTypes.COLUMN_HEADER_RESIZED:
    DataTableStore.emitColumnHeaderResized(action.appId, action.data);
    break;
  case ActionTypes.FILTER_UPDATED_CHANGE_HIDDEN:
    DataTableStore.emitFilterUpdateShowHidden(action.appId);
    break;
  case ActionTypes.CUSTOM_CONFIGURATION_CHNAGED:
    DataTableStore.emitCustomConfigurationChanged(action.appId, action.fromExternalCallBack);
    break;

  case ActionTypes.CUSTOM_CONFIGURATION_DEFAULT:
    DataTableStore.emitCustomConfigurationDefault(action.appId, action.subType,
        action.noNotice);
    break;

  case ActionTypes.CUSTOM_CONFIGURATION_DELETE:
    DataTableStore.emitCustomConfigurationDelete(action.appId, action.subType);
    break;

  case ActionTypes.CUSTOM_CONFIGURATION_UPDATE:
    DataTableStore.emitCustomConfigurationUpdate(action.appId, action.subType);
    break;

  case ActionTypes.CLOSE_CELL_DETAIL_POPUP:
    DataTableStore.emitCloseCellDetailPopup(action.appId, action.colName);
    break;

  case ActionTypes.CHECK_ALL_ROWS:
    DataTableStore.emitCheckAllRows(action.appId, action.checked);
    break;

  case ActionTypes.CHECK_ROWS_UPDATED:
    DataTableStore.emitCheckRowsUpdated(action.appId);
    break;

  case ActionTypes.COLUMN_RESIZED:
    DataTableStore.emitColumnResized(action.appId);
    break;
  case ActionTypes.MULTI_CONFIG_WITH_NAME_SAVED:
    DataTableStore.emitMultiConfigWithNameSaved(action.appId, action.subType);
    break;
  case ActionTypes.ACTION_BUTTON_CLICKED_OPENCASES:
    DataTableStore.emitActionButtonClicked(action.appId, action.data);
    break;
  case ActionTypes.CUSTOM_CONFIGURATION_VIEWING:
    DataTableStore.emitCustomConfigViewing(action.appId, action.data);
    break;
  case ActionTypes.ACCOUNT_SELECT_CHANGED:
    DataTableStore.emitAccountSelectedChanged(action.appId, action.data);
    break;
  case ActionTypes.TOTAL_FILTER_NUM_UPDATE:
    DataTableStore.emitTotalFilterChanged(action.appId, action.data);
    break;
  case ActionTypes.VERTICAL_SCROLL_END:
    DataTableStore
        .emitVerticalScrollEnd(action.appId, action.start, action.end);
    break;
  case ActionTypes.JUMP_TO_ROW:
    DataTableStore.emitJumpToROW(action.appId, action.rowNum);
    break;
  case ActionTypes.CHNAGE_CONTROLLER_TYPE:
    DataTableStore.emitChangeControllerTypes(action.appId, action.type);
    break;
  case ActionTypes.FROZEN_COLUMN_UPDATE:
    DataTableStore.emitFrozenColumnChanged(action.appId, action.subType);
    break;
  case ActionTypes.NESTED_CONTENT_TAB_CHANGED:
    DataTableStore.emitNestedTabChanged(action.appId, action.tabName);
    break;
  case ActionTypes.NESTED_CONTENT_NEXT_PAGE:
    DataTableStore.emitNestedNextPage(action.appId, action.type);
    break;
  case ActionTypes.NESTED_CONTENT_SORT:
    DataTableStore.emitNestedSort(action.appId, action.type, action.key,
        action.up);
    break;
  case ActionTypes.NESTED_CONTENT_FILTER:
    DataTableStore.emitNestedFilter(action.appId, action.type,
        action.filterObject);
    break;
  case ActionTypes.NESTED_CONTENT_DATAUPDATED:
    DataTableStore.emitNestedContentDataUpdated(action.appId, action.data,
        action.type);
    break;
  case ActionTypes.UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL:
    DataTableStore.emitAutoCompleteDefaultAllSelectOptions(action.appId, action.fieldName,
        action.filterModel);
    break;
  case ActionTypes.CELL_ACTION_MOUSE_OVER:
      DataTableStore.emitCellActionMouseOver(action.appId, action.data,
          action.cell, action.item);
      break;
  case ActionTypes.CELL_ACTION_MOUSE_OUT:
      DataTableStore.emitCellActionMouseOut(action.appId, action.data,
          action.cell, action.item);
      break;
  case ActionTypes.CELL_DATA_UPDATE:
      DataTableStore.emitCellDataUpdate(action.appId, action.rowIndex, action.columnId, action.data);
      break;
  }

});

module.exports = DataTableStore;
