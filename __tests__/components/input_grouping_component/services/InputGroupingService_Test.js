import InputGroupingReducerService from '../../../../components/input_grouping_component/services/InputGroupingService';

describe('InputGrouping - Services', () => {
    var service = new InputGroupingReducerService();

    it('checkStrLengthValidity() - with valid value', ()=>{
        var error = service.checkStrLengthValidity("test123" , 10);   
        expect(error).toBe(false);

    });

    it('checkStrLengthValidity() - with invalid value', ()=>{
        var error = service.checkStrLengthValidity('test123' , 5);
        expect(error).toBe(true);    
    });

    it('getCount() ', ()=>{
        var service = new InputGroupingReducerService();
        let len = service.getCount("test123");
        expect(service.getCount("test123")).toBe(7);    
    });    


});
