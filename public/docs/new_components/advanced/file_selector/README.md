# File Selector Introduction
Goals for this component

- In many cases, UI needs to provide user append files capabilities. This component needs to do followings:

1. Initial vadidation for user's file selection, such as size/types etc;
2. User should be able to remove the attached file


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
var FileSelector = JnprCL.FileSelector;
```

**Step 3: Create Components**
```
ReactDOM.render(React.createElement(FileSelector, {
	appId: "appId_1",
	restrictions: {
	   allowedFileTypes: ['xls', 'xlsx', 'docx', 'doc'],
       allowedFileTypesErrorMsg:'wrong format'
	},
	onUploadCallback: this.onUploadCallback.bind(this),
	trans: this.trans.bind(this)
}), document.getElementById('file_selector'));

```
Notes:

- appId: used to distinguish multiple file selector in the application
- restrictions(optional): if omitted, there is no validation check once user chose one file. Currently, I put one restriction here, allowedFileTypes, here, it only accepts two types 'xls', 'xlsx', 'docx', 'doc'. You can also provide pdf, txt etc, and the component will check fileName for this. The reason for checking fileName is just for simplicity reason. So, do not depend on this validation checking, you need to put more backend checking.
- allowedFileTypesErrorMsg (optional): this is used to pass i18n message into component, if omitted, a default msg will be displayed
- onUploadCallback: This function is triggered when user click the upload button
- trans(optional): used in translate passed term. Each app needs to undertake this based on their own solutions

**Step 4: CallBack Handler**

```

var onUploadCallback = function(file){
	$('#selectedFile').html('You have selected file: ' + file.name);
}

var trans =function(term){
	return term +'!';
}

```

Notes:

- this function only accept one parameter, it is the file object. Please refer to HTML standard on how to use file object here.
