# textarea length validation Introduction
Goals for this component

- Validate textrea/input box length
>>>>>>> b943286... textarea length validation component

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
var InputGrouping = JnprCL.InputGrouping;
```

**Step 3: Render it**

```
  ReactDOM.render(React.createElement(InputGrouping, {
  	appId: "appId_1",
    currentTextlength:0,
    maxTextLength: 10,
    initValue:"test",
    inputType:"textarea"
    initClickHandler: this.initClickHandler.bind(this)
  }), document.getElementById('example'));
```

Notes:

- initValue: optional, initial values for editing purpose
- currentTextlength: optional, textarea/inputbox value count
- maxTextLength: max length of textarea/inputbox value
- Here we can push textarea/ inputpox as inputType.
