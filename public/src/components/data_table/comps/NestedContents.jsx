let React = require('react');
let ClassName = require('classnames');
var jQuery = require('jquery');


let DataTableAction = require( '../flux/actions/DataTableActions' );
let DataTableStore = require( '../flux/stores/DataTableStore' );
let jnprDataTableObj = require("../data_object/DataTableObjectFactory").getDataTableObject();

var NestedContentsHeaderItem = React.createClass({

    getInitialState: function() {
        return { selected: this.props.className };
    },

    componentWillUnmount: function() {
        DataTableStore.removeNestedTabChanged(this.props.appId, this.switchTabx);

    },

    componentWillMount: function() {
        DataTableStore.addNestedTabChanged(this.props.appId, this.switchTabx);
    },

    switchTabx: function(tabName){
     setTimeout(()=>{
         this.setState({
             selected: this.props.columnKey===tabName
         })
     },0);
    },

    _changeTab: function() {
        DataTableAction.performNestedChildTabChanged( this.props.appId, this.props.columnKey );
    },

    render: function() {
        return <li className={this.state.selected?'selected':''} onClick={this._changeTab}>
            <div className={this.state.selected ? 'li-highlight' : 'li-nohighlight'}>
                {this.props.title} ({this.props.totalRecords})
            </div>
        </li>
    }

});

var NestedContentsHeader = React.createClass({

    getInitialState: function() {
        return {
            selectedChildKey: this.props.selectedChildKey
        }
    },

    componentWillUnmount: function() {
        DataTableStore.removeNestedTabChanged(this.props.appId, this.switchTab1);

    },

    componentWillMount: function() {
        DataTableStore.addNestedTabChanged(this.props.appId, this.switchTab1);
    },

    switchTab1: function(tabName){
        this.setState({
             selectedChildKey: tabName
        })
    },

    render: function() {
        return (
            <ul>
                {
                    Object.keys(this.props.data).map((myKey, i) => {
                        if (this.props.data[myKey].children.length > 0 ||
                           (this.props.data[myKey].config.hasOwnProperty('displayingTitle') && this.props.data[myKey].config.displayingTitle )) {
                            return <NestedContentsHeaderItem
                                appId= {this.props.appId}
                                key={i}
                                className={ClassName({ selected: myKey == this.props.selectedChildKey }) }
                                title={this.props.data[myKey].config.title}
                                columnKey={myKey}
                                totalRecords ={this.props.data[myKey].totalRecords? this.props.data[myKey].totalRecords : this.props.data[myKey].children.length}
                                children={this.props.data[myKey].children}/>
                            }
                    })
                }
            </ul>

        );
    }
});

var CasesNestedContentsBody = React.createClass({
    componentWillUnmount: function() {
       DataTableStore.removeNestedTabChanged(this.props.appId, this.switchTab2);
       try {
           ReactDOM.unmountComponentAtNode( $( '.dataTableContent').get( 0 ) );
       } catch ( e ) { }

   },

    switchTab2:function(tabName){
        //remove table first
        try {
            ReactDOM.unmountComponentAtNode( $( '.dataTableContent').get( 0 ) );
        } catch ( e ) { }

        if(tabName=='prIds'){
            jnprDataTableObj.setConfig( jnprDataTableObj.getAdditionalConfigFor( this.props.appId, "detailConfigs" ).pr, "pr-rc-table" );
            jnprDataTableObj.dataList = this.props.extraData.pr.prLineLevelDetailsList;
            jnprDataTableObj.grandTotalRecords = this.props.extraData.pr.totalRecords;
            setTimeout( function() {
                var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;
                ReactDOM.render( React.createElement( JnprDataTableNgcsc, {
                    styleType: "ngcsc",
                    appId: "pr-rc-table",
                    nested: false,
                    destroy: function() {
                        ReactDOM.unmountComponentAtNode( $( '.dataTableContent').get( 0 ) );
                    }
                }), $( '.dataTableContent').get( 0 ) );
            }, 100 );
        }else if(tabName=='kbIds'){
            jnprDataTableObj.setConfig( jnprDataTableObj.getAdditionalConfigFor( this.props.appId, "detailConfigs" ).kb, "kb-rc-table" );
            jnprDataTableObj.dataList = this.props.extraData.kb.kbLineLevelDetailsList;
            jnprDataTableObj.grandTotalRecords = this.props.extraData.kb.totalRecords;
            setTimeout( function() {
                var JnprDataTableNgcsc1 = JnprCL.JnprDataTableNgcscPlain;
                ReactDOM.render( React.createElement( JnprDataTableNgcsc1, {
                    styleType: "ngcsc",
                    appId: "kb-rc-table",
                    nested: false,
                    destroy: function() {
                        ReactDOM.unmountComponentAtNode( $( '.dataTableContent').get( 0 ) );
                    }
                }), $( '.dataTableContent').get( 0 ) );
            }, 100 );
        }

    },
    componentWillMount: function() {
        DataTableStore.addNestedTabChanged(this.props.appId, this.switchTab2);
    },

    componentDidMount: function(){
        setTimeout(()=>{
            this.switchTab2(this.props.selectedChildKey);
        }, 0)
    },

    render: function() {
        return <div>
                <div className='dataTableContent'></div>
            </div>
    }


});

