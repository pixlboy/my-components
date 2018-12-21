let React = require( 'react' );
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

var CsvGenerator = function(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || ',';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }

    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var rowData = row.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        var type = 'data:text/csv;charset=utf-8';
        var data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    };

    this.getLinkElement = function (linkText) {
        var downloadLink = this.getDownloadLink();
        var fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            var a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    };
    // call with removeAfterDownload = true if you want the link to be removed after downloading
    this.download = function (removeAfterDownload) {
        var linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    };
};

var ExportComp = React.createClass( {

    downloadDataTableData : function(){
        var columnKeys = [];
        var columnTitles = [];
        jnprDataTableObj.appId = this.props.appId;
        Object.keys(jnprDataTableObj.selectedColumns).forEach(function(key){
           if(key!='addedCheckBox'){
               columnKeys.push(key);
               columnTitles.push( jnprDataTableObj.getConfigFor(this.props.appId).columns[key].title);
           }
        }.bind(this));
        var resultArray = [];
        resultArray.push(columnTitles);

        jnprDataTableObj.getProcessedDataListFor(this.props.appId).forEach(function(item){
            var tmpArray = [];
            columnKeys.forEach(function(key){
             key = (isNaN(item[key]) ) ? item[key] : (item[key]+"\t");
             tmpArray.push(key);
            });
            resultArray.push(tmpArray);
        });
        var csvGenerator = new CsvGenerator(resultArray,'export.csv',",",true);
        csvGenerator.download(true);
    },

    render: function() {
        return (
                <button className='btnDownloadComp'
                    onClick={this.downloadDataTableData}><i className="material-icons quick-export-icon">file_download</i>Quick Export</button>
        )
    }

});

module.exports = ExportComp;
