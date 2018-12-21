class WidgetOptionsConfig {

    constructor() {
        this._widgetOptions = [];
        this._subscribers = [];
        this._subscribers_existing_widgets = [];
        this._processedWidgetOptions = {};
        this._existingWidgets = [];
        this._activeTab = "";
        this._showWidgetSetList = {};
        this._results = {};
    }

    set widgetOptions(configs) {
        this._widgetOptions = configs;
        this._processConfigs();
        this._subscribers.map(subscriber => {
            subscriber(this.processedWidgetOptions);
        });
    }

    _processConfigs() {

        var results = {};
        var dataType;
        var subWidgetType;
        var activetab;

        this._widgetOptions.map(option => {
            dataType = '';
            subWidgetType = '';
            option.attributes.map(attribute => {
                if (attribute.name === 'dataTypeTitle')
                    dataType = attribute.value;
                if (!(dataType in results) && dataType != '')
                    results[dataType] = {};
            });

            option.attributes.map(attribute => {
                if (attribute.name === 'subWidgetType')
                    subWidgetType = attribute.value;
                if (!(subWidgetType in results[dataType]) && subWidgetType != '')
                    results[dataType][subWidgetType] = [];
            });

            if (dataType && subWidgetType)
                results[dataType][subWidgetType].push(option);
        });

        this._results = results;

        switch (this._activeTab) {
            case 'overview':
                activetab = 'overview';
                this._showWidgetSet(activetab);
                break;
            case 'cases':
                activetab = "servicerequests";
                this._showWidgetSet(activetab);
                break;
            case 'installbases':
                activetab = 'products';
                this._showWidgetSet(activetab);
                break;
            case 'contracts':
                activetab = 'contracts';
                this._showWidgetSet(activetab);
                break;
            case 'rmas':
                activetab = 'rmas';
                this._showWidgetSet(activetab);
                break;
            case 'renewalquotes':
                activetab = 'renewalquotes';
                this._showWidgetSet(activetab);
                break;
            default:
                this._showWidgetSetList = this._results;
        }

        this._processedWidgetOptions = this._showWidgetSetList;
    }

    _showWidgetSet(activetab) {

        var showWidgetSetList = {};
        var results = this._results;

        if (activetab !== 'overview') {
            Object.keys(results).map(branch => {
                var selectedBranch = branch.replace(/\s/g, "").toLowerCase();
                if (selectedBranch === activetab || selectedBranch === 'relatedcontent') {
                    var subbranch = results[branch];
                    showWidgetSetList[branch] = subbranch;
                }
            });
        } else {
            Object.keys(results).map(branch => {
                var selectedBranch = branch.replace(/\s/g, "").toLowerCase();
                if (selectedBranch !== 'renewalquotes') {
                    var subbranch = results[branch];
                    if (subbranch.table) {
                        delete subbranch.table;
                    }
                    showWidgetSetList[branch] = subbranch;
                }
            });
        }
        this._showWidgetSetList = showWidgetSetList;
    }

    get widgetOptions() {
        return this._widgetOptions;
    }

    get processedWidgetOptions() {
        return this._processedWidgetOptions;
    }

    get activeTab() {
        return this._activeTab;
    }

    set activeTab(tabname) {
        this._activeTab = tabname;
    }

    set existingWidgets(widgets) {
        this._existingWidgets = widgets;
        this._processConfigs();
        this._subscribers_existing_widgets.map(subscriber => {
            subscriber(this.processedWidgetOptions);
        });
    }

    get existingWidgets() {
        return this._existingWidgets;
    }

    subscribe(subscriber) {
        this._subscribers.push(subscriber);
    }

    subscribeToExistingWidgets(subscriber) {
        this._subscribers_existing_widgets.push(subscriber);
    }

    unsubscribeAll() {
        this._subscribers_existing_widgets = [];
        this._subscribers = [];
    }

    addExistingWdiget(config) {
        this._existingWidgets.push(config);
    }

    isConfigExisting(obj) {
        if (Array.isArray(obj)) {
            if (obj.length == 1) {
                return this._checking(obj[0])
            } else {
                var existing = true;
                //if many configs, we need to check all to make sure
                obj.map((item) => {
                    existing = existing && this._checking(item)
                });
                return existing;
            }
        } else {
            return this._checking(obj);
        }
    }

    _checking(obj) {
        var exited = false;
        var passedName = obj.name;
        var passedDataType = "";
        var passedWidgetType = "";
        obj.attributes.forEach(item => {
            if ('name' in item && item.name !== null && item.name.toLowerCase() === 'datatype') {
                passedDataType = item.value;
            }
            if ('name' in item && item.name !== null && item.name.toLowerCase() === 'widgettype') {
                passedWidgetType = item.value;
            }
        });
        this._existingWidgets.forEach(item => {
            if ('name' in item && item.name !== null && item.name.toLowerCase() === passedName.toLowerCase()) {
                //name same, checking attributes
                var attDataType = "";
                var attWidgetType = "";
                item.attributes.forEach(attribute => {
                    if (attribute.name.toLowerCase() === 'datatype') {
                        attDataType = attribute.value;
                    }
                    if (attribute.name.toLowerCase() === 'widgettype') {
                        attWidgetType = attribute.value;
                    }
                });

                if (attDataType.toLowerCase() === passedDataType.toLowerCase() && attWidgetType.toLowerCase() === passedWidgetType.toLowerCase())
                    exited = true;
            }
        });
        return exited;
    }
}

var WidgetOptionsFactory = {
    widgetOptionsConfig: null,
    getWidgetOptionsConfig: function () {
        if (this.widgetOptionsConfig == null)
            this.widgetOptionsConfig = new WidgetOptionsConfig();
        return this.widgetOptionsConfig;
    }
};

module.exports = WidgetOptionsFactory;
