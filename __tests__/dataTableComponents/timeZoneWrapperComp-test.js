jest.unmock("../../public/src/components/data_table/comps/TimeZoneWrapper");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TimeZoneWrapper from '../../public/src/components/data_table/comps/TimeZoneWrapper';
import test_helper from '../__helper__/test_helper';

var getMockedJnprDataTableObject = function(){
  return {
      defaultTimeZone: "PST",
      
      getTimeZoneFor: function(appId){
        return "PST";
      }
  }
}

describe('<TimeZoneWrapper />', ()=>{
  
  it('checking button text for different timezone', ()=>{
    var comp =  TestUtils.renderIntoDocument( <TimeZoneWrapper mockedDataTableObject={getMockedJnprDataTableObject()} /> );
    expect(TestUtils.isCompositeComponent(comp)).toBeTruthy();
    
    var btn = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    expect(btn.type).toBe("button");
    expect(test_helper.getStyleClassesFromClassList(btn.classList).includes('btnToggleTimezone')).toBeTruthy();
  
  });
  
  
  
  it('Renders Comp as Composite + checking the button', ()=>{
    var comp =  TestUtils.renderIntoDocument( <TimeZoneWrapper mockedDataTableObject={getMockedJnprDataTableObject()} /> );
    expect(TestUtils.isCompositeComponent(comp)).toBeTruthy();
    
    var btn = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    expect(btn.type).toBe("button");
    expect(test_helper.getStyleClassesFromClassList(btn.classList).includes('btnToggleTimezone')).toBeTruthy();
  });
  
  
  it('Checking visibility of the drop down', ()=>{
    var comp =  TestUtils.renderIntoDocument( <TimeZoneWrapper mockedDataTableObject={getMockedJnprDataTableObject()}/> );
    var timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(0); // none exist for initial loading
    
    var btn = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    TestUtils.Simulate.click(btn);
    timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(1); //first click show
    
    
    TestUtils.Simulate.click(btn);
    timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(0); // second click to hide dropdown
    
    
  });
  
  it('Test dropdown timezone select effect', ()=>{
    
    var comp =  TestUtils.renderIntoDocument( <TimeZoneWrapper mockedDataTableObject={getMockedJnprDataTableObject()} /> );
    var timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(0); // none exist for initial loading
    
    var btn = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    TestUtils.Simulate.click(btn);
    timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(1); //first show dropdown
    
    //here, we are searching and then set the list to be only one, then we can click on it
    var input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    expect(input.type).toBe('text');
    input.value = "EDT";
    TestUtils.Simulate.change(input);
    var lis = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'li');
    expect(lis.length>0).toBeTruthy();
    //Above is same as timeZonnComp test
    
    //difference here:let's click this one
    TestUtils.Simulate.click(lis[1]);
    expect(btn.textContent).toBe('Eastern Daylight Time(UTC - 4)');
    
    //once selected timezone, dropdown is closed
    timeZoneDropDown = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'ulTimezoneButtonDropDown');
    expect(timeZoneDropDown.length).toBe(0); // none exist for initial loading
    
    
  });
  
 
  
  
});