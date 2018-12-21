import React, { Component } from 'react';
import Counter from '../containers/Counter';
import AddCounter from '../containers/AddCounter';
import RemoveCounter from '../containers/RemoveCounter';
import StepSetter from '../containers/StepSetter';

class App extends Component{
    render(){
        return (
            <table>
                <tbody>
                    <tr>
                        <td><AddCounter appId={this.props.appId} ></AddCounter></td>
                        <td><Counter appId={this.props.appId}></Counter></td>
                        <td><RemoveCounter appId={this.props.appId}></RemoveCounter></td>
                        <td><StepSetter appId={this.props.appId}></StepSetter></td>
                    </tr>
                </tbody>

            </table>
        )
    }
}
module.exports = App;
