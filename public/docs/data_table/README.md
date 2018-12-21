# Data Table Introduction
Goals for this component

- Display passed data automatically
- Implement both in component sorting/filter as well as global sorting/filter
- Should be able to display whatever data passed, no coding needed
- Infinity scrolling
- Colume picker is used to let user choose which colume to display
- Column is resizable

## Usage

**Step 1: Adding following js files into code base**
```sh
<script src="/js/libs/component/react-with-addons.min.js"></script>
<script src="/js/libs/component/react-dom.min.js"></script>
<script src="/js/libs/component/jnpr-components.min.js"></script>
<link rel="stylesheet" href="/js/libs/component/jquery-ui.min.css">
```
**Step 2: Obtain Component Instance**
```sh
var JnprDataTable = JnprCL.JnprDataTable;
```
**Step 3: Signature for using component.**
Below I am only listing how to do in plain html file, if you are interested in knowing more for backbone/angularJS, please refer to README under root directory
```sh
 ReactDOM.render(React.createElement(JnprDataTable, {
    nextPageCallBack: this.callBack_appId_3.bind(this),
    changeValueHandler: this.changeValueHandler.bind(this),
    sortHandler: this.sortHandler.bind(this),
    filterHandler: this.filterHandler.bind(this),
    nested: true,
    styleType: "ngcsc",
    appId: "appId_3",
    accountSearchCallBack: this.accountSearchCallBack.bind(this),
    saveConfigCallBack: this.saveConfigCallBack.bind(this),
    caseManagerLink: 'https://stage.juniper.net/casemanager/#/cmdetails/',
    initalNumberPerPage: 5,
    initialDelayForDatSubscribe: 10,
  }), document.getElementById('example1'));
  ```
  nextPageCallBack: To be called when user scroll to the bottom
  changeValueHandler: as follows
  ```sh
  var changeValueHandler=function(obj,col,newValue){
  };
  ````
Here Obj is the object to be udpated, col is the columnName, newValue is the value user want to change to

filterHandler:
```sh
 var filterHandler=function(filterObject, sortObject){
  	console.log(filterObject);
  };
  ```
 Passed object has key as column, comp (on, onorbefore, onorafter, between, contains), value1, value2(for between). You need to use this object to construct filter object

Newly added second parameter, used for resetting, for resetting, filterObect is empty, {}, but if user set the default sortFields, then second parameter will be send back. Please detect it and use it to fetch data when resetting.
**positionHandler:** To manage position of related content view or other content view if we have the view by clicking cell
```sh
  positionHandler: function(target, element, offsetX, offsetY, expanded) {
  });
  ```
**nested: true | false**

This is very important, if you are displaying flat data you should pass false, then facebook fixed data table is used, otherwisem you should pass true, then Juniper self grown table is used.

**showControls: true | false**

If you want to hide the account chooser from right/left hand side set this property to false. Default is true.

**styleType: ngcsc|jtacworkbench**

This field is used to provide style, that will be extended from base style. To editing style, please modify jnpr-datatable.scss file under /src/components/data_table directory. Go to end of the file and modify it based on different environment.

**hasAccIdCol: true|false**

Set this field to **true** if your table contains a column of accountId that needs to be filtered. By default this is **false**.

**saveConfigCallBack**
Used to save configuration and it is the hook for saving the whole configuration.

**actionButtonClickHandler**
Used to take an action when user clicks option in action button after select row/rows with 'checkBoxEnabled' flag in table.

**checkBoxCallBackHandler**
If you want to get notified when user change the checkbox, please add this callback handler. Remember you must set 'checkBoxEnabled' flag in the table

**initalNumberPerPage**
By default, it showd 10 records perpage on loading, if we want to reduce this initial value, we can change this value. This is helpful for plain table as we do not have page selector

**initialDelayForDatSubscribe**
By default, there is 1000 ms delay for subscribing external data change in order to wait the whole table to be stablized, expecially in situation of multiple tables in same page. In most cases, this is good enough, as data is already assigned and then table is being rendered. But in ASWB, data can be arrived later, so this default delay may cause table to be empty. Please adjust this time delay to whatever needed, or even to reduce it to 0.

## Passed data object
**Step 1: Instantiate dataObject**
```sh
var jnprDataTableObj = JnprCL.JnprDataTableObjectFactory.getDataTableObject();
```
You can now pass data directly to component, instead you must use this object to pass data. The reason is I am using observation pattern to observe data update. So you also have to use setter to set data.

**Step 2: Create configuration**
```sh
var config = {
    rowHeight: 50,
    headerHeight: 30,
    tableHeight: 500,
    tableWidth: 800,
    columnFilterable: true,
    showGlobalCheckbox: false,
    defaultGlobal: false,
    globalAutoComplete: true,
    sendClickToParent: true,
    noToolTip: true,
    resizeMode: 'table', // table|column
    disableSaveConfigBtn: true,
    partialGlobal: true,


    showingInitialHiddenWhenFiltering: true, //we need to change hidden to show when filtering
    showingInitialHiddenForSuperUser: false, //control if we want to show all columns for super user

    defaultSortField: 'contractId',
    defaultSortOrder: 'desc',
    multipleConfigEnabled: true,

    caseManagerLink: "https://stage.juniper.net/casemanager/#/cmdetails/", //this is only for caseManagerLink",
    checkBoxEnabled: true,

    enableInAppDownload: true,

	allowAccountInFilterNumber: true,

    columns: {
      srId: {
        defaultColumn: true,
        width: 100,
        flexGrows: 1,
        type: "string",
        title: "srId",
        sortable: false,
        filterable: false,
        editable: false,
        key: true,
        sticky: true,
        hidden: true,
        initialHidden: true,

        resizable: false,
        minWidth: 100

      },
      ...
       relatedContent:{
      	defaultColumn: false,
        width: 100,
        flexGrows: 1,
        type: "list",
        title: "Related Contents",
        sortable: false,
        filterable: false,
        editable: false,
        children:{
        	prIds:{
        		title: "Problem Report"
        	},
        	kbIds:{
        		title: "Knowledge Base"
        	}
        }
      },

      }
```
Here you must pass initial configuration for the table, such as rowHeight, headerHeight, tableWidth and tableHeight.

- columnFilterable: true | false (if you want column to have filter, you must pass true, otherwise, there is no filter in column header)

Meantime, you must specify columns configuration, each item is using same key in the data object, also it contains following field:
- allowAccountInFilterNumber: by default, we do not consider account as filter, so the filter number does not include account. But if you want to consider account as filter, please set this configuration to true.
- enableInAppDownload: true|false enable in application export
- defaultColumn: true|false
- width: initial width
- flexGrows: growing factor when table is resized
- type: must be string|datetime|image, this is used to define the filter component and adopt various sorting/filtering solution
- title: Column Title
- sortable: define if this column is sortable
- filterable: define if this column is filterable
- editable: define if this column is editable
- enableRegExp: true, if this column need to support regular expression. Only available when "defaultGlobal" is set to "true" on the config. When enableRegExp is true, a checkbox to select regular expression is provided below the input field on filters. Also Live searching is disabled and only when user clicks on "submit" button, the callback for handleFilter is triggered
- showGlobalCheckbox: do we want to give user option to do both internal and external sort/filter
- defaultGlobal: false|true, if no user choice, this flag is used to do either internal or global search.
- partialGlobal: optional, false|true, default to false. If user want to use in app sort/filter, they will set defaultGlobal to false, but if they also want to control data displayed in the table, then they need to set partialGlobal to true. in this case, filter/sorter still in app, but table can be updated globalized
- globalAutoComplete: If we want to do global auto-complete, please pass true, otherwise, it is false
- caseManagerLink: Used by caseManger link, it must be different for staging and production, can be omitted if not for cases
- minWidth: optional, this will make column be able to resize minimum this width.  by default, minWidth is 60px.
- sticky: optional, true|false, if true, this field will always be displayed
- hidden: optional, true|false, if true, this field won't be shown in column chooser and table
- sendClickToParent: optional true|false, if true, the this field will be displayed as a link, clicking the link, the callback functin will be triggered, name of the callback function is cellClicked
- noToolTip: optional true|false, by default, all fields will show toolTip, using this flag to disable tooltip on some field
- resizeMode: optional table|column, this flag is used to control if we want to make total table width fixed (if we choose column) and resize each column or we want to make total table width flexible, and only resize the dragged column. By default it is column, that means, total table width is fixed.
- showingInitialHiddenWhenFiltering: optional true|false, explained as below
- defaultSortField: optional, if we need default sorting field, using this one, it must be the same as below columnId
- defaultSortOrder: asc|desc, this field and above field MUST co-exist to make it working
Attention, if user already has sortModal saved in app, the defaultSort field will be disregarded, it only worked when there is no custom config

- multipleConfigEnabled:  optional, true|false, This config must be provided in order to have multiple configuration, otherwise, your dataTable will work the same as before. But due to the fact that api also changed, I only guarantee the table is up, I do not guarantee you can save all the configuration the same as before. So, please do not reply on this to always keep the single configuration solution unless you have good api support.
```
We have requirements for contract and contractItems, by defualt, contract has 5 columns and contract Item has 10 fields. It is desired to show only 5 columns when first loaded datable, but use all the filters as contract items. Whenever you are filtering, we need to show all the 10 fields. But when we clear filter, we want to get back to initial state, only showing 5 columns. Also you can save and restore this.
This requires this flag to be set as true. If you do not set it, this function is totally ignored. Then inside each column setting, you need to set "initialHidden: true" for such dyamic column. Attention here: difference between "hidden" and "initialHidden" is we will never change "hidden" attribute, if you want to hide once certain column, it is always hidden, while for "initialHidden", it is dynamically changing. For above contract senario, we need to set all the extra fields inside contractItems but not inside contract to be initiallyHidden.
```
- showingInitialHiddenForSuperUser: optional true|false
Purpose for this field is if this is super user, we then need to set this flag to true, then this super user will be able to see ALL the initially hidden field as soon as they load the table.

- displayingActionButton: optional true|false
If we need to put some action button, then we need to set this flag to true. then action button will appear in the table.
Also, if we have different option list for this button, then you would need to create a component for this button like 'public/src/components/data_table/comps/IbaseActionButtonList.jsx'. keep checking next flag 'displayingActionButtonOptionList'.

- displayingActionButtonOptionList: optional value
Once you create a component to display options for action button, go to 'public/src/components/data_table/comps/ActionButton.jsx' to detect this specific value (this flag's value). You need to embed your option list component here. Then you will have this list in options view. You need to set 'displayingActionButton' flag to display button first, if it's required.
- checkBoxEnabled : optional true|false -- look for (**Checkbox Support**) below for detail description
- resizable: optional true|false (defualt to true) decide if one column is resizable or not
- minWidth: optional if you want to give minimum width of one column
- closeLeftPanelBtn: optional true|false if you want to close left panel by default
- disableSaveConfigBtn: optional true|false if you want to disable multiple configuration features

**Upates:**
- key: this field is optional, it's purpose is to put all list fields under this field and make this field collapsable. It is true|false
- Looking at above relatedContents field, it must follow above format, first it must be having list type, second, it must have children, and under children, it must list all the children, during each definition, it needs to have configuration, currently, title is mandatory


**Step 4: Set up Configuration**
```sh
jnprDataTableObj.setConfig(config, "appId_1");
```
Using above logic to pass default config

**Step 5: Set up data list**
```sh
  jnprDataTableObj.dataList = <dataList>;
```
At this stage, the internal subscriber is trigger to update state and furthermore, the whole UI is updated.

# Extended DataTable for NGCSC
For NGCSC, we are using ngcscDataTable
```
var JnprDataTable = JnprCL.JnprDataTableNgcsc;
```
Then, you need to pass accountList like this:
```
jnprDataTableObj.accountList = accountsList
```
# Restore pre-saved configuration

```
 if(localStorage.getItem('jnpr_datatable_custom_config')){
    jnprDataTableObj.allCustomConfigurations =   JSON.parse(localStorage.getItem('jnpr_datatable_custom_config'));
  }
```

Here, I am using localStorage only for demo purpose, in real situation, you need to use api, name can be anything, just make sure you will retrieve using same name.

The component is used like this:
```
   ReactDOM
                            .render(
                                React
                                    .createElement(
                                        JnprDataTable,
                                        {
                                          nextPageCallBack : callBack,
                                          changeValueHandler : changeValueHandler,
                                          sortHandler : sortHandler,
                                          filterHandler : filterHandler,
                                          selectedAccountsUpdateCallBack : selectedAccountsUpdateCallBack,
                                          saveConfigCallBack: saveConfigCallBack,
                                          caseManagerLink: 'https://stage.juniper.net/casemanager/#/cmdetails/',
                                          nested : true,
                                          accountSearchCallBack : accountSearchCallBack,
                                          appId: "appId_1",
                                          cellClicked: cellClicked,
                                          destroy : function() {
                                            setTimeout(
                                                function() {
                                                  ReactDOM
                                                      .unmountComponentAtNode(_self
                                                          .$(
                                                              '.divDataTableComponent')
                                                          .get(0));
                                                }, 0);
                                          }
                                        }), _self.$('.divDataTableComponent')
                                    .get(0));
                      });
