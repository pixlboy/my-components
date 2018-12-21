import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-mdl';
import CheckBoxStore from './CheckBoxStore';

class CheckBoxComponent extends Component{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            checked: this.props.default
        };
        //now subscribe to external update
        this.subscriber = CheckBoxStore(this.props.appId).subscribe(checked=>{
            this.setState({
                checked: checked
            });
        });
    }

    onChange(ev){
        let checked = ev.target.checked;
        this.setState({
            checked: checked
        });
        if('onChange' in this.props){
            this.props.onChange(checked);
        }
    }

    render(){
        return  (
            <Checkbox
                checked = { this.state.checked }
                label={this.props.label}
                onChange={this.onChange}
            />
        )
    }
}

CheckBoxComponent.propTypes = {
    onChange: PropTypes.func,
    default: PropTypes.bool,
    label: PropTypes.string
};

CheckBoxComponent.defaultProps = {
    default: false,
    label: ""
};
export default CheckBoxComponent;
