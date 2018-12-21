'use strict';

jest.unmock('../../public/src/components/auto_complete/Service');
describe('Testing AutoComplete Service Class', ()=>{
  let AutoCompleteService = require('../../public/src/components/auto_complete/Service');
  
  var testingData = [
                        {
                          value:'value1',
                          title:'title1'
                        },
                        {
                          value:'value2',
                          title:'title2'
                        },
                        ];
  
  var getLargeQuantityData = function(count){
    var options = [];  
    for(var i=0; i<count; i++){
      options.push({
        value: "value_"+i,
        title: "title_"+i
      });
    }
    return options;
  };
  
  it('should be able to set selected options', ()=>{
    var autoCompleteService = new AutoCompleteService(testingData); 
    expect( autoCompleteService.options.length>1 ).toBe(true);
    expect( autoCompleteService.options[0].value ).toBe('value1');
    expect( autoCompleteService.options[0].title ).toBe('title1');
    expect(autoCompleteService.selectedOptions.length).toBe(2);
    
    autoCompleteService.setSelectedValues(['value2']);
    expect(autoCompleteService.selectedOptions.length).toBe(1);
    autoCompleteService.setSelectedValues(['value1']);
    expect(autoCompleteService.selectedOptions.length).toBe(1);
    
  });
  
  it('should construce Service object from constructor', ()=>{
    var autoCompleteService = new AutoCompleteService(testingData); 
    expect( autoCompleteService.options.length>1 ).toBe(true);
    expect( autoCompleteService.options[0].value ).toBe('value1');
    expect( autoCompleteService.options[0].title ).toBe('title1');
  });
  
  it('should construce Service object from setter', ()=>{
    var autoCompleteService = new AutoCompleteService(); 
    autoCompleteService.options = testingData;
    expect( autoCompleteService.options.length>1 ).toBe(true);
    expect( autoCompleteService.options[0].value ).toBe('value1');
    expect( autoCompleteService.options[0].title ).toBe('title1');
    expect(autoCompleteService.search('value').length).toBe(2);
    expect(autoCompleteService.search('title').length>0).toBe(true);
    expect(autoCompleteService.search('value1').length).toBe(1);
    expect(autoCompleteService.search('VALUE').length).toBe(2);
    expect(autoCompleteService.search('TITLE').length>0).toBe(true);
    expect(autoCompleteService.search('VALUE1').length).toBe(1);
    expect(autoCompleteService.search('none').length).toBe(0);
   });
  
  it('should togger item selected', ()=>{
    var autoCompleteService = new AutoCompleteService(); 
    autoCompleteService.options = testingData;
    expect(autoCompleteService.selectedOptions.length).toBe(2);
    autoCompleteService.options[0].toggleSelect();
    expect(autoCompleteService.selectedOptions.length).toBe(1);
    autoCompleteService.options[1].toggleSelect();
    expect(autoCompleteService.selectedOptions.length).toBe(0);
  });
  
  // this one must be at last as it is modifying testing data
  it('set data with predefined value', ()=>{
    testingData[0]['selected'] = true;
    testingData[1]['selected'] = false;
    var autoCompleteService = new AutoCompleteService(testingData); 
    expect( autoCompleteService.options.length>1 ).toBe(true);
    expect( autoCompleteService.options[0].value ).toBe('value1');
    expect( autoCompleteService.options[0].title ).toBe('title1');
    expect(autoCompleteService.selectedOptions.length).toBe(1);
    
  });
  
  /**
   * start testing pagination here
   */
  it('should geneate first page intially', ()=>{
    var autoCompleteService = new AutoCompleteService(getLargeQuantityData(10));
    expect(autoCompleteService.selectedOptions.length).toBe(10);
    expect(autoCompleteService.paginationedOptions.length).toBe(10);
    expect(autoCompleteService.currentPage).toBe(1);
    
    var autoCompleteService = new AutoCompleteService(getLargeQuantityData(100));
    expect(autoCompleteService.selectedOptions.length).toBe(100);
    expect(autoCompleteService.paginationedOptions.length).toBe(50);
    expect(autoCompleteService.currentPage).toBe(1);
    
  });
  
  it('should geneate second page records', ()=>{
    var autoCompleteService = new AutoCompleteService(getLargeQuantityData(100));
    expect(autoCompleteService.selectedOptions.length).toBe(100);
    expect(autoCompleteService.paginationedOptions.length).toBe(50);
    expect(autoCompleteService.currentPage).toBe(1);
    
    autoCompleteService.currentPage=autoCompleteService.currentPage+1;
    
    expect(autoCompleteService.selectedOptions.length).toBe(100);
    expect(autoCompleteService.paginationedOptions.length).toBe(100);
    expect(autoCompleteService.currentPage).toBe(2);
  });
  
  it('should search records - reset the current page to first one', ()=>{
    
    var autoCompleteService = new AutoCompleteService(getLargeQuantityData(100));
    var searchedResults = autoCompleteService.search('value_');
    expect(autoCompleteService.currentPage).toBe(1);
    expect( searchedResults.length ).toBe(50);
    searchedResults = autoCompleteService.search('value_1');
    expect(autoCompleteService.currentPage).toBe(1);
    expect( searchedResults.length ).toBe(11);
    searchedResults = autoCompleteService.search('value_10');
    expect(autoCompleteService.currentPage).toBe(1);
    expect( searchedResults.length ).toBe(1);
    searchedResults = autoCompleteService.search('value_');
    expect(autoCompleteService.currentPage).toBe(1);
    expect( searchedResults.length ).toBe(50);
  });
  
  it('should get toggled options', ()=>{
    var autoCompleteService = new AutoCompleteService(getLargeQuantityData(10));
    expect(autoCompleteService.selectedOptions.length).toBe(10);
    expect(autoCompleteService.paginationedOptions.length).toBe(10);
    autoCompleteService.toggleOption(autoCompleteService.options[0]);
    expect(autoCompleteService.selectedOptions.length).toBe(9);
    expect(autoCompleteService.paginationedOptions.length).toBe(10);
    autoCompleteService.toggleOption(autoCompleteService.options[0]);
    expect(autoCompleteService.selectedOptions.length).toBe(10);
    
  });
  
});