```
One method, selectedAccountsUpdateCallBack, is aded as handler to save user's account selection into any storage, then it can be retrieved later.

For component, you must set destroy so that this dom can be removed completely when no longered needed.

**Filter/Sorter saving**
Filter and sorter are now saved into localStorage, see this:
```
if(currentSavedConfig){
                    //passing configuraiton to component for UI restoration
                    jnprDataTableObj.allCustomConfigurations = currentSavedConfig;
                    //let's get ONLY configuration for this component
                    if('appId_1' in currentSavedConfig)
                      currentSavedConfig=currentSavedConfig['appId_1'];
                  }
                  //restoring sortModel
                  if(currentSavedConfig && "sortModel" in currentSavedConfig && Object.keys(currentSavedConfig.sortModel).length>0){
                    var sortModel = currentSavedConfig.sortModel;
                    if(sortModel.up!==null){
                      jnprCaseCollection.setSort(sortModel.field, sortModel.up===true ? 'asc' : 'desc');
                    }
                  }
                  //restoring filterModel
                  if(currentSavedConfig && "filterModel" in currentSavedConfig &&  Object.keys(currentSavedConfig.filterModel).length>0 ){
                    procesFilter(currentSavedConfig.filterModel);
                  }
                  //now we need to set pre-saved accounts
                  if(currentSavedConfig && "defaultSelectedAccountList" in currentSavedConfig && currentSavedConfig['defaultSelectedAccountList'].length>0){
                    var accountIds = [];
                    currentSavedConfig['defaultSelectedAccountList'].forEach(function(item){
                      accountIds.push(item.split(':')[2]);
                    });
                    jnprCaseCollection.setAccountIds(accountIds);
                  }

```

Also for each reading back, you must set grandTotal number as this:
	jnprDataTableObj.grandTotalRecords = jnprCaseCollection.grandTotal;

 So that the footer number can be updated automatically.

 ## Update Jun 14th

 New functionality for supporting global saving as well sa multi-datatable on the same page are now provided, please follow these steps:

 1. When create dataTableObjec, you must explicitly set the config like this:
```
jnprDataTableObj.setConfig(config, "appId_2");
```

2. During callback to fetch data, must set appId first, so as to let correct callback being called
```
var callBack = function() {
                jnprDataTableObj.appId = "appId_1";
                jnprCaseCollection.nextPage(function(cases) {
                  jnprDataTableObj.dataList = cases;
                });
              };
```

3. adding saveConfigCallBack into the component props,
```
ReactDOM
                            .render(
                                React
                                    .createElement(
                                        JnprDataTable,
                                        {
                                          ...
                                          saveConfigCallBack: saveConfigCallBack,
                                         ...
                                        }), _self.$('.divDataTableComponent')
                                    .get(0));
```

Then in the function:

```
  var saveConfigCallBack=function(configObject){
    localStorage.setItem('jnpr_datatable_custom_config', JSON.stringify(configObject));
    console.log( configObject );
  };
```

Here using any api request to save the configuration

4. Before loading the datatable, must retrieve configuration first:

```
if(localStorage.getItem('jnpr_datatable_custom_config')){
    jnprDataTableObj.allCustomConfigurations = JSON.parse(localStorage.getItem('jnpr_datatable_custom_config'));
  }
