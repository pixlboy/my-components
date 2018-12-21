import React, {Component} from 'react';
import S from './store/RadioOptionsGroupStore';
import Service from './services/RadioOptionsGroupService';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import {Radio, RadioGroup} from 'react-mdl';


require('./styles/radioOptionsGroup.scss');
class RadioOptionsGroupComp extends Component {

    constructor(props) {
        super(props);
        this.store = S(this.props.appId);
        this.state = this.store.getState();
        this.service = new Service();
        this.bindingFunctions();
        this.unSubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());
        });
    }

    componentWillUnmount() {
        this.unSubscribe();
    }
    componentDidMount() {
        this.store.setInitialState(this.props.options);
    }

    bindingFunctions() {
        this.selectRadioButton = this.selectRadioButton.bind(this);
    }

    selectRadioButton(e) {
        this.store.setRadioButtonVal(e.target.value);

        let opt = {title:'', value:''}
        opt['title']=this.service.getRadioOptionTitle(e.target.value, this.props.options);
        opt['value'] = e.target.value;

        this.props.onChange(opt);
    }


    render() {
        let options = [];
        let checked = false;
        let compTitle = <div></div>;
        if(this.props.groupTitle){
            compTitle = <div className='radioOptionsGroupTitle'>{this.props.groupTitle}</div>;
        }

        if (this.props.options) {
            if (this.props.options.length > 0) {
                this.props.options.forEach((item, index) => {
                    checked = (this.store._state.value == item.value) ? true : false;
                    options.push(
                        <Radio key={index} data-index={index} value={item.value} checked={checked}>{item.title}</Radio>
                    );
                });
            }else{

            }
        }

        return (<div className='radioOptionsGroupWrapper'>
            {compTitle}
            <RadioGroup name={this.props.appId} value={this.state.value} onChange={this.selectRadioButton}>
            {options}
            </RadioGroup>
        </div>);
    }

}

export default RadioOptionsGroupComp;
