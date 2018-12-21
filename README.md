# Component Library Introduction
This library aims at providing common components that will be used in but not limited to Backbone (for NGCSC), Angular1 (for JtacWorkBench), Angular2(Next Generation solution) framework. 
## Basic requirements for the components are:
  - Design for each component should not be for any particular framwork.
  - Each component code should not cause any conflicts with parent container.
  - Each component style should be considered carefully and should not pollute parent style.
  - Each component is independent of any other component, they can only use other component, but code should not depend on each other.
  - Data should be able to flow between parent containers and components, regardless of what parent container is, it can be backbone, angularjs, knockout, ember or even angular2!
  - Data update, when external data get updated, internal view needs to be updated automatically
  - Final deliverable must be minized and as simple as possible. Ideally, just ONE file for delivery.

## Solution - Technology
Considering above requirements, we decided to use ReactJS to create our components library, it is created by facebook, pretty light weight, furthermore it is not a framework, but only a view solution, so we can integrate it seamlessly into most modern javascript frameworks and use is only as view. 
Please read at: [React Introduction](https://facebook.github.io/react/)

Besides ReactJS, following technologies are used for building purpose:

  - npm: Package management
  - babel: converting jsx file into javascript file
  - lite-server: a light weight web server to serve static files using nodeJS
  - webpack: a super good web content packaging solution, it will package all the js, css or even images into a single file and very good and easy for use to deliver. As all css is integrated in the js file and minimized simultaneous, this is also a very secure solution.
  - scss: Although we can write css directly, it is required to write all the css using scss for each component you are creating. This can make each component more modularized
 
## Starting project

First install all node libraries:

```sh
npm install
```

Then you can start project using this command:

```sh
npm start
```
This command will start the whole system and following steps are performed:

  + lite-server is started at a random port if port 3000 is taken already
  + Whole project is being built, this includes building all scss/sass files, integrating into finalized js file, converting all jsx files into js file, concatenate all js file, and minimize single js file. Finally, watch the working directory, this will be explained later

## Development process

#### Auto Build
After you start the whole prlject using "npm start", your src folder (explained later) is being watched by webpack, this means, any update in your jsx and scss/sass files will trigger the building job all over again and you will always have lastest files inside the dist directory (see below)

#### Folder structure

```sh

--node_modules
--public
----dist
--------jnpr-components.js
--------jnpr-components.min.js
--------jnpr-components.js.map
----lib
--------some required js file by react and angualrJS2 (will clarify them later which one is needed)
----ng2
--------only files for angularJS2 projects (for demo only, ignore them here as we are not using angular2 yet)
----src
--------compoments
------------component1
----------------file.jsx
----------------file.scss
------------component2
----------------file.jsx
----------------file.scss
--------lib
------------base_chart_d3
------------other_lib
--------index.jsx
----typings (used by angularjs2, ignore as of now)
----bs-config.json
----package.json
----tsconfig.json
----webpack.config.json
----webpack.config.min.js

```

Based on this structure, we have to follow below requirements to guarantee the successful build:
1. When a new component is created, you should create some meaningful folder name under public/src/components directory.
2. All the files (both .jsx and .scss) should be in the same folder, this is recommended, but not mandatory. Because we are using webpack, as long as you can use 'require', it is all good.
3. Basic file structure for one .jsx is as follows:

```sh
let React = require('react');
let BarChart = require('../../lib/base_charts_d3/BarChart');
require('./barChart.scss');
 let JnprBarChartComponents = React.createClass({
 })
 module.exports = JnprBarChartComponents;
```

  * Require is used to load other package, module on demand
  * Please require the scss file into the component, this will guarantee the scss file is compilred and integrated into final js file automatically
  * You can use css if you want, just requite('file.css')
  * Name of component doesn't matter, but it must be exported using module.exports = xxxxx format

4. Once you created your component, you now need to expose it, edit public/src/index.jsx as follows

```sh
let JnprChartBar = require('./components/jnpr_charts/BarChart');
let JnprTestInputComp = require('./components/test_component2/testInputComp');
let JnprFbLink = require('./components/test_component1/fbLink');

module.exports = {
    JnprChartBar:JnprChartBar,
    JnprTestInputComp: JnprTestInputComp,
    JnprFbLink: JnprFbLink
};
```

Then when you want to use any component, you can do this way:

```sh
var ControlledComponents =  JnprCL.JnprTestInputComp;
```
Here JnprCL is the namespace exposed when webpack is packaging the whole project.

## Integration Approach (Backbone, AngularJS1 and AngularJS2)

In order to use components in backbone, AngularJS1 or AngularJS2, we need to add this into each application first,

```sh
<script src="lib/react-with-addons.min.js"></script>
<script src="lib/react-dom.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.js"></script>
<script src="lib/browser.min.js"></script>
<script src="dist/jnpr-components.min.js"></script>
<link rel="stylesheet" type="text/css" href="chart-style.css">
```

From here, we can see we have only used **ONE** actual component file, jnpr-components.min.js, thanks for webpack for packaging **ALL** web static assets into this file for us! You can use backbone config.js to have auto load if you want. Once you added above code reference, you are ready to use the component. 

**Sigature of each component**
All the components must provide following signature in order to communicate with parent container:
  - params: If parent container needs to pass data to component, they must pass pure javascript object, and wrap the data into this object;
  - callBack: If parent container wants to get data back from component, it must provide callback function,data will be passed back based on user's operation inside the component.
  
Both requirements will be explained in more details for all the senarios, pure html, backbone and angular1

**Pure html or none framework environment**:

```sh
<body>
    <div id="example"></div>
</body>
<script type="text/babel">
  	var obj = {
      		firstName: "Frank",
      		lastName: "He"
      	};
    var compCallBack = function(data){
    	document.getElementById('testOutput').innerHTML = data;
    }
 var ControlledComponents =  JnprCL.JnprTestInputComp;
	ReactDOM.render(
	  <ControlledComponents  params= {obj} callBack= {compCallBack.bind(this)} />,
	  document.getElementById('example')
	);
</script>
```

**Backbone**

```sh
 var AppView = Backbone.View.extend({
      el: 'body',
      template: '<h1>Widget Area:<h1><div class="widget-container">HelloWorld</div><hr/><h1>This is backbone area</h1><div id="divOutWidget"><div>',
      model: null,
      obj: null,
      initialize: function(){
        this.render();
      },
      compCallBack: function(data){
      	$('#divOutWidget').html(data);
      },
      render: function(){
      	obj = {
      		firstName: "Frank",
      		lastName: "He"
      	};
        this.$el.html(this.template);
        var ControlledComponents =  JnprCL.JnprTestInputComp;
        ReactDOM.render(React.createElement(ControlledComponents, { callBack: this.compCallBack.bind(this), params: obj}), this.$('.widget-container').get(0));
    	return this;
      }
    });
    var appView = new AppView();	
```
From the above code, the main point is we are using ReactJS component in the render() function of backbone view, please see how to pass data to component and how the callBack method is triggered.

**AngularJS 1**

```sh
		<div id='app1' ng-controller="controller">
			Regular angular area:
			<hr/>
			<react obj={{obj}} output="outputResponse"></react>
			Response:
			{{respondedContent}}
		</div>
	</body>
	<script>
		angular.module('app', [])
  		.directive('react', ()=>{
  		    var ControlledComponents =  JnprCL.JnprTestInputComp;
		  	return {
		  		restrict: "EA",
		  		template: '<div></div>',
		  		scope: {
		  			obj: '@',
		  			output: '='
		  		},
		  		controller: ['$scope', function($scope){
     				$scope.obj = JSON.parse($scope.obj);
     				$scope.compCallBack = function(data){
     					$scope.output(data);
     				}
    			}],
		  		link: (scope, element, attrs)=>{
		  			ReactDOM.render(
		  				React.createElement(ControlledComponents,  { callBack: scope.compCallBack.bind(this), params: scope.obj} ),
		  				element[0]
		  			)
		  		}
		  	}
		  })
		 .controller('controller', function($scope){
		 	$scope.obj = {
		      		firstName: "Frank",
		      		lastName: "He"
		      	};
	      	$scope.respondedContent="Waiting...";
		 	$scope.outputResponse = function(data){
		 		$scope.respondedContent = data;
		 		$scope.$apply();
		 	}
		 }) 
  ;
	</script>
```
In AngularJS, we are using component inside directive, and the directive is being used by controller to generate the view. Here, we are passing data from controller to the directive, and once component needs to pass data back, the directive controller will use scope to call controller's method.

**AngularJS 2**

```sh

@Component({
  selector: 'my-app',
  template:`
  <h1>Hello AngularJS2!</h1>
  <h2>ReactJS Component</h2>
  <div class='widget'></div> 
<hr/>
  <b>Inside Angular2: Response From Coponent:<b>  
  {{responseContent}} 
  `
})
export class AppComponent implements AfterViewInit{
    constructor(private el: ElementRef){
        this.el = el;  
        this.responseContent="hello";  
    }
    responseContent: string = "";
    compCallBack(data) { 
        console.log(data); 
        this.responseContent=data;
    }
    ngAfterViewInit() {
       var obj = {
            firstName: "Frank",
            lastName: "He"
        };
      var ControlledComponents =  JnprCL.JnprTestInputComp; 
      ReactDOM.render(React.createElement(ControlledComponents, { params: obj, callBack:  this.compCallBack.bind(this) }),
          this.el.nativeElement.getElementsByClassName('widget')[0]);
     }
}
```

In Angular 2, the core part is we need to implement AfterViewInit, and then in ngAfterViewInit, we can render the component.

### Demo

1. Go to http://server-host/index.html for plain html version
2. Go to http://server-host/backbone.html for backbone version
3. Go to http://server-host/angular.html for angular1 vertion
4. Go to  http://server-host/angular2.html for angular2 vertion

You can see all the three pages are using same component with exactly same look and feel


# Events (Deprecated)
Events are very important when we have multiple components and they need to communicate with each other, or child component need to notifiy parent component for some updates or vice versa.

But there is no native support in JS or ReactJS to support event, in order to meet that requirement, NGCL comes with its own solution, like this:

```
let jnprEvents = require('./../../../lib/JnprEvents');
jnprEvents.trigger(eventId);
jnprEvents.subscribe(eventId, subscriberId, cb);
jnprEvents.unSubscribe(eventId, subscriberId);
```

Please refer to JnprEvents.jsx file under /src/lib directory to see how to use it.

Please be reminded that:

- Event is global singleton, and can be used anywhere, in any components
- You must remember to unSubscribe event so as to avoid any memory leak
- You have to create eventID as constant inside JnprEvent class

# Flux Support

When events solutions are still in the codebase, it is now highly suggested to adopt Facebook Flux solution to coordinate events flow between various components. Please proceed to here for more Flux introduction: https://facebook.github.io/flux/

If you fully understand my events solution above, you should feel Flux solution is kind of similar to this concept, you have to subscribe to event dispatcher, and then trigger/emit events so that events will propogate to all the subscribers and run the call back!

The differencs here are Flux introduced Actions and Store concept, which has made event propogation more controllable and more modularized. See this as file structures:

flux
---- actions
-------- ActionTypes.jsx
-------- DataTableActions.jsx
---- dispatcher
-------- AppDispatcher.js
---- stores
-------- DataTableStore.jsx

Please refer above files for detailed implementations.

In detail, for datatable implementation, when user click reset button out of table, this action needs to be able to trigger all updates of headerCell and reset all the filters. 
For each headerCell, I put this in the code:

```
    componentDidMount : function() {
      DataTableStore.addResetColumnFiltersListener(this._resetFilter);
    },
    componentWillUnmount: function(){
      DataTableStore.removeResetColumnFiltersListener(this._resetFilter);
  },
```

Remember, like previous events solution, you MUST unsubscribe your event listener whenever the components are unmounted, otherwise, memoryleak will happend. You are ***WARNED***!

Then when the reset button is clicked, you need to do this:
```
_filterReset : function() {
	this._filterObj = {};
	DataTableAction.resetAllColumnFilters();
	this.setState({
	    dataList : this.state.originalDataList
	});
    },
```
Third line, ***DataTableAction.resetAllColumnFilters();*** is very important, to pass action into dispatcher. Then if you go to DataTableStore, you can see below:
```
var DataTableStore = assign({}, EventEmitter.prototype, {
    
    addResetColumnFiltersListener: function(callback){
	this.on(RESET_COLUMN_FILTERS, callback);
    },
    
    removeResetColumnFiltersListener: function(callback){
	this.removeListener(RESET_COLUMN_FILTERS, callback);
    },
    
    emitResetColumnFiltersTrigger: function(){
	this.emit( RESET_COLUMN_FILTERS );
    }
    
});

//Register callback to handle all updates
AppDispatcher.register(function(action) {
    
    switch(action.actionType){
    	case  	ActionTypes.COLUMN_FILTER_UPDATE:
        	DataTableStore.emitResetColumnFiltersTrigger();
        	break;
    }
    
});
```
This mean store is not subscrbing themselves to dispatcher, and dispatcher will emit event to call the callback for each headerCell to have headerCell resetted!

Remember Flux is single direction dataflow, you should never flow data back.

##important notice##

Flux is a global solution, which means, its action will be triggered globally. That is why above dataTable store is now changed as follows:

```
var DataTableStore = assign({}, EventEmitter.prototype, {
    
    addResetColumnFiltersListener: function(appId, callback){
	this.on(RESET_COLUMN_FILTERS +'_'+ appId, callback);
    },
    
    removeResetColumnFiltersListener: function(appId, callback){
	this.removeListener(RESET_COLUMN_FILTERS +'_'+ appId, callback);
    },
    
    emitResetColumnFiltersTrigger: function(appId){
	this.emit( RESET_COLUMN_FILTERS+'_'+ appId );
    }
    
});

//Register callback to handle all updates
AppDispatcher.register(function(action) {
    
    switch(action.actionType){
    	case  	ActionTypes.COLUMN_FILTER_RESET:
        	DataTableStore.emitResetColumnFiltersTrigger(action.appId);
        	break;
    }
    
});

module.exports = DataTableStore;
```

The difference here is we have added appId as parameter. If you do not add appId, the event dispatched in one instance will be intercepted by another instance! So when you are creating multiple instance of same component, you must pass appId when you use the component.

##material design css overwrite##
Currently, material design is used inside NGCL, in your application, if you want to overwrite the style and use your specific scheme, please include your specific material design css style, then ngcl material design style will be overwritten

##Feature Toggler##

Feature can be toggled by using feature toggler service, this is how you can do.

1. Configuration of features:

Feature configuration file is located under below directory:
src/feature-toggler/configurations
Filename are like this:
Base Features: features.json
Environment Specific Features: features-<environment>.json
environment variables are as follows:development|test|kubdev|kubtesting|kubstaging|kubproduction

The base features.json can be overwritten by environment specific features configuration.

2. feature configuration file format:

```
[
	{
		"name": "FEATURE-CASEMANAGER",
		"enabled": "true",
		"visibleUsers": 
		[
			"frankhe@juniper.net",
			"ngcsc1@ngcsc.33mail.com"
		]
	}
]
```
explanation:
name: feature name (mandatory)
enabled: true|false
visibleUsers: list of users who can visit this feature, this is optional, if not set, then visible to all users

3. How to use FeatureTogglerService

```
let FeatureTogglerService = require('../../feature-toggler/FeatureTogglerService');
var fs = new FeatureTogglerService('test', 'frankhe@juniper.net');
if(fs.isFeatureEnabled('FEATURE-CASEMANAGER')){
}
```

4. Passing config to component
When instantiate the featureTogglerService, we need to pass below parameters,

environment: (Optional) development|test|kubdev|kubtesting|kubstaging|kubproduction
userId: (Optional)  userid configured in the config file

To the component based on the requirements.



### Conclusion

Component is **only** responsible for rendering data based on specific requirement, it should never be used to retrieve data from any data source, it accept data from container by using **params**, and sending data back by using **callBack**.