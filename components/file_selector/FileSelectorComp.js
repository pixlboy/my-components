import React, {Component} from 'react';
import S from './store/FileSelectorStore';
import PropTypes from 'prop-types';

import ClassNames from 'classNames';
import {trans} from '../common';
import * as FileStatus from './store/Status'

require('./styles/file_selector.scss');

class FileSelector extends Component {

    constructor(props) {
        super(props);
        this.store = S(this.props.appId);
        this.state = this.store.getState();
        this.unSubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());
        });
        this.bindingFunctions();
    }

    componentWillUnmount() {
        this._remove();
        this.unSubscribe();
    }

    bindingFunctions() {
        this._openAttach = this._openAttach.bind(this);
        this._fileSelected = this._fileSelected.bind(this);
        this._remove = this._remove.bind(this);
        this._onUploadClick = this._onUploadClick.bind(this);
    }

    _openAttach() {
        this.refs[`SelectFile_${this.props.appId}`].click();
    }

    _fileSelected() {
        this.store.selectFile(this.refs[`SelectFile_${this.props.appId}`].files[0], this.props.restrictions);
        if (this.props.singleUpload) {
            if (this.props.onUploadCallback) {
                this.props.onUploadCallback(this.refs[`SelectFile_${this.props.appId}`].files[0]);
            }
        }
    }

    _remove() {
        this.store.removeFile();
        //this is needed to make sure we can attache same file again
        this.refs[`SelectFile_${this.props.appId}`].value = null;
    }

    _onUploadClick() {
        if (this.props.onUploadCallback) {
            this.props.onUploadCallback(this.state.selectedFile);
        }
    }

    render() {
        let fileName = "";
        let singleFlag = this.props.singleUpload;
        if (this.state.selectedFile) {
            fileName = this.state.selectedFile.name;
        } else {
            if(singleFlag){
                fileName = "";
            }else{
                fileName = trans(this.props, 'No File Chosen');
            }
            
        }

        let deleteBtn = null;
        if (this.state.selectedFile) {
            deleteBtn = <span className='delete' onClick={this._remove}>x</span>;
        }

        let uploadBtn = null;
        if (this.state.status !== FileStatus.EMPTY) {
            uploadBtn = <button onClick={this._onUploadClick} className={ClassNames({
                active: this.state.status === FileStatus.READY,
                processing: this.state.status === FileStatus.PROCESSING
            })}>{this.state.status === FileStatus.PROCESSING
                    ? trans(this.props, 'Uploading')
                    : trans(this.props, 'Upload')}</button>;
        }
        return (
            <div className='jnprFileSelector'>
                <input type='file' ref={`SelectFile_${this.props.appId}`}
                    accept={this.props.accept}
                    className='hidden' onChange={this._fileSelected}/>
                <ul>
                    <li>
                        <button onClick={this._openAttach}>{trans(this.props, 'Attach File')}</button>
                    </li>
                    <li>
                        <span className='selectedFileName middle'>{fileName}</span>
                        {(!singleFlag) && deleteBtn}
                    </li>
                    <li>
                        {(!singleFlag) && uploadBtn}
                    </li>
                </ul>
                <div className='error'>{this.state.errors.join(';')}</div>

            </div>
        );
    }
}

FileSelector.propTypes = {
    appId: PropTypes.string,
    restrictions: PropTypes.object,
    onUploadCallback: PropTypes.func,
    trans: PropTypes.func,
    accept: PropTypes.string
};

FileSelector.defaultProps = {
    accept: ""
};

export default FileSelector;