```

5. data loading restoration:
Before loading data, must reload configuration, and create good ajax query in order to restore data for last saving.
See this code snippet:

```
//need to retrieve current saved configuraiton in order to do pre-fetching
                var currentSavedConfig = null;
                if(localStorage.getItem('jnpr_datatable_custom_config')){
                  currentSavedConfig = JSON.parse(localStorage.getItem('jnpr_datatable_custom_config'));
                  //passing configuraiton to component for UI restoration
                  jnprDataTableObj.allCustomConfigurations = currentSavedConfig;
                  //let's get ONLY configuration for this component
                  if('appId_1' in currentSavedConfig)
                    currentSavedConfig=currentSavedConfig['appId_1'];
                }
                //restoring sortModel
                if(currentSavedConfig && "sortModel" in currentSavedConfig && Object.keys(currentSavedConfig.sortModel).length>0){
                  var sortModel = currentSavedConfig.sortModel;
                  if(sortModel.up!==null){
                    jnprCaseCollection.setSort(sortModel.field, sortModel.up===true ? 'asc' : 'desc');
                  }
                }
                //restoring filterModel
                if(currentSavedConfig && "filterModel" in currentSavedConfig &&  Object.keys(currentSavedConfig.filterModel).length>0 ){
                  procesFilter(currentSavedConfig.filterModel);
                }
                //now we need to set pre-saved accounts
                if(currentSavedConfig && "defaultSelectedAccountList" in currentSavedConfig && currentSavedConfig['defaultSelectedAccountList'].length>0){
                  var accountIds = [];
                  currentSavedConfig['defaultSelectedAccountList'].forEach(function(item){
                    accountIds.push(item.split(':')[2]);
                  });
                  jnprCaseCollection.setAccountIds(accountIds);
                }
```

Attention: Above sample is only for demo purpose using localStorage, in reality, you should use real API to save settings, in NGCSC, this is fully functional, but in Workbench, please come up with own api solutions.

The fully functional code for NGCSC is now located at:
https://git.juniper.net/ngcsc/ngcsc/blob/development/ngcsc-ui/public/js/app/demos/Page1View.js
Please go through it carefully to make any necessary updatess

## How to add extra fields not included in original data response

Step 1:  Data needs to be prepared out of component, combining two fields into new field, having a look at this in NGCSC collections:
```
fetchCases: function(cb) {
      var self = this;
      utils.ajax_post(this.url,
        this.buildRequestBody(), function(data) {
          self.grandTotal = data.totalRecords;
          //but first, we need to keep original un-touched cases, so that we can do pagination easily
          var cases = data.caseList;
          self.cases = self.cases.concat(cases);          
          //we need to modify caseList here
          //and fake some fields
          var modifiedCases = [];
          self.cases.forEach(function(item){
            var clone = $.extend({}, item);
            clone['status_reason'] = clone['status']+" - "+clone['reason'];
            clone['accountId_accountName'] = clone['accountId']+" - "+clone['accountName'];
            modifiedCases.push(clone);
          });
          cb(modifiedCases);
        });
    },
```
Then note down the field name, status_reason or accountId_accountName

Step 2: In the configuration, adding these:
```
status_reason: {
                    defaultColumn: false,
                    width: 200,
                    flexGrows: 1,
                    type: "text",
                    id: "status_reason",
                    title: "Statue/Reason",
                    sortable: true,
                    filterable: false,
                    editable: false
                  },

                  accountId_accountName: {
                    defaultColumn: false,
                    width: 200,
                    flexGrows: 1,
                    type: "text",
                    id: "accountId_accountName",
                    title: "Account",
                    sortable: true,
                    filterable: false,
                    editable: false
                  }
```
Step 3: When user sort the column, parent app must be able to convert it, see this code:
```
setSort: function(field, order, cb) {

      //accountId_accountName=>accountName
      //status_reason==>status
      //let's change it here, as some fileds are faked, but they need to be able to sorted
      field = field==='accountId_accountName'?'accountName':field;
      field = field==='status_reason'?'status':field;

      this.sortModel = {
        field: field,
        sort: order
      };
      this.cases = [];
      if(cb)
        this.firstPage(cb);
    },
```
Now you have new fields that are not provided by original API!

## Multiple table with different confing in same page
You can put multiple dataTable in the same page side by side, just make sure:
1. you have to provide different table configuration;
2. The critical point for successful integration is you must make sure each table having different appId, and when you set up datatable, you need to explicitly link config with appId, like this:
```
jnprDataTableObj.setConfig(defaultTableConfig, "appId_1");
jnprDataTableObj.setConfig(contracTableConfig, "appId_2");
```
3. For any callback, you must explicitly set appId, like this:
```
var callBack = function() {
    jnprDataTableObj.appId = "appId_1";
    jnprCaseCollection.nextPage(function(cases) {
          jnprDataTableObj.dataList = cases;
    });
};
```
4. When you are setting new data to the table, you must explicitly tell dataTableObject which table is going to receive the data, do this way:
```
jnprDataTableObj.appId="appId_1";
jnprDataTableObj.dataList = <Your dataList here>
```
Or to be more precisely (newly added):
```
jnprDataTableObj.setDataListFor("appId_2", results[1]);
jnprDataTableObj.setGrandTotalRecordsFor("appId_2", jnprCaseCollection.grandTotal);
jnprDataTableObj.setAccountListFor("appId_2", results[0]);
```
Second option above is now recommanded so that you can guarantee to pass appId correctly.

## Plain DataTable
If you just need a plain dataTable, no left control panel, no column chooser, no account chooser and no filters, you should use plainDataTable.

```
 var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;
   ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
    parentLineItem: jsonObj1.caseList[0],
    nextPageCallBack: this.callBack.bind(this),
    changeValueHandler: this.changeValueHandler.bind(this),
    sortHandler: this.sortHandler.bind(this),
    styleType: "ngcsc",
    appId: "appId_3",
    nested: true
  }), document.getElementById('example1'));
```
You can reuse same configuration. This is extra field:
```
parentLineItem: jsonObj1.caseList[0]
```
If you pass this when creating the table, then parent item will be displayed in the header.


## Plain DataTable -- display hierarchical table

Basically, We put parent data in the header table. But if you want to make this plain table looking like hierarchical table, follow the below.
1. just put extra field in configuration.
```
var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;
  ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
parentLineItem: jsonObj1.caseList[0],
parentHasArrowBtn: "srId",
nextPageCallBack: this.callBack.bind(this),
changeValueHandler: this.changeValueHandler.bind(this),
sortHandler: this.sortHandler.bind(this),
styleType: "ngcsc",
appId: "appId_3",
nested: true
}), document.getElementById('example1'));
```
You can reuse same configuration. Just put this with column id as value. Then it will put arrow down button in front of the data in this column cell.
```
parentHasArrowBtn: "srId"
```

2. to make indentation for this hierarchical columns, in your column config, add "indentation: true".
```
srId: {
 defaultColumn: true,
 width: 100,
 flexGrows: 1,
 id: "srId",
 type: "text",
 title: "Case ID",
 sortable: false,
 filterable: false,
 editable: true,
 key: true,
 sticky: true,
 sendClickToParent: false,
 noToolTip: true,
 indentation: true
},
```
Then, this columns will be indented.

## Update Config (DataTableConfiguration)
If you want to update certain config for some column on the fly, for example, for contract table, once we did some filtering, we are showing the contractItem, now we no longer want to have pop up for the details. In order to do this, we need todo this to change column configuration:

```
jnprDataTableObj.updateTableColumnConfigFor(appId, column, property, value );
```
For example:
```
jnprDataTableObj.updateTableColumnConfigFor('appId_contract', 'contractId', 'sendClickToParent', true );
```

## Update/Exchange Custom Configuration on the fly
Unlike above requirement, we if we need to change custom configuration on the fly, which means, user has saved multiple custom configurations, and they want to load different custom-configuration to apply different filters/sorters, also once they changed different pre-saved configuration, we must update UI immediately and also load data based on the new criterias.

In order to meet this requirement, we need following two steps:

Step 1: Assign new custom configuration to dataTableObject, please use this method:
```
 jnprDataTableObj.setCustomConfigFor (appId, customConfigurationForThisAppId);
```
This step can be done either within NGCL or in parent application as long as they are using same instance of jnprDataTableObj

Step 2. After above step, DataTable will immediately udpate UI, and also, dataTable will trigger a callback to parent handler to reload data based on the newly provided custom configuration. In order todo this, parent applicaiton must provide call back, see below:
```
ReactDOM.render(React.createElement(
                                        JnprDataTable,
                                        {
                                          ....
                                          fetchHandler: fetchHandler,
                                          ...
                                          }), _self.$('.divDataTableComponent')
                                    .get(0));


              var fetchHandler = function(filter, sorter){
                //first clear everything
                procesFilter([]);
                //second passing all filters
                procesFilter(filter);
                //passing sorter
                if(sorter!=null && Object.keys(sorter).length>0){
                   jnprCaseCollection.setSort(sorter.field, sorter.up ? 'asc' : 'desc');
                }
                //finally fetching data
                // finally, set up first page
                jnprCaseCollection.firstPage(function(cases) {
                  _this.jnprDataTableObj.appId = "appId_1";
                  _this.jnprDataTableObj.grandTotalRecords =  jnprCaseCollection.grandTotal;
                  _this.jnprDataTableObj.setDataListFor("appId_1", cases);
                });
              };
