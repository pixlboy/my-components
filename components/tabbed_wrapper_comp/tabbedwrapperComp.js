import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classNames';

import S from './store/tabbedwrapper_store';

import CloseBtn from '../common/close_button/CloseButton';

require('./styles/tab_wrapper.scss');

class TabbedWrapperComp extends Component {

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
        this.displayDataTable = this.displayDataTable.bind(this);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    componentDidMount(){
        if(this.props.tableData){
            this.displayDataTable(0);
        }

    }

    onClickCallBack(e) {
       if (this.props.onTabClicked) {
            this.props.onTabClicked(e.currentTarget.getAttribute('data-tabId'));
        }else if(this.props.tableData){
            this.displayDataTable(e.currentTarget.getAttribute('data-tabId'));
            this.setState ({
                tabindex : e.currentTarget.getAttribute('data-tabId')
            })
        }
    }

    close(){
        if(this.props.onClose){
            this.props.onClose();
        }
    }

    displayDataTable(tabindexdefault){

        var jnprDataTableObj = JnprCL.JnprDataTableObjectFactory.getDataTableObject();
        try{
            ReactDOM.unmountComponentAtNode(document.getElementById('tabbedWrapper-tablecomp'));
        }catch(e){}

        if(this.props.tableData){
            let configs =[];
            let datalists = [];

            this.props.tableData.forEach((obj) =>{
                configs.push(obj.config)
                datalists.push(obj.dataList)
            })

            jnprDataTableObj.setConfig(configs[tabindexdefault], "tabbedWrapper_appid");
            jnprDataTableObj.setDataListFor("tabbedWrapper_appid", datalists[tabindexdefault]);
        }

        var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;
        ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
          appId : "tabbedWrapper_appid",
          displayDataTable: this.displayDataTable.bind(this)
        }), document.getElementById('tabbedWrapper-tablecomp'));

    }

    render() {
        let passtabtitles = [];
        let closeBtn = null;
        if(this.props.tableData){
            let tabindex ;
            tabindex ++;
            this.props.tableData.forEach((obj, tabindex)=>{
            passtabtitles.push(
                    <div className="tabtitle" key={tabindex} onClick={this.onClickCallBack} data-tabId = {tabindex}>
                        <span className={classNames({'activeindex': this.state.tabindex== tabindex})}> {obj.title} </span>
                    </div>)
            })
        }else{
            closeBtn = <div className="closingBtn">
                <CloseBtn onClick={this.close} wrapperClassName='tabs-tabbedwrapper'/>
            </div>
            passtabtitles = this.props.tabTitles.map((title, tabindex)=>{
                return(
                    <div className="tabtitle" key={tabindex} onClick={this.onClickCallBack} data-tabId = {tabindex}>
                        <span className={classNames({'activeindex': this.state.tabindex == tabindex})}> {title} </span>
                    </div>)
            })
        }

        return (
            <div className="tabs-tabbedwrapper">
                <div>{closeBtn} </div>
                <div>{passtabtitles}</div>
                <div dangerouslySetInnerHTML={{__html: this.state.content}} className="display-content" />
                <div id="tabbedWrapper-tablecomp"> </div>
            </div>

        );

        }
    }

    TabbedWrapperComp.propTypes = {
        onClose: PropTypes.func,
        onTabClicked: PropTypes.func,
        appId: PropTypes.string,
        tabTitles: PropTypes.array,
        tableData: PropTypes.array
    };

    TabbedWrapperComp.defaultProps = {
        appId: "",
        tabTitles: []
    };

export default TabbedWrapperComp;
