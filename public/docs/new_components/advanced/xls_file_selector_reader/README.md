# XLS/XLSX File Selector/Reader Introduction
Goals for this component

This component extends FileSelector component, but it goes further to parse the contents of the file and return back as json data.

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
var XLSFileSelectorReader = JnprCL.XLSFileSelectorReader;
```

**Step 3: Create Components**
```
ReactDOM.render(React.createElement(XLSFileSelectorReader, {
	appId: "appId_1",
	typeErrorMessage: 'please select xls only',
	onUploadCallback: this.onUploadCallback.bind(this),
	trans: this.trans.bind(this)
}), document.getElementById('file_selector'));

```
Notes:

- appId: used to distinguish multiple file selector in the application
- typeErrorMessage(Optional): if not provided, then default error message will be displayed if user choose wrong file type
- onUploadCallback: This function is triggered when user click the upload button
- trans(optional): used in translate passed term. Each app needs to undertake this based on their own solutions


**Step 4: CallBack Handler**

```
var onUploadCallback = function(resultObj){
	$('#selectedFile').html('You have selected file: ' + resultObj.file.name +'<br/>Data:' + JSON.stringify(resultObj.data));
}

var trans =function(term){
	return term +'!';
}
```

Notes:

result object has two keys:
- file: fileObject that user selected from file selector
- data: This is the parsed json data from the file contents. For simplicity, it is in JSON format, so you can easily use it without worrying about how to parse it.

**Step 5: Update Button text before and after processing**
If you want to show button text when processing started and want to hide it after processing the data, you need to do this way:

```
var S = JnprCL.FileSelectorStore;
```

Here, we are exposing the fileSelectorStore.

```
var onUploadCallback = function(resultObj){
	$('#selectedFile').html('You have selected file: ' + resultObj.file.name +'<br/>Data:' + JSON.stringify(resultObj.data));
	S('appId_1').startProcessing();
	setTimeout(function(){
		S('appId_1').finishedProcessing();
	}, 2000);
}
```

Here, we are getting fileSelectorStore by using appId as parameter. Then we are using startProcessing() and finishedProcessing() to change button status here.
