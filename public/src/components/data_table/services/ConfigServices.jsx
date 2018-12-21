const
ConfigServices = {
  checkPlusSignAvailability : function(rowData, colName, tableConfig) {
    var enabled = false
    if ('extraDataControllerColumn' in tableConfig
        && tableConfig['extraDataControllerColumn'] in tableConfig.columns) {
      if (rowData[tableConfig['extraDataControllerColumn']].value == true) {
        if ('extraDataShowingColumns' in tableConfig) {
          // if we have designaged the displaying columns
          enabled = tableConfig['extraDataShowingColumns'].includes(colName);
        } else {
          // otherwise, we will apply on key columns only
          if (colName in tableConfig.columns
              && 'key' in tableConfig.columns[colName]
              && tableConfig.columns[colName]['key'] == true)
            enabled = true;
        }
      }
    }
    return enabled;
  }
}

module.exports = ConfigServices;