let Item = require('./Item');

class Service {

    constructor(){
        this._items = [];
        this._clickable = false;
    }

    set clickable(clickable){
        this._clickable = clickable;
        //now, we need to normalize the active
        this.normalizeActiveItems();
    }
    get clickable(){
        return this._clickable;
    }

    set items(options){
        this._items = [];
        var index = 0;
        options.forEach(option=>{
            this._items.push(new Item( option.title, option.active, index));
            index++;
        });
        //now, we need to normalize the active
        this.normalizeActiveItems();
    }

    setCurrentStep(order){
        for(var i=0; i<this.items.length; i++){
            if(this.items[i].order<=parseInt(order)){
                this.items[i].active=true;
            }else{
                this.items[i].active=false;
            }
            if(i==order){
                this.items[i].current = true;
            }else{
                this.items[i].current = false;
            }
        }
        this.normalizeActiveItems();
        return this.items;
    }

    normalizeActiveItems(){
        this._normalizeActive();
        this._normalizeClickable();
        this._normalizeCurrent();
    }

    _normalizeActive(){
        //this method is ot make sure all hte selected is adjacent to each other,
        //and also fix any wrong choise
        var startingPointUnselected = this.items.length;
        for(var i=0; i<this.items.length; i++){
            if(!this.items[i].active){
                startingPointUnselected=i;
                break;
            }
        }

        //now we deselect all after this point
        for(var i=startingPointUnselected; i<this.items.length;i++){
            this.items[i].active = false;
        }
    }
    _normalizeClickable(){
        //now, let's update clickable
        //for clickable, only all active ones + the next inactive item is clickable
        if(this.clickable){
            var i;
            for(i=0; i<this.items.length; i++){
                if(this.items[i].active){
                    this.items[i].clickable = true;
                }else{
                    //now this is the first inactive item, setting it to be clicable and then break
                    this.items[i].clickable = true;
                    i++; //we already set this as clickable, so just skip it
                    break;
                }
            }
            for(;i<this.items.length; i++){
                this.items[i].clickable = false;
            }
        }
    }

    _normalizeCurrent(){
        var i;
        for(i=this.items.length-1; i>=0;i--){
            if(this.items[i].active){
                this.items[i].current=true;
                break;
            }
        }
        for(i=i-1;i>=0;i--){
            this.items[i].current=false;
        }
    }

    get items(){
        return this._items;
    }
}

module.exports = Service;
