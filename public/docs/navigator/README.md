# Navigate Indicator Guideline#
Goals for this library

For multi-steps features, such as create case, create Quote, we need to be able to visualize customer's current step, also, we should have solution for customer to jump from step to next step. This component aims at simplifying this implementation. Also, some basic restrictions should be available, such as user should not be able to skip any steps, instead, they must navigate step by step

##Part One: Configuration and displaying on the screen##

**Step 1: Provide configuration**
```sh

var options = [
	{
		title: "step1",
		active: true
	},
	{
		title: "step2",
		active: false
	},
	{
		title: "step3",
		active: false
	},
	{
		title: "step4",
		active: false
	},
	{
		title: "step5",
		active: false
	}
];
```

Remember, for each block, you have two attribute:
- title: to be displayed under step number
- active: (optional) true|false, by default, it is false

**Step 2: Display the navigator in all templates**

Once you have above configuration available, you can display it as below:

```
var onClick=function(item){
	console.log('clicked ');
	console.log(item);
}

ReactDOM.render(React.createElement(JnprCL.NavigatorComp, {
	options: options,
	appId: 'appId',
	onClick: onClick
}), document.getElementById('example'));
```

options: configurations as indicated in step 1,
appId: used to distinguish multiple navigator in same app,
onClick: (Optional) if not passing this. then the navigator will be used as only indicator, if passed, then user will be able to click the circle to navigator.

Please note that not all the items are clickable, only below items are clickable:
- All the current active items, this can make user navigate to any previous steps
- The first in-active item after all the active items. We have this design because we should prevent user from skipping any un-filled steps

##Part Two: Update Indicator##

Once getting onClick callback, we usually need to update the navigator to display the updated steps. Please follow below steps to update the indicator:

```
JnprCL.NavigatorStoreFactory.getStore().dispatch(
	{
		type:'NAVIGATE',
		payload: 0
	},
	'appId'
);

```

WE are here following Redux solutions by dispatching action on the store. The action is in following format:

- type: now only 'NAVIGATE' is accepted
- payload: please passing 0-N, as the step number

appId: this should map the appId we passed in step two of part one
