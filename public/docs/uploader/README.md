# Uploader & ProgressBar Component Technical Specification
Goals for this component

- Simplify Upload Implementation (AWS S3 only, will be extended to regular file upload when needed )
- Simplify progress bar for file upload


## Usage

There will be two components provided here, you can choose if you want to use progressbar or not based on your application requirements.

###Uploader Component###


**Step 1: Adding following js files into code base**
```sh
<script src="/js/libs/component/react-with-addons.min.js"></script>
<script src="/js/libs/component/react-dom.min.js"></script>
<script src="/js/libs/component/jnpr-components.min.js"></script>
<link rel="stylesheet" href="/js/libs/component/jquery-ui.min.css">

<script src="/lib/aws-sdk-2.7.20.min.js"></script>

```
Please add aws sdk here, it is helpful for providing md5 and SHA256 purpose

**Step 2: Obtain Component Instance**
```sh
 var JnprUploader = JnprCL.JnprUploader;
 var JnprUploaderDataObject = JnprCL.JnprUploaderDataObjectFactory.getDataObject();
 ```

**Step 4: Render the Uploader**

```
ReactDOM.render(React.createElement(JnprUploader, {

    maxFileCounts: 5,
    maxTotalFilesSize: 500000000, //500M
    maxEachFileSize: 100000000, //100M
    allowedFileTypes: ['pdf','txt','csv','zip'],

    aws_signerUrl: 'http://localhost:3000/api/sign_auth/juniper123',
    aws_key : 'AKIAJQEPYP2JOSXIPXRQ',
    aws_bucket : 'development-myjuniper',
    aws_region: 'us-west-1',

    onUploadKeys: this.onUploadKeys.bind(this),
    appId: "appId_1",

    onUploadStart: this.onUploadStart.bind(this)

  }), document.getElementById('uploader'));

```

Notes: It is highly recommended to provide uploading restrictions, if not, then there won't be any restrictions at all, restrictions are as follows:

- maxFileCounts: (Optional) How many simultaneous uploads are allowed, the total number includes files being uploaded in backend
- maxTotalFilesSize: (Optional) Max total sized allowed (in Bytes), this also includes current uploading file fize
- maxEachFileSize: (Optional) Max file size allowed for each file (in Bytes)
- allowedFileTypes: (Optional) Array list for file type

Below are S3 configurations (All mandatory):
- aws_signerUrl: signer URLfor each S3 requests
- aws_key: AWS s3 secrete key
- aws_bucket: Bucket name for S3
- aws_region: Region name

Call Back handler:
- onUploadKeys: used to generate fileKey for S3
- onUploadStart: used to trigger show/display of progressBar. To be introduced later
You do NOT need to use this event,as the progressBar will automatically appear when upload started, you can use this call back only if you are NOT using progressBar or wants to do other behaviors


**Step 5: CallBack function**

```
  var onUploadKeys=function(files){
    var keys = [];
    files.forEach(file=>{
      keys.push( ''+Math.floor(Math.random()*100000));
    });
    JnprUploaderDataObject.setFileKeysFor( 'appId_1', keys );
  }

```
Once keys aer generated, please use above solution to setKeys on DataObject only.

**Dynamic AWS_KEY support**
if AWS_KEY has to be dynamically changed, we config aws_key as null, and we need to provide awskeysForFiles list using callback getDynamicAWSKeys().
```
ReactDOM.render(React.createElement(JnprUploader, {

    maxFileCounts: 5,
    maxTotalFilesSize: 500000000, //500M
    maxEachFileSize: 100000000, //100M
    allowedFileTypes: ['pdf','txt','csv','zip'],

    aws_signerUrl: 'http://localhost:3000/api/sign_auth/juniper123',
    aws_key : null,
    aws_bucket : 'development-myjuniper',
    aws_region: 'us-west-1',

    onUploadKeys: this.onUploadKeys.bind(this),
    getDynamicAWSKeys: this.getDynamicAWSKeys.bind(this),
    appId: "appId_1",

    onUploadStart: this.onUploadStart.bind(this)

  }), document.getElementById('uploader'));

```
and then,
```
var awskeysForFiles = null;
var getDynamicAWSKeys = function() {
    return awskeysForFiles;
}
var onUploadKeys = function(files) {
  files.forEach((file, i) => {
    awsKeysForFiles.push({
      fileName: file.file.name,
      aws_key: (i + 1).toString()      --- this value should be aws_key from API
    })
  });
}
```
you need to pass fileName and aws_key for each object.

**Event Listeners**

```
this.jnprUploaderDataObject.subscribeToStatus('appId_uploader',
              _this._statusUpdated.bind(_this));
```

Why using this event? If you closed the progressBar, but you still want to notify user when uploading finished, please subscribe to this event.


**Uploader Extra Headers**

If we need to add extra headers when pushing to S3, you need to pass in config, liek this:

```
ReactDOM.render(React.createElement(JnprUploader, {

     x_amz_headers: {
      'x-amz-meta-attachment-type': 'CORE',
      'x-amz-meta-is-attachment-private': 'X',
      'x-amz-meta-user-id': 'ngcsc1@ngcsc.33mail.com'
    }

  }), document.getElementById('uploader'));

```

And then, if you are making update external and want the uploader to hear that, please use subscriber pattern to pass data to comp. Refer to Uploader/DataObjectFactory.jsx and UploaderMixin.jsx for more detail

**FileName Auto Increase Solution**

If you have requirement to automatically avoid filename conflicts and increase the filename by 1 each time, for example, currently, we already have filename: file1.txt, and we require the newly uploaded filename to be file1[1].txt, or currently, we already have file1[1].txt, file1[2].txt, then we want the newly uploaded filename to be file1[3].txt, then you need to perform below actions:

in config:


```
ReactDOM.render(React.createElement(JnprUploader, {

    currentFileNames: currentFileNames,

  }), document.getElementById('uploader'));

```

Here, the currentFileNames is in format of filename array, such as ["file1.txt", "file2.txt"]...

This attribute is optional, if you do not pass, then the filename will be used as is

**Update Attachment Names dynamically**

If user stay on the same page and continuously uploading the same file again and again, in order to have NGCL automatically update the file names, please inform it by doing below:

```
JnprUploaderDataObject.triggerFileCurrentNames("appId_uploader", currentFileNames);
```
Here, currentFileNames is the list of updated file names, once one file is uploaded successfully, you need to update the fileName list and trigger the event again. In this way, NGCL will always hold the latests file name list and can accurately calculate the next name.

###Progress Bar Component###

Progress bar is a separate component to show S3 uploading progress. It needs to be put separately with uploader, so that when user navigate away from current page, it is still being displayed.

**Step 1: Obtain Component Instance**

```sh
 var JnprUploaderProgresBar = JnprCL.JnprUploaderProgressBar;
```

**Step 2: Render ProgressBar**

```
 ReactDOM.render(React.createElement(JnprUploaderProgresBar, {
      monitorAppId: "appId_1",
      onClose: this.onClose.bind(this)
    }), document.getElementById('progressBar'));
```

Notes:

- monitorAppId: mandatory. This is NOT appId, but the appId of the monitored uploader
