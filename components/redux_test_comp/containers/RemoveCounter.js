import React, { Component } from 'react';
import getStore from '../store/Store';

class RemoveCounter extends Component {
    constructor(props) {
        super(props);
        this._remove=this._remove.bind(this);
    }
    _remove(e){
        getStore(this.props.appId).removeCounter();
    }

    render() {
        return (
            <div className="container">

                <button className="button is-primary"
                    onClick={this._remove}>remove</button>

                </div>
            )
        }
    }

    export default RemoveCounter;
