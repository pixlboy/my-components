'use strict';

jest.unmock('../../public/src/components/data_table/services/TimeZoneService');

describe('TimeZone Service with TimeStamp Test', ()=>{
  let TZ = require('../../public/src/components/data_table/services/TimeZoneService');

  it('shoudl create timezone', ()=>{
    var tz = new TZ();
    expect(tz.getTimeZones().length>0).toBe(true);
    tz.getTimeZones().forEach(function(z){
      expect(z.getAbbreviation()!='').toBe(true);
      expect(z.getName()!='').toBe(true);
      expect(z.getDisplayName()!='').toBe(true);
      expect(z.getOffset()!='').toBe(true);
    });
  });

  it('should find zone abbreviation', ()=>{
    var tz = new TZ();
    expect( tz.findTimezoneByAbbreviation("PST").getName()).toBe("Pacific Standard Time");
  });

  it('getTimezoneOffsetByName() ', ()=>{
    var tz = new TZ();
    expect( tz.getTimezoneOffsetByName('PST').Offset).toBe('-8 hours') ;
    expect( tz.getTimezoneOffsetByName('PST').Hours).toBe(8) ;
    expect( tz.getTimezoneOffsetByName('PST').Minutes).toBe(0) ;
    expect( tz.getTimezoneOffsetByName('PST').TotalMinutesOffset).toBe(-480) ;
    expect( tz.getTimezoneOffsetByName('PST').TotalMS).toBe(-28800000) ;
  });


  it('getSecondsFromString() - should convert offetStrig into seconds', ()=>{
    var ts = new TZ();

    expect(ts.getSecondsFromString('-5 hours')).toBe(-300*60);
    expect(ts.getSecondsFromString('5 hours')).toBe(300*60);
    expect(ts.getSecondsFromString('0 hours')).toBe(0);
    expect(ts.getSecondsFromString('-5:30 hours')).toBe(-330*60);
    expect(ts.getSecondsFromString('5:30 hours')).toBe(330*60);

    expect(ts.getSecondsFromString('1 hours')).toBe(60*60);
    expect(ts.getSecondsFromString('1:45 hours')).toBe(105*60);
    expect(ts.getSecondsFromString('-1 hours')).toBe(-60*60);
    expect(ts.getSecondsFromString('-1:45 hours')).toBe(-105*60);
    expect(ts.getSecondsFromString('-10 hours')).toBe(-600*60);
    expect(ts.getSecondsFromString('-10:45 hours')).toBe(-645*60);
  });

  it('getDateTimeForDifferentZone() - should calculate seconds difference for timeZone offsets', ()=>{

    var ts = new TZ();
    expect( ts.getTimeZoneDifferenceInSecond('0 hours', '1 hours')).toBe(60*60);
    expect( ts.getTimeZoneDifferenceInSecond('1 hours', '0 hours')).toBe(-60*60);
    expect( ts.getTimeZoneDifferenceInSecond('1 hours', '-1 hours')).toBe(-120*60);
    expect( ts.getTimeZoneDifferenceInSecond('-1 hours', '1 hours')).toBe(120*60);

    expect( ts.getTimeZoneDifferenceInSecond('-1:30 hours', '1 hours')).toBe(150*60);
    expect( ts.getTimeZoneDifferenceInSecond('-1:30 hours', '-1 hours')).toBe(30*60);

    expect( ts.getTimeZoneDifferenceInSecond('-5:30 hours', '-4 hours')).toBe(90*60);
    expect( ts.getTimeZoneDifferenceInSecond('5:30 hours', '4 hours')).toBe(-90*60);
    expect( ts.getTimeZoneDifferenceInSecond('5:30 hours', '6 hours')).toBe(30*60);


  });


  it('convertDateOject()', ()=>{
    var ts = new TZ();
    var dt = ts.convertDateOject('2017-03-01 00:00:00');
    expect(dt.getFullYear()).toBe(2017);
    expect(dt.getMonth()).toBe(2);
    expect(dt.getDate()).toBe(1);
    expect(dt.getHours()).toBe(0);
    expect(dt.getMinutes()).toBe(0);
    expect(dt.getSeconds()).toBe(0);

    expect(ts.getDateLocalString(dt)).toBe('2017-03-01 00:00:00');

    var dt = ts.convertDateOject('2016-01-01 12:01:02');
    expect(dt.getFullYear()).toBe(2016);
    expect(dt.getMonth()).toBe(0);
    expect(dt.getDate()).toBe(1);
    expect(dt.getHours()).toBe(12);
    expect(dt.getMinutes()).toBe(1);
    expect(dt.getSeconds()).toBe(2);

    expect(ts.getDateLocalString(dt)).toBe('2016-01-01 12:01:02');


  });


  it('isDSTInEffect - detect summer day time automatically ', ()=>{

    var ts = new TZ();
    var dt1 = '2017-01-01';
    var dt2 = '2017-07-01';
    var dt3 = '2017-04-05';
    var dt4 = '2017-03-01';

    expect(ts.isDSTInEffect(dt1)).toBe(false);
    expect(ts.isDSTInEffect(dt2)).toBe(true);
    expect(ts.isDSTInEffect(dt4)).toBe(false);

    expect(ts.getDSTDifference(dt1)).toBe(0);
    expect(ts.getDSTDifference(dt2)).toBe(-60);
    expect(ts.getDSTDifference(dt3)).toBe(-60);
    expect(ts.getDSTDifference(dt4)).toBe(0);

  });


  it('getDateTimeForDifferentZone() - should getDateTime string form offset 1 to offset2 ', ()=>{
    var ts = new TZ();
    expect(ts.getDateTimeForDifferentZone('2016-12-01 13:01:00', '1 hour', '2 hour')).toBe('2016-12-01 14:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-12-01 00:01:00', '2 hour', '1 hour')).toBe('2016-11-30 23:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-12-01 13:01:00', '10 hour', '8 hour')).toBe('2016-12-01 11:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-01-01 00:01:00', '2 hour', '1 hour')).toBe('2015-12-31 23:01:00');
  });


  it('convertDateTimeForTimeZone() - should convert dateTime from zone1 name to zone2 name', ()=>{
    var ts = new TZ();
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'EST', 'PST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2016-12-01 10:01:00 (PST)');
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'PST', 'EST', 'YYYY/MMM/DD HH:mm:ss ZONE')).toBe('2016/DEC/01 16:01:00 (EST)');
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'PST', 'EST', 'YYYY/MMM/DD ZONE')).toBe('2016/DEC/01 (EST)');
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'PST', 'EST', 'MMM-DD-YYYY ZONE')).toBe('DEC-01-2016 (EST)');
    expect(ts.convertDateTimeForTimeZone('2017-12-28 13:01:00', 'PST', 'EST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2017-12-28 16:01:00 (EST)');
    expect(ts.convertDateTimeForTimeZone('2017-06-28 13:01:00', 'PST', 'EST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2017-06-28 15:01:00 (EST)');
    expect(ts.convertDateTimeForTimeZone('2017-04-28 12:55:21', 'PST', 'EST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2017-04-28 14:55:21 (EST)');
    expect(ts.convertDateTimeForTimeZone('2017-04-28 09:55:21', 'PST', 'EST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2017-04-28 11:55:21 (EST)');
    expect(ts.convertDateTimeForTimeZone('2017-06-09 16:40:43', 'PST', 'EST', 'YYYY-MM-DD HH:mm:ss ZONE')).toBe('2017-06-09 18:40:43 (EST)');

  });


  // it('convertTimeStampForTimeZone() - should convert timestamp to timezone ', ()=>{
  //   var ts = new TZ();
  //   if(ts.isDSTInEffect()){
  //       expect( ts.convertTimeStampForTimeZone(1497552516611, 'PDT')).toBe('2017-06-15 11:48:36');
  //   }else{
  //       expect( ts.convertTimeStampForTimeZone(1497552516611, 'PDT')).toBe('2017-06-15 12:48:36');
  //   }
  //
  // });

  it('should convert string to date object', ()=>{
    var tz = new TZ();

    var dtObj = tz.getDateObjectFromDTString('2017-01-01');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(0);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(0);
    expect(dtObj.getMinutes()).toBe(0);
    expect(dtObj.getSeconds()).toBe(0);

    dtObj = tz.getDateObjectFromDTString('2017-10-01');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(9);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(0);
    expect(dtObj.getMinutes()).toBe(0);
    expect(dtObj.getSeconds()).toBe(0);

    dtObj = tz.getDateObjectFromDTString('2017-10-01 12:01:01');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(9);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(12);
    expect(dtObj.getMinutes()).toBe(1);
    expect(dtObj.getSeconds()).toBe(1);

    dtObj = tz.getDateObjectFromDTString('2017-10-01 01:01:01');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(9);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(1);
    expect(dtObj.getMinutes()).toBe(1);
    expect(dtObj.getSeconds()).toBe(1);

    dtObj = tz.getDateObjectFromDTString('10-01-2017 01:01:01', 'MM-DD-YYYY HH:mm:ss');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(9);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(1);
    expect(dtObj.getMinutes()).toBe(1);
    expect(dtObj.getSeconds()).toBe(1);

    dtObj = tz.getDateObjectFromDTString('OCT-01-2017 01:01:01', 'MMM-DD-YYYY HH:mm:ss');
    expect(dtObj.getFullYear()).toBe(2017);
    expect(dtObj.getMonth()).toBe(9);
    expect(dtObj.getDate()).toBe(1);
    expect(dtObj.getHours()).toBe(1);
    expect(dtObj.getMinutes()).toBe(1);
    expect(dtObj.getSeconds()).toBe(1);

  });

  it('should convert string to date object', ()=>{
    var tz = new TZ();
    var utcTS = tz.convertDateTimeStringToTimeStampWithZone('2017-01-01', 'UTC');
    var pstTS = tz.convertDateTimeStringToTimeStampWithZone('2017-01-01', 'PST');
    //if we convert PST 2017-01-01 00:00:00 to UTC, it should be 8 hours ahead
    expect(pstTS-utcTS).toBe(3600*8*1000);
  });


  // it('double check the timestamp to timezone string conversion', ()=>{
  //   var tz = new TZ();
  //   var output =tz.convertTimeStampForTimeZone(1500005684000, 'PDT');
  //   if(tz.isDSTInEffect()){
  //     expect(output).toBe('2017-07-13 21:14:44');
  //   }else{
  //     expect(output).toBe('2017-07-13 22:14:44');
  //   }
  //
  //   output =tz.convertTimeStampForTimeZone(1500005684000, 'PST');
  //   if(tz.isDSTInEffect()){
  //     expect(output).toBe('2017-07-13 20:14:44');
  //   }else{
  //     expect(output).toBe('2017-07-13 21:14:44');
  //   }
  //
  //   output = tz.convertTimeStampForTimeZone(1499082337000, 'PDT');
  //
  //   if(tz.isDSTInEffect()){
  //     expect(output).toBe('2017-07-03 04:45:37');
  //   }else{
  //     expect(output).toBe('2017-07-03 05:45:37');
  //   }
  //
  // });

  // it("should convert zero for timestamp", ()=>{
  //
  //   var tz=new TZ();
  //   expect(tz.convertTimeStampForTimeZone("0", "PST")==="").toBe(false);
  //   if(tz.isDSTInEffect()){
  //     expect(tz.convertTimeStampForTimeZone("0", "PST")).toBe('1969-12-31 15:00:00');
  //   }else{
  //     expect(tz.convertTimeStampForTimeZone("0", "PST")).toBe('1969-12-31 16:00:00');
  //   }
  //
  // });
});