```
Please see carefully above the fetchHandler is having two parameters, first filterObject, second is sorterObject, parent application(NGCSC) must retrieve fresh data based on the passed object. Once data is retrieved, just assign to dataTable using
```
jnprDataTableObj.setDataListFor("appId_1", cases);
```
Now, in dataTable, you will have both new fitler, sorter and also new data!


## How to remove a single record without passing whole data
In order to remove a single record, you can either pass all the records to dataTableObject live above mentioned or you can do a much simpler operation as below:
```
jnprDataTableObj.removeRecordFor(appId, KeyValueForTheRemovedRecord);
```
This method can be used in both inside component or out of component, such as inside NGCSC or JtacWB.

- You must pass valid appId as first paramter
- The value is key value as required inside the configuration. We are not going to compare all the fields due to its complexity as well as some nested fields. So we only compare key value, once key value is equal, this record will be removed.

## Multiple Configuration support

Major solution of Multiple Configuration of DataTable is now provided, please take a very careful reading and then start implementing in both integration and API part.
In configuration, adding this:
```
multipleConfigEnabled: true,
optional, true|false, This config must be provided in order to have multiple configuration, otherwise, your dataTable will work the same as before. But due to the fact that api also changed, I only guarantee the table is up, I do not guarantee you can save all the configuration the same as before. So, please do not reply on this to always keep the single configuration solution unless you have
```

In order to load the table with multiple configurations, please follow these steps:

1)  Retrieve accounts, (Same as before)
2)  Retrieve available configurations.
		Major update here is the use of configurationAPI. Previous we only have these two fields, ‘type’ and ‘value’, you can save all your configuration into a json string and then using setAllCustomerConfig to set it in one time.This approach is now changed, we are now having following fields for one configuration:
- type
- subType (string)
- defaultConfig (boolean)
- Value (json string)

The mapping relation now becomes
- type – dataTable appId
- subType – name for one single config, this means one dataTable appId may have multiple subType named configurations
- defaultConfig – used to define if this record is default config or not
- Value – only for one record
Now we need to do followings:
Retrieving available configs:
```
 var availableConfigsPromise = new Promise(function(resolve){
                          self.configSettingCollection.retrieveAllConfigsFor('appId_1', function(configs){
                            var availableConfigs = {};
                            configs.forEach(function(config){
                              availableConfigs[config.subType] = {
                                  value: JSON.parse(config.value),
                                  default: config.defaultConfig
                              }
                            });
                            resolve(availableConfigs);
                          });
                        });
