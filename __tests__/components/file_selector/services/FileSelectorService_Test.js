import FileSelectorService from '../../../../components/file_selector/services/FileSelectorService';
describe('FileSelector - Services', () => {

    it('checkFileValidity() - pass without restrictions', ()=>{
        var service = new FileSelectorService();
        var file = {
            name:'test123'
        };
        expect(service.checkFileValidity(file).length).toBe(0);
    });

    it('checkFileValidity() - fail without good type', ()=>{
        var restrictions = {
                allowedFileTypes: ['xls', 'xlsx']
        }
        var service = new FileSelectorService(restrictions);
        var file = {
            name:'test123'
        };
        var errors = service.checkFileValidity(file);
        expect(errors.length).toBe(1);
        expect(errors[0].indexOf('File test123 type is not accetable')).toBe(0);
    });

    it('checkFileValidity() - fail without good type, passed error', ()=>{
        var restrictions = {
                allowedFileTypes: ['xls', 'xlsx'],
                allowedFileTypesErrorMsg: "failed reason 123"
        }
        var service = new FileSelectorService(restrictions);
        var file = {
            name:'test123'
        };
        var errors = service.checkFileValidity(file);
        expect(errors.length).toBe(1);
        expect(errors[0]).toBe('failed reason 123');
    });

    it('checkFileValidity() - pass with good type', ()=>{
        var restrictions = {
                allowedFileTypes: ['xls', 'xlsx']
        }
        var service = new FileSelectorService(restrictions);
        var file = {
            name:'test123.xlsx'
        };
        var errors = service.checkFileValidity(file);
        expect(errors.length).toBe(0);
    });

});
