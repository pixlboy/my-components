import React, { Component } from 'react';
import CloseBtn from '../common/close_button/CloseButton';
import ExportComp from '../common/export_component/ExportComponent';
import PropTypes from 'prop-types';

require('./style/style.scss');

class SimplifiedDataGrid extends Component{

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    close(){
        this.props.onClose();
    }

    render(){
        return (
            <div className='simplifiedDataGrid'>
                <div className='sfdg_header'>
                    <div className='sfdg_title'>
                        {this.props.config.title}
                    </div>
                    <div className='sfdg_controller'>
                        <ExportComp titles={this.props.config.columns} dataList={this.props.config.rows} />
                        <CloseBtn onClick={this.close} wrapperClassName='simplifiedDataGrid'/>
                    </div>
                </div>
                <div className='tableWrapper'>
                    <table>
                        <tbody>
                            <tr className='sfdg_header'>
                                {this.props.config.columns.map((columnTitle,index)=>{
                                    return <td key={index}>{columnTitle}</td>;
                                })}
                            </tr>
                            {this.props.config.rows.map((row,index)=>{
                                return <tr key={index}>
                                    {row.map((cell, index)=>{
                                        return <td key={index}>
                                            {cell}
                                        </td>;
                                    })}
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

SimplifiedDataGrid.propTypes = {
    onClose: PropTypes.func,
    config: PropTypes.object
};

export default SimplifiedDataGrid;