```
Here we are only retrieving configuration for table “appId_1”, once we retrieve all the configs, we will need to assign like this:
```
_this.jnprDataTableObj.setAvailableConfigsFor("appId_1", availableConfigs);
```
Attention, availableConfigs object is using the subType as key, and then using object to assign, please follow above format strictly

3. Retrieve customerConfiguration for one appId and assign:
```
_this.jnprDataTableObj.setCustomerConfigForOne('appId_1', currentSavedConfig);
```
The difference here we are only assigning one table appId direclty, unlike in the past, we are assigning all the configuration as a batch. The reason is we are now using configurationSettting Type value as table appId.


Now for CallBack, we need these:

```
ReactDOM
                                      .render(
                                          React
                                              .createElement(
                                                  JnprDataTable,
                                                  {
                                                    defaultConfigHandler: defaultConfigHandler,
                                                    deleteConfigHandler: deleteConfigHandler,
                                                    saveConfigWithName: saveConfigWithName
                                                    }, _self.$(
                                              '.divDataTableComponent').get(0));

   var defaultConfigHandler = function(subType){
                self.configSettingCollection.setDefaultConfigFor('appId_1', subType, function(data) {
                });
              };
   var deleteConfigHandler = function(subType){
                self.configSettingCollection.deleteConfigFor('appId_1', subType, function(data) {
                });
              };

    var saveConfigWithName = function(name, config){
                var str = {
                    settings : [ {
                      type : "appId_1",
                      subType: name,
                      value : JSON.stringify(config),
                      defaultConfig: true
                    } ]
                  };
                  self.configSettingCollection.createConfig(str, function(data) {
                  });
              };
     var fetchHandler = function(filter, sorter) {
         // ...fetching data there with fitler/sorter
     }
```
For above,
1. Whenever one config is choosen, defaultConfigHandler is called, to set this config as defaultConfig
2. Whenever one config is deleted, deleteConfgiHandler is called to delete this configuration
3. Whenever adding new config, we need to call saveConfigWithName method. Looking at the data Structure for detail
4. Also when one config is chooser, the fetchHandler is called to fetch data for this particular config
Now you can have everything up for multiple configuration support.

API requirements:
-  /api/config/settings/{type}
 This api is only retrieving the first default configuration for the passed Type, if no default config, then select first available one.
-  /api/config/advanced_settings/{type}
This api is used to return all the available configuration for one type
-  DELETE /api/config/advanced_settings/{type}/{subType}
This one is used to delete the configuration
-  PUT /api/config/advanced_settings/{type}/default/{subType}
This one is to set the default one.

**Extra step for detecting user config update:**

It is impossible to handle user config update and prevent user from leaving inside the component, so this task needs to be implemented in the wrapper application, ideally, it needs to be handled in the routing system, ASAP user want to leave the page, the URL will be changed, and this will be trigger lifecycle event, now app needs to detect if user has made any change without saving, if so, prompt user to enter the name to save as new or udpate current one. In order to meet this target, please following these steps:

1. Detecting if user has made any change: NGCL is providing api to implement this:
```
var changedResult = jnprDataTableObj.isConfigurationChanged(appId, fieldsToDetect);
```
Here: 1) appId is the appId you want to check; 2) fieldsToDetect: array of fields to check, available fields are: colWidths|filterModel|sortModel, sample inputs are:

```
jnprDataTableObj.isConfigurationChanged('appId_contract', ['colWidths','filterModel','sortModel'])
```
The response you will get is:
```
{
    changed: true|false,
    subType: <name of subType>
}
```
2. Next Step, once you get this response, you should prompt user to either enter new name or user this name to save the updates. The UI needs to be implemented by yourself. Then using same method as above:

```
    saveConfigWithName(subType, jnprDataTableObj.customConfiguration);
```

Then you are Done!

**How to retrieve data from DataTable**

If you need to download dataTable filtered/sorted data, you can use this method:
```
jnprDataTableObj.getProcessedDataListFor(appId)
```
This method will give you all the data visible inside datatable. Remember, it is giving you all the row data, regardless of what column you choose in the column chooser.

**Checkbox Support**

It is desired to show checkbox as first column and give user capability to choose whatever columns they want. Also, it is expected to get only selected rows for downloading purpose. In order to meet this requirement, please add this into your configuration:
```
config = {
      ...
      checkBoxEnabled: true,
      ...
      columns: {
        }
}
```
Once you add this into your configuration, you will see checkbox as the first column of the dataTable.

Once user made any selection, you will see total number selected on the top right of the table.

If you want to obtain selected data only, please use this method:

```
jnprDataTableObj.getCheckedRowsFor(appId); //getting all the selected data
jnprDataTableObj.getCheckedRowsCountFor(appId); //getting total count of selected data
```

**Base Filter Support**
For some table, it has base filter, for example, p1 case table, this means the baseFilter is Priority:P1, and if user click the reset filter button, the filterObject should not be empty, instead, the base filter will be sent back. Also, a use case is we ONLY want to show lineItems table, but this table depends on the non-empty fitler. if we clear the filter, filter is empty, and table will only show parent line items. This is not what we needed, we want to show child line items table even if we click the click fitler button.

In order to do this:
```
 jnprDataTableObj.setBaseFilterFor("appId_contract", baseFilterObject);
```
For example:
```
 jnprDataTableObj.setBaseFilterFor("appId_contract",
       {
     	status: {
     	  comp: "contains",
     	  value1: "Expired"
     	}
   	   });
```
1. If you click clear fitler button, dataTable will reset everything back to base filter;
2. If you click reset fitler button, the filterHandler will give the base filter object as first parameter.
3. This is ONLY useful in NGCSC, for in-app filter app, such as JtacWB, no need, as the data is already pre-filtered by the base filter. Also for NGCSC, please hide the filter or update the fitler options for accurate render purpose.

**Passing External Filters to DataTable**
DataTable only accept the same fitler already existed inside dataTable. You can pass filter into dataTable using below syntax:

```
jnprDataTableObj.setFilterObjectFor(appId, fitlerObject)
```

Once you do this, whole dataTable will be reloaded, either internal search or global search based on your configuration. Remember, data format must be identical to the same you obtained from datatable.

**Dynamically update configuration for DataTable**
You can change dataTable configuration on the fly, and dataTable will reflect the configuration update immediately.

```
 jnprDataTableObj.setConfig(config, appId);
 ```

 THis is the same method you are using before, just passing a new configuration. The passed configuration should be having same format as before, espeically should match the passed data. Otherwise, dataTable will be confused.

 **CurrentPage added to nextPageCallBack method**
 Right now, we are using firstRecord/lastRecord for data retrieval for next page. For better performance, we are now adding currentPage parameter for nextPageCallBack Handler.

 **Save numPerPage**
 When user changed number per page, this number can be persisted into database, below are two methods you need to use to set and the callbackHandler.

 Callback handler to save, please use this when create the dataTable

 ```
 updateNumPerPageHandler: this.updateNumPerPageHandler.bind(this),
 ```

 Setting number:
 ```
 jnprDataTableObj.setNumPerPageFor("appId_3", 20);
 ```

 this method needs to be called before rendering the table.

 **Passing Highlighted Rows**
 If we need to highlight rows when table is being rendered, we need to do following step:

  ```
 jnprDataTableObj.setHighlightedRows(appId, listOfKeysForHighlightRows);
 Example:
 jnprDataTableObj.setHighlightedRows('appId_3', [ '2015-0608-T-1100', '2014-0602-T-0470' ]);
 ```

The second parameter is the list of keys for the data, the value must be the key of the table configuration. Datatable will apply highlighted class to the row, by default, the highlighted row has background color of yellow, you can overwrite the style by using below style:

 ```
.jnprDataTableContent {
 .highlighted{
			.public_fixedDataTableCell_main{
				background-color: yellow;
			}
		}
 }
 ```

 **Dynamically highlight rows on user click**
 By default there is no user click highlight when user click row, if this feature is required, we can config like this:
 In column configuration, adding clickToHighlight: true, sample as below:

 ```
  columns: {

         contractId: {
         	....
         	clickToHighlight: true
         },

         }
 ```
 Please put this only on the keyColumn in order to take effect, otherwise, highlight is not going to happen.

 **Mode of DataTable**
 DataTable is mostly used for viewing data, but it has some writing operaiton, such as create view, delete view, or update current view. In order to prevent user from making any modification, you need to do followings:

 ```
  var config = {

    mode: "R",

 ```
 mode config is operational and its available options are R | R/W
 Attention, we have already provided default class, you can overwrite the class by css in your app. Now it is:
 ```
 .R{
	opacity: 0.2;
    pointer-events: none;
}
 ```

 **TimeZone Support**
 DataTable is now providing timeZone support, if you want to enable it, please add following config:

 ```
 enableTimeZone: true,
 defaultTimeZone: "PST",
 ```

 Meaning of parameter:

 1. defaultTimeZone is the timezone used for dateTime column in the data passed to dataTable. Rightnow, we only accept date format of:

 ```
 YYYY-mm-dd HH:mm:ss
 ```

 If you pass other date format and also want to enable timeZone on it, please submit ticket.

 2. For each timezone, there are currently two options, daylight saving time and standard time, that means, if you choose EST, it will always be EST, customer has to intentionally change that to EDTduring summer time.

 There is no need in wrapper app to update js code, config is already saved with customer config.


**TimeZone Support Global**

Above config is only for local timezone config, which means, timezone config is saved with each individual config. And user can apply different timezone to different view configuration.

If you require to have table scope timezone, which means, you want to apply SAME timezone for all the individual config, you need to use following settings:

 ```
 enableTimeZone: true,
 defaultTimeZone: "PST",
 isGlobalTimeZone: true,
 timeZone: "PST",
 ```

 isGlobalTimeZone: Optional, default is false, setting true to make global timezone
 timeZone: "PST"|"EST".., this is optional, if omitted, it will be same as defaultTimeZone.

 Then when you are loading dataTable, you need to provide below callback handler to change timeZone:

 ```
 updateGlobalTimeZone: function(zoneName){}
 ```

You must provide this callBack handler to save user's choice, then next time, when the dataTable is loaded, you need to either pass timeZone with above config, or call below method to set timeZone:

 ```
	dataTableObj.setGlobalTimeZoneFor(appId, timeZoneName);
 ```

Remember, this method must be called after config setting, otherwise, it will be overwritten.



 **Popup Column Chooser**

In case there are a lot columns, for example ASWB, they have more than 50 columns, it will be very inconvenient to use left panel to do column sorting. In this case, the pop-up column chooser/sorter is provided, please do following for config:

 ```
 allowPopupColumnSelect : true,
 ```

In this case, if you click the column tab, a dialog will be provided for user to toggle or re-order current columns.

 **Column Freezable**

 It is desirable that user want to freeze some columns, so that when they scroll the columns, the frozen columns will stay unchanged at all. This is required by AsWorkbench, but this feature should be applied to all tables for users to easily scroll columns and compare data.

 In order to freeze columns, you just need to simply change your config like this:

 ```
 	columns : {
      srId : {
       	freezable: true
      },

      status_reason : {
       freezable: true
      },
      }
 ```

You need to put freezable attribute to any columns that you want it to be frozen.
1. You should not put ALL columns to be frozen
2. All the frozen columns are moved to the leftmost part of the table
3. If you are using popup mode for column choser, the checkbox is added to each toggleable button
4. ASAP you are freezing any columns, this is saved as the current config, then next time, when you are loading the  table, it will be restored automatically. There is NO need to provide any extra api support for saving the frozen columns.


**Summer Day Light Saving Time Support**
By default, component is detecting day light saving time automatically and use it for displaying purpose. The working process is like this:

1. When rendering a dateTime data in data table, it will automatically check if the dateTime is falling into day light saving time period by comparing the date's timezone offset vs. standard timezone offset;
2. Then the original dateTime will be added with the offset difference as above. For example, if case created dateTime is 2017-04-01 12:00:00, then it is within summer time, and this dateTime will be adjusted automatically with the above summerTime difference, and in reality, it should be 2017-04-01 11:00:00 (after adjustion)
3. Once we remove the summer time influence, it will be displayed accurately as if no summer time exists.

This feature will be disabled if you set following config (this is optional):

```
 disableAutoSummerTimeDetect: true
```

 **Nested Content Global Filter/Sort/Pagination**
 By default, nested contents (pop-up table inside dataTable) is using in-app sorting/filtering and pagination. If you want to enable global filter/sorter/pagination, please follow below steps:

 1. When you are creating nested dataTable, you need to set defaultGlobal to true and also set relevant column to be sortable based on your requirements;
 2. For dataTable creation, please add following configurations:

 ```
  ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
     nestedNextPageHandler: this.nestedNextPageHandler.bind(this),
     nestedSortHandler: this.nestedSortHandler.bind(this),
     nestedFilterHandler:this.nestedFilterHandler.bind(this),
 ```

 3. For the handler, implement as below:

 ```
 	var nestedFilterHandler = function(type, filterObject){
   	console.log('type: ' + type);
   	console.log('filter is ');
   	console.log( filterObject);
   };

   var nestedSortHandler = function(type, key, up){
     console.log('type: ' + type);
     console.log("key: " + key);
     console.log('up: ' + up);
   };

   var nestedNextPageHandler = function(type, currentPage){
   ....
   }

 ```

 4. Once you finished data Retrieval, you must set data like this:

 ```
  jnprDataTableObj.setExtraDataUpdate(appId, <newDataList>);
 ```

 Attention, you must use use setExtraDataUpdate() to set new data, not setExtraData()


**Nested Content Popup (New)**
Current solution for showing nested popup table inside dataTable is pretty heavy and it includes too much business logic. In order to simplify this process, we are moving out the plus sign detection logic out of NGCL and the wrapper application needs to do before passing data to NGCL. The steps are as follows:

Step 1. Main table config:

Inside main table configuration, you need to add following configs:

```
  extraDataControllerColumn : 'having_extra_data',
  extraDataShowingColumns : ['rma_id'],
  extraDataConfigIds: ['extra_data_config'],
  extraDataOffsets: [0, 20],
 ```

 - extraDataControllerColumn: Point to the new column for each data row, this column is used to specify if this row has extra data or not
 - extraDataShowingColumns: (Optional) Specify which column to put the plus sign is plus sign is to be added. This has been updated from before, in the past, we only add plus sign to the key columns, now, you can add the plus sign to any columns. One or more
 - extraDataConfigIds: (Optional) This is required also to make sure configuration can be mapped accurately for pop-up table. It is in list format if we have more table in the pop-up component, such as MyJuniper KB/PR.
 - extraDataOffsets: (Optional) If you are not displaying popup at first column, then you need to use this config to change offset on X and Y. Rememebr, the larger X, the lefter, and the larger Y, the lower)

 Step 2: Add extra column definition as follows:

 ```
 	columns:{
 		....
 		 having_extra_data : {
	        id : 'extra_data_controller',
	        hidden : true
	      }
 	}
 ```

 Here, this column must be hidden and also its id must match above extraDataControllerColumn definition

 Step 3: Now you need to update your data passed to parent table, remember, you must add column <having_extra_data> to each row and accurately set it to be true | false, for example:

 ```
 jnprDataTableObj.dataList = [ {
    "rma_id" : "R2892124-1",
    "status" : "Open",
    "created_ts" : 1498147871000,
    "having_extra_data" : true
  },{}]
 ```

 Step 4: When rendering dataTable, add extraDataCallBack Handler like below:

 ```
   ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
    appId : "rma",
    extraDataCallBack : this.extraDataCallBack.bind(this),
  }), document.getElementById('example4'));
 ```

 Step 5: Now we need to show extra data table by doing following:

 - step 1) You create configuration for pop-up window, right now, please do NOT use global, only in-app filter/sort is available
 - step 2) passing to dataObject like below:
 ```
 nprDataTableObj.setAdditionalConfigFor("rma", 'extra_data_config', config_popup);
 ```
 Here, "rma" is parent table appId, "extra_data_config" is what you specified in extraDataConfigIds in above step 1, and config_popup is the new configration.

 - step 3) passing data to dataTable object like below:

 ```
   var extraData = {
      extra_data_config : [ {
        replace_id : '',
        replace_status : 'Complete',
        replace_serial : 'CABN6194',
        defective_item_id : '',
        defective_serial : 'CAAZ2876',
        defective_product_id : 'MPC4W-3D-32XGE-SFPP'
      }, {
        replace_id : '',
        replace_status : 'Complete',
        replace_serial : 'CABN6195',
        defective_item_id : '',
        defective_serial : 'CAAZ2877',
        defective_product_id : 'MPC4W-3D-32XGE-SFPP'
      } ]
    }
    jnprDataTableObj.setExtraData('rma', extraData);
 ```

You have to put configId you specified in your step 1 configuraiton into extraData format here.

Now you are done and you have a pop-up table inside NGCL!

**Nested Popup With Custom Defined Content**

By default, we will show pop-up DataTable in NGCL. If you do NOT need to have dataTable pop-up, but only your own defined contents, please follow below steps.

Step 1. Configuration for main  table:
This step is similar to above,

```
 	extraDataControllerColumn : 'having_extra_data', //this is mandatory
    extraDataShowingColumns : 'rma_id', //this is optional, you can also use ['rma_id, 'created_ts']
    extraDataOffsets: [0, 20], // optional, used to place popup accurately
	customizedPopUp: true, //optional, used to pass popup html content
