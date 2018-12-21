let Service = require('./Service');
let StoreFactory = require('./Store');
var NavigatorMixin = {
    _service : null,
    getInitialState : function() {
        this._service = new Service();
        //next, setting properties, and service is analyzing the data
        this._service.clickable = 'onClick' in this.props?true:false;
        this._service.items = this.props.options?this.props.options:[];
        return {
            items: this._service.items
        }
    },

    clickHandler: function(item){
        if('onClick' in this.props){
            this.props.onClick(item);
        }
    },

    componentDidMount: function(){
        StoreFactory.getStore().subscribe(this.goToStep, this.props.appId);
    },

    goToStep: function(){
        this.setState({
            items: this._service.setCurrentStep(StoreFactory.getStore().getState())
        });
    }
};

module.exports = NavigatorMixin;
