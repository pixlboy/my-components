let React = require('react');
let classNames = require('classnames');
require('../style/action-button.scss');
import _ from 'underscore';
let DataTableAction = require('../flux/actions/DataTableActions');
let jnprDataTableObj = require('../data_object/DataTableObjectFactory').getDataTableObject();
let DataTableStore = require('../flux/stores/DataTableStore');

var IbaseActionButtonList = React.createClass({
    getInitialState: function() {

      var userRoles = [];
      var bCaseManager = false;
      if ('userRoles' in jnprDataTableObj.getConfigFor(this.props.appId)) {
          userRoles = jnprDataTableObj.getConfigFor(this.props.appId)['userRoles'];
      }
      userRoles.forEach(role => {
          if (role.toLowerCase().trim() === 'Case Manager Read/Write'.toLowerCase()) {
              bCaseManager = true;
          }
      });

        return {
          num: jnprDataTableObj.getCheckedRowsCountFor(this.props.appId),
          havingSN: this.serialNumberStatus(),
          bCaseManager: bCaseManager
        }
    },

    componentDidMount: function() {
      DataTableStore.addCheckRowsUpdated(this.props.appId, this._checkedRowsCallBack);
    },

    componentWillUnmount: function() {
      DataTableStore.removeCheckRowsUpdated(this.props.appId, this._checkedRowsCallBack);
    },

    _checkedRowsCallBack: function(){
      this.setState({
        num: jnprDataTableObj.getCheckedRowsCountFor(this.props.appId),
        havingSN: this.serialNumberStatus()
      });
    },
    serialNumberStatus: function(){
        var lists=jnprDataTableObj.getCheckedRowsFor(this.props.appId);
        if(lists.length == 1 && lists[0].serialNumber ==""){
            return false;
        }
        else{
            return true;
        }
    },
    getUrlLink: function(){
        var lists=jnprDataTableObj.getCheckedRowsFor(this.props.appId);
        if(lists.length == 1){
            var serialNo = (lists[0].serialNumber) ? lists[0].serialNumber : "\"\"";
            var accountId = (lists[0].installedAt) ? lists[0].installedAt.split(" - ",2)[1] : "\"\"" ;
            var installedAtAccId = (lists[0].installedAtAccId) ? lists[0].installedAtAccId : "\"\"";
            var restUrl = serialNo+'/'+installedAtAccId;
        }
        return restUrl;
    },

    openCasesClick: function(e) {

      var lists = jnprDataTableObj.getCheckedRowsFor(this.props.appId);
      var selectedserialNumbers = [];
      _.each(lists, function(row) {
        selectedserialNumbers.push(row.serialNumber);
      });
      var data = {
        serialNumberList: selectedserialNumbers,
        type: $(e.target)[0].type,
        parentsData: lists
      };
      DataTableAction.performActionButtonClicked(this.props.appId, data);
    },

    render: function() {
      if (this.state.bCaseManager && jnprDataTableObj.config.srDataEnabled) {

        if (jnprDataTableObj.config.newActionFeatureEnabled) {
          return (<div className='actions-options-list'>
            <ul>
              <li className={classNames({
                  'active': this.state.num == 1,
                  'R': 'mode' in jnprDataTableObj.config
                    ? jnprDataTableObj.config.mode === 'R'
                    : false
                })} type={"ZADM"} onClick={this.openCasesClick}>
                Open an Admin SR
              </li>
              <li className={classNames({
                  'active': this.state.num == 1 && this.state.havingSN,
                  'R': 'mode' in jnprDataTableObj.config
                    ? jnprDataTableObj.config.mode === 'R'
                    : false
                })} type={"ZTEC"} onClick={this.openCasesClick}>
                Open a Tech SR
              </li>
            </ul>
          </div>);
        } else {
          return (<div className='actions-options-list'>
            <ul>
              <li className={classNames({
                  'active': this.state.num == 1,
                  'R': 'mode' in jnprDataTableObj.config
                    ? jnprDataTableObj.config.mode === 'R'
                    : false
                })} type={"ZADM"} onClick={this.openCasesClick}>
                Open an Admin SR
              </li>
              <li className={classNames({
                  'active': this.state.num == 1 && this.state.havingSN,
                  'R': 'mode' in jnprDataTableObj.config
                    ? jnprDataTableObj.config.mode === 'R'
                    : false
                })} type={"ZTEC"} onClick={this.openCasesClick}>
                Open a Tech SR
              </li>
              <li className={classNames({
                  'active': this.state.num >= 1
                })} type={"allSR"} onClick={this.openCasesClick}>
                Show all Cases
              </li>
            </ul>
          </div>);
        }

      } else {

        if (jnprDataTableObj.config.newActionFeatureEnabled) {
          return (<div className='actions-options-list'>
            <ul></ul>
          </div>);
        } else {
          return (<div className='actions-options-list'>
            <ul>
              <li className={classNames({
                  'active': this.state.num >= 1
                })} type={"allSR"} onClick={this.openCasesClick}>
                Show all Cases
              </li>
            </ul>
          </div>);
        }

      }
    }
});

module.exports = IbaseActionButtonList;