var IbContractsHistoryNestedContentsBody = React.createClass({

    nextPageCallBack: function(){
        DataTableAction.performNextContentNextPage(this.props.appId, 'ib_contracts_history');
    },

    sortHandler: function(key, up){
        setTimeout(()=>{
             DataTableAction.performNestedContentSort(this.props.appId, 'ib_contracts_history', key, up);
        }, 0);
    },

    filterHandler: function(filterObject){
        setTimeout(()=>{
            DataTableAction.performNestedContentFilter(this.props.appId, 'ib_contracts_history', filterObject);
        }, 0);
    },

    componentDidMount: function() {
        DataTableStore.addNestedContentDataUpdated(this.props.appId, this._dataUpdated);
    },
    componentWillUnmount: function() {
        DataTableStore.removeNestedContentDataUpdated(this.props.appId, this._dataUpdated);
    },

    _dataUpdated: function(data, type){
        setTimeout(()=>{
            jnprDataTableObj.setDataListFor(this.props.appId+"_ib_contracts_history", data.responseList);
        }, 0);
    },

    componentWillMount: function() {
        //remove table first
        try {
            ReactDOM.unmountComponentAtNode($('.expDataTable_'+this.props.appId).get(0));
        } catch (e) { }

        //ib contracts history table
        var jnprDataTableObj = JnprCL.JnprDataTableObjectFactory.getDataTableObject();
        if ('responseList' in this.props.extraData && this.props.extraData.responseList != null) {
            jnprDataTableObj.setConfig(jnprDataTableObj.getAdditionalConfigFor(this.props.appId, "detailConfigs").contractsHistory, this.props.appId+"_ib_contracts_history");
            jnprDataTableObj.dataList = this.props.extraData.responseList;
            jnprDataTableObj.grandTotalRecords = this.props.extraData.totalRecords;
            setTimeout(function() {
                var JnprDataTableNgcsc = JnprCL.JnprDataTableNgcscPlain;
                ReactDOM.render(React.createElement(JnprDataTableNgcsc, {
                    nextPageCallBack: this.nextPageCallBack,
                    sortHandler : this.sortHandler,
                    filterHandler : this.filterHandler,
                    styleType: "ngcsc",
                    appId: this.props.appId+"_ib_contracts_history",
                    nested: false,
                    nestedContent: true,
                    destroy: function() {
                        ReactDOM.unmountComponentAtNode($('.expDataTable_'+this.props.appId).get(0));
                    }
                }), $('.expDataTable_'+this.props.appId).get(0));
            }.bind(this), 0);
        }

    },

    render: function() {
      var tableClassName = 'dataTableContent selected expDataTable_'+this.props.appId;
        return <div>
            <div className={tableClassName}></div>

        </div>
    }
});


var GeneralNestedContentsBody = React.createClass({
    render: function() {
        return <ul>
            {
                this.props.data.children.map((item, i) => {
                    return <li className='item' key={i}> <a href={item.link}>{item.title}</a> </li>
                })
            }
        </ul>
    }
});


var NestedContentsDOM = React.createClass({

    getInitialState: function() {
        var selectedChildKey = null;

      for ( var key in this.props.data.children ) {
            if ( this.props.data.children[key].children.length > 0 ||
                 (this.props.data.children[key].config.hasOwnProperty('displayingTitle') && this.props.data.children[key].config.displayingTitle )) {
                selectedChildKey = key;
                break;
            }
        }

        return {
            selectedChildKey: selectedChildKey
        }
    },

    //need to pass control to parent to prevent it from closing
    mouseDown: function() {
        if (this.props.linkClicked)
            this.props.linkClicked(true);
    },
    //if the whole popup lost focus, we close it
    _onBlur: function() {
        if (this.props.linkClicked)
            this.props.linkClicked(false);
        if (this.props._onBlurChild)
            this.props._onBlurChild();
    },
    closeRCview: function(e) {
        jnprDataTableObj.resetCustomConfigFor(this.props.appId+"_ib_contracts_history");
        this._onBlur();

    },

    render: function() {
        var NestedContentsBody = null;
        if (('prIds' in this.props.data.children) || ('kbIds' in this.props.data.children)) {
            NestedContentsBody = <CasesNestedContentsBody
                appId= {this.props.appId}
                extraData= {this.props.extraData}
                selectedChildKey={this.state.selectedChildKey}
                data={ this.props.data.children[this.state.selectedChildKey]}/>

        } else if ('ibParents' in this.props.data && this.props.data.ibParents !== null && this.props.data.key && 'link' in this.props.data && this.props.data.link) {
            NestedContentsBody = <IbContractsHistoryNestedContentsBody
                appId= {this.props.appId}
                extraData= {this.props.extraData}
                selectedChildKey='contractsHistory'
                data={this.props.data.children[this.state.selectedChildKey]}/>

        } else {
            NestedContentsBody = <GeneralNestedContentsBody/>;
        }
        return (
            <div className='attachingPointUl' tabIndex="0" onBlur={this._onBlur} onMouseDown={this.mouseDown}>
                <div className="closingBtn" onClick={this.closeRCview}><i className="material-icons">cancel</i></div>
                <NestedContentsHeader appId= {this.props.appId} data={ this.props.data.children } selectedChildKey={this.state.selectedChildKey}/>
                <div className="clearfix"></div>
                {NestedContentsBody }
            </div >
        );
    }
});

module.exports = NestedContentsDOM;
