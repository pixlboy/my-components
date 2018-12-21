let React = require('react');
let WidgetChooserActions = require('../flux/actions/WidgetChooserActions');
let WidgetChooserStore = require('../flux/stores/WidgetChooserStore');

let ActionTypes = require('../flux/actions/ActionTypes');
let PageNames = require('./PageNames');
let ClassNames = require('classnames');
let widgetChooserDataObject = require('../data_object/WidgetChooserObject').getWidgetOptionsConfig();

var DataTypeHeaderItem = React.createClass({

    getInitialState: function() {
        return {
            disabled: widgetChooserDataObject.isConfigExisting(this.props.configs)
        }
    },

    _changePage: function() {
        //if this widgetType has only one widget or if that is not chart, no need to go to next step, adding directly
        if (this.props.configs.length == 1 && this.props.subWidgetType != "chart") {
            if (!this.state.disabled){
              WidgetChooserActions.addWidget(this.props.appId, this.props.configs[0]);
              //after addWdiget, let's update state here
              setTimeout(function(){
                this.setState({
                  disabled: widgetChooserDataObject.isConfigExisting(this.props.configs)
                });
              }.bind(this), 50);
            }
        } else if( ! widgetChooserDataObject.isConfigExisting(this.props.configs) ){
            WidgetChooserActions.changePage(this.props.appId, this.props.dataType, this.props.subWidgetType, PageNames.DETAIL, this.props.configs)
        }
    },

    componentDidMount: function() {
      WidgetChooserStore.addCurrentWidgetsChangedListener(this.props.appId, this._updateCurrentWidgets);
    },

    componentWillUnmount: function() {
      WidgetChooserStore.removeCurrentWidgetsChangedListener(this.props.appId, this._updateCurrentWidgets);
    },

    _updateCurrentWidgets: function(){
      this.setState({
          disabled: widgetChooserDataObject.isConfigExisting(this.props.configs)
      });
    },

    render: function() {
        var classNames = ClassNames('itemContent', { [this.props.subWidgetType]: true });
        var headerClassNames = ClassNames([{ 'item': !this.state.disabled }, { 'itemDisabled': this.state.disabled }]);
        var addWidgetTabTitle = this.props.subWidgetType === 'screen_share'  ? 'Screen Share' : this.props.subWidgetType;
        return (
            <span className={headerClassNames} onClick={this._changePage}>
                <div className="title">
                    add {addWidgetTabTitle}
                </div>
                <div className={classNames} />
            </span>
        )
    }
});

var DataTypeHeader = React.createClass({


    render: function() {
        return (
            <span className="headerBlockWrapper">

                <div className="caption">
                    {this.props.dataType}
                </div>

                <ul>
                    {
                        Object.keys(this.props.configs).map((subWidgetType, i) => {
                            return (
                                <li key={i}>
                                    <DataTypeHeaderItem
                                        dataType={this.props.dataType}
                                        subWidgetType={subWidgetType}
                                        configs={this.props.configs[subWidgetType]}
                                        appId={this.props.appId}
                                        />
                                </li>
                            )
                        })
                    }
                </ul>

            </span>
        )
    }

});

module.exports = DataTypeHeader;
