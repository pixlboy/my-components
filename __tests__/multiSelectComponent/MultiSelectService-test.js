jest.unmock("../../public/src/components/drop_down_list/SelectService");

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import test_helper from '../__helper__/test_helper';

import MultiSelectService from '../../public/src/components/drop_down_list/SelectService';

describe('<MultiSelect Service />', ()=>{

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


    var service = new MultiSelectService();
    service.setOptions(config);
    expect(service.getOptions().length).toBe(4);
    expect(service.getOptions()[0].title).toBe('All');
    expect(service.getOptions()[0].value).toBe('all');
    expect(service.getOptions()[0].selected).toBe(true);
    expect(service.getOptions()[1].title).toBe('option1');
    expect(service.getOptions()[1].value).toBe('value1');
    expect(service.getOptions()[1].selected).toBe(true);
  });

  it('should check All option', ()=>{
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


    var service = new MultiSelectService();
    service.setOptions(config);
    var options = service.getOptions();
    expect(options.length).toBe(4);

    // select All
    service.selectOption( options[0], false );
    options.forEach(option=>{
      expect(option.selected).toBe(false);
    });

    service.selectOption( options[0], true );
    options.forEach(option=>{
      expect(option.selected).toBe(true);
    });

    // select one
    service.selectOption( options[1], false );
    expect(options[0].selected).toBe(false);
    expect(options[1].selected).toBe(false);

    service.selectOption( options[1], true );
    expect(options[0].selected).toBe(false);
    expect(options[1].selected).toBe(true);

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
    var service = new MultiSelectService();
    service.setOptions(config);
    var options = service.getOptions();
    service.selectOption( options[0], true );

    expect(service.getSelectedValues()).toBe('value1,value2,value3');
    service.selectOption( options[1], false );
    expect(service.getSelectedValues()).toBe('value2,value3');

    service.selectOption( options[0], false );
    expect(service.getSelectedValues()).toBe('');
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
        selected: true
      }
    ]
    var service = new MultiSelectService();
    service.setOptions(config);
    var options = service.getOptions();
    expect(options[0].selected).toBe(false);

    service.selectOption( options[0], true );
    expect(service.getSelectedValues()).toBe('value1,value2,value3');


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
    var service = new MultiSelectService(true);

    service.setOptions(config);
    service.resetSelectedItems();

    var searchedItems = service.filterItems('on');
    expect(searchedItems.length).toBe(0);


    service.resetSelectedItems();
    var searchedItems = service.filterItems('on2');
    expect(searchedItems.length).toBe(0);

    service.resetSelectedItems();
    var searchedItems = service.filterItems('xxx');
    expect(searchedItems.length).toBe(0);

    service.resetSelectedItems();
    var searchedItems = service.filterItems('option');
    expect(searchedItems.length).toBe(3);


    service.resetSelectedItems();
    var searchedItems = service.filterItems('option2');
    expect(searchedItems.length).toBe(1);


    service.resetSelectedItems();
    var searchedItems = service.filterItems('xxx');
    expect(searchedItems.length).toBe(0);

  });

  it('getSelectedValues() - input value is comma separated, also dedup ', ()=>{
    var config = [
      {
        title: 'option1',
        value: 'value1, value2, value3'
      },
      {
        title: 'option2',
        value: ' value2, value3, value4'
      },
      {
        title: 'option3',
        value: 'value3'
      }
    ]
    var service = new MultiSelectService();
    service.setOptions(config);
    var options = service.getOptions();
    service.selectOption( options[0], true );

    expect(service.getSelectedValues()).toBe('value1,value2,value3,value4');

    service.selectOption( options[1], false );
    expect(service.getSelectedValues()).toBe('value2,value3,value4');

    service.selectOption( options[0], false );
    expect(service.getSelectedValues()).toBe('');
  });


});
