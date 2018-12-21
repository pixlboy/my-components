import React, { Component } from 'react';
import getStore from '../store/Store';

class AddCounter extends Component{

    constructor(props){
        super(props);
        this._add=this._add.bind(this);
    }

    _add (e){
        getStore(this.props.appId).addCounter();
    }

    render(){
        return (
            <div>
                <button onClick={this._add}>Add</button>

            </div>
        )
    }
}
module.exports = AddCounter;
