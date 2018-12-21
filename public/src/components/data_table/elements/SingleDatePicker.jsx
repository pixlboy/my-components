import React from 'react';
var jQuery = require('jquery');

var SingleDatePicker = React.createClass({
  // initial state
  getInitialState() {
    return {
      current_dt: this.props.date ? this.props.date : ""
    }
  },

  componentWillUnmount() {
    jQuery( this.refs.datePicker ).datepicker( "destroy" );
  },

  componentDidMount() {
    if ( window.jQuery != null ){
      jQuery( this.refs.datePicker ).datepicker( {
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true,
        yearRange: '1996:2026',
        onClose: function() {
          this.blur();
        },
        onSelect: this.dateChanged
      });
    }
  },

  dateChanged(){
    var dt = jQuery( this.refs.datePicker ).datepicker( {
      dateFormat: 'yy-mm-dd'
    }).val();

    this.setState( {
      current_dt: dt ? dt : ""
    });

    if('onDateChange' in this.props){
      this.props.onDateChange(dt);
    }
  },

  render(){
    return (
      <div>
        <input type="text" ref='datePicker' readOnly className="dateElementInput"  value={ this.state.current_dt } onChange={this.dateChanged}/>
      </div>
    )
  }

});
module.exports = SingleDatePicker;
