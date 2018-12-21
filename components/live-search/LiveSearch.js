import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

require('./style/style.scss');

class LiveSearch extends Component {

    constructor(props) {
        super(props);
        const { defaultValue, selectedIndex, isClosed, isDisabled, config } = this.props;
        this.state = {
            filteredResults: [],
            defaultValue,
            selectedIndex,
            isClosed,
            isDisabled,
            config,
            isError : false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSelect = this.onSelect.bind(this);       //select using mouse click
        this.onNavigate = this.onNavigate.bind(this);   //arrow keys navigation
        this.showList = this.showList.bind(this);       //show list on select box
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    onSelect(index, name) {
        this.setState({
            selectedIndex: index,
            defaultValue: name,
            filteredResults: [],
            isClosed: true
        });
        this.props.itemSelected ? this.props.itemSelected(name) : null;
    }

    updateComp(changeObj) {
        this.setState(changeObj);
    }

    onNavigate(event) {
        let { selectedIndex, filteredResults }  = this.state;
        const idx = selectedIndex;
        let { searchBar, optList } = this.refs;
        const valLength = searchBar.value.length;
        const length = filteredResults.length;
        if (event.keyCode === 40) {                                 //going down the list
            if (selectedIndex === length - 1) {
                return false;
            }
            this.setState({
                selectedIndex : idx + 1
            });
            optList.scrollTop = 300 / length * idx;
        }
        if (event.keyCode === 38) {                                 //going up the list
            if (selectedIndex === 0) {
                return false;
            }
            this.setState({
                selectedIndex: idx - 1
            });
            optList.scrollTop = 300 / length * idx;
            searchBar.setSelectionRange(valLength, valLength);      //to make sure cursor stays at end of input box
        }
        if (event.keyCode === 13) {                                 //select an item on enter
            this.onSelect(selectedIndex, filteredResults[idx].name);
        }
    }

    handleChange(event) {
        let query = event.target.value;
        let { clearSelection } = this.props;
        let { config } = this.state;
        if (query.length) {
            let results = _.filter(config, (item) => item.name.toLowerCase().includes(query.toLowerCase()));
            this.setState({
                filteredResults: results,
                isClosed: false
            });
        } else {
            this.onSearchFocus();
            clearSelection ? clearSelection() : null;
        }
        this.setState({
            defaultValue: query,
            selectedIndex: 0
        });
    }

    onSearchFocus() {
        this.setState({
            filteredResults: config.slice(0, 9),
            isClosed: false
        });
    }

    showList() {
        let { config, isClosed } = this.state;
        if(isClosed){
            this.setState({
                filteredResults: config,
                isClosed: false
            });
        } else{
            this.setState({
                isClosed: true
            });
        }
    }

    getInputType(){
        let { defaultValue, isDisabled, isError } = this.state;
        return (
            <div>
                <span className = 'search-icon'>search</span>
                <input type='text'
                    value = {
                        defaultValue
                    }
                    disabled = { isDisabled }
                    className = { classNames('auto-complete-bar', { 'error' : isError }) }
                    placeholder = { this.props.placeholder }
                    onChange = {
                        this.handleChange
                    }
                    onKeyUp = {
                        this.onNavigate
                    }
                    onFocus = {
                        this.onSearchFocus
                    }
                    ref = 'searchBar' />
            </div>
        );
    }

    getSelectType(){
        let { defaultValue, isDisabled, isError } = this.state;
        return (
            <div
                className = { classNames('select-bar', { 'disabled' : isDisabled, 'error' : isError }) }
                onClick = {
                    !isDisabled ? this.showList : null
                } >{defaultValue || <span className='placeholder'>{this.props.placeholder}</span> }
                <span className = 'dd-icon' >keyboard_arrow_down</span>
            </div>
        );
    }

    componentWillMount(){
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick(e){
        if(this.node.contains(e.target)){
            return;
        }
        this.handleOutsideClick();
    }

    handleOutsideClick(){
        this.setState({
            isClosed: true
        });
    }

    render() {
        let { defaultValue, filteredResults, selectedIndex } = this.state;
        let type = this.props.type;
        return (
            <div className='jncl-auto-complete-wrapper' ref={(node) => {this.node = node}}>
            {
                type === 'select' ? this.getSelectType() : this.getInputType()
            }
            <div
                className = { classNames('auto-complete-opt-list', { 'hidden' : this.state.isClosed }) }
                ref = 'optList'>
                <ul
                    className = 'list'
                    data-role = 'list'
                    aria-labelledby = 'list'>
                    {filteredResults.length ?
                        filteredResults.map((row, index) => {
                            return (<li
                                key={index}
                                className = { classNames('option', { 'selected' : selectedIndex === index }) }
                                onClick={() => this.onSelect(index, row.name)}>
                                <div className='name'>{row.name}</div>
                                {
                                    row.metadata && row.metadata.length ? <pre className='metadata'>{row.metadata}</pre> : null
                                }
                            </li>)
                            })
                            : <div className='no-records'>No records found</div>
                    }
                </ul>
            </div>
        </div>
        )
    }
}

LiveSearch.defaultProps = {
    config: [],
    type: 'search',
    isClosed: true,
    defaultValue : '',
    selectedIndex : 0,
    isDisabled: false,
    placeholder: "Search"
};

export default LiveSearch;
