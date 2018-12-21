let Item = require('./Item');

class AutoCompleteService{

  constructor(options){
    this._options = [];
    //used to sore filered options only
    this._filteredOptions = [];

    //paginationed configuration
    this._pageSize = 50;
    this.currentPage = 1;

    if(options)
      this.options = options;
  }

  set options(options){
    //first, we need to clear current options and set currentPage to 1
    this.currentPage = 1;
    this._options = [];
    
    options.forEach(option=>{
      this._options.push(new Item(option['value'], option['title'], option['selected']));
    });
    //passing to filtered options here
    this.filteredOpitons = this.options;
  }


  get options(){
    return this._options;
  }

  get filteredOpitons(){
    return this._filteredOptions;
  }

  set filteredOpitons(options){
    this._filteredOptions = options;
  }

  set currentPage(page){
    this._currentPage = page;
  }

  get currentPage(){
    return this._currentPage;
  }

  get paginationedOptions(){
    var count = 0;
    var _paginationedOptions = [];
    for(var i=0; i<this.filteredOpitons.length; i++){
      //only generate smaller than required
      if(count<this._pageSize*this._currentPage){
          _paginationedOptions.push( this.filteredOpitons[i]);
          count++;
      }else{
        //if enough, then break;
        break;
      }
    }
    return _paginationedOptions;
  }

  search(term){

    //step 1: resetting current page to 1
    this.currentPage = 1;
    //step 2: searching
    this.filteredOpitons = [];
    this._options.forEach(item=>{
      if(item.contains(term)){
        this.filteredOpitons.push(item);
      }
    });
    //step 3. returning
    return this.paginationedOptions;

  }

  setSelectedValues(listOfSelectedValues){
    this._options.forEach(option=>{
      var bSelected=false;
      listOfSelectedValues.forEach(value=>{
        if(value===option.value)
          bSelected = true;
      });
      option.selected = bSelected;
    });
  }

  get selectedOptions(){
    return this._options.filter(item=>{
      return item.selected;
    });
  }

  //used to make all items as selected
  setAllSelected(selected){
    this._options.forEach(option=>{
      option.selected = selected;
    });
  }

  resetFilteredOptions(){
    this.filteredOpitons = this.options;
  }

  toggleOption(item){

    var foundItem = null;
    for(var i=0; i<this.options.length; i++){
      if(this.options[i].value===item.value){
        foundItem = this.options[i];
        break;
      }
    }

    if(foundItem)
      foundItem.toggleSelect();

  }
}

module.exports = AutoCompleteService;
