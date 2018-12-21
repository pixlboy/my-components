jest.unmock("../../public/src/components/drop_down_list/SelectService");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import test_helper from '../__helper__/test_helper';

import SingleSelectService from '../../public/src/components/drop_down_list/SelectService';

describe('<SingleSelect Service />', ()=>{

  beforeEach(function(){
    this.config = [
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
  });

  it('should parse config into items', ()=>{
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


      var service = new SingleSelectService(true);
       service.setOptions(config);
       expect(service.getOptions().length).toBe(3);
       expect(service.getOptions()[0].title).toBe('option1');
       expect(service.getOptions()[0].value).toBe('value1');
       expect(service.getOptions()[0].selected).toBe(false);
  });


  it('check output string here', ()=>{
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
    var service = new SingleSelectService(true);
    service.setOptions(config);
    var options = service.getOptions();
    service.selectOption( options[0] );

    expect(service.getSelectedValues()).toBe('value1');
    service.selectOption( options[1] );
    expect(service.getSelectedValues()).toBe('value2');

    service.selectOption( options[2] );
    expect(service.getSelectedValues()).toBe('value3');
  });


  it('check pre-selected options', ()=>{
    var config = [
                  {
                    title: 'option1',
                    value: 'value1',
                    selected: true
                  },
                  {
                    title: 'option2',
                    value: 'value2',
                    selected: false
                  },
                  {
                    title: 'option3',
                    value: 'value3',
                    selected: false
                  }
                  ]
    var service = new SingleSelectService(true);
    service.setOptions(config);
    var options = service.getOptions();
    expect(options[0].selected).toBe(true);
    expect(options[1].selected).toBe(false);
    expect(options[2].selected).toBe(false);

    service.selectOption( options[1] );
    expect(service.getSelectedValues()).toBe('value2');


  });

  it('filterItems() ', ()=>{
      var config = [
                    {
                      title: 'option1',
                      value: 'value1',
                      selected: true
                    },
                    {
                      title: 'option2',
                      value: 'value2',
                      selected: false
                    },
                    {
                      title: 'option3',
                      value: 'value3',
                      selected: false
                    }
                    ]
      var service = new SingleSelectService(true);

      service.setOptions(config);
      service.resetSelectedItems();

      var searchedItems = service.filterItems('on');
      expect(searchedItems.length).toBe(0);

      service.resetSelectedItems();
      searchedItems = service.filterItems('on2');
      expect(searchedItems.length).toBe(0);

      service.resetSelectedItems();
      var searchedItems = service.filterItems('xxx');
      expect(searchedItems.length).toBe(0);

      service.resetSelectedItems();
      searchedItems = service.filterItems('option2');
      expect(searchedItems.length).toBe(1);

      var searchedItems = service.filterItems('xxx');
      expect(searchedItems.length).toBe(0);


  });

});
