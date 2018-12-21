var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('./ActionTypes');
var WidgetChooserActions = {
    changePage: function(appId, dataType, subWidgetType, pageName, configs) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.WIDGET_CHOOSER_CHNAGE_PAGE,
            appId: appId,
            configs: configs,
            dataType: dataType,
            subWidgetType: subWidgetType,
            pageName: pageName
        });
    },

    addWidget: function(appId, widgetConfig) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.WIDGET_CHOOSER_ADD_WIDGET,
            appId: appId,
            widgetConfig: widgetConfig
        });
    },

    performCurrentWidgetChanged: function(appId) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.WIDGET_CURRENT_CHANGED,
            appId: appId
        });
    }
}
module.exports = WidgetChooserActions;