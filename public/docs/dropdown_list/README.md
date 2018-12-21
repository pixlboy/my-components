# DropDown List Introduction
Goals for this component

- Display DropDown in a more professional way

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
var JnprDropDownComp = JnprCL.JnprDropDownComp;
```

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

- Each option has two attribute title and value, if you want to preselect, please pass selected attribute to it. it is true | false

**Step 4: Render the comp**

```
ReactDOM.render(React.createElement(JnprDropDownComp, {
    options : options,
    singleSelect:false,
    onChange: this.onChange.bind(this),
    appId: "appId_1"
  }), document.getElementById('multi_select'));
```

Notes:

- options: like above configured
- singleSelect: By default, it is single select, so you have to decide if your dropdown is either single select or multiselect. it is true|false
- onChange: call back function for user selection. it is comma separated string. Empty if nothing selected
- appId: same as all other comp, it is very important to make sure you can put multiple dropdown select on the same page

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

You can have two options having overlapping keys, and NGCL will automatically de-duplicate the values, for example, you have 'val1, val2, val3' and 'val2,val3,val4', then NGCL will give back 'val1,val2,val3,val4' if user selected both options.
