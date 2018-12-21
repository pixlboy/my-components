import React, { Component } from 'react';
let App = require('./components/App');
require('./style/style.scss');

class RudexTestComponents extends Component{
    render(){
        var className = 'testComponent';
        if(this.props.skin){
            switch(this.props.skin){
                case 'myjuniper': className = 'myjuniper_testCompnent';break;
                case 'jtacwb': className = 'jtacwb_testCompnent';break;
            }
        }
        return (
            <div className={className}>
                <App appId={this.props.appId}></App>
            </div>

        )
    }
}

module.exports = RudexTestComponents;
