import React, {Component} from 'react';
import PropTypes from 'prop-types';
import XLSFileSelectorReaderService from './services/XLSFileSelectorReaderService';
import FileSelector from '../file_selector/FileSelectorComp';

var ClassNames = require('classNames');

class XLSFileSelectorReader extends Component {

    constructor(props) {
        super(props);
        this.bindingFunctions();
        this.service = new XLSFileSelectorReaderService();
    }

    bindingFunctions(){
        this.onUploadCallback=this.onUploadCallback.bind(this);
    }

    onUploadCallback(file){
        this.service.readFile(file,json=>{
            if(this.props.onUploadCallback){
                this.props.onUploadCallback({
                    file: file,
                    data: json
                })
            }
        });
    }
    render() {
        const {appId, btnText, onUploadCallback, typeErrorMessage, trans, singleUpload} = this.props;
        const restrictions = {
            allowedFileTypes: ['xls', 'xlsx'],
    		allowedFileTypesErrorMsg: typeErrorMessage
        }
        return <FileSelector
            appId={appId}
            restrictions={restrictions}
            onUploadCallback={this.onUploadCallback}
            singleUpload = {singleUpload}
            trans={trans}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />;
        }
    }

    XLSFileSelectorReader.propTypes = {
        appId: PropTypes.string,
        typeErrorMessage: PropTypes.string,
        onUploadCallback: PropTypes.func,
        trans: PropTypes.func
    };

    XLSFileSelectorReader.defaultProps = {
    };

    export default XLSFileSelectorReader;
