import React, {Component} from 'react';
import S from './store/DropDownInputStore';
import DropDownService from './services/DropDownInputService';
import ClassNames from 'classnames';
import {Checkbox} from 'react-mdl';
import jQuery from 'jquery';

require('./styles/dropdown.scss');


class DropDownInputAppendCompSingle extends Component {

    constructor(props) {
        super(props);
        this.service = new DropDownService();
        this.store = S(this.props.appId);
        this.component_id = this.props.appId;
        this.bindingFunctions();

        //now we need to keep passedProps
        if('passedProps' in this.props){
            this.store.setPassedProps(this.props.passedProps);
        }
        if('defaultDisabled' in this.props){
            this.store.setDisabled(this.props.defaultDisabled);
        }
        var _this = this;
        window.selectSingleItem = function(e, appId){
            _this.selectSingleItem(e, appId);
        }
        this.state = this.store.getState();
    }

    bindingFunctions() {
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.selectSingleItem = this.selectSingleItem.bind(this);
        this._toggleDropDownOnKeyDownOutSide = this._toggleDropDownOnKeyDownOutSide.bind(this);
        this._toggleDropDownOnClickOutSide = this._toggleDropDownOnClickOutSide.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
    }

    componentDidMount() {
        this.unSubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());

            //here, we need to set the text for selected item
            setTimeout(() => {
                if ((!('singleSelect' in this.props) || this.props.singleSelect) && this.state.selectedItem != null && this.refs !== undefined && this.refs.txtSearchedTerm != null) {
                    this.refs.txtSearchedTerm.value = this.state.selectedItem.title;
                    //this.refs.txtSearchedTerm.value = this.state.selectedItem.title;
                } else if (this.refs !== undefined && this.refs.txtSearchedTerm != null) {
                    this.refs.txtSearchedTerm.value = this.state.searchTerm;
                }
            }, 0);
        });
        this.store.setInitialState(this.props.options);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    selectSingleItem(e, appId) {
        S(appId).setSelectedItemValue(e.target.getAttribute('value'));
        this._closeDropDown(appId);
        if (this.props.onChange) {
            this.props.onChange(e.target.getAttribute('value'), S(appId).getState().passedProps);
        }
    }

    toggleDropDown(e) {
        if (e.target.type !== 'text') {
            if (!this.state.showDropDown) {
                this._openDropDown(e);
            } else {
                this._closeDropDown();
            }
        }
    }

    _onMouseDown(e) {
        this._openDropDown(e);
    }


    _toggleDropDownOnKeyDownOutSide(e) {
        if (e.keyCode == 27) {
            this._closeDropDown();
        }
    }

    _toggleDropDownOnClickOutSide(event) {
        var excludedElement = document.querySelector("." + this.props.appId);
        var selectedElement = excludedElement
        ? excludedElement.contains(event.target)
        : false;

        var extraExcludedElement =  document.querySelector(".popup_" + this.props.appId);
        var extraselectedElement = extraExcludedElement
        ? extraExcludedElement.contains(event.target)
        : false;
        if (!selectedElement && !extraselectedElement) {
            this._closeDropDown();
        }
    }

    _openDropDown(e) {
        //close all dropdowns first
        var evt = document.createEvent("Events");
        evt.initEvent("keydown", true, true);
        evt.keyCode= 27;
        evt.which=evt.keyCode;
        evt.altKey=false;
        evt.ctrlKey=true;
        evt.shiftKey=false;
        evt.metaKey=false;
        window.dispatchEvent(evt);


        this.store.setDropDown(true);
        window.addEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.addEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);

        //now we neeed to
        this.popUpPosition = {
            x: $(e.target).offset().left-$(e.currentTarget).outerWidth()+10,
            y: e.pageY
        };
        setTimeout(()=>{
            $("#"+this.component_id).remove();
            let content = "<div  class='jnprDropDownInput popup_"+this.props.appId+"' onclick=\"selectSingleItem(event, '"+this.props.appId+"')\" id='"+this.component_id+"'>" +  jQuery(this.refs['dropdownWrapper']).html() + "</div>";
            $(content).appendTo(document.body);
            $("#"+this.component_id).offset({top: this.popUpPosition.y, left: this.popUpPosition.x });
        }, 0);

    }
    _closeDropDown(appId) {
        if(appId!=undefined){
            S(appId).setDropDown(false);
        }else{
            S(this.props.appId).setDropDown(false);
        }
        window.removeEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.removeEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);
        if(appId!=undefined){
            $(".popup_"+appId).remove();
        }else{
            $(".popup_"+this.props.appId).remove();
        }
    }

    render() {
        var options = [];
        var rows = null;

        if (this.state.showDropDown) {
            if (this.state.items.length == 0) {
                rows = <ul>
                    <li>No Items Found</li>
                </ul>
            } else {
                this.state.items.forEach((item, index) => {
                    let classNames = ClassNames({
                        singleItem: true,
                        selected: this.state.selectedItem
                        ? this.state.selectedItem.value === item.value
                        : false
                    });
                    options.push(
                        <div key={index} data-index={index} value={item.value} className={classNames}>{item.title}</div>
                    );
                });
                rows = <div className='singleSelectWrapper'>{options}</div>
            }
        }

        var classNames;
        if(this.state.disabled){
            classNames = 'jnprDropDownInput disabledDropDown ' + this.props.appId;
        }else{
            classNames = 'jnprDropDownInput ' + this.props.appId;
        }

        var dropDownComp = null;
        if(this.state.items.length==1 && 'disableSingleSelectOption' in this.props && this.props.disableSingleSelectOption===true){
            dropDownComp = <div className='singleOption'>
                <div className='content'>
                    {this.state.items[0].title}
                </div>
            </div>;
        }else{
            dropDownComp = <div>
                <div className={ClassNames({
                    title: true,
                    open: this.state.showDropDown,
                    error: this.state.error,
                    normal: !this.state.error
                })} onMouseUp={this.toggleDropDown}>
                <div className='content'>
                    <input type='text' ref="txtSearchedTerm" readOnly defaultValue={this.props.searchTerm}  onMouseDown={this._onMouseDown}/>
                </div>
            </div>
            <div ref="dropdownWrapper" className='hide dropdownWrapper'>
                {rows}
            </div>
        </div>;
    }

    return (
        <div className={classNames}>
            {dropDownComp}
        </div>
    )
}
}

module.exports = DropDownInputAppendCompSingle;
