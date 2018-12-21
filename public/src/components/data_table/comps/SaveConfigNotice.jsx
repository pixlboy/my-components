let React = require('react');
let DataTableStore = require('../flux/stores/DataTableStore');


var SaveConfigNotice = React.createClass({

    getInitialState: function() {
        return {
            msg: ''
        }
    },

    componentDidMount: function() {
        DataTableStore.addCustomConfigurationDefaultCallBackHandler(this.props.appId, this._defaultConfigCallBack);
        DataTableStore.addCustomConfigurationDeleteCallBackHandler(this.props.appId, this._deleteConfigCallBack);
        DataTableStore.addCustomConfigurationUpdateCallBackHandler(this.props.appId, this._updateConfigCallBack);
        DataTableStore.addMultiConfigWithNameSaved(this.props.appId, this._newConfigSaved);
        DataTableStore.addCustomConfigViewingHandler(this.props.appId, this._viewingConfigCallBack);
    },

    componentWillUnmount: function() {
        DataTableStore.removeCustomConfigurationDefaultCallBackHandler(this.props.appId, this._defaultConfigCallBack);
        DataTableStore.removeCustomConfigurationDeleteCallBackHandler(this.props.appId, this._deleteConfigCallBack);
        DataTableStore.removeCustomConfigurationUpdateCallBackHandler(this.props.appId, this._updateConfigCallBack);
        DataTableStore.removeMultiConfigWithNameSaved(this.props.appId, this._newConfigSaved);
        DataTableStore.removeCustomConfigViewingHandler(this.props.appId, this._viewingConfigCallBack);
    },

    counter: 0,

    _viewingConfigCallBack: function(subType) {
        this.setState({
            msg: 'Viewing \'' + subType + '\'.'
        });
        this.counter++;
        this._hideMsg();
    },

    _defaultConfigCallBack: function(subType, noNotice) {
        if (noNotice !== true) {
            subType = subType === "default" ? 'System ' + subType :subType;

            this.setState({
                msg: 'Saved \'' + subType  + '\' as my default.'
            });
            this.counter++;
            this._hideMsg();
        }
    },
    _deleteConfigCallBack: function(subType) {
        this.setState({
            msg: '\''+ subType + '\' has been removed successfully.'
        });
        this.counter++;
        this._hideMsg();
    },
    _updateConfigCallBack: function(subType) {
        this.setState({
            msg: '\''+ subType + '\' has been updated successfully.'
        });
        this.counter++;
        this._hideMsg();
    },
    _newConfigSaved: function(subType) {
        this.setState({
            msg: '\''+ subType + '\' has been saved.'
        });
        this.counter++;
        this._hideMsg();
    },

    _hideMsg: function() {
        setTimeout(function() {
            if (this.counter <= 1)
                this.setState({
                    msg: ''
                });
            this.counter--;
        }.bind(this), 5000);
    },

    render: function() {
        var msgComp = null;
        if (this.state.msg.length > 0) {
            msgComp = <span className='saveConfigNotice'><span className='content'>{this.state.msg}</span></span>;
        }
        return msgComp;
    }
});
module.exports = SaveConfigNotice;
