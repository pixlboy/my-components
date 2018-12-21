class Item{
  constructor(value, title, selected){
    if(value){
      this._value = value;
    }else{
      this._value = '';
    }
    if(title){
      this._title = title;
    }else{
      this._title = '';
    }
    
    if(selected === null || selected==undefined)
      this._selected = true;
    else
      this._selected = selected;
  }
  get value(){
    return this._value;
  }
  get title(){
    return this._title;
  }
  get selected(){
    return this._selected;
  }
  set value(value){
    this._value = value;
  }
  set title(title){
    this._title = title;
  }
  set selected(selected){
    this._selected = selected;
  }
  
  toggleSelect(){
    this._selected=!this._selected;
  }
  
  contains(term){
    return this._value.toLowerCase().indexOf(term.toLowerCase())>=0||this._title.toLowerCase().indexOf(term.toLowerCase())>=0;
  }
}

module.exports = Item;