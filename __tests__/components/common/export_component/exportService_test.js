import ExportService from '../../../../components/common/export_component/ExportService';
describe('ExportService', ()=>{

    it('create new service here', ()=>{
        var svc = new ExportService([1,2,3],[['a',1,1],[2,2,2]]);
        expect(svc.dataArray.length).toBe(3);
        expect(svc.fileName).toBe('download.csv');
        expect(svc.separator).toBe(',');
        expect(svc.addQuotes).toBe(false);
        expect(svc.dataArray[2][0]).toBe('2\t');
        expect(svc.dataArray[2][1]).toBe('2\t');
        expect(svc.dataArray[2][2]).toBe('2\t');
        expect(svc.dataArray[1][0]).toBe('a');
        expect(svc.dataArray[1][1]).toBe('1\t');
        expect(svc.dataArray[1][2]).toBe('1\t');

        expect( svc.getDownloadLink().indexOf('data:text/csv;charset=utf-8')).toBe(0);
        expect( svc.getDownloadLink().indexOf(';base64')>0).toBe(true);
    });

});
