let React = require('react');
let WidgetChooserMixins = require('./mixins/WidgetChooserMixins');
let DataTypeHeader = require('./comps/DataTypeHeader');
let PageNames = require('./comps/PageNames');
let WidgetsList = require('./comps/WidgetsList');
require('./style/jnpr-widgetchooser.scss');



let WidgetChooserDom = React.createClass({

    mixins: [WidgetChooserMixins],
    render: function() {
        var {processedWidgetConfig, currentPageName, detailPageConfigs, dataType, subWidgetType} = this.state;
        var _self = this;

        var className = "jnpr_widget_chooser";
        if (this.props.styleType)
            className += "_" + this.props.styleType;

        if (currentPageName == PageNames.MAIN)
            return (
                <div className={className}>
                    <div className='headerWrapper'>
                        {
                            Object.keys(processedWidgetConfig).map(function(dataType, i) {
                                return (
                                    <DataTypeHeader
                                        key={i}
                                        dataType={dataType}
                                        configs={processedWidgetConfig[dataType]}
                                        appId={_self.props.appId}
                                        />
                                )
                            })
                        }
                    </div>

                    <div className="closeMe" onClick={this._closeme}/>
                </div>
            )

        if (currentPageName == PageNames.DETAIL)
            return (
                <div className={className}>
                    <div className="widgetsListWrapper">
                        <div className="title"  onClick={this._backToMain}>
                            {"< " + dataType}
                        </div>

                        <WidgetsList
                            appId={this.props.appId}
                            configs = {processedWidgetConfig[dataType][subWidgetType]}
                            />
                    </div>
                    <div className="closeMe" onClick={this._closeme}/>
                </div>
            )
    }
});

module.exports = WidgetChooserDom;