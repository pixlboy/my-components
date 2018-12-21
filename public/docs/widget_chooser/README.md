# Widget Chooser Introduction
Goals for this component

- displaying available widgets to the user
- trigger call back to add widget to the tab when user click add button

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
var JnprWidgetChooser = JnprCL.JnprWidgetChooser;
```

**Step 3: Using DataObject to pass data to component**
```
var JnprWidgetChooserObject = JnprCL.JnprWidgetChooserObjectFactory.getWidgetOptionsConfig();
JnprWidgetChooserObject.widgetOptions = data; 
```
Notes:

- This object is a singleton, when widgets are passed to this data object, it will be automatically available inside the component using same solution
- data format is converted when passing data to data object using setter

**Step 4: Passing current wdigets**
There is a requirement to grey out current widget, so that user can no longer click it to add to the tab. In order to meet this requirement, you must pass current widgets in arrayList to dataObject before creating the widgetChooser instance like this:

```
JnprWidgetChooserObject.existingWidgets = data;
```

If you do not pass this option, then all the widget is clickable.

**Step 5: Signature for using component.**
Below I am only listing how to do in plain html file, if you are interested in knowing more for backbone/angularJS, please refer to README under root directory
```sh
 ReactDOM.render(React.createElement(JnprWidgetChooser, {
  		addWidgetCallBack: this.addWidgetConfig.bind(this),
  		closeMe: this.closeMe.bind(this),
  		//styleType: "ngcsc",
  	    destroy: function(){
	   		setTimeout(function(){
	    		ReactDOM.unmountComponentAtNode(document.getElementById('example'));
	    	}, 0);
	   	}
	}), document.getElementById('example'));
  ```
addWidgetCallBack: To be called when user add one widget, parameter is widget object

closeMe: To be called when user click close button  

**Step 6: Dynamically update widget chooser**

In order to make widgetChooser dynamically show disable/enable status, you just need to pass this on the fly:
```
JnprWidgetChooserObject.existingWidgets = data;
```
Then status for the widget option will be displayed automatically. Please note:

1. No need to call this when adding widget, as it is already takn cared inside widget chooser;
2. If you delete widget from outside of widget, you need to call this api to passs lastest existing widgets.
