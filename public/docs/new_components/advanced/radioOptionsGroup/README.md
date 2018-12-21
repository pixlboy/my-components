# Radio Button Introduction

Goals for this component

- Display Radio Button in a more professional way. Also user can multiple radio button

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
var RadioOptionsGroupComp = JnprCL.RadioOptionsGroupComp;
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
    selected  : false
  }, {
    title : '!option3',
    value : 'value3',
   selected  : false
  },
  {
    title : 'option4',
    value : 'value4',
    selected  : false
  }, {
    title : 'option5',
    value : 'value5',
    selected  : false
  }, {
    title : 'option6',
    value : 'value6',
    selected  : true
},
{
  title : 'option7',
  value : 'value7',
  selected  : false
}

  ];
```

Notes:

- Each option has three attribute title , value and checked and checked is optional.

**Step 4: Render the comp**

```
ReactDOM.render(React.createElement(RadioOptionsGroupComp, {
    appId: "appId_1",
    options:options,
    groupTitle: 'Title: demo',
    onChange:this.onChange.bind(this),
  }), document.getElementById('example'));
```

Notes:

- options: like above configured
- onChange: call back function for user selection. it is comma separated string.
- appId: same as all other comp, it is very important to make sure you can put multiple dropdown select on the same page
- groupTitle: displaying title on top of options, optional

**Step 5: callbacks**

Two callbacks are needed here:

```

var onChange = function(data){ console.log( data ); }
