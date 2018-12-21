let React = require( 'react' );
import {Cell} from 'fixed-data-table-2';
var dataTableObject = require( '../data_object/DataTableObjectFactory' ).getDataTableObject();

const ExpandableActionsCell = React.createClass( {

  onClick: function(e){
    if(this.props.onActionClick)
    this.props.onActionClick(this.props.items[ e.target.getAttribute('data-index') ]);
  },

  //calling back customizedToolTip method
  onHover: function(e){
    var item = this.props.items[ e.currentTarget.getAttribute('data-index') ];
    if('customizedTooltip' in item && item['customizedTooltip'] === true && this.props.onMouseOver) {
      //now, let's subscribe to the event listener
      dataTableObject.subscribeToOpenCustomTooltip(this.props.appId, data=>{
        dataTableObject.unSubscribeOpenCustomTooltip(this.props.appId);
        this.showToolTip(data, item);
      });
      this.props.onMouseOver(item);
    };
  },

  onOut: function(e){
    var item = this.props.items[ e.currentTarget.getAttribute('data-index') ];
    if('customizedTooltip' in item && item['customizedTooltip'] === true) {
      $("#divCellClickDetailContent_" + this.props.appId).empty();
    };
  },

  showToolTip: function(data, item){

    var offsetX = -30;
    var offsetY = -25;

    if('offset' in item){
      offsetX = item['offset'][0];
      offsetY = item['offset'][1];
    }

    if('styleLess' in item && item['styleLess']===true){
      $("#divCellClickDetailContent_" + this.props.appId).html(data );
    }else{
      $("#divCellClickDetailContent_" + this.props.appId).html( "<div class='externalToolTipContent'>"+data+"</div>" );
    }


    this.props.showDetailCallBack( '#spanItemListWrapper_' + this.props.rowIndex + '_'+this.props.appId, this.props.rowIndex, this.props.col, false, offsetX, offsetY );
  },

  render: function() {
    var itemsList = [];
    //if defined the value for item and it is true, we display the icon
    this.props.items.map((item, index)=>{
      if(item.type in this.props.value && this.props.value[item.type]){
        if(item.icon.indexOf('.')>=0){
          itemsList.push(<img src={item.icon} key={item.type} data-index={index} onClick={this.onClick} onMouseOut={this.onOut} onMouseEnter={this.onHover}/>)
        }else{
          itemsList.push(<i className="material-icons" key={item.type} data-index={index} onMouseOut={this.onOut}  onMouseEnter={this.onHover} onClick={this.onClick}>{item.icon}</i>)
        }
      }
    });
    return (
      <span className='actionButtonColumns' id={"spanItemListWrapper_"+this.props.rowIndex+"_"+this.props.appId} >
        {itemsList}
      </span>
    )
  }
});

module.exports = ExpandableActionsCell;
