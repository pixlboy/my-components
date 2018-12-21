'use strict';

jest.unmock('../../public/src/components/auto_complete/AutoCompleteComp');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import test_helper from '../__helper__/test_helper';
import AutoCompleteComponent from '../../public/src/components/auto_complete/AutoCompleteComp';
import { Checkbox } from 'react-mdl';

window.componentHandler = {
    upgradeElements: function(){}
}

describe('Test AutoComplete Component', ()=>{

  let options = [
                 {
                   value:'value1',
                   title:'title1'
                 },
                 {
                   value:'value2',
                   title:'title2'
                 },
                 {
                   value:'value3',
                   title:'title3'
                 },

                 {
                   value:'value11',
                   title:'title11'
                 },
                 {
                   value:'value22',
                   title:'title22'
                 },
                 {
                   value:'value33',
                   title:'title33'
                 }
                 ];
  
  it('toggle select on the item', ()=>{
    
    var autoCompleteComp = TestUtils.renderIntoDocument(
        <AutoCompleteComponent options= {options} testingMode={true} />);
    expect(TestUtils.isCompositeComponent(autoCompleteComp)).toBeTruthy();
    
    var autoCompleteTitle = TestUtils.findRenderedDOMComponentWithClass(autoCompleteComp, 'autoComplete-title');    
    expect(autoCompleteTitle.tagName).toBe("DIV"); 
    TestUtils.Simulate.click(autoCompleteTitle);
        
    var ulOption = TestUtils.findRenderedDOMComponentWithClass(autoCompleteComp, 'autoComplete-options');
    expect(ulOption.tagName).toBe("UL");
    expect(ulOption.children.length).toBe(6);   

  });

});