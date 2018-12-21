var AutoCompleteService = require('./Service');

let DataTableStore = require('../data_table/flux/stores/DataTableStore');
let jnprDataTableObj = require("../data_table/data_object/DataTableObjectFactory").getDataTableObject();
let DataTableActions = require('../data_table/flux/actions/DataTableActions');
import ScrollBar from 'perfect-scrollbar';
import _ from 'underscore';

var AutoCompleteMixin = {

  _service : null,

  getInitialState : function() {
    this._service = new AutoCompleteService(
        this.props.options ? this.props.options : []);
    return {
      options : this._service.options,
      selectedOptions: this._service.selectedOptions,
      showDropDown: false,
      checkedAll: true,
      paginationedOptions: this._getPaginationedOptions(),
      searchTerm: "",
      appId: this.props.appId ? this.props.appId: '',
      compAppId: this.props.compAppId ? this.props.compAppId: ''
    }
  },

  toggleItem : function(ev) {

    this._service.toggleOption( this.state.paginationedOptions[ev.currentTarget.getAttribute('data-selectedIndex')] );
    this.setState({
      options : this._service.options,
      selectedOptions: this._service.selectedOptions
    });

    this.updateCheckedAll();

    if (this.props.onChangeSelect)
       this.props.onChangeSelect(this._service.selectedOptions);

  },

  selectAll:function(ev){
    this._service.options.forEach(item=>{
      item.selected = ev.target.checked;
    });
    // setState again to trigger UI update
    this.setState({
      options: this._service.options,
      selectedOptions: this._service.selectedOptions
    });

    this.updateCheckedAll();
    var _this = this;
    setTimeout(function(){
      if (_this.props.onChangeSelect)
        _this.props.onChangeSelect(_this._service.selectedOptions);
    }, 50);

  },

  toggleDropDown: function(){
    var _this = this;
    if(!this.state.showDropDown){
        // we need to open dropdown here
        setTimeout(function(){
          var node = $( '#autoComplete-dropdown-wrapper-'+_this.props.compAppId )[0];
          ScrollBar.initialize( node  );
          ScrollBar.update( node );
          $( '#autoComplete-dropdown-wrapper-'+_this.props.compAppId ).on(
              'ps-y-reach-end',
              _this._scrollToEnd
              );
        }, 0);
    }else{
      // destrop it
      ScrollBar.destroy(  $( '#autoComplete-dropdown-wrapper-'+this.props.compAppId )[0] );
    }
    this.setState({
      showDropDown: !this.state.showDropDown
    });
  },

  endDispatched: false,
  // purpose for his method is to change flag to make sure the event is NOT
  // dispatched multiple times
  _getPaginationedOptions: function(){
    this.endDispatched = false;
    return this._service.paginationedOptions;
  },
  _scrollToEnd: function(){
    if(!this.endDispatched){
      this.endDispatched = true;
      // now trigger next page
      this._service.currentPage = this._service.currentPage +1;
      this.setState({
        paginationedOptions: this._getPaginationedOptions()
      });
    }
  },

  updateCheckedAll: function(){
    setTimeout(()=>{
      this.setState({
        checkedAll: this.state.selectedOptions.length==this.state.options.length
      });
    }, 0);
  },

  componentDidMount: function() {

    var _this = this;
    var updateOptions = function(options){
      if(options.length>0){
        _this._service.options = options;

        _this.setState({
          paginationedOptions: _this._getPaginationedOptions(),
          selectedOptions: _this._service.selectedOptions
        });
      }
    };

    //now we need to register to external event - for setting options later
    if(this.props.id && this.props.appId){
        var options = jnprDataTableObj.getBigColumnAutoCompleteData(this.props.appId, this.props.id);
        //if the big column options are set already, we use it directly
        if(options.length>0){
            updateOptions(options);
        }else{
          //if no data yet, we need to subscribe here
          jnprDataTableObj.subscribeToBigColumnAutoCompleteData(this.props.appId, this.props.id, function(options){
            updateOptions(options);
          });
        }
      }

    var win = window;
    if ( win.addEventListener ) {
        win.addEventListener( 'click', this._toggleDropDownOnClickOutside, false );
    } else if ( win.attachEvent ) {
        win.attachEvent( 'onclick', this._toggleDropDownOnClickOutside );
    }
    // this is used for filter resetting, for independ usage, this can also work
    DataTableStore.addFiltersReset(this.props.appId, this._filtersResetHandler);
    // adding customer configuration changing listener
    DataTableStore.addCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);

    var testing = 'testingMode' in this.props && this.props.testingMode;

    if(!testing && jnprDataTableObj.customConfiguration && 'systemDefault' in jnprDataTableObj.customConfiguration && jnprDataTableObj.customConfiguration.systemDefault){

      var optionValues = [];
      this._service.selectedOptions.forEach(option=>{
        optionValues.push(option.value);
      });
      var _this = this;
      setTimeout(function(){
        DataTableActions.performUpdateAutoCompleteDefaultAllSelectedOptions(
            _this.props.appId,
            _this.props.id,
            {
              comp: 'in',
              value1: optionValues
            }
        );
      }, 500);
    }

    //filter handler here
    this.filter = _.debounce(ev => {
      this.endDispatched = false;
      this.setState({
        paginationedOptions : this._service.search($('#autoComplete-search-'+this.props.compAppId).val()),
        searchTerm: $('#autoComplete-search-'+this.props.compAppId).val()
      });
      this.updateCheckedAll();
    }, 500);

  },

  componentWillUnmount: function() {
    var win = window;
    if ( win.removeEventListener ) {
        win.removeEventListener( 'click', this._toggleDropDownOnClickOutside, false );
    } else if ( win.detachEvent ) {
        win.detachEvent( 'onclick', this._toggleDropDownOnClickOutside );
    }
    DataTableStore.removeFiltersReset(this.props.appId, this._filtersResetHandler);
    DataTableStore.removeCustomConfigurationChangedCallBackHandler(this.props.appId, this._customConfigChanged);
  },

  _filtersResetHandler: function(noDataReset, noChangingDefault, fromResetClick) {
    this._service.setAllSelected(true);
    this._service.resetFilteredOptions();
    // setState again to trigger UI update
    this.setState({
      options: this._service.options,// this.state.options,
      selectedOptions: this._service.selectedOptions,
      paginationedOptions: this._getPaginationedOptions(),
      searchTerm: ""
    });
    this.updateCheckedAll();

    // if this is drectly from resetAll, we then do NOT need to update again
    // based on passed filter as we do not want to show all the filters
    // otherwise, by default, all filters will be displayed
    this._fromResetClick = fromResetClick;
  },

  _customConfigChanged: function(fromExternalCallBack){

    if(this._fromResetClick){
      this._fromResetClick = false;
      return;
    }

    // if user has filerModel set, then we need to do like these
    if (jnprDataTableObj.customConfiguration.filterModel && Object.keys(jnprDataTableObj.customConfiguration.filterModel).length > 0) {
      let model = jnprDataTableObj.customConfiguration.filterModel[this.props.id];
      if(model){
        // having custom configuraiton
        var listOfSelectedValues = model.value1;
        this._service.setSelectedValues(listOfSelectedValues);
      }else{

        // here we need to detect if this is systemDefault, if systemDefault,
        // let's select all
        if( !fromExternalCallBack && 'systemDefault' in jnprDataTableObj.customConfiguration && jnprDataTableObj.customConfiguration.systemDefault){
          this._service.setAllSelected(true);

          // now, we need to update filterModel for datatableObject as now, it
          // does not
          // contain the auto-complete field, but since we already selected all,
          // we need to
          // synchronize the filterModel as well here.
          var filterModel = jnprDataTableObj.customConfiguration.filterModel;
          var optionValues = [];
          this._service.selectedOptions.forEach(option=>{
            optionValues.push(option.value);
          });
          filterModel[this.props.id] = {
              comp: 'in',
              value1: optionValues
          }
          jnprDataTableObj.filter(this.props.appId, filterModel);

        }else{
          // if the saved config does not contains this fitler, then we need to
          // restore to all
          this._service.setAllSelected(false);
        }
      }
      // now we need to set default here
      this.setState({
        selectedOptions: this._service.selectedOptions
      });
    }else{
      // if no filter model, then we reset all to unselecte
      this._service.setAllSelected(false);
      // now we need to set default here
      this.setState({
        selectedOptions: this._service.selectedOptions
      });
    }
    this.updateCheckedAll();

  },

  // toggle the timezone dropDown
  // when either not this whole block or not the toggle button
  _toggleDropDownOnClickOutside: function(event) {
      var excludedElement = document.querySelector( "#autoComplete-"+ this.props.compAppId );
      var selectedElement = excludedElement ? excludedElement.contains( event.target ) : false;
      if ( !selectedElement){
        this.setState({
          showDropDown: false
        })
        try{
        // destrop it
          ScrollBar.destroy(  $( '#autoComplete-dropdown-wrapper-'+this.props.compAppId )[0] );
        }catch(e){}
      }

  },

}
module.exports = AutoCompleteMixin;
