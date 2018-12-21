import TimeZoneService from '../../../components/common/timezone_service';

describe("TimezoneService", ()=>{
    it('convertFormat', ()=>{
        var service = new TimeZoneService();
        expect(service.convertFormat('YYYY-MMM-DD')).toBe('yy-M-dd');
        expect(service.convertFormat('YYYY-MM-DD')).toBe('yy-mm-dd');
        expect(service.convertFormat('DD-MMM-YYYY')).toBe('dd-M-yy');
    });

    // it('convertTimeStampForTimeZone()', ()=>{
    //     var service = new TimeZoneService();
    //     var ts = 1519690656000; //2018-02-26
    //     expect(service.convertTimeStampForTimeZone( ts, 'PST', 'DD-MMM-YYYY' )).toBe('26-FEB-2018');
    // });
    //
    // it('convertDateTimeStringToTimeStampWithZone()', ()=>{
    //     var service = new TimeZoneService();
    //     expect(service.convertDateTimeStringToTimeStampWithZone( '12-FEB-2018', 'PST', 'DD-MMM-YYYY' )).toBe(1518422400000);
    // });
});
