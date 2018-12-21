'use strict';

jest.unmock('../../public/src/components/auto_complete/Item');
describe('Testing AutoComplete Item Class', ()=>{
  let Item = require('../../public/src/components/auto_complete/Item');
  it('should create Item object', ()=>{
    var item = new Item('key1','value1');
    expect(item.value).toBe('key1');
    expect(item.title).toBe('value1');
    expect(item.selected).toBe(true);
    item.value='key2';
    expect(item.value).toBe('key2');
  });
  
  it('should create Item object from setter', ()=>{
    var item = new Item();
    expect(item.value).toBe('');
    expect(item.title).toBe('');
    expect(item.selected).toBe(true);
    item.value='key2';
    item.title='title2';
    item.selected = true;
    expect(item.selected).toBe(true);
    expect(item.value).toBe('key2');
    expect(item.title).toBe('title2');
    expect(item.contains('key')).toBe(true);
    expect(item.contains('title')).toBe(true);
    expect(item.contains('none')).toBe(false);
    expect(item.contains('KEY')).toBe(true);
    expect(item.contains('TITLE')).toBe(true);
    expect(item.contains('NONE')).toBe(false);
  });
  
  
});