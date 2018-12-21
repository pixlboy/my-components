import React, {Component} from 'react';
import S from './store/DropDownInputStore';
import DropDownService from './services/DropDownInputService';
import ClassNames from 'classnames';
import {Checkbox} from 'react-mdl';

require('./styles/dropdown.scss');

class CheckOption extends Component {
    constructor(props) {
        super(props);
        this.store = S(this.props.appId);
        this._check = this._check.bind(this);
    }

    _check(e) {
        this.store.setMultiSelectedItem(this.props.item);
        this.props.changeCheckbox();
    }

    render() {
        return <Checkbox label={this.props.item.title} checked={this.props.item.selected} onChange={this._check}/>
    }
}

class DropDownInputComp extends Component {

    constructor(props) {
        super(props);
        this.service = new DropDownService();
        this.store = S(this.props.appId);
        this.bindingFunctions();
        this.unSubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());
            //here, we need to set the text for selected item
            setTimeout(() => {
                if ((!('singleSelect' in this.props) || this.props.singleSelect) && this.state.selectedItem != null && this.refs !== undefined && this.refs.txtSearchedTerm != null) {
                    this.refs.txtSearchedTerm.value = this.state.selectedItem.title;
                } else if (this.refs !== undefined && this.refs.txtSearchedTerm != null) {
                    this.refs.txtSearchedTerm.value = this.state.searchTerm;
                }

                //if no item found, but also we must check state error, if this error is set already, no need to callback
                if (!this.state.error && this.state.items.length == 0 && this.props.noItemHandler && this.refs !== undefined && this.refs.txtSearchedTerm != null) {
                    var _this = this;
                    this.service._debounce(() => {
                        if (_this.refs !== null && _this.refs.txtSearchedTerm !== undefined) {
                            _this.props.noItemHandler(_this.refs.txtSearchedTerm.value);
                        }
                    });
                }
            }, 0);
        });
        this.state = this.store.getState();
    }

    bindingFunctions() {
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.selectSingleItem = this.selectSingleItem.bind(this);
        this.changeCheckbox = this.changeCheckbox.bind(this);
        this._toggleDropDownOnKeyDownOutSide = this._toggleDropDownOnKeyDownOutSide.bind(this);
        this._toggleDropDownOnClickOutSide = this._toggleDropDownOnClickOutSide.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    componentDidMount() {
        this.store.setInitialState(this.props.options);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    selectSingleItem(e) {
        this.store.setSelectedItemValue(e.target.getAttribute('value'));
        if (this.props.onChange) {
            this.props.onChange(e.target.getAttribute('value'));
        }
    }

    changeCheckbox() {
        if (this.props.onChange) {
            this.props.onChange(this.service.getSelectedItemValues(this.state.items));
        }
    }

    toggleDropDown(e) {
        if (e.target.type !== 'text') {
            if (!this.state.showDropDown) {
                this._openDropDown();
            } else {
                this._closeDropDown();
            }
        }
    }

    _onMouseDown() {
        this._openDropDown();
    }

    _onKeyUp(e) {
        var _searchTerm = e.target.value;
        this.service._debounce(() => {
            this.store.filterItems(_searchTerm);
        });
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
        if (!selectedElement) {
            this._closeDropDown();
        }
    }
    _openDropDown() {
        this.store.setDropDown(true);
        window.addEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.addEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);
    }
    _closeDropDown() {
        this.store.setDropDown(false);
        window.removeEventListener('click', this._toggleDropDownOnClickOutSide, false);
        window.removeEventListener('keydown', this._toggleDropDownOnKeyDownOutSide, false);
    }

    render() {
        var options = [];
        var rows = null;

        if (this.state.showDropDown) {
            if (this.state.items.length == 0) {
                if (this.props.noItemHandler) {
                    rows = null;
                } else {
                    rows = <ul>
                        <li>No Items Found</li>
                    </ul>
                }

            } else {
                this.state.items.forEach((item, index) => {
                    if ('singleSelect' in this.props && this.props.singleSelect == false) {
                        options.push(
                            <li key={index}><CheckOption appId={this.props.appId} item={item} changeCheckbox={this.changeCheckbox}/></li>
                        );
                    } else {
                        let classNames = ClassNames({
                            singleItem: true,
                            selected: this.state.selectedItem
                                ? this.state.selectedItem.value === item.value
                                : false
                        });
                        options.push(
                            <div key={index} value={item.value} className={classNames} onClick={this.selectSingleItem}>{item.title}</div>
                        );
                    }
                });

                if ('singleSelect' in this.props && this.props.singleSelect == false) {
                    rows = <ul>{options}</ul>
                } else {
                    rows = <div className='singleSelectWrapper'>{options}</div>
                }
            }
        }

        var classNames = 'jnprDropDownInput ' + this.props.appId;
        return (
            <div className={classNames}>
                <div className={ClassNames({
                    title: true,
                    open: this.state.showDropDown,
                    error: this.state.error,
                    normal: !this.state.error
                })} onMouseUp={this.toggleDropDown}>
                    <div className='content'>
                        <input type='text' ref='txtSearchedTerm' defaultValue={this.props.searchTerm} onKeyUp={this._onKeyUp} onMouseDown={this._onMouseDown}/>
                    </div>
                </div>
                <div className='dropdownWrapper'>
                    {rows}
                </div>
            </div>
        )
    }
}

module.exports = DropDownInputComp;
