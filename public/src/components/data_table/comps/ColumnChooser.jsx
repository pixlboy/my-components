let React = require('react');

var ColumnChooser = React.createClass({
  
  getInitialState: function() {
    var keys = Object.keys(this.props.availableColumns);
    var keySel = [];
    var selectedColumns = [];
    var index = 0;
    keys.forEach(function(key){
      keySel.push({key: key, primaryKey: index++});
    });
    
    return {
      keyOptions: keySel,
      selectedColumns: this.props.selectedColumns
    };
    
  },
  
  columnChooserChanged: function(){
    var values = [];
    for(var i=0; i<this.refs.columnChooserSelect.options.length; i++){
      if(this.refs.columnChooserSelect.options[i].selected){
        values.push(this.refs.columnChooserSelect.options[i].value);
      }
    }
    this.setState({ selectedColumns: values });
    this.props.callBack(values);
  },
  
  render: function(){
    return (
           
              <select multiple={true} value={this.state.selectedColumns} className='columnChooserSelect'  ref='columnChooserSelect' onChange={this.columnChooserChanged}>
              {this.state.keyOptions.map(function(object, i){
                return <option value={object.key} key={object.primaryKey} >{object.key}</option>;
              })}
              </select>
            
    );
  }
});

module.exports = ColumnChooser;