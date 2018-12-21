let React = require('react');
var dataTableObject = require('../data_object/DataTableObjectFactory').getDataTableObject();

var MultiColumnFilter = React.createClass({
  
  _doFilter: function(){
    
    var filterObj = {};
    
    Object.keys(this.props.availableColumns).map(function(columnKey, i){
      if(this.props.availableColumns[columnKey].filterable){
        
         if(this.props.availableColumns[columnKey].type=='customDate' && ( this.refs[columnKey+"_1"].value.length>0 || this.refs[columnKey+"_2"].value.length>0) ){
              filterObj[columnKey] = {
                  comp:  this.refs[columnKey+"_comp"].value,
                  value1: this.refs[columnKey+"_1"].value,
                  value2: this.refs[columnKey+"_2"].value
              };
          }
          
         if(this.props.availableColumns[columnKey].type=='text' &&  this.refs[columnKey].value.length>0 ){
            filterObj[columnKey] = {
                    comp: "contains",
                    value1:  this.refs[columnKey].value
                };
          }
         
         if((this.props.availableColumns[columnKey].type=='groupedCheckBox'  || this.props.availableColumns[columnKey].type=='multilist' || this.props.availableColumns[columnKey].type=='multiHtml') 
          &&  this.refs[columnKey].value.length>0 ){
             filterObj[columnKey] = {
                     comp: "contains",
                     value1:  this.refs[columnKey].value
                 };
           }
      }
    }.bind(this));
    
    if(this.props.filterCallBack)
      this.props.filterCallBack(filterObj);
  },
  
  _doReset: function(){
    Object.keys(this.props.availableColumns).map(function(columnKey, i){
      if(this.props.availableColumns[columnKey].filterable){
        if(this.refs[columnKey])
          this.refs[columnKey].value = "";
        if(this.refs[columnKey+"_1"])
          this.refs[columnKey+"_1"].value = "";
        if( this.refs[columnKey+"_2"])
          this.refs[columnKey+"_2"].value = "";
        
      }
    }.bind(this)
    );
    
    if(this.props.filterReset)
      this.props.filterReset();
  },
  
  render: function(){
    return (
            <div>
            <div className='globalFilter'>
            {Object.keys(this.props.availableColumns).map(function(columnKey, i){
              
              if(this.props.availableColumns[columnKey].filterable){
                
                if(this.props.availableColumns[columnKey].type=='customDate')
                  
                  return <div key={i}>
                          {this.props.availableColumns[columnKey].title}
                          <br/>
                          <select ref={columnKey+"_comp"}>
                            <option value='on'>On</option>
                            <option value='onorbefore'>On or Before</option>
                            <option value='onorafter'>On or After</option>
                            <option value='between'>Between</option>
                          </select>
                          <input type='date' ref={columnKey +"_1"} className='headerFilterDetailContent'/>
                          To
                          <input type='date' ref={columnKey+"_2"} className='headerFilterDetailContent'/>
                          <hr/>
                          </div>
                
                
                if(this.props.availableColumns[columnKey].items) 
                  return <div key={i}>
                          {this.props.availableColumns[columnKey].title}
                          <br/>
                          <select ref={columnKey}> 
                            <option value=""></option>
                              {
                                    this.props.availableColumns[columnKey].items.map(function(value, i){
                                      return <option key={i} value={value}>{value}</option>
                                    })
                                }
                         </select>
                         </div>;
                  
                         
                          
                if(this.props.availableColumns[columnKey].type=='text') 
                  return <div key={i} >
                          {this.props.availableColumns[columnKey].title}
                          <br/>
                          <input type='text' ref={columnKey} className='headerFilterDetailContent'/>
                          <hr/>
                        </div>;
                  
             }
            }.bind(this))}
            </div>
            <input type="button" value='submit' onClick={this._doFilter}/>
            <input type="button" value='reset' onClick={this._doReset}/>
            </div>
    );
  }
});

module.exports = MultiColumnFilter;