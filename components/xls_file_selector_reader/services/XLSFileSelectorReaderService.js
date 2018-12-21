var XLSX = require('xlsx');

//https://github.com/sheetjs/js-xlsx

class XLSFileSelectorReaderService{

    readFile(file, cb){

        const rABS = false; // true: readAsBinaryString ; false: readAsArrayBuffer
        const reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            if(!rABS) data = new Uint8Array(data);
            const workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
            const first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            const worksheet = workbook.Sheets[first_sheet_name];
            const json = XLSX.utils.sheet_to_json(worksheet);
            cb(json);
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    }

}
export default XLSFileSelectorReaderService;
