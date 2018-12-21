# Input Box Introduction
Goals for this component

- Give user better way to input multiple terms, such as emails, and it is easy for user to delete any term in the middle

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
 var JnprInputBoxComp = JnprCL.JnprInputBoxComp;
```

**Step 3: Render it**

```
  ReactDOM.render(React.createElement(JnprInputBoxComp, {
    onChange: this.onChange.bind(this),
    initValue:"asf@asf.ca,tesat@test.com,teat123",
    placeholder: "enter emails here",
    showAddButton: true,
    acceptSpace: true,
    blocksBelowInput: true,
    onDeleteBlock: onDeleteBlock,
    onAddBlock: onAddBlock,
    validate: validate
  }), document.getElementById('input_box'));
```

Notes:

- initValue: optional, initial values for editing purpose
- placeholder: optional, used to be place holder of input box
- onChange: callback function when input box is changed. This is called whenever user keydown or delete any terms. The callback data is formatted input, which means terms separated by comma only
- showAddButton: optional, used to show add button after the input box.
- acceptSpace: optional, used to accept spaces for the chips/blocks.
- blocksBelowInput: optional, used to show blocks before input box of after input box.
- onDeleteBlock: optional, callback function when chip/block is deleted.
- onAddBlock: optional, callback function when chip/block is added.
- validate: optional, callback function for validation before we add chip.

**Delimiter**
Right now, only ",",";"," " are considered as delimiter 

**Detect first time click**
In case manager, we have requirement to show message only when user click in the input field. In order to meet this requirement, we need to put a call back liek this:

```
  ReactDOM.render(React.createElement(JnprInputBoxComp, {
    onChange: this.onChange.bind(this),
    initValue:"asf@asf.ca,tesat@test.com,teat123",
    placeholder: "enter emails here",
    initClickHandler: this.initClickHandler.bind(this)
  }), document.getElementById('input_box'));
```