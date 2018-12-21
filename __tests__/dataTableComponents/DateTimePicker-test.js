'use strict';

jest.unmock('../../public/src/components/data_table/elements/DateTimePicker');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


describe('Test ValidateService', ()=>{

  let DateTimePicker = require('../../public/src/components/data_table/elements/DateTimePicker');

  it('should display date time innitially', ()=>{
    var dateTimePickerView = TestUtils.renderIntoDocument(<DateTimePicker dateTime='2017-01-01 12:00:00'/>);
    expect(TestUtils.isCompositeComponent(dateTimePickerView)).toBeTruthy();
    var dateTimePickerViewUl = TestUtils.findRenderedDOMComponentWithClass(dateTimePickerView, 'ulCellEditComp');
    expect(dateTimePickerViewUl.children.length).toBe(3);

    var dateInput = TestUtils.findRenderedDOMComponentWithClass(dateTimePickerView, 'dateElementInput');
    expect(dateInput.value).toBe('2017-01-01');

    var timeInput = TestUtils.findRenderedDOMComponentWithClass(dateTimePickerView, 'inputTime');
    expect(timeInput.value).toBe('12:00:00');
    //be default, only one class for input
    expect( Object.keys(timeInput.classList).length ).toBe(1);

    //now assign invalid time
    timeInput.value = 'invalid-time';
    var submitBtn = TestUtils.findRenderedDOMComponentWithClass(dateTimePickerView, 'material-icons');
    TestUtils.Simulate.click(submitBtn);
    //now input box is having 'error' class
    expect( Object.keys(timeInput.classList).length ).toBe(2);
    expect( timeInput.classList['1']).toBe('error');

    //enter valid time
    timeInput.value = '12:00:00';
    TestUtils.Simulate.click(submitBtn);
    //and the error class has been removed automatically
    expect( Object.keys(timeInput.classList).length ).toBe(1);

  });

});
