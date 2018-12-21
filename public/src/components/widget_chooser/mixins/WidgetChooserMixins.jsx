let widgetChooserObject = require('../data_object/WidgetChooserObject').getWidgetOptionsConfig();
let WidgetChooserStore = require('../flux/stores/WidgetChooserStore');
let PageNames = require('../comps/PageNames');
let WidgetChooserActions = require('../flux/actions/WidgetChooserActions');

var WidgetChooserMixin = {

    getDefaultProps: function() {
        return {
            appId: ""
        }
	   },

    getInitialState: function() {
        //subscribe to the updates for existing widgets here
        widgetChooserObject.subscribeToExistingWidgets(function(obj) {
          WidgetChooserActions.performCurrentWidgetChanged(this.props.appId);
        }.bind(this));
        
        return {
            processedWidgetConfig: widgetChooserObject.processedWidgetOptions,
            currentPageName: PageNames.MAIN,
            detailPageConfigs: null,
            dataType: null,
            subWidgetType: null
        };
    },

    componentDidMount: function() {
        WidgetChooserStore.addWidgetChooserChangePageListener(this.props.appId, this._changePageCallBack);
        WidgetChooserStore.addWidgetChooserAddWidgetListener(this.props.appId, this._addWidget);

    },

    componentWillUnmount: function() {
        if (this.props.destroy)
            this.props.destroy();

        WidgetChooserStore.removeWidgetChooserChangePageListener(this.props.appId, this._changePageCallBack);
        WidgetChooserStore.removeWidgetChooserAddWidgetListener(this.props.appId, this._addWidget);
        widgetChooserObject.unsubscribeAll();
    },

    _addWidget: function(widgetConfig) {
      //No need to go back to upper level here, 
        /*this.setState({
            currentPageName: PageNames.MAIN
        });*/
        //once we add widget, we need to udpate dataTableObject.
        widgetChooserObject.addExistingWdiget(widgetConfig);
        if (this.props.addWidgetCallBack)
            this.props.addWidgetCallBack(widgetConfig);
        
    },

    _changePageCallBack: function(dataType, subWidgetType, pageName, configs) {
        this.setState({
            currentPageName: pageName,
            detailPageConfigs: configs,
            dataType: dataType,
            subWidgetType: subWidgetType
        });
    },

    _backToMain: function() {
        this.setState({
            currentPageName: PageNames.MAIN
        });
    },

    _closeme: function() {
        if (this.props.closeMe)
            this.props.closeMe();
    }

};

module.exports = WidgetChooserMixin;