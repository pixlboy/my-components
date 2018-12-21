var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('./ActionTypes');
var DataTableActions = {
  resetAllColumnFilters : function(appId) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_FILTER_RESET,
      appId : appId
    });
  },

  performColumnFilter : function(appId, filterObj, global) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_FILTER,
      filterObj : filterObj,
      global : global,
      appId : appId
    });
  },
  performColumnSorter : function(appId, columnName, up, global) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_SORTER,
      columnName : columnName,
      up : up,
      global : global,
      appId : appId
    });
  },
  performColumnsUpdate : function(appId, columns) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_CHOOSER_UPDATE,
      columns : columns,
      appId : appId
    });
  },
  performAccountsUpdate : function(appId, accounts, global) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.ACCOUNT_CHOOSER_UPDATE,
      accounts : accounts,
      global : global,
      appId : appId
    });
  },
  performFiltersUpdate : function(appId, filtersObj, global) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.FILTERS_UPDATE,
      filtersObj : filtersObj,
      global : global,
      appId : appId
    });
  },
  performFiltersReset : function(appId, noDataReset, noChangingDefault,
      fromResetClick) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.FILTERS_RESET,
      appId : appId,
      noDataReset : noDataReset,
      noChangingDefault : noChangingDefault,
      fromResetClick : fromResetClick
    });
  },
  performAutoCompleteAccout : function(appId, term) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.AUTO_COMPLETE_ACCOUNTS,
      term : term,
      appId : appId
    });
  },
  performUpdateRecordsPerPage : function(appId, num) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.TABLE_RECORDS_PER_PAGE,
      num : num,
      appId : appId
    });
  },
  performColumsReordered : function(appId) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_REORDERED,
      appId : appId
    });
  },
  performColumsHeaderSortReset : function(appId) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_HEADER_SORTER_RESET,
      appId : appId
    });
  },
  performCellClickParentCallBack : function(appId, data, cell) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CELL_CLICK_PARENT_CALLBACK,
      appId : appId,
      data : data,
      cell : cell
    });
  },
  performCellActionClickParentCallBack : function(appId, data, cell, action) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CELL_ACTION_CLICK_PARENT_CALLBACK,
      appId : appId,
      data : data,
      cell : cell,
      action : action
    });
  },

  performCellActionMouseOverCallBack : function(appId, data, cell, item) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CELL_ACTION_MOUSE_OVER,
      appId : appId,
      data : data,
      cell : cell,
      item : item
    });
  },

  performCellActionMouseOutCallBack : function(appId, data, cell, item) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CELL_ACTION_MOUSE_OUT,
      appId : appId,
      data : data,
      cell : cell,
      item : item
    });
  },

  performFilterUpdatedCallBack : function(appId, data) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.FILTER_UPDATED_CHANGE_HIDDEN,
      appId : appId,
      data : data
    });
  },
  performCustomConfigurationChanged : function(appId, fromExternalCallBack) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CUSTOM_CONFIGURATION_CHNAGED,
      appId : appId,
      fromExternalCallBack: fromExternalCallBack
    });
  },
  performUpdateDefaultConfiguration : function(appId, subType, noNotice) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CUSTOM_CONFIGURATION_DEFAULT,
      appId : appId,
      subType : subType,
      noNotice : noNotice
    });
  },
  performDeleteConfiguration : function(appId, subType) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CUSTOM_CONFIGURATION_DELETE,
      appId : appId,
      subType : subType
    });
  },
  performUpdateConfiguration : function(appId, subType) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CUSTOM_CONFIGURATION_UPDATE,
      appId : appId,
      subType : subType
    });
  },
  performCloseCellDetailPopup : function(appId, colName) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CLOSE_CELL_DETAIL_POPUP,
      appId : appId,
      colName : colName
    });
  },
  performCheckAllRows : function(appId, checked) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CHECK_ALL_ROWS,
      appId : appId,
      checked : checked
    });
  },
  performCheckRowUpdated : function(appId) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CHECK_ROWS_UPDATED,
      appId : appId
    });
  },
  performColumnResized : function(appId) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.COLUMN_RESIZED,
      appId : appId
    });
  },
  performMultiConfigWithNameSaved : function(appId, subType) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.MULTI_CONFIG_WITH_NAME_SAVED,
      appId : appId,
      subType : subType
    });
  },

  performActionButtonClicked : function(appId, data) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.ACTION_BUTTON_CLICKED_OPENCASES,
      appId : appId,
      data : data
    });
  },

  performCustomConfigViewing : function(appId, data) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CUSTOM_CONFIGURATION_VIEWING,
      appId : appId,
      data : data
    });
  },

  performAccountSelectChanged : function(appId, data) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.ACCOUNT_SELECT_CHANGED,
      appId : appId,
      data : data
    });
  },

  performTotalFitlerNumUpdate : function(appId, data) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.TOTAL_FILTER_NUM_UPDATE,
      appId : appId,
      data : data
    });
  },

  performVerticalScrollEnd : function(appId, start, end) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.VERTICAL_SCROLL_END,
      appId : appId,
      start : start,
      end : end
    });
  },

  performJumpToRow : function(appId, rowNum) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.JUMP_TO_ROW,
      appId : appId,
      rowNum : rowNum
    });
  },

  performChangeControllerType : function(appId, type) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.CHNAGE_CONTROLLER_TYPE,
      appId : appId,
      type : type
    });
  },

  performFrozenColumnsChanged : function(appId, subType) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.FROZEN_COLUMN_UPDATE,
      appId : appId,
      subType : subType
    });
  },

  performNestedChildTabChanged : function(appId, tabName) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.NESTED_CONTENT_TAB_CHANGED,
      appId : appId,
      tabName : tabName
    });
  },

  performNextContentNextPage : function(appId, type) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.NESTED_CONTENT_NEXT_PAGE,
      appId : appId,
      type : type
    });
  },

  performNestedContentSort : function(appId, type, key, up) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.NESTED_CONTENT_SORT,
      appId : appId,
      key : key,
      up : up,
      type : type
    });
  },

  performNestedContentFilter : function(appId, type, filterObject) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.NESTED_CONTENT_FILTER,
      appId : appId,
      filterObject : filterObject,
      type : type
    });
  },

  performNestedContentDataUpdated : function(appId, data, type) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.NESTED_CONTENT_DATAUPDATED,
      appId : appId,
      data : data,
      type : type
    });
  },

  performUpdateAutoCompleteDefaultAllSelectedOptions : function(appId,
      fieldName,
      filterModel) {
    AppDispatcher.dispatch({
      actionType : ActionTypes.UPDATE_AUTO_COMPLETE_DEFAULT_FILTERMODEL,
      appId : appId,
      fieldName: fieldName,
      filterModel : filterModel
    });
  },

  performCellUpdate: function(appId, rowIndex, columnId, data){
      AppDispatcher.dispatch({
        actionType : ActionTypes.CELL_DATA_UPDATE,
        appId : appId,
        rowIndex: rowIndex,
        columnId : columnId,
        data: data
      });
  }

 // CELL_DATA_UPDATE
};

module.exports = DataTableActions;
