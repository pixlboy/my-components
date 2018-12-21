import React, { Component } from 'react';
import PropTypes from 'prop-types';
require ('./styles.scss');

class CloseButtonComponent extends Component{

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this._toggleDropDownOnClickOutSide=this._toggleDropDownOnClickOutSide.bind(this);
        this._toggleDropDownOnKeyDownOutSide = this._toggleDropDownOnKeyDownOutSide.bind(this);
    }

    onClick(){
        this.props.onClick();
    }

    componentDidMount() {
        window.addEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.addEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.removeEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);
    }

    _toggleDropDownOnClickOutSide(event) {
        if(this.props.wrapperClassName){
            var excludedElement = document.querySelector("." + this.props.wrapperClassName);
            var selectedElement = excludedElement
            ? excludedElement.contains(event.target)
            : false;
            if (!selectedElement) {
                this.onClick();
            }
        }
    }

    _toggleDropDownOnKeyDownOutSide(e) {
        if (e.keyCode == 27) {
            this.onClick();
        }
    }

    render(){
        return <i className="material-icons jnpr" onClick={this.onClick}>cancel</i>;
    }
}

CloseButtonComponent.propTypes = {
    onClick: PropTypes.func,
    wrapperClassName: PropTypes.string
};

export default CloseButtonComponent;
