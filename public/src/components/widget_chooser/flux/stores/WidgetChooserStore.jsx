var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../actions/ActionTypes');
var EventEmitter = require('events').EventEmitter;

EventEmitter.prototype.setMaxListeners(0);
var assign = require('object-assign');

const WIDGET_CHOOSER_CHANGE_PAGE = 'WIDGET_CHOOSER_CHANGE_PAGE';
const WIDGET_CHOOSER_ADD_WIDGET = 'WIDGET_CHOOSER_ADD_WIDGET';
const WIDGET_CURRENT_CHANGED = 'WIDGET_CURRENT_CHANGED';

var WidgetChooserStore = assign({}, EventEmitter.prototype, {

    addWidgetChooserChangePageListener: function(appId, callback) {
        this.on(WIDGET_CHOOSER_CHANGE_PAGE + '_' + appId, callback);
    },
    removeWidgetChooserChangePageListener: function(appId, callback) {
        this.removeListener(WIDGET_CHOOSER_CHANGE_PAGE + '_' + appId, callback);
    },
    emitWidgetChooserChangePage: function(appId, dataType, subWidgetType, pageName, configs) {
        this.emit(WIDGET_CHOOSER_CHANGE_PAGE + '_' + appId, dataType, subWidgetType, pageName, configs);
    },


    addWidgetChooserAddWidgetListener: function(appId, callback) {
        this.on(WIDGET_CHOOSER_ADD_WIDGET + "_" + appId, callback);
    },
    removeWidgetChooserAddWidgetListener: function(appId, callback) {
        this.removeListener(WIDGET_CHOOSER_ADD_WIDGET + "_" + appId, callback);
    },
    emitWidgetChooserAddWidget: function(appId, widgetConfig) {
        this.emit(WIDGET_CHOOSER_ADD_WIDGET + "_" + appId, widgetConfig);
    },

    addCurrentWidgetsChangedListener: function(appId, callback) {
        this.on(WIDGET_CURRENT_CHANGED + "_" + appId, callback);
    },
    removeCurrentWidgetsChangedListener: function(appId, callback) {
        this.removeListener(WIDGET_CURRENT_CHANGED + "_" + appId, callback);
    },
    emitCurrentWidgetChanged: function(appId) {
        this.emit(WIDGET_CURRENT_CHANGED + "_" + appId);
    }
});

//Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case ActionTypes.WIDGET_CHOOSER_CHNAGE_PAGE:
            WidgetChooserStore.emitWidgetChooserChangePage(action.appId, action.dataType, action.subWidgetType, action.pageName, action.configs);
            break;
        case ActionTypes.WIDGET_CHOOSER_ADD_WIDGET:
            WidgetChooserStore.emitWidgetChooserAddWidget(action.appId, action.widgetConfig);
            break;
        case ActionTypes.WIDGET_CURRENT_CHANGED:
            WidgetChooserStore.emitCurrentWidgetChanged(action.appId);
            break;
    }
});

module.exports = WidgetChooserStore;