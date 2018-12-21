jest.unmock("../../public/src/components/data_table/comps/TimeZone");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TimeZoneComp from '../../public/src/components/data_table/comps/TimeZone';
import test_helper from '../__helper__/test_helper';

describe('<TimeZoneComp />', ()=>{

  beforeEach(function(){
    this.component = TestUtils.renderIntoDocument( <TimeZoneComp /> );
  });

  it('Renders mutiple li', ()=>{
    const renderer = TestUtils.createRenderer(); // shallow render
    renderer.render( <TimeZoneComp />); // no DOM required
    const result = renderer.getRenderOutput(); // get the shallowly rendered
                                                // output.

    expect(result.type).toBe('section');
    expect(result.props.className).toBe('timezone-container');
    expect(result.props.children.length>0).toBe(true);
    expect(result.props.children[0].props.type).toBe("text");
    expect(result.props.children[1].type).toBe('div');

    expect(result.props.children[1].props.children.type).toBe('ul');

    expect(result.props.children[1].props.children.props.children.length>0).toBe(true);
    expect(result.props.children[1].props.children.props.children[0].type).toBe('li');

  });


  it('Search on TimeZone - EDT', ()=>{

       const tz = TestUtils.renderIntoDocument( <TimeZoneComp /> );
       expect(TestUtils.isCompositeComponent(tz)).toBeTruthy();

       var input = TestUtils.findRenderedDOMComponentWithTag(tz, 'input');
       expect(input.type).toBe('text');

       var div = TestUtils.findRenderedDOMComponentWithTag(tz, 'div');
       expect( test_helper.getStyleClassesFromClassList(div.children[1].classList).includes('ps-scrollbar-x-rail')).toBeTruthy();
       expect( test_helper.getStyleClassesFromClassList(div.children[2].classList).includes('ps-scrollbar-y-rail')).toBeTruthy();
      
       expect( test_helper.getStyleClassesFromClassList(div.children[1].children[0].classList).includes('ps-scrollbar-x')).toBeTruthy();
       expect( test_helper.getStyleClassesFromClassList(div.children[2].children[0].classList).includes('ps-scrollbar-y')).toBeTruthy();
       
       input.value = "EDT";
       TestUtils.Simulate.change(input);

       var lis = TestUtils.scryRenderedDOMComponentsWithTag(tz, 'li');
       expect(lis.length).toBe(2);
       
       
       input.value = "PST";
       TestUtils.Simulate.change(input);
       lis = TestUtils.scryRenderedDOMComponentsWithTag(tz, 'li');
       expect(lis.length).toBe(1);
       expect(lis[0].textContent).toBe('Pacific Standard Time(UTC - 8)');

       var ul = TestUtils.findRenderedDOMComponentWithTag(tz, 'ul');
       /*
       console.log(  ul.children[0].tagName );
       console.log(  ul.children[0].classList );
       console.log(  ul.children[0].textContent );
       */
       expect(ul.children.length>0).toBeTruthy()
       expect(ul.children[0].textContent).toBe('Pacific Standard Time(UTC - 8)');

  });




});
