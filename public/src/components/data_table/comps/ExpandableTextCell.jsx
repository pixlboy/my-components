let React = require('react');
import { Cell } from 'fixed-data-table-2';
let NestedContents = require('./NestedContents');
let classNames = require('classnames');

let DataTableAction = require('../flux/actions/DataTableActions');
let DataTableStore = require('../flux/stores/DataTableStore');
import { Checkbox } from 'react-mdl';
var jQuery = require('jquery');
var dataTableObject = require('../data_object/DataTableObjectFactory').getDataTableObject();

let configService = require('../services/ConfigServices');
let DetailPopUpView = require('./DetailPopupView');

let DateTimePicker = require('../elements/DateTimePicker');
const ExpandableActionsCell = require('./ExpandableActionsCell');

var TZ = require('../services/TimeZoneService');
var ReactDom = require('react-dom');

import JnprCheckBox from '../../../../../components/common/checkbox/CheckBox';
import DropDownInputCompSingle from '../../../../../components/drop_down_input_comp/DropDownInputAppendCompSingle';
import DropDownInputCompMulti from '../../../../../components/drop_down_input_comp/DropDownInputAppendCompMulti';

import DatePicker from '../../../../../components/common/date_picker/DatePicker';

var ExpandableTextCell = React.createClass({

  getInitialState: function () {
    return {
      editing: false, expanded: false, showToolTip: false, showCellNoti: false
    }
  },

  totalRows: 0,

  clickHandler: function (e) {

    this.cellHighlightHandler(e);

    var el = this.refs.myClickableDiv;
    if (this.props.nested) {
      // regular dataTable
      while ((el = el.parentElement) && !el.classList.contains('jnprDataTablePlainTr'))
        ;

      if (el.nextSibling && el.nextSibling.classList.contains("jnprDataTablePlainTrInserted")) {
        el.nextSibling.remove();
      } else {
        var htmlStr = "<tr class='jnprDataTablePlainTrInserted'><td colspan=" + el.childNodes.length + ">";
        htmlStr += "<div id='jnpr_expanded_CellRow_" + this.props.rowIndex + "'></div>";
        htmlStr += "</td></tr>";
        el.insertAdjacentHTML('afterend', htmlStr);
        ReactDOM.render(React.createElement(NestedContents, {
          data: this.props.data[this.props.rowIndex][this.props.col]
        }), document.getElementById('jnpr_expanded_CellRow_' + this.props.rowIndex));
      }

      this.setState({
        expanded: !this.state.expanded
      });

    } else {
      // facebook FixedDataTable, nested = false
      if (!this.state.expanded) {
        var dt = this.props.data[this.props.rowIndex][this.props.col];

        // if this plus sign is controlled by external directly
        if (this.showingPlusSign) {
          dataTableObject.subscribeToExtraDataFor(this.props.appId, function (data) {
            dataTableObject.unSubscribeToExtraDataFor(this.props.appId);
            this.showExtraDataPopUpView(dt, data);
          }.bind(this));

          if (this.props.extraDataCallBack)
            this.props.extraDataCallBack(this.props.data[this.props.rowIndex]);
          return;
        }

        /**
        * Below logic needs to be removed, no need to embed business login in
        * NGCL here at all
        */


        var relatedContentPrKb = {};
        var ib_contracts_history = {};
        var prIds = [];
        var kbIds = [];
        var ids = dt.value;
        ib_contracts_history['ids'] = dt.link;
        relatedContentPrKb['ids'] = ids;

        if (('prIds' in dt.children) || ('kbIds' in dt.children)) {
          if ('prIds' in dt.children && 'children' in dt.children.prIds && dt.children.prIds.children.length > 0) {
            dt.children.prIds.children.forEach(function (item) {
              prIds.push(item.title);
            });
          }
          relatedContentPrKb['pr'] = $.extend({}, prIds);
          if ('kbIds' in dt.children && 'children' in dt.children.kbIds && dt.children.kbIds.children.length > 0) {
            dt.children.kbIds.children.forEach(function (item) {
              kbIds.push(item.title);
            });
          }
          relatedContentPrKb['kb'] = $.extend({}, kbIds);
          dataTableObject.subscribeToExtraDataFor(this.props.appId, function (data) {
            dataTableObject.unSubscribeToExtraDataFor(this.props.appId);
            this.showComponent(dt, data);
          }.bind(this));

          if (this.props.showDetailExtraDataCallBack) {
            this.props.showDetailExtraDataCallBack('case_rc', relatedContentPrKb);
          }
          // detecting ib key cell of ib table in ngcsc
        } else if ('ibParents' in dt && dt.ibParents !== null && dt.key && 'link' in dt && dt.link) {
          dataTableObject.subscribeToExtraDataFor(this.props.appId, function (data) {
            dataTableObject.unSubscribeToExtraDataFor(this.props.appId);
            dt.children = {
              "contractsHistory": {
                "children": data.responseList,
                "totalRecords": data.totalRecords,
                "config": { "title": "Contracts History", "displayingTitle": true }
              }
            };
            this.showComponent(dt, data);
          }.bind(this));

          if (this.props.showDetailExtraDataCallBack) {
            this.props.showDetailExtraDataCallBack('ib_contracts_history', ib_contracts_history);
          }

        } else {
          this.showComponent(dt);
        }

      } else {
        this.props.showDetailCallBack('#divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId, this.props.rowIndex, this.props.col, this.state.expanded, 100, 25);
        this.setState({
          expanded: !this.state.expanded
        });
      }
    }
  },

  // logic to control if we need to show plus sign or not
  showPlusSign: function () {
    // logic for checking if we need to show plus sign or not
    this.showingPlusSign = configService.checkPlusSignAvailability(
      this.props.data[this.props.rowIndex], // rowData
      this.props.col, // currentColumnName
      dataTableObject.getConfigFor(this.props.appId));
    return this.showingPlusSign;
  },

  _showDetailCallBack: function (compId, rowIndex, col, expanded, offsetX, offsetY) {
    this.props.showDetailCallBack(compId, rowIndex, col, expanded, offsetX, offsetY);

  },

  showExtraDataPopUpView: function (data, extraData) {
    ReactDOM.unmountComponentAtNode(document.getElementById('divCellClickDetailContent_' + this.props.appId));
    var offsetX = 100;
    var offsetY = 25;
    if ('extraDataOffsets' in dataTableObject.getConfigFor(this.props.appId)) {
      offsetX = dataTableObject.getConfigFor(this.props.appId)['extraDataOffsets'][0];
      offsetY = dataTableObject.getConfigFor(this.props.appId)['extraDataOffsets'][1];
    }
    this.props.showDetailCallBack('#divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId, this.props.rowIndex, this.props.col, this.state.expanded, offsetX, offsetY);
    ReactDOM.render(React.createElement(DetailPopUpView, {
      linkClicked: this.linkClicked,
      _onBlurChild: this._onBlurChild,
      appId: this.props.appId,
      extraData: extraData
    }), document.getElementById('divCellClickDetailContent_' + this.props.appId));


    this.setState({
      expanded: !this.state.expanded
    });


  },

  showComponent: function (data, extraData) {
    ReactDOM.unmountComponentAtNode(document.getElementById('divCellClickDetailContent_' + this.props.appId));
    this.props.showDetailCallBack('#divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId, this.props.rowIndex, this.props.col, this.state.expanded, 100, 25);
    ReactDOM.render(React.createElement(NestedContents, {
      linkClicked: this.linkClicked,
      _onBlurChild: this._onBlurChild,
      appId: this.props.appId,
      data: data,
      extraData: extraData,
      _changeTab: this._changeTab
    }), document.getElementById('divCellClickDetailContent_' + this.props.appId));


    this.setState({
      expanded: !this.state.expanded
    });
  },

  // called by NestedContents popup, we do no want to close the popup if the
  // link is clicked
  linkClicked: function (b) {
    this.linkClicking = b;
  },
  linkClicking: false,

  _onBlurChild: function () {
    if (!this.linkClicking) {
      setTimeout(function () {
        this.props.showDetailCallBack('#divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId, this.props.rowIndex, this.props.col, true);
        this.setState({
          expanded: false
        });
      }.bind(this), 0
      );
    }
    this.linlinkClicking = false;
  },




  /**
  * Reason for below approach, in NGCSC, the mouseDown or click events not
  * dispatched inside NestedContents.jsx, perhaps it is filtered out by onBlur,
  * so we have to put a small delay in _onBlur method. So a small walkaround is
  * setting flag of tTabChanged flag, and when onBLur happened, do not do
  * immediately, waiting for a small delay, let tabclick happen, then tabClick
  * happened, ASAP it happened, we use flag to indicate tabClick happened, then
  * when onBlur happeend, we check, if not tabChange, we then do onBlur. Also
  * do not forget to change tabChanged flag to false
  *
  */

  bTabChanged: false,
  _changeTab: function () {
    this.bTabChanged = true;
    setTimeout(function () {
      this.bTabChanged = false;
    }.bind(this), 150);
  },
  _onBlur: function () {
    // console.log(this.props.data[this.props.rowIndex][this.props.col])
    // if ( 'ibParents' in
    // this.props.data[this.props.rowIndex][this.props.col] ) {
    // //this is only for fixing iBase lose focus issue
    // this.cellNotiHandler();
    // }
    /*
    * setTimeout(function() { if (!this.bTabChanged) { this._onBlurChild(); }
    * }.bind(this), 100);
    */
  },
  changeValueHandler: function (event) {
    if (event.keyCode == 13) {
      this._updateValueHandler();
    }
  },

  _updateValueHandler: function () {
    if (this.props.changeValueHandler) {
      // Only call the change value handler if value has changed
      if (this.props.data[this.props.rowIndex][this.props.col].value !== this.refs.editableCellInput.value) {
        // If user deletes the existing value, then empty cell should
        // not be displayed
        if (this.refs.editableCellInput.value === '') {
          this.props.data[this.props.rowIndex][this.props.col].value = 'Click to edit';
        } else {
          this.props.data[this.props.rowIndex][this.props.col].value = this.refs.editableCellInput.value;
        }
        this.props.changeValueHandler(this.props.data[this.props.rowIndex], this.props.col, this.refs.editableCellInput.value);
      }
    }
    this.setState({ editing: false });
  },

  _onDateTimeChange: function (newDateTime) {
    if (this.props.changeValueHandler) {
      // Only call the change value handler if value has changed
      if (this.props.data[this.props.rowIndex][this.props.col].value !== newDateTime) {
        this.props.data[this.props.rowIndex][this.props.col].value = newDateTime;
        this.props.changeValueHandler(this.props.data[this.props.rowIndex], this.props.col, newDateTime);
      }
    }
    this.setState({ editing: false });
  },

  createReactMarkup: function (markup) {
    return { __html: markup.cellDataValue };
  },

  mouseEnterHandler: function () {
    this.setState({ showToolTip: true });
  },

  mouseLeaveHandler: function () {
    this.setState({ showToolTip: false });
  },

  parentCallBack: function (e) {
    this.cellHighlightHandler(e);
    DataTableAction.performCellClickParentCallBack(this.props.appId, this.props.data[this.props.rowIndex], this.props.col);
  },

  parentActionCallBack: function (action) {
    DataTableAction.performCellActionClickParentCallBack(this.props.appId, this.props.data[this.props.rowIndex], this.props.col, action);
  },

  parentOnMouseOver: function (item) {
    DataTableAction.performCellActionMouseOverCallBack(this.props.appId, this.props.data[this.props.rowIndex], this.props.col, item);
  },

  editingHandler: function (e) {
    this.cellHighlightHandler(e);
    if (this.props.editable) {
      this.setState({ editing: true });
    }
  },

  componentDidMount: function () {
    DataTableStore.addCloseCellDetailPopup(this.props.appId, this._hidePopUp);
  },

  componentWillUnmount: function () {
    this.setState({ editing: false });
    DataTableStore.removeCloseCellDetailPopup(this.props.appId, this._hidePopUp);

    // this line is use to remove all the event listenders
    jQuery(ReactDom.findDOMNode(this)).replaceWith(jQuery(ReactDom.findDOMNode(this)).clone());
  },

  _hidePopUp: function (colName) {
    if (colName === this.props.col) {
      this.setState({
        expanded: false
      });
    }
  },
  /**
  * the solution for highlighting a row here is to set highlightedRows of
  * dataTableObject, and then, in ngcscDatatable, we are using
  * rowClassNameGetter to adjust row class
  */
  cellHighlightHandler: function (e) {
    if ('clickToHighlight' in this.props.columnConfig && this.props.columnConfig.clickToHighlight === true) {
      if (dataTableObject.getHighlightedRowsFor(this.props.appId).includes(this.props.data[this.props.rowIndex][this.props.col].value)) {
        dataTableObject.setHighlightedRows(dataTableObject.getHighlightedRowsFor(this.props.appId).splice(dataTableObject.getHighlightedRowsFor(this.props.appId).indexOf(this.props.data[this.props.rowIndex][this.props.col].value)));
      } else {
        dataTableObject.setHighlightedRows(this.props.appId, [this.props.data[this.props.rowIndex][this.props.col].value]);
      }
    }
  },

  _check: function (e) {
    if (this.props.checkHandler) {
      this.props.checkHandler(this.props.rowIndex, e.target.checked)
    }
  },

  _cellDataUpdated: function (value, passedProps) {
    var rowIndex = this.props.rowIndex;
    var columnId = this.props.columnConfig.id;
    var appId = this.props.appId;
    if (passedProps) {
      rowIndex = passedProps['rowIndex'];
      columnId = passedProps['columnId'];
      appId = passedProps['appId'];
    }
    DataTableStore.emitCellDataUpdate(appId, rowIndex, columnId, value);
  },

  _updateDate: function (date, ts) {
    DataTableStore.emitCellDataUpdate(this.props.appId, this.props.rowIndex, this.props.columnConfig.id, { date: date, ts: ts });
  },

  _dummyCheckBoxChange: function () { },
  render: function () {

    var rowData = this.props.data[this.props.rowIndex];
    var cellData = rowData[this.props.col];
    var cellDataValue;

    if (this.props.columnConfig.type == 'datepicker') {
      let appId = this.props.appId + '_' + this.props.rowIndex + '_' + this.props.columnConfig.id;
      cellDataValue = cellData.value ? cellData.value : "";
      //get minDate value
      var minDate = null;
      if ('minDateControllerColumn' in this.props.columnConfig && rowData[this.props.columnConfig['minDateControllerColumn']]) {
        minDate = rowData[this.props.columnConfig['minDateControllerColumn']].value;
      }

      var maxDate = null;
      if ('maxDateControllerColumn' in this.props.columnConfig && rowData[this.props.columnConfig['maxDateControllerColumn']]) {
        maxDate = rowData[this.props.columnConfig['maxDateControllerColumn']].value;
      }
      
      return <Cell>
        <DatePicker
          appId={appId}
          date_ts={cellDataValue}
          format={this.props.columnConfig.format ? this.props.columnConfig.format : 'DD-MMM-YYYY'}
          timezone={this.props.columnConfig.timezone ? this.props.columnConfig.timezone : 'PST'}
          onDateChange={this._updateDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Cell>;
    } else if (this.props.columnConfig.type == 'multi_select') {
      let defaultDisabled = false;
      if ('defaultDisabledControlColumn' in this.props.columnConfig) {
        defaultDisabled = this.props.data[this.props.rowIndex][this.props.columnConfig.defaultDisabledControlColumn].value;
      }
      cellDataValue = cellData.value ? cellData.value : [];
      let appId = this.props.appId + '_' + this.props.rowIndex + '_' + this.props.columnConfig.id;
      return <Cell>
        <DropDownInputCompMulti passedProps={{ rowIndex: this.props.rowIndex, columnId: this.props.columnConfig.id, appId: this.props.appId }} appId={appId} defaultDisabled={defaultDisabled} options={cellDataValue} disableSingleSelectOption={this.props.columnConfig['disableSingleSelectOption']} numberTitle={this.props.columnConfig.numberTitle ? true : false} onChange={this._cellDataUpdated} />
      </Cell>;
    } else if (this.props.columnConfig.type == 'single_select') {
      let defaultDisabled = false;
      if ('defaultDisabledControlColumn' in this.props.columnConfig) {
        defaultDisabled = this.props.data[this.props.rowIndex][this.props.columnConfig.defaultDisabledControlColumn].value;
      }
      cellDataValue = cellData.value ? cellData.value : [];
      let appId = this.props.appId + '_' + this.props.rowIndex + '_' + this.props.columnConfig.id;
      return <Cell>
        <DropDownInputCompSingle passedProps={{ rowIndex: this.props.rowIndex, columnId: this.props.columnConfig.id, appId: this.props.appId }} defaultDisabled={defaultDisabled} disableSingleSelectOption={this.props.columnConfig['disableSingleSelectOption']} appId={appId} options={cellDataValue} onChange={this._cellDataUpdated} />
      </Cell>;
    } else if (this.props.columnConfig.type == 'checkbox') {
      cellDataValue = cellData.value ? true : false;
      let appId = this.props.appId + '_' + this.props.rowIndex + '_' + this.props.columnConfig.id;
      return <Cell><JnprCheckBox appId={appId} default={cellDataValue} onChange={this._cellDataUpdated} /></Cell>;
    } else if (this.props.columnConfig.type == "actions") {
      return <Cell><ExpandableActionsCell
        showDetailCallBack={this._showDetailCallBack}
        rowIndex={this.props.rowIndex}
        appId={this.props.appId}
        col={this.props.col}
        onMouseOver={this.parentOnMouseOver}
        onActionClick={this.parentActionCallBack} items={this.props.columnConfig['items']} value={this.props.data[this.props.rowIndex][this.props.col]['value']} /></Cell>;

    } else if (this.props.columnConfig.type == "addedCheckBox") {
      let checkDisable = rowData.disabledCheckbox;
      return <Cell>
        <Checkbox
          className="single-rowselect"
          ref='myCheckBox'
          id={this.props.appId + '-single-rowselect-' + this.props.rowIndex}
          checked={this.props.data[this.props.rowIndex].checked}
          disabled={checkDisable? checkDisable.value:false}
          onChange={this._check}
          value='on' />
      </Cell>;
    } else if ('clickableColumnListNameForRow' in dataTableObject.getConfigFor(this.props.appId)
      && this.props.data[this.props.rowIndex][dataTableObject.getConfigFor(this.props.appId)['clickableColumnListNameForRow']]
      && this.props.data[this.props.rowIndex][dataTableObject.getConfigFor(this.props.appId)['clickableColumnListNameForRow']].value.indexOf(this.props.columnConfig.id) >= 0
    ) {
      if (cellData)
        cellDataValue = cellData["value"] == null
          ? ""
          : cellData["value"].toString();

      if (this.showPlusSign()) {
        if (this.state.expanded) {
          return <Cell>
              <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
              <div tabIndex="0" className='cell clickbleCell count shrink' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
            </div>
          </Cell>;
        } else {
          return <Cell>
              <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
              <div tabIndex="0" className='cell clickbleCell count expand' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
            </div>
          </Cell>;
        }
      } else {
        return <Cell>
          <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
        </Cell>;
      }
    } else if ('clickableColumnListNameForRow' in dataTableObject.getConfigFor(this.props.appId)
      && this.props.data[this.props.rowIndex][dataTableObject.getConfigFor(this.props.appId)['clickableColumnListNameForRow']]
      && this.props.data[this.props.rowIndex][dataTableObject.getConfigFor(this.props.appId)['clickableColumnListNameForRow']].value.indexOf(this.props.columnConfig.id) == -1
    ) {
      if (cellData)
        cellDataValue = cellData["value"] == null
          ? ""
          : cellData["value"].toString();


      if (this.showPlusSign()) {
        if (this.state.expanded) {
          return <Cell>
            <span>{cellDataValue}</span>
            <div tabIndex="0" className='cell clickbleCell count shrink' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
            </div>
          </Cell>;
        } else {
          return <Cell>
            <span>{cellDataValue}</span>
            <div tabIndex="0" className='cell clickbleCell count expand' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
            </div>
          </Cell>;
        }
      } else {
        if (this.props.columnConfig.type == "autoCompleteSearch") {
          var toolTipContent;
          toolTipContent = this.props.columnConfig.title + ": " + cellDataValue;
          return <Cell>
            <span className='cell tooltip ellipse_child' title={toolTipContent} ref='tooltip' onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
              {cellDataValue}
            </span>
            {toolTipComp}
          </Cell>;
        } else {
          return <Cell>
            <span>{cellDataValue}</span>
          </Cell>;
        }
      }
    }
    else {
      if (cellData)
        cellDataValue = cellData["value"] == null
          ? ""
          : cellData["value"].toString();
      var toolTipComp;
      var toolTipContent;

      var colName = null;
      colName = this.props.columnConfig.title + ": ";
      if ('noToolTip' in this.props.columnConfig && this.props.columnConfig.noToolTip === true) {
        toolTipComp = null;
        toolTipContent = null;
      } else if (this.state.showToolTip) {
        toolTipComp = <div ref='tooltiptext' className='tooltiptext'><div className='tooltipColName'>{colName}</div><div className='tooltipCellDataVal'>{cellDataValue}</div></div>
        toolTipContent = this.props.columnConfig.title + ": " + cellDataValue;
      }
      /// /if this is nested, we use our won toolTipSolution, otherwiese,
      /// / use html toolTip direclty
      if (this.props.nested) {
        toolTipContent = null;
      } else {
        toolTipComp = null;
      }

      var dataValueComp = null;

      if (this.showPlusSign()) {
        var expandableClassName = (rowData.customize_extra_icon && rowData.customize_extra_icon.value) ? "modified-cell": "";
        if (this.state.expanded) {
          return <Cell>
            <span className={expandableClassName}>
              <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
              <div tabIndex="0" className='cell clickbleCell count shrink' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
              </div>
            </span>
          </Cell>;
        } else {
          return <Cell>
            <span className={expandableClassName}>
              <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
              <div tabIndex="0" className='cell clickbleCell count expand' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
              </div>
            </span>
          </Cell>;
        }

      } else if ("sendClickToParent" in this.props.columnConfig && this.props.columnConfig.sendClickToParent === true) {

        if (cellData["key"] == true && "children" in cellData && cellData["totalChildren"] > 0) {
          if (this.props.expandable) {

            if (this.state.expanded) {
              return <Cell>
                <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
                <div tabIndex="0" className='cell clickbleCell count shrink' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
                </div>
              </Cell>;
            } else {
              return <Cell>
                <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
                <div tabIndex="0" className='cell clickbleCell count expand' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
                </div>
              </Cell>;
            }

          } else
            return <Cell>
              <span className='clickbleCell' onClick={this.parentCallBack}>{cellDataValue}</span>
            </Cell>;
        }
        else {
          if (this.props.columnConfig.type == "image") {
            return <Cell>
              <img src={cellDataValue} alt={cellDataValue} height="24" width="24" onClick={this.cellHighlightHandler} />
            </Cell>;
          } else if (this.props.columnConfig.type == "html" || this.props.columnConfig.type == "multiHtml") {
            return <Cell>
              <div className='clickbleCell' onClick={this.parentCallBack} dangerouslySetInnerHTML={this.createReactMarkup({ cellDataValue })}></div>
            </Cell>;
          } else
            /// /unclicakable cell if contractId has no child items
            if (cellData["disableLink"] === true) {
              return <Cell>
                <span title={toolTipContent} className='cell tooltip clickbleCell-disable' ref='tooltip' onClick={this.cellHighlightHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                  {cellDataValue}
                </span>
                {toolTipComp}
              </Cell>;
            } else {
              if (this.props.columnConfig.indentation === true) {
                return <Cell>
                  <span className='cell tooltip indentation' title={toolTipContent} ref='tooltip' onClick={this.editingHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                    {cellDataValue}
                  </span>
                  {toolTipComp}
                </Cell>;
              } else {
                /// /---- special requirement for product table
                /// / on ngcsc ----
                if (this.props.data[this.props.rowIndex][this.props.col].key === true
                  && this.props.data[this.props.rowIndex][this.props.col].hasOwnProperty('ibParents')
                  && this.props.data[this.props.rowIndex][this.props.col].ibParents === false) {
                  if (this.props.data[this.props.rowIndex].hasOwnProperty('materialItemCategory')
                    && this.props.data[this.props.rowIndex].materialItemCategory.value === 'Fixed Software') {
                    if (this.props.data[this.props.rowIndex].hasOwnProperty('contractID') &&
                      this.props.data[this.props.rowIndex].contractID.value) {
                      if (this.state.expanded) {
                        return <Cell>
                          <span title={toolTipContent} className='cell tooltip clickbleCell isChild-FS' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                            {cellDataValue}
                          </span>
                          <span className='shrinkBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                          {toolTipComp}
                        </Cell>;
                      } else {
                        return <Cell>
                          <span title={toolTipContent} className='cell tooltip clickbleCell isChild-FS' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                            {cellDataValue}
                          </span>
                          <span className='expandBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                          {toolTipComp}
                        </Cell>;
                      }

                    } else {
                      return <Cell>
                        <span title={toolTipContent} className='cell tooltip clickbleCell isChild-FS' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                          {cellDataValue}
                        </span>
                        {toolTipComp}
                      </Cell>;
                    }

                  } else {
                    if (this.props.data[this.props.rowIndex].hasOwnProperty('contractID') &&
                      this.props.data[this.props.rowIndex].contractID.value) {
                      if (this.state.expanded) {
                        return <Cell>
                          <span title={toolTipContent} className='cell tooltip clickbleCell isChild' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                            {cellDataValue}
                          </span>
                          <span className='shrinkBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                          {toolTipComp}
                        </Cell>;
                      } else {
                        return <Cell>
                          <span title={toolTipContent} className='cell tooltip clickbleCell isChild' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                            {cellDataValue}
                          </span>
                          <span className='expandBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                          {toolTipComp}
                        </Cell>;
                      }

                    } else {
                      return <Cell>
                        <span title={toolTipContent} className='cell tooltip clickbleCell isChild' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                          {cellDataValue}
                        </span>
                        {toolTipComp}
                      </Cell>;
                    }

                  }
                  /// /---------------------------------------------------------
                } else {
                  if (this.props.data[this.props.rowIndex].hasOwnProperty('contractID') &&
                    this.props.data[this.props.rowIndex].contractID.value && !this.props.data[this.props.rowIndex].contractID.key) {
                    if (this.state.expanded) {
                      return <Cell>
                        <span title={toolTipContent} className='cell tooltip clickbleCell' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                          {cellDataValue}
                        </span>
                        <span className='shrinkBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                        {toolTipComp}
                      </Cell>;
                    } else {
                      return <Cell>
                        <span title={toolTipContent} className='cell tooltip clickbleCell' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                          {cellDataValue}
                        </span>
                        <span className='expandBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                        {toolTipComp}
                      </Cell>;
                    }

                  } else {
                    return <Cell>
                      <span title={toolTipContent} className='cell tooltip clickbleCell' ref='tooltip' onClick={this.parentCallBack} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                        {cellDataValue}
                      </span>
                      {toolTipComp}
                    </Cell>;
                  }

                }

              }
            }

        }

      } else {
        if (cellData["key"] == true && "children" in cellData && cellData["totalChildren"] > 0) {

          if (this.props.expandable) {
            if (cellData["link"] == null) {
              return <Cell>
                <span>{cellDataValue}</span>
                <div tabIndex="0" className={classNames({ 'cell': true, 'clickbleCell': true, 'count': true, 'shrink': this.state.expanded, 'expand': !this.state.expanded })} id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv">
                </div>
              </Cell>;
            } else {
              return <Cell>
                <div className={classNames({ 'cellLinkContent': true, 'indentation': this.props.columnConfig.indentation })}>
                  <a target="_new" href={cellData['link']}>{cellDataValue}</a>
                  <div tabIndex="0" className={classNames({ 'cell': true, 'clickbleCell': true, 'count': true, 'shrink': this.state.expanded, 'expand': !this.state.expanded })} id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></div>
                </div>
              </Cell>;
            }
          } else if (cellData["link"] == null)
            return <Cell>
              <span onClick={this.cellHighlightHandler}>{cellDataValue}</span>
            </Cell>;
          else
            return <Cell>
              <span onClick={this.cellHighlightHandler}>
                <a target="_new" href={cellData['link']}>{cellDataValue}</a>
              </span>
            </Cell>;

        }
        else {
          if (this.props.columnConfig.type == "image") {
            return <Cell>
              <img src={cellDataValue} alt={cellDataValue} height="24" width="24" onClick={this.cellHighlightHandler} />
            </Cell>;
          } else if (this.props.columnConfig.type == "html" || this.props.columnConfig.type == "multiHtml") {
            return <Cell>
              <div dangerouslySetInnerHTML={this.createReactMarkup({ cellDataValue })} onClick={this.cellHighlightHandler}></div>
            </Cell>;
          } else if ((dataTableObject.config.hasOwnProperty('mode') && dataTableObject.config.mode !== 'R' ||
            !dataTableObject.config.hasOwnProperty('mode')) && this.props.editable && this.state.editing) {
            if (this.props.columnConfig.type == "customDate") {
              return <Cell>
                <div className='cell'>
                  <DateTimePicker dateTime={cellDataValue} onDateTimeChange={this._onDateTimeChange} />
                </div>
              </Cell>;
            } else {
              return <Cell>
                <div className='cell'>
                  <input type='text' ref='editableCellInput' maxLength="50" onBlur={this._updateValueHandler} onKeyUp={this.changeValueHandler} defaultValue={cellDataValue} autoFocus={true}></input>
                </div>
              </Cell>;
            }

          } else {
            if (cellData["link"] == null) {
              if (this.props.columnConfig.indentation === true) {
                return <Cell>
                  <span className='cell tooltip ellipse_child indentation' title={toolTipContent} ref='tooltip' onClick={this.editingHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                    {cellDataValue}
                  </span>
                  {toolTipComp}
                </Cell>;
              } else {
                if ('enableTimeZone' in dataTableObject.config && dataTableObject.config.enableTimeZone === true && this.props.columnConfig.type == "customDate") {

                  if (isNaN(cellDataValue)) {
                    //based on if this is nummber, we adopt two convertion type automatically.
                    return <Cell>  <span className='cell tooltip ellipse_child' title={toolTipContent} ref='tooltip' onClick={this.editingHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                      {new TZ('disableAutoSummerTimeDetect' in dataTableObject.config ? dataTableObject.config.disableAutoSummerTimeDetect : false).convertDateTimeForTimeZone(cellDataValue, dataTableObject.config.defaultTimeZone, dataTableObject.getTimeZoneFor(this.props.appId))}
                    </span>
                      {toolTipComp}
                    </Cell>
                  } else {
                    return <Cell>  <span className='cell tooltip ellipse_child' title={toolTipContent} ref='tooltip' onClick={this.editingHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                      {new TZ('disableAutoSummerTimeDetect' in dataTableObject.config ? dataTableObject.config.disableAutoSummerTimeDetect : false).convertTimeStampForTimeZone(cellDataValue, dataTableObject.getTimeZoneFor(this.props.appId), "format" in this.props.columnConfig ? this.props.columnConfig.format : "YYYY-MM-DD HH:mm:ss")}
                    </span>
                      {toolTipComp}
                    </Cell>
                  }
                }

                else
                  return <Cell>
                    <span className='cell tooltip ellipse_child' title={toolTipContent} ref='tooltip' onClick={this.editingHandler} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler}>
                      {cellDataValue}
                    </span>
                    {toolTipComp}
                  </Cell>;
              }

            } else {
              if (this.props.columnConfig.indentation === true) {
                if (this.props.data[this.props.rowIndex][this.props.col].key === true
                  && this.props.data[this.props.rowIndex][this.props.col].hasOwnProperty('ibParents')
                  && this.props.data[this.props.rowIndex][this.props.col].ibParents !== null) {


                  if (this.props.data[this.props.rowIndex].hasOwnProperty('contractID') &&
                    this.props.data[this.props.rowIndex].contractID.value) {
                    if (this.state.expanded) {
                      return <Cell>
                        <span className='tooltip indentation' title={toolTipContent} onClick={this.cellHighlightHandler}>
                          {cellDataValue}
                        </span>
                        <span className='shrinkBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                        {toolTipComp}
                      </Cell>;

                    } else {
                      return <Cell>
                        <span className='tooltip indentation' title={toolTipContent} onClick={this.cellHighlightHandler}>
                          {cellDataValue}
                        </span>
                        <span className='expandBtn' id={'divExpandableBtn_' + this.props.rowIndex + '_' + this.props.appId} onBlur={this._onBlur} onClick={this.clickHandler} ref="myClickableDiv"></span>
                        {toolTipComp}
                      </Cell>;

                    }

                  } else {
                    return <Cell>
                      <span className='tooltip indentation' title={toolTipContent} onClick={this.cellHighlightHandler}>
                        {cellDataValue}
                      </span>
                      {toolTipComp}
                    </Cell>;
                  }

                } else {
                  return <Cell>
                    <span className='tooltip indentation' title={toolTipContent} onClick={this.cellHighlightHandler}>
                      <a target="_new" href={cellData['link']}>{cellDataValue}</a>
                    </span>
                    {toolTipComp}
                  </Cell>;
                }

              } else {
                return <Cell>
                  <span className='tooltip' title={toolTipContent} onClick={this.cellHighlightHandler}>
                    <a target="_new" href={cellData['link']}>{cellDataValue}</a>
                  </span>
                  {toolTipComp}
                </Cell>;
              }

            }
          }
        }
      }
    }


  }
});

module.exports = ExpandableTextCell;
