import TimeZoneService from '../../public/src/components/data_table/services/TimeZoneService';
let ExtendedTimeZoneServcie = function(disableAutoSummerTimeCheck){

    this.timeZoneService = new TimeZoneService(disableAutoSummerTimeCheck);
    /*
    Here, we need to convert input format into jqueryUI recognized format
    */
    this.convertFormat = function(inputFormat){
        //we recognized here format:

        //YYYY - four digit year ====== yy (this is jqueryUI date format)
        // MM - two digit month ==== mm
        // MMM - show name month === M
        // DD - two digits day === dd

        inputFormat=inputFormat.replace('YYYY', 'yy');
        inputFormat=inputFormat.replace('MMM', 'M');
        inputFormat=inputFormat.replace('MM', 'mm');
        inputFormat=inputFormat.replace('DD', 'dd');
        return inputFormat;
    }

    this.convertTimeStampForTimeZone = function(timestamp, toTimeZoneName,format)
    {
        return this.timeZoneService.convertTimeStampForTimeZone(timestamp, toTimeZoneName,format)
    }

    this.convertDateTimeStringToTimeStampWithZone = function(dateTimeString,tz, format) {
        return this.timeZoneService.convertDateTimeStringToTimeStampWithZone(dateTimeString,tz, format);
    }
}

module.exports = ExtendedTimeZoneServcie;
