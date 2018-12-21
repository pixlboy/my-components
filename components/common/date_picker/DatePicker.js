import React, { Component } from 'react';
import PropTypes from 'prop-types';
var jQuery = require('jquery');
import TimeZoneService from '../timezone_service';
import DatePickerStore from './DatePickerStore';

require('./styles.scss');

class DatePicker extends Component{

    constructor(props) {
        super(props);
        this.bindingFunctions();
        this.timezoneService = new TimeZoneService;

        let default_date_ts = this.props.date_ts;
        if(default_date_ts!='' && !isNaN(default_date_ts)){
            //if this is number, that means it is timestamp, we conver here
            default_date_ts = this.timezoneService.convertTimeStampForTimeZone(default_date_ts, this.props.timezone, this.props.format);
        }
        this.state = {
            current_dt: default_date_ts
        }

        //now subscribe to external update
        this.subscriber = DatePickerStore(this.props.appId).subscribe(dt=>{
            this.setState({
                current_dt: dt
            });
        });
    }

    bindingFunctions(){
        this.dateChanged = this.dateChanged.bind(this);
    }

    componentDidMount() {
        let minDate = new Date( this.props.minDate);
        let maxDate = this.props.maxDate? new Date( this.props.maxDate): null;

        //if maxdate is smaller than mindate, ignore maxdate
        if(maxDate < minDate){
            maxDate = null;
        }

        if ( window.jQuery != null ){
            window.jQuery( this.refs.datePicker ).datepicker( {
                dateFormat: this.timezoneService.convertFormat(this.props.format),
                changeMonth: true,
                changeYear: true,
                yearRange: '1996:2026',
                onSelect: this.dateChanged,
                minDate: minDate,
                maxDate: maxDate
            });
        }
    }

    componentWillUnmount() {
        try{
            window.jQuery( this.refs.datePicker ).datepicker( "destroy" );
        }catch(e){}
        this.subscriber();
    }

    dateChanged(){
        let dt = window.jQuery( this.refs.datePicker ).datepicker( {
            dateFormat: this.timezoneService.convertFormat(this.props.format)
        }).val();

        this.setState( {
            current_dt: dt ? dt : ""
        });

        if('onDateChange' in this.props){
            this.props.onDateChange(dt, this.timezoneService.convertDateTimeStringToTimeStampWithZone(
                dt,
                this.props.timezone,
                this.props.format
            ));
        }
    }

    render(){
        return (
            <div className='datePickerWrapper'>
                <input type="text" ref='datePicker' readOnly
                    className="dateElementInput"
                    value={this.state.current_dt}
                />
                <i className="material-icons icon">date_range</i>
            </div>

        )
    }
}

DatePicker.propTypes = {
    format:  PropTypes.string,
    timezone: PropTypes.string,
    minDate: PropTypes.number,
    maxDate: PropTypes.number,
    date_ts: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

DatePicker.defaultProps = {
    format:  'YYYY-MM-DD',
    timezone: 'PST',
    date_ts: '',
    minDate: null,
    maxDate: null
};

export default DatePicker;