```

You do not need to provide configIds for pop-up table any more as there is no need to have pop-up table

Step 2: Same as above step 2

Step 3: Same as above step 3

Step 4: Same as above step 4

Step 5: in the call backHandler, do as below:
```
	 var extraDataCallBack = function(data) {
	  var content =
       `<table style='width:200px' border=1>
      		<thead>
      			<tr>
      				<th>col1</th><th>col2</th><th>col3</th>
      			</tr>
      		</thead>
      		<tbody>
	      		<tr>
					<td>col1</td><td>col2</td><td>col3</td>
				</tr>
				<tr>
					<td>col1</td><td>col2</td><td>col3</td>
				</tr>
				<tr>
					<td>col1</td><td>col2</td><td>col3</td>
				</tr>
      		</tbody>
      	</table>`;
      jnprDataTableObj.setExtraData('rma', content);
	 }

```

Please note here, you must provide style or style className in your app so as to make the pop-up content to be accurately formated. Also please avoid style conflicts between NGCL and your application.



**Nested Popup With passing TabbedWrapper component and config**

By default, we will show pop-up DataTable in NGCL. If you do NOT need to have dataTable pop-up, but if you need to pass config, please follow below steps.

Step 1. Configuration for main  table:
This step is similar to above,

```
 	extraDataControllerColumn : 'having_extra_data', //this is mandatory
    extraDataShowingColumns : 'rma_id', //this is optional, you can also use ['rma_id, 'created_ts']
    extraDataOffsets: [0, 20], // optional, used to place popup accurately
	customizedPopUp: false, //mandatory, need to pass false when customizePopUpType is being passed
    customizePopUpType: 'tabbedTable' //this is mandatory
```

You do not need to provide configIds for pop-up table any more as there is no need to have pop-up table

Step 2: Same as above step 2

Step 3: Same as above step 3

Step 4: Same as above step 4

Step 5: in the call backHandler, do as below:
```
	 var extraDataCallBack = function(data) {

         var datalists = [
   		[{ "QuoteId" : "2892124-1",
   			 "endCust" : "test0",
   			 "createdBy": "juniper"
   		}],

   		[{ "QuoteId" : "2892124-1",
   			"endCust" : "test0",
   			"createdBy": "juniper"
   		},
   		{
   		  "QuoteId" : "2892124-1",
   		  "endCust" : "test0",
   		  "createdBy": "juniper"
   		}],

   		[{ "QuoteId" : "2892124-1",
   			"netValue" : 121.12
   		 },
   		 {
   		   "QuoteId" : "2892124-1",
   			"netValue" : 121.12
   		},
   		{
   		  "QuoteId" : "2892124-1",
   		  "endCust" : "test0"
   		}]
   	  ]

   	  var configs = [
   		   {
   			  rowHeight: 29,
   			  headerHeight: 35,
   			  tableHeight: 348,
   			  tableWidth: 1200,
   			  defaultGlobal: false,
   			  hidingBottomPagePositioner: true,
   			  columns: {
   				QuoteId: {
   				  id: "QuoteId",
   				  title: 'Quote #',
   				  key: true,
   				  sortable: true,
   				  defaultColumn: true,
   				  width: 150,
   				  minWidth: 100,
   				  flexGrows: 0,
   				  sendClickToParent: false
   				},
   				endCust: {
   				  id: "endCust",
   				  title: 'End Customer',
   				  sortable: true,
   				  defaultColumn: true,
   				  width: 150,
   				  flexGrows: 1
   				},
   				createdBy: {
   				  id: "createdBy",
   				  title: 'Created By',
   				  sortable: true,
   				  defaultColumn: true,
   				  width: 150,
   				  flexGrows: 1
   				}

   			  }
   		  },

   		  {
   			rowHeight: 29,
   			headerHeight: 35,
   			tableHeight: 348,
   			tableWidth: 1200,
   			defaultGlobal: false,
   			hidingBottomPagePositioner: true,

   			columns: {
   			  QuoteId: {
   				id: "QuoteId",
   				title: 'Quote #',
   				key: true,
   				sortable: true,
   				defaultColumn: true,
   				width: 150,
   				minWidth: 100,
   				flexGrows: 0,
   				sendClickToParent: false
   			 }
   			}
   		  },

   		  {
   			  rowHeight: 29,
   			  headerHeight: 35,
   			  tableHeight: 348,
   			  tableWidth: 1200,
   			  defaultGlobal: false,
   			  hidingBottomPagePositioner: true,

   			  columns: {
   				QuoteId: {
   				  id: "QuoteId",
   				  title: 'Quote #',
   				  key: true,
   				  sortable: true,
   				  defaultColumn: true,
   				  width: 150,
   				  minWidth: 100,
   				  flexGrows: 0,
   				  sendClickToParent: false
   			  },

   			  netValue: {
   				id: "netValue",
   				title: 'Net Value',
   				sortable: true,
   				defaultColumn: true,
   				width: 150,
   				flexGrows: 1
   			  }

   			  }
   		  }

   	  ]

   	  var data = [{
   		  title:'tab1',
   		  config:configs[0],
   		  dataList:datalists[0]
   	  },
   	  {
   		  title:'tab2',
   		  config:configs[1],
   		  dataList:datalists[1]
   	  },
   	  {
   		  title:'tab3',
   		  config:configs[2],
   		  dataList:datalists[2]
   	  }]

      jnprDataTableObj.setExtraData('rma',  data);

	 }

