# AutoComplete Introduction
Goals for this component

- Provide auto complete dropdown functions

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
var JnprAutoComplete = JnprCL.AutoComplete;
```

**Step 3: Construct Dropdown Options**

```
var options = [
                 {
                   value:"value1",
                   title:"title1"
                 },
                 {
                   value:"value2",
                   title:"title2"
                 }...
                 ];
```

Each item has two values, value/title

**Step 4: Show Component**

```
 ReactDOM.render(React.createElement(JnprAutoComplete, {
    options: options,
    onChangeSelect:this.onChangeSelect.bind(this),
    destroy : function() {
      setTimeout(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById('example'));
      }, 0);
    }
  }), document.getElementById('example'));
```

**Step 5: Callback Handler**

```
  var onChangeSelect = function(options){
    console.log(options);
  };
```

Here the returned data is list of options, but it has attribute name as _value and _title, as they are used as internal class.

