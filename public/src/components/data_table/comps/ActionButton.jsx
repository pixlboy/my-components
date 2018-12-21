let React = require('react');
let classNames = require('classnames');
let IbaseActionButtonList = require('./IbaseActionButtonList');
require('../style/action-button.scss');
import _ from 'underscore';
let DataTableStore = require('../flux/stores/DataTableStore');
let jnprDataTableObj = require('../data_object/DataTableObjectFactory').getDataTableObject();

var ActionButton = React.createClass({
    getInitialState: function() {

        var userRoles = [];
        var bCaseManager = false;
        if ('userRoles' in jnprDataTableObj.getConfigFor(this.props.appId)) {
            userRoles = jnprDataTableObj.getConfigFor(this.props.appId)['userRoles'];
        }

        userRoles.forEach(role => {
            if (role.toLowerCase().trim() === 'Case Manager Read/Write'.toLowerCase() || role.toLowerCase().trim() === 'Case Manager View Only'.toLowerCase()) {
                bCaseManager = true;
            }
        });

        return {
            openActions: false,
            num: jnprDataTableObj.getCheckedRowsCountFor(this.props.appId),
            bCaseManager: bCaseManager
        }
    },

    componentDidMount: function() {
        DataTableStore.addCheckRowsUpdated(this.props.appId, this._changeNum);
        DataTableStore.addActionButtonClickHandler( this.props.appId, this._actionButtonClickHandler );
        window.addEventListener('click', this._toggleActionBtnOnClickOutside, false);
    },

    componentWillUnmount: function() {
        DataTableStore.removeCheckRowsUpdated(this.props.appId, this._changeNum);
        DataTableStore.removeActionButtonClickHandler( this.props.appId, this._actionButtonClickHandler );
        window.removeEventListener('click', this._toggleActionBtnOnClickOutside, false);
    },
    _actionButtonClickHandler: function(){
        this.setState({
            openActions: false
            });

    },

    _changeNum: function() {
        var num = jnprDataTableObj.getCheckedRowsCountFor(this.props.appId);
        this.setState({
            num: jnprDataTableObj.getCheckedRowsCountFor(this.props.appId),
            openActions: num == 0 ? false : this.state.openActions
        });
    },

    _openMenu: function(event) {
        event.stopPropagation();

        if (this.state.num > 0) {
            this.setState({
                openActions: !this.state.openActions
            });
        } else {
            this.setState({
                openActions: false
            });
        }
    },
    _toggleActionBtnOnClickOutside: function(event) {
        var excludedElement = document.querySelector(".actions-options-list")
        var selectedElement = excludedElement ? excludedElement.contains(event.target) : false;
        if (!selectedElement) {
            this.setState({
                openActions: false
            });
        }
    },

    render: function() {
        var actionsList = null;
        var arrowIcon = <span className='actions-icon down'></span>
        if (this.props.displayingActionButtonOptionList && this.state.openActions) {
            arrowIcon = <span className='actions-icon up'></span>

            switch (this.props.displayingActionButtonOptionList) {
                case 'IBASES':
                case 'CASES':
                    actionsList = <IbaseActionButtonList appId={this.props.appId}/>
                    break;
            }
        }
        var btn = null;

        if (this.props.displayingActionButton) {
            if(('mode' in jnprDataTableObj.config && jnprDataTableObj.config.mode === 'R') || this.state.bCaseManager){
                btn = <button className={classNames({ 'active': this.state.num > 0 }) } onClick={this._openMenu}>actions {arrowIcon}
                </button>
            }
        }
        return (
            <div className='actionBtnComp'>
                {btn}
                {actionsList}
            </div>
        );
    }
});

module.exports = ActionButton;
