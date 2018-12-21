class Item{

    constructor(title, active, order){
        this.title = title;
        this.active = (active==null||active==undefined)?false:active;
        this.order = order;
        //by default, not clickable
        this.clickable = false;
        this.current = false;
    }

}

module.exports = Item;
