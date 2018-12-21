import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classNames';

import S from './store/confirmationpop_store';

import CloseBtn from '../common/close_button/CloseButton';

require('./styles/confirmation_pop.scss');

class ConfirmationPopUpComp extends Component {

    constructor(props) {
        super(props);
        this.store = S(this.props.appId);
        this.state = this.store.getState();
        this.unSubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());
        });

        this.bindingFunctions();
    }

    bindingFunctions() {
        this.onClickCallBack = this.onClickCallBack.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    componentDidMount(){
    }

    onClickCallBack(e){
        if (this.props.onBtnClicked) {
            this.props.onBtnClicked(e.currentTarget.getAttribute('data-tabId'));
        }
    }

    close(){
        if(this.props.onClose){
            this.props.onClose();
        }
    }

    render() {
        let content = null;
        if(this.state.config.visible){
            content = (
                    <div className="confirmation-modalbox">
                        <div className="confirmation-modalbox-content">
                            <div className="closingBtn">
                                <CloseBtn onClick={this.close}/>
                            </div>

                               <div className="confirmation-modalboxtitle">
                                   <span dangerouslySetInnerHTML={{__html: this.state.config.title}} />
                               </div>

                               <div className="confirmation-modalboxcontent">
                                   <span dangerouslySetInnerHTML={{__html: this.state.config.content}} />
                               </div>
                               <div className="confirmation-modalboxbuttons">
                                   <section>
                                       {this.state.config.buttons.map(object=>{
                                           return(
                                               <button className= {classNames({"confirmation-btns":true,"active": object['status']==='active', "inactive": object['status']==='inactive'  })}  key={object.title} onClick={this.onClickCallBack} data-tabId = {object.buttonId || object.title}> {object.title} </button>
                                           )
                                       })}
                                   </section>

                               </div>

                        </div>
                    </div>)
        }else{
            return content;
        }

        return (
            <div className="pop-confirmation"> { content } </div>
        );

        }
    }

    ConfirmationPopUpComp.propTypes = {
        onClose: PropTypes.func,
        onBtnClicked: PropTypes.func,
        appId: PropTypes.string,
        config: PropTypes.object
    };

    ConfirmationPopUpComp.defaultProps = {
        appId: "",
        config: {}
    };

export default ConfirmationPopUpComp;
