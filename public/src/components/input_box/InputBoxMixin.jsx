let Service = require('./InputBoxService');
var InputBoxMixin = {

    defaultProps:{
        placeholder: ''
    },

    getInitialState: function() {
        this.keyClickTriggered = false;
        this.service = new Service();
        if ('initValue' in this.props)
            this.service.setInput(this.props.initValue, this.props.acceptSpace);
        return {
            blocks: this.service.getBlocks(true),
            remainingStr: ''
        };
    },

    deleteBlock: function(block) {
        this.service.deleteBlock(block);
        this.setState({
            blocks: this.service.getBlocks(true),
            remainingStr: ''
        });
        if (this.props.onChange) {
            this.props.onChange(this.service.getFormattedInput());
        }

        if (this.props.onDeleteBlock) {
            this.props.onDeleteBlock(block);
        }
    },

    notifyParent: function(e) {
        if (!this.keyClickTriggered && 'initClickHandler' in this.props) {
            this.props.initClickHandler(e);
            this.keyClickTriggered = true;
        }
    },

    mouseDown: function(e) {
        this.notifyParent(e);
    },

    keyDown: function(e) {
        this.notifyParent(e);



        let isEnterKey = e.key === 'Enter';
        let isSpace = !this.props.acceptSpace && e.key === ' ';
        let buttonClick = e === 'buttonClick';

        if (isEnterKey || isSpace || buttonClick) {
            //let's update here
            var str = this.refs.myInput.value;

            if(this.props.validate){
                let valid = this.props.validate(str);
                if(!valid){ return false; }
            }

            if (this.props.onAddBlock) {
                this.props.onAddBlock(str);
            }

            if (this.props.acceptSpace) {
                str =  ',' + str;
            }

            if (isEnterKey) {
                str = str + ' ';
            }
            if (this.state.remainingStr === '') {
                str = ' ' + str;
            }

            this.service.setInput(this.service.getOriginalInput() + str, this.props.acceptSpace);
            this.setState({
                blocks: this.service.getBlocks(false),
                remainingStr: this.service.getRemainingStr()
            });
            this.refs.myInput.value = this.service.getRemainingStr();

            if (this.props.onChange)
                this.props.onChange(this.service.getFormattedInput());
        }
    }
};
module.exports = InputBoxMixin;
