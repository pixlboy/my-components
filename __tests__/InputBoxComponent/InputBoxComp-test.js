jest.unmock("../../public/src/components/input_box/InputBoxComp");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import InputBoxComp from '../../public/src/components/input_box/InputBoxComp';

describe('<InputBoxComp />', ()=>{
  
  it('should file click event', ()=>{
    
    const myMock = jest.fn();
    var tz = TestUtils.renderIntoDocument( <InputBoxComp 
        initClickHandler={myMock}
        /> );
    expect(TestUtils.isCompositeComponent(tz)).toBeTruthy();
    var btn = TestUtils.findRenderedDOMComponentWithTag(tz, 'input');
    TestUtils.Simulate.click(btn);
 
  });
  
  
});