```

***AutoComplete DropDown Filter***

If you want to filter some fields with autocomplete option, please do this way:

You need to define the columns as below:

```

        locationName: {
          defaultColumn: true,
          width: 100,
          flexGrows: 0,
          id: "locationName",
          type: "autoCompleteSearch",
          title: "Location Name",
          sortable: true,
          filterable: true,
          editable: false,
          items: locationOptions
       },

```

Most definitions are the same as others, but the type shold be: autoCompleteSearch

Also, you must pass all the available dropdown options as list in below format:

```
[
	{
		value: 'aaaa',
		tilte: 'bbb'
	},
	{
		value: 'cccc',
		tilte: 'ddd'
	},
	...
]

```

And in the filter call back handler, you will have this if use make any choices:

```
{
	locationName: {
		comp: 'in',
		value1: ["d30fb81b-cf1a-11e5-b83b-005056a9381e", "3dcd769e-cf1b-11e5-a1bd-005056a9381b"]
	}
}
```

If user does not select any dropdown, then this won't exist in the filerHandler parameter

***Performance for large data for autoCompleteSearch functions***

There are situations that autoCompleteSearch component has a large quantity of dropdown, such as in MYJ contract, user can have more than 30k accounts. This will cause the table loading to be frozen, in this case, if you expect the large quantity of dropdown options, please follow below solutions:

Step 1: pass empty options in the configuration like below:

```
    locationName: {
          type: "autoCompleteSearch",
          items: []
    }
```

Step 2. Once you obtain the dropdown list, please set it as below:

```
jnprDataTableObj.setBigColumnAutoCompleteData(appId, columnId,  options);
```

Once you set the dropdown options, it will be reflected in the data table immediately.


***Right Fixed Column***
In most cases, the freezable columns are used to freeze column on the left side of the table. If you want to freeze column on the right side of the table, please use following configuration for the table.

```
columns:{
	srId:{
		...
        rightFixed:true
```        

This configuration is optional, by default, there is no right fix on any columns.

***Action Clickable Cell***
In case that we need to provide clickable icons/images in one cell, such as PDF/XLS download or Copy/Edit icons in the cell for each row, we need to do as follows:

**Step 1: Provide configuration for the icons/images for the column**

```
 download:{
        defaultColumn : true,
        width : 100,
        flexGrows : 1,
        type : "actions",
        id : "download",
        title : "Quote Output",
        items: [
                {
                  icon:'./images/xls.png',
                  type: 'download_xls'
                },
                {
                  icon:'./images/pdf.png',
                  type:'download_pdf'
                }
                ],
        rightFixed: true
      },

      actions:{
        defaultColumn : true,
        width : 200,
        flexGrows : 1,
        type : "actions",
        id : "actions",
        title : "Actions",
        items: [
                {
                  icon: 'mode_edit',
                  type: 'edit'
                },
                {
                  icon:'content_copy',
                  type:'copy'
                },
                {
                  icon:'./images/copy.png',
                  type:'copy-1'
                }
                ],
        rightFixed: true
      }
```

The most important configurations are the items, each item has two attributes, icon and type.

icon: it can be in one of two formats:
1) Material design icon name or
2) actual icon image URL

type: type name will be sent back once clicked, used for different action oprations


**Step 2: update the data passed to data table to decide if we need to display the action icons**

For each row, you need to set if display or not, for above configurations:

```
item['actions']={
          edit: true,
          copy:true
      }
      item['download']={
          download_xls: false,
          download_pdf: false
      }

```

Here, item is the row data, and key for the data is mapped to the type defined in the configuration above. by default, it is not displaying the icon, but you have to pass true to display the icon

**Step 3: setting up the call backHandler as below**

```
ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
	....
 	cellActionClickHandler: this.cellActionClickHandler.bind(this),
	...
});

 var cellActionClickHandler = function(row, cell, action){

    console.log('clicked the action icon');
    console.log("row=>", row);
    console.log("cell=>", cell);
    console.log("action=>", action);

  };

```

Here action object can be used to decide what to do when user click the icon

***TimeStamp Support***
NGCL is now supporting timestamp in addition to regular date string support. In order to use timestamp, you just need to pass timestamp directly instead of date string. No other special setting is required.
The column type is the same as before, still customDate. The component is designed to automatically treat it as timestamp if the value passed is number, if not number, then this value is treated as date string.

A new attribute is added to decide the format, if you are passing type as customDate, and you want to use your own dateFormat, please pass like this:

```
lastModifiedDateMillis: {
...
type: 'customDate',
format: "DD-MMM-YYYY HH:mm:ss"
...
},
```

Explanation of format:


YYYY: year
MMM: month in three charactoer
MM:  month in tow digits
DD:  days in two digits
HH: hours in 24
mm: minutes in 60
ss: seconds in 60
ZONE: timezone used


***Customized ToolTip***
By default, tooltip is just being displayed using html title attribute, that is not possible to apply any style on it, and also it is NOT dynamically assigned. If we need to display custom tooltip with dynamic content, please following below approach.

**Step 1: Configuration**
Currently, tool tip is supported ONLY on the action type's icon, not on any other column types. If we have that requirements, I will continue to provide. Below is a demo for actions type:

```
download:{
  defaultColumn : true,
  width : 100,
  flexGrows : 1,
  type : "actions",
  id : "download",
  title : "Quote Output",
  items: [
          {
            icon:'./images/xls.png',
            type: 'download_xls',
            customizedTooltip: true,
            offset: [-30, -25],
            styleLess: false
          },
          {
            icon:'./images/pdf.png',
            type:'download_pdf'
          }
          ],
 rightFixed: true
},

```
For each item, you need to provide below three attribtutes:
- customizedTooltip: (optional) true | false, by default, it is not enabled
- offset: (optional) used to adjust tool tip position. Attention, tooltip can NOT cover the icon image, otherwise, it will not work properly and you will see flickering effect. Make sure it is out of the icon image boundary
- styleLess: (optional) I am already provided a basic style as tooltip content wrapper, which is having gray background with border, if you want to provide your own style, please set it to true, and provide your own html content with wrapper styling

**Step 2: callback and content setting**
After setting config, please provide callback handler as below:

```
  ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
  ...
  cellActionMouseOverHandler: this.cellActionMouseOverHandler.bind(this),
  ...
  }
```

And in the callback handler, do below:

```
var cellActionMouseOverHandler = function(row, cell, item){
  //here we need to show toopTip info
  var content = "<div><b>Title:Shared Session</b><br/>Case: 12345-33-22<br/>Start at: 2017-01-03</div>";
  jnprDataTableObj.setOpenCustomToolTip('appId_3', content);
};
```

For the parent application, please use passed row/cell/item parameter to generate relevant tooltip and then set as above.

***Customer Event***

You can add following eventHandler in case of needed

```
rowClassNameGetter: this.rowClassNameGetter.bind(this),
onRowMouseLeave : this.onRowMouseLeave.bind(this),
onRowMouseEnter: this.onRowMouseEnter.bind(this),

var rowClassNameGetter = function(index){
if(index<5){
  if(index==1){
    return 'top';
  }else if(index==4){
    return 'bottom';
  }else{
    return 'middle';
  }
}else{
  return '';
}
};

var onRowMouseEnter = function(event, index){
var x = event.clientX;
var y = event.clientY;
var coords = "X coords: " + x + ", Y coords: " + y;
console.log( 'enter', index, coords );
};

var onRowMouseLeave = function(event, index){
var x = event.clientX;
var y = event.clientY;
var coords = "X coords: " + x + ", Y coords: " + y;
console.log( 'leave', index, coords );
};


