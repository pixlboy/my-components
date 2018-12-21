var tzDataJson = require('./timezone.json');
/**
 * https://github.com/sumitchawla/timezone-names
 */


var TimeZone = function(abb, name, displayName, offset) {

  this._abbreviation = abb;
  this._name = name;
  this._displayName = displayName;
  this._offset = offset;

  this.setAbbreviation = function(abbr) {
    this._abbreviation = abbr;
  }

  this.getAbbreviation = function() {
    return this._abbreviation;
  };

  this.setName = function(name) {
    this._name = name;
  };

  this.getName = function() {
    return this._name;
  };

  this.setDisplayName = function(displayName) {
    this._displayName = displayName;
  };

  this.getDisplayName = function() {
    return this._displayName;
  };

  this.setOffset = function(offset) {
    this._offset = offset;
  };

  this.getOffset = function() {
    return this._offset;
  }

}

/**
 * convertTimeStampForTimeZone(timestamp, toTimeZoneName,format)
 * convertDateTimeStringToTimeStampWithZone(dateTimeString,tz, format)
 * convertDateTimeForTimeZone(inputDateTime, fromTimeZoneName, toTimeZoneName, format)
 * getTimeZones()
 *
 */

var TimeZoneService = function(disableAutoSummerTimeCheck) {


  // disableAutoSummerTimeCheck = true;
  this._timezones = [];
  var _this = this;
  tzDataJson.map(function(tz) {
    _this._timezones.push(new TimeZone(tz.Abbreviation, tz.Name,
        tz.DisplayName, tz.Offset));
  });

  if (disableAutoSummerTimeCheck != null
      && disableAutoSummerTimeCheck != undefined
      && disableAutoSummerTimeCheck != false
  ) {
    this.timeZoneDiff = this.getDSTDifference();
    this.disableAutoSummerTimeCheck = disableAutoSummerTimeCheck;
  } else {
    this.timeZoneDiff = 0;
    this.disableAutoSummerTimeCheck = false;
  }

  this.getTimeZones = function() {
    return this._timezones;
  }

  this.search = function(term){

    return this.getTimeZones().filter( timezone => {
      return timezone.getAbbreviation().toLowerCase().indexOf( term.toLowerCase() ) > -1
          || timezone.getName().toLowerCase().indexOf( term.toLowerCase() ) > -1
          || timezone.getDisplayName().toLowerCase().indexOf( term.toLowerCase() ) > -1
  });

  }

  // this method is used to check if day light saving time is in effect or not
  this.isDSTInEffect = function(date) {
    var dt = date ? this.convertDateOject(date) : new Date();

    var jan = new Date(dt.getFullYear(), 0, 1);
    var jul = new Date(dt.getFullYear(), 6, 1);
    var stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul
        .getTimezoneOffset());
    return dt.getTimezoneOffset() < stdTimeZoneOffset;
  }

  this.getDSTDifference = function(date) {
    var dt = date ? this.convertDateOject(date) : new Date();
    var jan = new Date(dt.getFullYear(), 0, 1);
    var jul = new Date(dt.getFullYear(), 6, 1);
    var stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul
        .getTimezoneOffset());
    return dt.getTimezoneOffset() - stdTimeZoneOffset;
  }


  this.getStandardDSTDifference = function() {
    var dt =  new Date();
    var jan = new Date(dt.getFullYear(), 0, 1);
    var jul = new Date(dt.getFullYear(), 6, 1);
    return jan.getTimezoneOffset() - jul.getTimezoneOffset();
  }

  // having to convert string into Date Object
  this.convertDateOject = function(dateString) {
    // in format of yyyy-mm-dd hh:mm:ss
    var yyyy = parseInt(dateString.substr(0, 4));

    var tmpStr = dateString.substr(5, 2);
    if (tmpStr.substr(0, 1) == '0')
      tmpStr = tmpStr.substr(1);
    var MM = parseInt(tmpStr);

    tmpStr = dateString.substr(8, 2);
    if (tmpStr.substr(0, 1) == '0')
      tmpStr = tmpStr.substr(1);
    var dd = parseInt(tmpStr);

    var hh, mm, ss;
    if (dateString.length < 11) {
      hh = 0;
      mm = 0;
      ss = 0;
    } else {
      tmpStr = dateString.substr(11, 2);
      if (tmpStr.substr(0, 1) == '0')
        tmpStr = tmpStr.substr(1);
      hh = parseInt(tmpStr);

      tmpStr = dateString.substr(14, 2);
      if (tmpStr.substr(0, 1) == '0')
        tmpStr = tmpStr.substr(1);
      mm = parseInt(tmpStr);

      tmpStr = dateString.substr(17, 2);
      if (tmpStr.substr(0, 1) == '0')
        tmpStr = tmpStr.substr(1);
      ss = parseInt(tmpStr);
    }

    return new Date(yyyy, MM - 1, dd, hh, mm, ss); // month is 0 based
  }

  /**
   * YYYY-MM-DD HH:mm:ss ZONE YYYY-MMM-DD HH:mm:ss ZONE
   */

  this.getDateLocalString = function(date, zoneName, format) {

    var YYYY = date.getFullYear();
    var MM = date.getMonth();
    if (MM < 9) {
      MM = '0' + (MM + 1);
    } else {
      MM = '' + (MM + 1);
    }
    var DD = date.getDate();
    if (DD < 10)
      DD = '0' + DD;
    var HH = date.getHours();
    if (HH < 10)
      HH = '0' + HH;
    var mm = date.getMinutes();
    if (mm < 10)
      mm = '0' + mm;
    var ss = date.getSeconds();
    if (ss < 10)
      ss = '0' + ss;

    var MMM = '';

    switch (MM) {

    case '01':
      MMM = 'JAN';
      break;
    case '02':
      MMM = 'FEB';
      break;
    case '03':
      MMM = 'MAR';
      break;
    case '04':
      MMM = 'APR';
      break;
    case '05':
      MMM = 'MAY';
      break;
    case '06':
      MMM = 'JUN';
      break;
    case '07':
      MMM = 'JUL';
      break;
    case '08':
      MMM = 'AUG';
      break;
    case '09':
      MMM = 'SEP';
      break;
    case '10':
      MMM = 'OCT';
      break;
    case '11':
      MMM = 'NOV';
      break;
    case '12':
      MMM = 'DEC';
      break;

    }

    var result = YYYY + '-' + MM + '-' + DD + ' ' + HH + ":" + mm + ":" + ss;
    // now, let's replace!
    if (format) {
      format = format.replace('YYYY', YYYY);
      format = format.replace('MMM', MMM);
      format = format.replace('MM', MM);
      format = format.replace('DD', DD);
      format = format.replace('HH', HH);
      format = format.replace('mm', mm);
      format = format.replace('ss', ss);
      format = format.replace('ZONE', '(' + zoneName + ')');
      result = format;
    }
    return result;
  }

  this.getDateObjectFromDTString = function(dt, format) {
    if (!format) {
      if (dt.length > 10)
        format = "YYYY-MM-DD HH:mm:ss";
      else
        format = "YYYY-MM-DD";
    }
    // 1. rerieve year
    var startPos = format.indexOf('YYYY');
    var year = parseInt(dt.substr(startPos, 4));

    startPos = format.indexOf('MM');
    var month = "";
    if (startPos >= 0) {
      month = dt.substr(startPos, 2);
    }
    startPos = format.indexOf('MMM');
    if (startPos >= 0) {
      var monthStr = dt.substr(startPos, 3).toUpperCase();
      switch (monthStr) {
      case "JAN":
        month = '01';
        break;
      case "FEB":
        month = '02';
        break;
      case "MAR":
        month = '03';
        break;
      case "APR":
        month = '04';
        break;
      case "MAY":
        month = '05';
        break;
      case "JUN":
        month = '06';
        break;
      case "JUL":
        month = '07';
        break;
      case "AUG":
        month = '08';
        break;
      case "SEP":
        month = '09';
        break;
      case "OCT":
        month = '10';
        break;
      case "NOV":
        month = '11';
        break;
      case "DEC":
        month = '12';
        break;
      }
    }
    month = parseInt(month) - 1;

    startPos = format.indexOf('DD');
    var day = 0;
    if (startPos >= 0)
      day = parseInt(dt.substr(startPos, 2));

    startPos = format.indexOf('HH');
    var hour = 0;
    if (startPos >= 0) {
      hour = parseInt(dt.substr(startPos, 2));
    }

    startPos = format.indexOf('mm');
    var minutes = 0;
    if (startPos >= 0) {
      minutes = parseInt(dt.substr(startPos, 2));
    }

    startPos = format.indexOf('ss');
    var seconds = 0;
    if (startPos >= 0) {
      seconds = parseInt(dt.substr(startPos, 2));
    }

    return new Date(year, month, day, hour, minutes, seconds); // month is 0
    // based
  }

  this.findTimezoneByAbbreviation = function(abbreviation) {
    var timezons = this._timezones.filter(function(tz) {
      return tz.getAbbreviation() == abbreviation;
    });
    if (timezons.length > 0)
      return timezons[0];
    else
      return null;
  }

  this.getTimezoneOffsetByName = function(name) {
    var t = this.findTimezoneByAbbreviation(name);
    if (!t)
      return null;

    var offset = t.getOffset().split(" ")[0];
    // in format of -2 hours
    if (offset.indexOf(":") == -1)
      offset = offset + ":00";
    // now in format of -2:00
    var arr = offset.split(':');
    var h = parseInt(arr[0]);
    var m = parseInt(arr[1]);

    return {
      Offset : t.getOffset(),
      Hours : Math.abs(h),
      Minutes : m,
      TotalMinutesOffset : h * 60 + ((h > 0 ? 1 : -1) * m),
      TotalMS : (h * 60 + ((h > 0 ? 1 : -1) * m)) * 60 * 1000
    };
  }

  // this method is used to change dateTime staring back to timeStamp, here if
  // zone is passed, then we need to consider it
  // Attention, this logic is reversed to convertTimeStampForTimeZone
  // because this one is starting from datePicker, which already contains
  // timeZONE concept, then we need to
  // restore timeZone to UTC timestamp
  this.convertDateTimeStringToTimeStampWithZone = function(dateTimeString,
      tz, format) {
    var dtObj = this.getDateObjectFromDTString(dateTimeString, format);

    var milliSeconds = dtObj.getTime();
    var fromTimeZone = this.findTimezoneByAbbreviation('UTC');
    var toTimeZone = this.findTimezoneByAbbreviation(tz);
    if (!fromTimeZone || !toTimeZone)
      return milliSeconds;
    var fromOffSet = fromTimeZone.getOffset();
    var toOffSet = toTimeZone.getOffset();

    // 1. we need to remove noise of user current timeZone noise, as regular
    // new Date() is including timezone offset already, this timezone is user system default timezone
    milliSeconds = milliSeconds
        - this.getTimeZoneDifferenceInSecond(fromOffSet, toOffSet) * 1000;
    // 2. then we need to remove timeZon completely, this timeZone is user
    // selected timezone
    milliSeconds = milliSeconds - new Date().getTimezoneOffset() * 60 * 1000;
    return milliSeconds;
  }

  // timestamp must be in milliseconds
  this.convertTimeStampForTimeZone = function(timestamp, toTimeZoneName,
      format) {
    timestamp = parseInt(timestamp);
    if (!(timestamp>=0))
      return "";
    // steps for this conversion:
    // 1. We need to get user's current timezone offset
    // convert timestamp to "local epoc time" in user's local computer system
    // because javascript new Date(timestamp) is actually users' local
    // timezone date, so
    // we need to restore back to real epoc timezone datetime, and then we can
    // show different timezone data

    if(this.isDSTInEffect()){
      if(this.isDSTInEffect(this.getDateLocalString(new Date(timestamp)))){
        timestamp = timestamp + (new Date().getTimezoneOffset()) * 60 * 1000;
      }else{
        timestamp = timestamp + (new Date().getTimezoneOffset() + this.getStandardDSTDifference()) * 60 * 1000;
      }
    }else{
        timestamp = timestamp + new Date().getTimezoneOffset() * 60 * 1000;
    }

    var fromTimeZone = this.findTimezoneByAbbreviation('UTC');
    var toTimeZone = this.findTimezoneByAbbreviation(toTimeZoneName);

    if (!fromTimeZone || !toTimeZone)
      return this.getDateLocalString(new Date(timestamp));

    // now we need to convert
    // yyyy-mm-dd HH:mm:ss
    var fromOffSet = fromTimeZone.getOffset();
    var toOffSet = toTimeZone.getOffset();
    return this.getDateTimeForDifferentZone(timestamp, fromOffSet, toOffSet,
        toTimeZoneName, format);
  }

  /*
   * YYYY-MM-DD HH:mm:ss ZONE YYYY-MMM-DD HH:mm:ss ZONE
   */

  // convert a dataTime string containing timezone info
  this.convertDateTimeForTimeZone = function(inputDateTime, fromTimeZoneName,
      toTimeZoneName, format) {

    if (!inputDateTime)
      return "";

    if (!fromTimeZoneName)
      return inputDateTime;

    var fromTimeZone = this.findTimezoneByAbbreviation(fromTimeZoneName);
    var toTimeZone = this.findTimezoneByAbbreviation(toTimeZoneName);

    if (!fromTimeZone || !toTimeZone)
      return inputDateTime;

    var fromOffSet = fromTimeZone.getOffset();
    var toOffSet = toTimeZone.getOffset();

    return this.getDateTimeForDifferentZone(inputDateTime, fromOffSet,
        toOffSet, toTimeZoneName, format);
  }

  this.getDateTimeForDifferentZone = function(dateTime, fromOffset, toOffset,
      toTimeZoneName, format) {
    if (dateTime == null || dateTime == '')
      return "";

    // this is string format
    var repDateTime;
    var time
    if (isNaN(dateTime)) {
      repDateTime = dateTime.replace(/-/g, "/");
      time = this.convertDateOject(dateTime).getTime();
    } else { // this is timestamp format
      repDateTime = this.getDateLocalString(new Date(dateTime)).replace(/-/g,
          "/");
      time = dateTime;
    }

    var newTime = time
        + this.getTimeZoneDifferenceInSecond(fromOffset, toOffset) * 1000;

    // adjust the timedifference here if dateTime is in summer time period, we
    // need to automatically adjust it
    // Update: this adjustment is ONLY for string format dateTime, as summer
    // time is NOT considered in our api date time respoonse, for timeStamp,
    // no need to adjust it.
    if (!this.disableAutoSummerTimeCheck && isNaN(dateTime)) {
      newTime += this.getDSTDifference(repDateTime) * 60 * 1000;
    }

    var newDate = new Date(null);
    newDate.setTime(newTime);
    return this.getDateLocalString(newDate, toTimeZoneName, format);

  }

  this.getTimeZoneDifferenceInSecond = function(fromOffset, toOffset) {
    var fromSeconds = this.getSecondsFromString(fromOffset);
    var toSeconds = this.getSecondsFromString(toOffset);
    return toSeconds - fromSeconds;
  }

  this.getSecondsFromString = function(offsetString) {
    // in format of 6:30 hours
    // -5 hours
    var part1 = offsetString.substring(0, offsetString.indexOf(' '));
    var minutes = 0;
    if (part1.indexOf(':') > -1) {
      var h = parseInt(part1.substring(0, part1.indexOf(':')));
      var m = parseInt(part1.substring(part1.indexOf(':') + 1));
      if (h > 0) {
        minutes = h * 60 + m;
      } else {
        minutes = h * 60 - m;
      }
    } else {
      minutes = parseInt(part1) * 60;
    }
    return minutes * 60;
  }

}

module.exports = TimeZoneService;
