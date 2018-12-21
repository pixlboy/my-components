let Item = require( './Item' );

class SelectService {

    constructor( bSingle ) {
        this._availableOptions = [];
        this.singleSelect = bSingle ? bSingle : false;
        this.selectedItems = [];
    }

    setOptions( options ) {

        if ( this.singleSelect ) {
            options.forEach( option => {
                this._availableOptions.push( new Item( option ) );
            });

        } else {
            //first, adding one option, All
            var preSelected = false;
            this._availableOptions.push( new Item( { title: "All", value: "all" }) );
            options.forEach( option => {
                if ( 'selected' in option )
                preSelected = true;
                this._availableOptions.push( new Item( option ) );
            });

            //by default, all selected, unless there is NO pre-selected value
            if ( !preSelected )
            this._availableOptions.forEach( item => {
                item.selected = true;
            })
        }
    }

    getOptions() {
        return this._availableOptions;
    }

    //for radio, we can only pass value, not object, so having to find first
    selectRadioOption(selectedValue){
        var item = this._availableOptions.filter(option=>{return option.value===selectedValue})[0];
        this.selectOption(item);
    }

    selectOption( item, selected ) {

        if ( this.singleSelect ) {
            //for single, we only select one, also can not deselect it at all
            this._availableOptions.forEach( option => {
                if ( option.value === item.value )
                option.selected = true;
                else
                option.selected = false;
            })

        } else {
            if ( item.value == 'all' ) {
                this._availableOptions.forEach( option => {
                    option.selected = selected;
                })
            } else {
                //first unselect All
                this._availableOptions[0].selected = false;
                this._availableOptions
                .filter( option => { return option.value == item.value })[0].selected = selected;
            }
        }


    }

    getSelectedValues() {
        var selectedValue = "";
        if ( this.singleSelect ) {
            this._availableOptions.forEach( item => {
                if ( item.selected )
                selectedValue = item.value;
            });
        } else {
            var selecteItems = [];
            this._availableOptions.forEach( item => {
                if ( ( this._availableOptions[0].selected || item.selected ) && item.value !== 'all' ){
                    item['value'].split(",").forEach(subItem=>{
                        if( selecteItems.indexOf(subItem.trim()) ==-1  ){
                            selecteItems.push(subItem.trim());
                        }
                    });
                }
            });
            if ( selecteItems.length > 0 )
            selectedValue = selecteItems.join( "," );
        }
        return selectedValue;
    }

    getSelectedTitles() {

        var selectStr = "Please Select";

        if ( this.singleSelect ) {

            this._availableOptions.forEach( item => {
                if ( item.selected )
                selectStr = item.title;
            });

        } else {
            var selecteItems = [];
            this._availableOptions.forEach( item => {
                if ( ( this._availableOptions[0].selected || item.selected ) && item.value !== 'all' )
                selecteItems.push( item.title );
            });
            if ( selecteItems.length > 0 ){
                if(selecteItems.length == this._availableOptions.length -1 ){
                    selectStr = 'All Selected';
                }else{
                    selectStr = selecteItems.join( "," );
                }
            }
        }
        return selectStr;
    }

    resetSelectedItems(){
        this.selecteItems = this.getOptions();
    }

    getSelectedItems(){
        return this.selecteItems;
    }
    setSelectedItems(items){
        this.selecteItems = items;
    }

    filterItems(term){

        let searchedItems = [];
        term = term.toLowerCase();

        this.getSelectedItems().forEach(item => {
            if(item.title.toLowerCase().indexOf(term) === 0 || item.value.toLowerCase().indexOf(term) === 0){
                searchedItems.push(item);
            }
        });
        // if(searchedItems.length == 0){
        //     searchedItems = this.getOptions();
        // }
        //we need to keep this here
        this.setSelectedItems(searchedItems);

        return searchedItems;

    }

}

module.exports = SelectService;
