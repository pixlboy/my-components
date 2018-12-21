class ExportService {

    constructor(titles, dataList , fileName, separator, addQuotes) {
        this.dataArray = this.processInputData(titles, dataList);
        this.fileName = fileName || 'download.csv';
        this.separator = separator || ',';
        this.addQuotes = !!addQuotes;
        if (this.addQuotes) {
            this.separator = '"' + this.separator + '"';
        }
    }

    processInputData(titles, dataList){
        let resultArray = [];
        resultArray.push(titles);
        dataList.forEach(lines=>{
            let tmpArray = [];
            lines.forEach(cell=>{
                tmpArray.push(isNaN(cell)?cell:(cell+"\t"));
            });
            resultArray.push(tmpArray);
        });
        return resultArray;
    }

    getDownloadLink(){
        let separator = this.separator;
        let addQuotes = this.addQuotes;

        let rows = this.dataArray.map(row => {
            let rowData = row.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        let type = 'data:text/csv;charset=utf-8';
        let data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    }

    getLinkElement(linkText){

        let downloadLink = this.getDownloadLink();
        let fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            let a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    }

    download(removeAfterDownload){
        let linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    }
}

export default ExportService;
