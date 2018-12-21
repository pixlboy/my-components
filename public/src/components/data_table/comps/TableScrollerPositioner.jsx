let React = require('react');
let DataTableStore = require( '../flux/stores/DataTableStore' );
let jnprDataTableObj = require( "../data_object/DataTableObjectFactory" ).getDataTableObject();
let DataTableAction = require( '../flux/actions/DataTableActions' );

var tableScrollerPositioner = React.createClass( {

    maxPages: 15,

    getInitialState: function() {
        return {
            pageSize: 10,
            actualPageSize:10,
            currentPageNum: 1,
            totalPages: parseInt( jnprDataTableObj._dataList[this.props.appId].length / 10 ) + 1,
            selectedPage:0
        };
    },

    componentDidMount: function() {
        DataTableStore.addVerticalScrollEnd( this.props.appId, this._verticalScrollEnd );
        DataTableStore.addUpdatePagePerPage( this.props.appId, this._updateNumPerPage );

    },

    componentWillUnmount: function() {
        DataTableStore.removeVerticalScrollEnd( this.props.appId, this._verticalScrollEnd );
        DataTableStore.removeUpdatePagePerPage( this.props.appId, this._updateNumPerPage );
    },

    _updateNumPerPage: function( num ) {
        this.setState( {
            pageSize: num
        });
    },
    
    lastStartRecordNum: 0,
   
    _verticalScrollEnd: function( start, end ) {
        var totalPages = parseInt( jnprDataTableObj._dataList[this.props.appId].length / this.state.pageSize ) + 1;
        totalPages = totalPages >= this.maxPages ? this.maxPages : totalPages;
        var currentPageNum;
        //this is from data update, not from scrolling, for start/end is 0, in this case, we need to remember previous point and start from there
        if ( start == 0 && end == 0 ) {
            currentPageNum = parseInt( this.lastStartRecordNum/jnprDataTableObj._dataList[this.props.appId].length * totalPages)+1
        } else {
            currentPageNum = parseInt( totalPages * start ) + 1;
            this.lastStartRecordNum = jnprDataTableObj._dataList[this.props.appId].length * start;
        }
        
        var actualPageSize = parseInt(jnprDataTableObj._dataList[this.props.appId].length/totalPages);
        //to solve initially, the actually page number is bigger than settings, and jump is not accurate
        if(actualPageSize<this.state.pageSize){
            actualPageSize = this.state.pageSize;
        }
        
        this.setState( {
            currentPageNum: currentPageNum,
            totalPages: totalPages,
            actualPageSize: actualPageSize,
        });

    },
    
    jump:function(e){
      
      this.setState({
          currentPageNum: e.target.getAttribute("data-pagenum") 
      });
      
      DataTableAction.performJumpToRow(this.props.appId,   ( e.target.getAttribute("data-pagenum") -1 ) * this.state.actualPageSize );
    },
    
    render: function() {

        var mapsData = [];
        for ( var i = 1; i <= this.state.totalPages; i++ ) {
            mapsData.push(i);
        }
        return <div className='content'>
            {mapsData.map(function(page){
                if(page == this.state.currentPageNum){
                     return <span key={page} className='selectedPageDot' onClick={this.jump} data-pagenum={page} ></span>
                }else{
                     return <span key={page} className='pageDot' onClick={this.jump} data-pagenum={page} ></span>
                }
               
            }.bind(this))}
            
        </div>
    }
});
module.exports = tableScrollerPositioner;