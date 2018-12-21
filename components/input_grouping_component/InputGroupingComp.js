import React, {Component} from 'react';
import S from './store/InputGroupingStore';
import PropTypes from 'prop-types';

require('./styles/input_grouping.scss');
class InputGroupingComp extends Component {

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
        this.unSubscribe();
    }

  
    bindingFunctions() {
        this._getCount = this._getCount.bind(this);
    }
    _getCount() {
         this.store.setItems(this.refs.myInput.value , this.props.maxTextLength);
    }

    render() {
        let inputComp;

        if (this.props.inputType === "textarea") {
            inputComp = <textarea appId={this.props.appId}  
                        onChange = {this._getCount}
                        ref='myInput' maxLength = {this.props.maxTextLength}></textarea>;
        }else{
            inputComp = <input type ="text" appId={this.props.appId} 
                        onChange={this._getCount}
                         ref='myInput' maxLength = {this.props.maxTextLength} />;
                        
        }
        return (
            <div className='inputGroupingWrapper'>
                <div className='blocksContent'>
                    {inputComp}
                </div>
                <div className='inputGroupingCount'>{this.store._state.currentTextlength} of {this.props.maxTextLength}

                </div>
            </div>
            );
    }
}

InputGroupingComp.propTypes = {
    appId: PropTypes.string,
    initValue: PropTypes.string,
    inputType: PropTypes.string,
    currentTextlength: PropTypes.number,
    maxTextLength: PropTypes.number,   
};

export default InputGroupingComp;
