let React = require('react');
require('./testInput.scss');

var jQuery = require('jquery');
require('jquery-ui/ui/core');
require('jquery-ui/ui/draggable');
require('jquery-ui/ui/resizable');

let ControlledComponents = React.createClass({
  
  getInitialState: function(){
    return {value: 'Hello World - Frank!',  firstName: this.props.params?this.props.params.firstName:"", lastName:  this.props.params?this.props.params.lastName:"" };
  },
  
  changeHandler: function(e){
    this.setState({ value: e.target.value });
    if(this.props.callBack)
      this.props.callBack(e.target.value);
  },
  
  componentDidMount: function(){
      jQuery(".testInputCompWrapper").draggable().resizable();
  },
  
  render: function(){
    return (
            <div className='testInputCompWrapper'>
            <h1>React JS Component</h1>
            
            <h1>Hello {this.state.value}</h1>
            <input type='text' ref='myInput1' value={this.state.value} onChange={this.changeHandler} /> 
            
            <p>
              Passed value from parent:
              <br/>
              {this.props.params.firstName}, {this.props.params.lastName}
            </p>
            </div>
            
    );
  }
});

module.exports = ControlledComponents;