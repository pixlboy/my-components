import React, { Component } from 'react';
import getStore from '../store/Store';

class StepSetter extends Component{

    constructor(props){
        super(props);
        this._updateStep=this._updateStep.bind(this);
    }

    _updateStep (e){
        getStore(this.props.appId).updateStep(e.target.value);
    }

    render(){
        return (
            <div>
                <label>Set Step Value:</label>
                <input type='number' onChange={this._updateStep} />
            </div>
        )
    }
}
module.exports = StepSetter;
