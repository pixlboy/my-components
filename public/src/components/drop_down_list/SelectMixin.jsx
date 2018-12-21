let SelectService = require( './SelectService' );
let _ = require('underscore');
var SelectMixin = {

    inputStr: "",

    getInitialState: function() {

        this.selectService = new SelectService( this.props.singleSelect );
        this.selectService.setOptions( this.props.options );
        return {
            options: this.selectService.getOptions(),
            seletedTitles: this.selectService.getSelectedTitles(),
            selectedValue: this.selectService.getSelectedValues(),
            showDropDown: false
        }
    },

    toggleDropDown: function() {
        if(!this.state.showDropDown){

            //must reset selected items so as to do fresh listing
            this.selectService.resetSelectedItems();

            //first restore default options
            this.setState({
                options: this.selectService.getOptions()
            });

            this.inputStr = "";

            window.addEventListener( 'click', this._toggleDropDownOnClickOutSide, false );
            window.addEventListener( 'keydown', this._toggleDropDownOnKeyDownOutSide, false );

            this.setState( {
                showDropDown: true
            });
        }else{
            this._closeDropDown();
        }
    },

    _toggleDropDownOnKeyDownOutSide: function(e) {
        let getTotalStr = _.debounce(() => {
            if (this.inputStr.length > 0) {
                //now doing filter here
                this.setState({
                    options: this.selectService.filterItems(this.inputStr)
                });
            }
        }, 300);

        //only searching letters, special characters, number.
        //otherwise, close dropdown.
        if(e.keyCode == 16 || e.keyCode == 32 || (e.keyCode >= 48 && e.keyCode <=90) || (e.keyCode >= 96 && e.keyCode <= 111) || (e.keyCode>=186 && e.keyCode<=222)){
            if (e.keyCode != '16') {
                    this.inputStr += e.key; //String.fromCharCode(e.keyCode);
                    getTotalStr();
                }
        }else{
            this._closeDropDown();
        }

    },

    _toggleDropDownOnClickOutSide: function(event){
        var excludedElement = document.querySelector( "."+this.props.appId);
        var selectedElement = excludedElement ? excludedElement.contains( event.target ) : false;
        if ( !selectedElement ) {
           this._closeDropDown();
        }
    },

    _closeDropDown: function(){
        this.setState({
            showDropDown: false
        });
        window.removeEventListener( 'click', this._toggleDropDownOnClickOutSide, false );
        window.removeEventListener( 'keydown', this._toggleDropDownOnKeyDownOutSide, false );
    },

    selectSingleItem: function(e){
        this.selectService.selectRadioOption( e.target.getAttribute('value') );
        this.updateStates();
        this._closeDropDown();
    },

    changeCheckbox: function( item, selected ) {
        this.selectService.selectOption( item, selected );
        this.updateStates();
    },

    updateStates() {
        this.setState( {
            options: this.selectService.getOptions(),
            seletedTitles: this.selectService.getSelectedTitles(),
            selectedValue: this.selectService.getSelectedValues()
        });
        if ( 'onChange' in this.props )
            this.props.onChange( this.selectService.getSelectedValues() );
    }

}

module.exports = SelectMixin;
