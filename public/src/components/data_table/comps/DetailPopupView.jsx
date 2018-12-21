let React = require('react');
let ClassName = require('classnames');
var dataTableObject = require( '../data_object/DataTableObjectFactory' ).getDataTableObject();

var NestedContentsTableBody = React.createClass({

  componentDidMount: function(){

    try{
      ReactDOM.unmountComponentAtNode($('.expDataTable_'+this.props.appId).get(0));
    }catch(e){}

    var jnprDataTableObj = JnprCL.JnprDataTableObjectFactory.getDataTableObject();

    var parentTableConfig = jnprDataTableObj.getConfigFor(this.props.appId);
    var extraConfigIds = [];
    if('extraDataConfigIds' in parentTableConfig){
      extraConfigIds=parentTableConfig.extraDataConfigIds;
    }

    // now we only consider one table situation
    if(extraConfigIds.length==1){
      jnprDataTableObj.setConfig(jnprDataTableObj.getAdditionalConfigFor(this.props.appId, extraConfigIds[0]), this.props.appId+"_"+extraConfigIds[0]);
      jnprDataTableObj.dataList = this.props.data[extraConfigIds[0]];
      jnprDataTableObj.grandTotalRecords = this.props.data[extraConfigIds[0]].length;

      var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;

      ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
          styleType: "ngcsc",
          appId: this.props.appId+"_"+extraConfigIds[0],
          nested: false,
          nestedContent: true
      }), $('.expDataTable_'+this.props.appId).get(0));
    }

  },

  render: function() {
    var tableClassName = 'dataTableContent selected expDataTable_'+this.props.appId;
    return <div>
      <div className={tableClassName}></div>
    </div>
  }
});


var NestedCustomizedContentBody = React.createClass({
  render(){
    return <div dangerouslySetInnerHTML={{__html: this.props.data}} />;
  }
});

var DetailPopupView = React.createClass({

  // need to pass control to parent to prevent it from closing
  mouseDown: function() {
    if (this.props.linkClicked)
    this.props.linkClicked(true);
  },

  // if the whole popup lost focus, we close it
  _onBlur: function() {
    if (this.props.linkClicked)
    this.props.linkClicked(false);
    if (this.props._onBlurChild)
    this.props._onBlurChild();
  },

  closeRCview: function(e) {
    this._onBlur();
  },

  render() {

    var currentConfig = dataTableObject.getConfigFor(this.props.appId);
    var popUpContent = null;
    if( currentConfig.hasOwnProperty('customizedPopUp') && currentConfig.customizedPopUp===true ){
        popUpContent = <NestedCustomizedContentBody  appId= {this.props.appId} data= {this.props.extraData}/>
    }else if(currentConfig.hasOwnProperty('customizePopUpType') && currentConfig.customizePopUpType==='tabbedTable'){
        let props = this.props.extraData;
        popUpContent = <JnprCL.TabbedWrapperComp tableData={props} />
    }else{
      popUpContent = <NestedContentsTableBody appId= {this.props.appId} data= {this.props.extraData}/>;
    }

    return (
      <div className='attachingPointUl' onBlur={this._onBlur} onMouseDown={this.mouseDown}>
        <div className="closingBtn" onClick={this.closeRCview}><i className="material-icons">cancel</i></div>
        <div className="clearfix"></div>
        {popUpContent}
      </div >
    );
  }
});

module.exports = DetailPopupView;
