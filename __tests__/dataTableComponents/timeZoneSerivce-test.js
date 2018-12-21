'use strict';

jest.unmock('../../public/src/components/data_table/services/TimeZoneService');

describe('sum', () => {
  
  let TimeZoneService = require('../../public/src/components/data_table/services/TimeZoneService');
  
  beforeAll(()=>{
  });
  
  it('should give back timezone list', () => {
    expect(new TimeZoneService().getTimeZones().length > 0 ).toBe(true);
  });
  
  it('should find zone abbreviation', () => {
    var ts = new TimeZoneService();
    expect( ts.findTimezoneByAbbreviation("PST").getName() ).toBe("Pacific Standard Time");
  });
  
  it('should search for timeZones', () => {
    var ts = new TimeZoneService();
    expect( ts.search("PST").length>0 ).toBe(true);
    expect( ts.search("Pacific").length>0 ).toBe(true);
  });
  
  it('getSecondsFromString() - should convert offetStrig into seconds', ()=>{
    var ts = new TimeZoneService();
    
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
    
    var ts = new TimeZoneService();
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
  
  
  it('getDateTimeForDifferentZone() - should getDateTime string form offset 1 to offset2 ', ()=>{
    var ts = new TimeZoneService();
    expect(ts.getDateTimeForDifferentZone('2016-12-01 13:01:00', '1 hour', '2 hour')).toBe('2016-12-01 14:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-12-01 00:01:00', '2 hour', '1 hour')).toBe('2016-11-30 23:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-12-01 13:01:00', '10 hour', '8 hour')).toBe('2016-12-01 11:01:00');
    expect(ts.getDateTimeForDifferentZone('2016-01-01 00:01:00', '2 hour', '1 hour')).toBe('2015-12-31 23:01:00');
    
  });
  
  it('convertDateTimeForTimeZone() - should convert dateTime from zone1 name to zone2 name', ()=>{
    var ts = new TimeZoneService();
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'EST', 'PST')).toBe('2016-12-01 10:01:00');
    expect(ts.convertDateTimeForTimeZone('2016-12-01 13:01:00', 'PST', 'EST')).toBe('2016-12-01 16:01:00');
  });
  
  it('isDSTInEffect - detect summer day time automatically', ()=>{
    
    var ts = new TimeZoneService();
    var dt1 = '2017-01-01 00:00:00';
    var dt2 = '2017-06-01 00:00:00';
    var dt3 = '2017-03-15 00:00:00';
    var dt4 = '2017-03-01 00:00:00';
    
    expect(ts.isDSTInEffect(dt1)).toBe(false);
    expect(ts.isDSTInEffect(dt2)).toBe(true);
    expect(ts.isDSTInEffect(dt4)).toBe(false);
    
    expect(ts.getDSTDifference(dt1)).toBe(0);
    expect(ts.getDSTDifference(dt2)).toBe(-60);
    expect(ts.getDSTDifference(dt3)).toBe(-60);
    expect(ts.getDSTDifference(dt4)).toBe(0);
    
  });
  
  
 it('summer time auto convert, if in summe time priod, fromTime is automatically changed back to none-summer time', ()=>{
   var ts = new TimeZoneService();
   expect(ts.convertDateTimeForTimeZone('2016-06-01 13:01:00', 'PST', 'PST')).toBe('2016-06-01 12:01:00');
   
   expect(ts.convertDateTimeForTimeZone('2016-04-01 13:01:00', 'EST', 'PST')).toBe('2016-04-01 09:01:00');
   expect(ts.convertDateTimeForTimeZone('2016-05-01 13:01:00', 'PST', 'EST')).toBe('2016-05-01 15:01:00');

   
  });

  
});