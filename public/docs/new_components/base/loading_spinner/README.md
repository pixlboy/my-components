# Loading Spinner Component
Goals for this component

- We have requirements to show spinner whenever user is calling api so that user knows what is happening


## Usage


**Step 1: Create and Render the Component**

```sh
var LoadingSpinner = JnprCL.LoadingSpinner;
var loaderComp = ReactDOM.render(React.createElement(LoadingSpinner), document.getElementById('output'));
 ```

**Step 2: Show/Hide the spinner**

Once you created the loader component, using below method to show.hid it
```
loaderComp.show();
loaderComp.hide();
```
