let React = require('react');
let WidgetChooserActions = require('../flux/actions/WidgetChooserActions');
let WidgetChooserStore = require('../flux/stores/WidgetChooserStore');
let ClassNames = require('classnames');

var jQuery = require('jquery');
require('jquery-ui/ui/core');
require('jquery-ui/ui/draggable');
require('jquery-ui/ui/resizable');

let widgetChooserDataObject = require('../data_object/WidgetChooserObject').getWidgetOptionsConfig();

let Swiper = require('swiper');
require('swiper/dist/css/swiper.min.css')


var WidgetsListItem = React.createClass({

    getInitialState: function() {
        return {
            disabled: widgetChooserDataObject.isConfigExisting(this.props.config)
        }
    },

    _addWidget: function() {
        if (!this.state.disabled)
            WidgetChooserActions.addWidget(this.props.appId, this.props.config);
        this.setState({
            disabled: true
        })
    },

    componentDidMount: function() {
        WidgetChooserStore.addCurrentWidgetsChangedListener(this.props.appId, this._updateCurrentWidgets);
    },

    componentWillUnmount: function() {
        WidgetChooserStore.removeCurrentWidgetsChangedListener(this.props.appId, this._updateCurrentWidgets);
    },

    _updateCurrentWidgets: function() {
        this.setState({
            disabled: widgetChooserDataObject.isConfigExisting(this.props.config)
        });
    },

    render: function() {
        var object = {};
        this.props.config.attributes.map(function(item) {
            object[item.name] = item.value;
        });
        var classNames = ClassNames('right',{ [object.widgetType]: true }, 'itemContent', { [object.subWidgetType]: true });
        var headerClassNames = ClassNames(['swiper-slide', { 'widgetItem': !this.state.disabled }, { 'widgetItemDisabled': this.state.disabled }]);
        return (
            <div className={headerClassNames} ref='widgetItem' onClick={this._addWidget}>
                <span className='left'>
                    {object.title}
                </span>
                <span className={classNames}>
                </span>
            </div>
        )
    }
});


var WidgetsList = React.createClass({

    componentDidMount: function() {
        jQuery(".widgetItem").draggable({
            axis: 'y',
            containment: 'html',
            helper: 'clone'
        });


        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 30
        })

    },



    render: function() {

        var divStyle = {
            width: (this.props.configs.length + 1) * 220 + "px",
        };
        var _self = this;

        return (
            <div>
                <div className='widgetItemWrapper swiper-container' ref='widgetItemWrapper' /*style={divStyle}*/>
                    <div className="swiper-wrapper">
                        {
                            this.props.configs.map(function(config, i) {
                                return <WidgetsListItem key={i} config={config}
                                    appId={_self.props.appId}
                                    />
                            })
                        }
                    </div>
                </div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-pagination"></div>

            </div>

        );
    }
});

module.exports = WidgetsList;
