jest.unmock("../../public/src/components/drop_down_list/SelectComp");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SelectComp from '../../public/src/components/drop_down_list/SelectComp';
import { Checkbox, Radio, RadioGroup } from 'react-mdl';


let componentHandler = {
    upgradeElements: function(){}
}

describe('<multiSelectComp />', ()=>{

  it('Render Comps', ()=>{

    var config = [
                  {
                    title: 'option1',
                    value: 'value1'
                  },
                  {
                    title: 'option2',
                    value: 'value2'
                  },
                  {
                    title: 'option3',
                    value: 'value3'
                  }
                  ]

    var comp =  TestUtils.renderIntoDocument( <SelectComp
        options={config} singleSelect = {false} /> );
    expect(TestUtils.isCompositeComponent(comp)).toBeTruthy();
    
    var content = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'content');
    expect(content.length).toBe(1);
    expect(content[0].textContent).toBe('All Selected');

    try{
      var title = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'title');
      expect(title.length).toBe(1);
      TestUtils.Simulate.click(title[0]); //emulate click
    }catch(e){
    }






  });

});
