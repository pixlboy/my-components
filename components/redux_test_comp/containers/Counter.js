import React, {Component} from 'react';
import getStore from '../store/Store';
class CounterComponent extends Component{

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        //return unsubscribe here, used to unsubscribe later
        this.unSubscribe =  getStore(this.props.appId).subscribe(()=>{
            this.update();
        });
        this.state = getStore(this.props.appId).getState();
        this._togged = true;

    }

    update(){

        this.setState(getStore(this.props.appId).getState());
    }

    toggle(){
        if(this._togged){
            this.unSubscribe();
        }else{
            this.unSubscribe = getStore(this.props.appId).subscribe(()=>{
                this.update();
            });
        }
        this._togged = !this._togged;
    }

    render(){
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h1>
                                    {this.state.count}
                                </h1>
                            </td>
                            <td>
                                <input type='button' value='toggleUpdate' onClick={this.toggle}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
module.exports = CounterComponent;