```

**Control cell clickable or not **

A generic requirement is to control if a cell is clickbale or not. For example, not every id in each row is clickable, based on other column data, we may decide some id is clickable, some id is not clickable. Please provide configuration as below:

Step 1: In the configuration

```
clickableColumnListNameForRow: 'clickable_columns'
```

This configuration indicates which column is used to indicate what columns are clickable for the row, in this case, the new column name is 'clickable_columns'

Step 2: Now, we need to add this column to each row of dataList and then asssign back to the table, for example:

```
jnprDataTableObj.dataList = [ {
  "rma_id" : "R2892124-1",
  "status" : "Open",
  "created_ts" : 1498147871000,
  'created_dt' : '2017-04-01 12:00:00',
  "having_extra_data" : true,
  "clickable_columns": "rma_id"
}, {
  "rma_id" : "R4546321",
  "status" : "Dispatch",
  "created_ts" : 1498127871000,
  'created_dt' : '2017-05-01 12:00:00',
  "having_extra_data" : false,
  "clickable_columns": ""
}, {
```

Here, we added extra column to each row named 'clickable_columns', and the value for this cell is the column list that should be clickable. Here, it can be either one column, or multiple columns, set as string separated by comma, such as 'rma_id,status', then both column cell will be clickable. If you do not want the cell to be clickable, then you NEED to pass empty string as above here.

***Updatable Cell***
In case you want to show cell in format as dropdown or checkbox or datePicker, you need todo as below:

1. Checkbox

```
{
    defaultColumn : true,
    width : 120,
    id : "column" + columns,
    type : "checkbox",
    title : "Column" + columns,
    sortable : true,
    filterable : true
}
```
Here the column type is "checkbox", and then the cell data is passed as true (checked) or false (unChecked)

2. single_select

```
{
    defaultColumn : true,
    width : 200,
    id : "column" + (columns+1),
    type : "single_select",
    disableSingleSelectOption: true,
    title : "Column" + (columns+1),
    sortable : true,
    filterable : true,
    defaultDisabledControlColumn: 'abc'
}
```

Here, the type is "single_select", after this, you should pass data of the cell to the list like below:
- disableSingleSelectOption, decide if you want to disable singleSelect dropdown or not if there is only one option
- defaultDisabledControlColumn: used to point to extra column to control default disable or not for this single select dropdown. Then you need to modify the column configuration by adding this column config as below:

```
{
    defaultColumn : false,
    hidden: true,
    sortable : false,
    filterable : false,
    key:false
}
```

finally, adding data to each row as below:

rowData['abc'] =  true|false;


```
[{
    title : 'option1,option2,option3,optoin4',
    value : 'value1,value2,value3',
    selected : false
}, {
    title : 'option2',
    value : 'value2,value3,value4',
    selected : false
}]
```
3. multi_select

```
{
    defaultColumn : true,
    width : 160,
    id : "column" + (columns+4),
    type : "multi_select",
    title : "Column" + (columns+4),
    sortable : true,
    filterable : true,
    numberTitle: true,
    disableSingleSelectOption: true,
    defaultDisabledControlColumn: 'def'
}
```
- the type is 'multi-select'
- numberTitle(optional): true|false Used to decide if we want to show total selected options number in the title or show list of options in the title
- disableSingleSelectOption: decide if you want to disable singleSelect dropdown or not if there is only one option

Then in the cell data, please use above option list as single-select

- defaultDisabledControlColumn: used to point to extra column to control default disable or not for this single select dropdown. Then you need to modify the column configuration by adding this column config as below:

```
{
    defaultColumn : false,
    hidden: true,
    sortable : false,
    filterable : false,
    key:false
}
```

finally, adding data to each row as below:

rowData['abc'] =  true|false;



4. Datepicker:

```
{
    defaultColumn : true,
    width : 200,
    id : "column" + (columns+2),
    type : "datepicker",
    format: "DD-MMM-YYYY",
    timezone: "PST",
    title : "Column" + (columns+2),
    sortable : true,
    filterable : true
}
```
- Here, the type is 'datepicker',
- 'format' (optional):  is having definition as date picker definition, please refer to that doc for details.
- 'timezone' (optional): default is 'PST'

Now for each cell, please pass value as default.
Attention, the value can be either string format or timestamp. DataTable will automatically convert it.

***Control minimum date for the datepicker***
In case you want to config the minumum date that user can select, please follow below:

In configuration:

```
{
	defaultColumn : true,
	type : "datepicker",
    ...
    minDateControllerColumn: 'minDateControllerColumn',
    maxDateControllerColumn: 'maxDateControllerColumn'
}
```

Here the minDateControllerColumn is pointing to the extra columns withe value of the minumum allowed date

Then in the dataList, set the value of this cell as below,

```
    rowData['minDateControllerColumn'] = 1524547618000; //Tuesday, April 24, 2018 5:26:58 AM
```

Here the maxDateControllerColumn is pointing to the extra columns withe value of the maximum allowed date
if maximum date is not bigger than min date, it will be ignored.
Then in the dataList, set the value of this cell as below,

```
    rowData['maxDateControllerColumn'] = 1650778018000; //Tuesday, April 24, 2022 5:26:58 AM
```

Here the value should be in format of timestamp only.

**Now we have call back handler as below:

```
ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
    cellDataUpdateCallBackHandler: function(row, columnId, data){
        console.log('row:');
        console.log(row);
        console.log('columnId:', columnId);
        console.log( data );
    },
}), document.getElementById('example3'));
```

Here, the first parameter is Row data, second is columnId, and third is the data  changed. If for datepicker, you will get objects returning both dateString and timestamp!

***Disable Row On Demand***
In cases that you want to disable rows based on client's event, such as once added some rows to backend, we want to disable these rows so tha tuser can not click them again, we can follow below solutions:

```
var checkedRows = [];
var disableRows = function(){
	checkedRows = [];
	var jnprDataTableObj = JnprCL.JnprDataTableObjectFactory.getDataTableObject();
	var rows = jnprDataTableObj.getCheckedRowsFor('appId_1');
	for(var i=0; i<newList.length;i++ ){
		 var selected = false;
		 rows.forEach(row=>{
			 if(row.column0===newList[i].column0){
				 selected = true;
			 }
		 });
		 if(selected){
			 checkedRows.push(i);
		 }
	 }
	 window.dispatchEvent(new Event('resize'));
}

var getRowClasses = function(index){
	if(checkedRows.indexOf(index)>=0){
		return 'disableRowClick';
	}else{
		return '';
	}

    ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
        ...
        rowClassNameGetter: this.getRowClasses.bind(this),
        ...
    }), document.getElementById('example3'));
```

Explanations:

- You need to set rowClassGetter callBack, this callback will be used whenever dataTable is refreshed and updated;
- You need to use one global variable to store all the to be disabled rows, here, we ONLY save indexes for the rows in this variable;
- Inside the getRowClasses() method, you can return any className. But if you do not use 'disableRowClick', you then have to provide your own styling in your applications

***Collapsed Row/Expandable Row solution***
It is possible that we want to display information acrossing all the columns in one row, in this case, we need to use below solution:

```
ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
    subRowHeightGetter: function(index){
        return 80;
    },
    rowExpandedGetter: function(data){
        console.log(data);
        return null;
    }
}), document.getElementById('example3'));
```

- subRowHeightGetter: used to decide the height of one certain inserted row. If you do not want to insert the row, then return null
- rowExpandedGetter: Passing component to be displayed

***New Cell Format - number***
There is a new cell format added, number, so that we can easily display and filter number in the data table.

- step1: Configuration
```
{
    defaultColumn : true,
    ...
    type : "number"
    ...
}
```
Once you set the type of the cell to number, the filter controller will automatically display the filter the same as date, which contains following options:
- equal
- less than
- greater than
- between

And customer will be able to filter number automatically if they are using in-app data processing solutions

- step2: Global searching
If you are using global data processing solution, when user filter by number there will be following call back:

In the filterHandler call back, you will have:
```
{
    columnId: {
        comp: "=" || "<=" || ">=" || "<>",
        value1: "xxx",
        value2: "yyy"
    }
}
```
Once you have filter object, please construct final global filterObject in the wrapper application level

***New Component Filter Solution (In App)***

Currently, we only filter component using component value. But with the addition of new components, such as checkbox, single_select component, datepicker etc, the value of each component is no longer the pure values, so in this case we need to change configuration as below to make sure the in app filter is working as expected:

- checkbox
Please put configuratin as below:

```
{
    ...
    filterable : true,
    items:[
        {id:'item1',title:'Checked',value:true},
        {id:'item2',title:'UnChecked',value:false}
    ]
}
```
Please be noted that
1. most important config here is title, which will be used for displaying purpose of the dropdown.
2. you must pass true|false to individual item, which will be used to match either checked or unchecked

- single_select
In order to make single_select dropdown filterable, you must provide below configuration:

```
{
    ...
    type : "single_select",
    filterable : true,
    items:[
        {
            id: 'item1',
            title : 'option1',
            value : 'value1'
        }, {
            id: 'item2',
            title : 'option2',
            value : 'value2'
        }, {
            id: 'item3',
            title : 'option3',
            value : 'option3'
        },
        ...
    ]
}
```

Please be noted that:
1. the options passed to items MUST match that of the data list's column cell options;
2. title is not important, value is the only criterial to be used for filtering purpose

- datepicker
No special handling required
