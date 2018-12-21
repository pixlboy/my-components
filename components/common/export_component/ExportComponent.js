import React, { Component } from 'react';
import ExportService from './ExportService';
import PropTypes from 'prop-types';

class ExportComponent extends Component{

    constructor(props) {
        super(props);
        this.bindingFunctions();
    }

    bindingFunctions(){
        this.download = this.download.bind(this);
    }

    componentDidMount(){
        this.service = new ExportService(this.props.titles, this.props.dataList, this.props.exportFileName);
    }

    download(){
        this.service.download(true);
    }

    render(){
        return <i className="material-icons jnpr" onClick={this.download}>file_download</i>;
    }
}

ExportComponent.propTypes = {
    titles: PropTypes.array,
    dataList: PropTypes.array,
    exportType: PropTypes.string,
    exportFileName: PropTypes.string
};

ExportComponent.defaultProps = {
    exportType: "csv",
    titles: [],
    dataList: [],
    exportFileName: 'download.csv'
};


export default ExportComponent;
