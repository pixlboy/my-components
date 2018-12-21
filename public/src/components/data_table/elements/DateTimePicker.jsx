import React from 'react';
import SingleDatePicker from './SingleDatePicker';
import ValidateService from '../services/ValidateService';
let ClassName = require('classnames');

var DateTimePicker = React.createClass({

  // initial state
  getInitialState() {
    var passed_dts = this.props.dateTime.split(' ');
    var passed_date=passed_dts[0], passed_time;
    if(passed_dts.length==2){
      passed_time=passed_dts[1];
    }
    return {
      current_date: passed_date,
      current_time: passed_time,
      time_valid: true
    }
  },

  _onDateChange(newDate){
    this.setState({
      current_date: newDate
    });
  },

  _changeTime(event){
    if ( event.keyCode == 13 ) {
      this._updateDateTime();
    }else{
      //checking validity of time here
      this.setState({
        current_time: this.refs.timeInput.value
      });
    }
  },

  _updateDateTime(){
    if(ValidateService.validateTime(this.refs.timeInput.value)){
      this.setState({
        time_valid: true
      });
      if('onDateTimeChange' in this.props){
        this.props.onDateTimeChange(this.state.current_date+' '+this.state.current_time);
      }
    }else{
      this.setState({
        time_valid: false
      });
    }
  },

  render(){
    return (
      <ul className='ulCellEditComp'>
        <li>
          <SingleDatePicker date={this.state.current_date} onDateChange={this._onDateChange}/>
        </li>
        <li>
          <input type='text' ref='timeInput' className={ClassName({'inputTime': true, error: !this.state.time_valid})}  defaultValue={this.state.current_time} onKeyUp={this._changeTime}/>
        </li>
        <li>
          <i className="material-icons" onClick={this._updateDateTime}>done</i>
        </li>
      </ul>
    )
  }

});

module.exports = DateTimePicker;
