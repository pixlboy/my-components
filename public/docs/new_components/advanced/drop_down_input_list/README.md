# DropDown List with InputBox Introduction
Goals for this component

- Display DropDown in a more professional way. Also user can input directly to have backend API validate the input value

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
var DropDownInputComp = JnprCL.DropDownInputComp;
var S = JnprCL.DropDownInputCompStore;
```

Notes: Here, we are exposing store, because this is needed when no item found callback is triggered, this store is useful for updating the style of this component (this will be explained in detail next)


**Step 3: Create Options**
```

var options = [ {
    title : 'option1',
    value : 'value1',
    selected : false
  }, {
    title : 'option2',
    value : 'value2',
    selected : false
  }, {
    title : 'option3',
    value : 'value3',
   selected : true,
  },
  {
    title : 'option4',
    value : 'value4',
    selected : false
  }, {
    title : 'option5',
    value : 'value5',
    selected : false
  }, {
    title : 'option6',
    value : 'value6',
    selected : true,
  }

  ];

```
Notes:

- Each option has two attribute title and value, if you want to preselect, please pass selected attribute to it. it is true | false.
- If this is single select, you must make sure only one is preselected.

**Step 4: Render the comp**

```
ReactDOM.render(React.createElement(DropDownInputComp, {
	options : options,
	singleSelect: false,
	onChange: this.onChange.bind(this),
	noItemHandler: this.noItemHandler.bind(this),
	appId: "appId_1"
}), document.getElementById('multi_select'));
```

Notes:

- options: like above configured
- singleSelect (optional): By default, it is single select, so you have to decide if your dropdown is either single select or multiselect. it is true|false
- onChange: call back function for user selection. it is comma separated string.
- appId: same as all other comp, it is very important to make sure you can put multiple dropdown select on the same page
- noItemHandler (Optional): In most cases, this is not needed, but if like that of Create Quote, when nothing is found, still need to dispatch API to check input validity, then this callBack is required. If you do pass this config, then if user input anything none-exist term, you will see no item found message. Otherwise, this message will not be there, instead this callback function will be triggered.

**Step 5: callbacks**

Two callbacks are needed here:

```

var onChange = function(data){
	console.log( data );
}

var noItemHandler = function(data){
	console.log('searching for ' + data);
	setTimeout(function(){
		S('appId_1').setError(true);
	}, 500);
}
```

The noItemHandler is what we will talk here. If you set this callback handler, then when no item is found form current dropdown, this callback handler will be triggered. You need to put whatever logic based on your requirement. But if nothing is found, we need to give user visual effect, so, at this moment, you need to call this:
```
	S('appId_1').setError(true);
 ```

 What does this mean? S() is what we included above at step two, and 'app_id' is what you passed to component props in step 4. As you may have multiple dropdown in the same page, and store is a singleton. In order to differentiate them, you then must pass appId as parameter of the store. Of course, if you have only one dropdown, then you can just use 'S()' to get the store.

**Closing of DropDown**
Dropdown will be automatically closed by any click out of the component and also be closed on ESC key click.

**Complicated Key values**
Now, this component is accepting option value with comma inside, for example, you can pass options as below:

```
var options = [ {
    title : 'option1',
    value : 'value1,value2,value3',
    selected : false
  }, {
      ...
```
**defualt disabled**
If you want to put default disabled, please use this as property:

```
ReactDOM.render(React.createElement(DropDownInputAppendCompSingle, {
	defaultDisabled: true,
}), document.getElementById('multi_select_append'));
````

Then you can control enable/disable from external:

```
store.setDisabled(true|false)
```

You can have two options having overlapping keys, and NGCL will automatically de-duplicate the values, for example, you have 'val1, val2, val3' and 'val2,val3,val4', then NGCL will give back 'val1,val2,val3,val4' if user selected both options.
