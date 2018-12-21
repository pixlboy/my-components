let JnprTestInputComp = require('./components/test_component2/testInputComp');
let JnprDataTable = require('./components/data_table/JnprDataTable');
let JnprDataTableNgcsc = require('./components/data_table/JnprDataTableNgcsc');

let JnprDataTableNgcscPlain = require('./components/data_table/JnprDataTableNgcscPlain');
let JnprDataTableJtwb = require('./components/data_table/JnprDataTableJtwb');
let JnprDataTableObjectFactory = require('./components/data_table/data_object/DataTableObjectFactory');

let JnprWidgetChooser = require('./components/widget_chooser/JnprWidgetChooser');
let JnprWidgetChooserObjectFactory =  require('./components/widget_chooser/data_object/WidgetChooserObject');

let JnprDropDownComp = require('./components/drop_down_list/SelectComp');
let JnprInputBoxComp = require('./components/input_box/InputBoxComp');

let Uploader =  require('./components/uploader/Uploader');
let UploaderProgressBar =  require('./components/uploader/ProgressBar');
let UploaderDataObjectFactory =  require('./components/uploader/DataObjectFactory');

let AutoComplete = require('./components/auto_complete/AutoCompleteComp');
let i18nFactory = require('./components/i18n/i18n');
let NavigatorComp = require('./components/navigator/NavigatorComp');
let NavigatorStoreFactory = require('./components/navigator/Store');

let TabbedWrapperStore = require('../../components/tabbed_wrapper_comp/store/tabbedwrapper_store');

let ConfirmationPopUpStore = require('../../components/confirmation_popup/store/confirmationpop_store');

import RudexTestComponents from '../../components/redux_test_comp/RudexTestComp';
import RudexTestComponentStore from '../../components/redux_test_comp/store/Store';

import DropDownInputComp from '../../components/drop_down_input_comp/DropDownInputComp';
import DropDownInputAppendCompSingle from '../../components/drop_down_input_comp/DropDownInputAppendCompSingle';
import DropDownInputAppendCompMulti from '../../components/drop_down_input_comp/DropDownInputAppendCompMulti';

import getDropDownInputStore from '../../components/drop_down_input_comp/store/DropDownInputStore';

import FileSelector from '../../components/file_selector/FileSelectorComp';
import XLSFileSelectorReader from '../../components/xls_file_selector_reader/XLSFileSelectorReader';
import getFileSelectorStore from '../../components/file_selector/store/FileSelectorStore';

import SimplifiedDataGrid from '../../components/simplified_data_grid/SimplifiedDataGrid'
import CloseButton from '../../components/common/close_button/CloseButton';
import ExportComponent from '../../components/common/export_component/ExportComponent';
import ExportService from '../../components/common/export_component/ExportService';

import DatePicker from '../../components/common/date_picker/DatePicker';
import DatePickerStore from '../../components/common/date_picker/DatePickerStore';
import JnprCheckBox from '../../components/common/checkbox/CheckBox';
import JnprCheckBoxStore from '../../components/common/checkbox/CheckBoxStore';


import TabbedWrapperComp from '../../components/tabbed_wrapper_comp/tabbedwrapperComp';
import InputGrouping from '../../components/input_grouping_component/InputGroupingComp';
import RadioOptionsGroup from '../../components/radioOptionsGroup/RadioOptionsGroupComp';
import ConfirmationPopUpComp from '../../components/confirmation_popup/ConfirmationPopUpComp';

import LoadingSpinnerComp from '../../components/common/loading_spinner/LoadingSpinnerComp';
import LiveSearch from '../../components/live-search/LiveSearch'

require('./lib/polyfills/polyfills.js');

require('./lib/css/jnpr-material.css');
require('./lib/css/jnpr-material-fix.css');
require('./lib/css/material-design-font.css');

var comps = {
    JnprTestInputComp: JnprTestInputComp,

    JnprDataTable: JnprDataTable,
    JnprDataTableNgcsc: JnprDataTableNgcsc,
    JnprDataTableNgcscPlain: JnprDataTableNgcscPlain,
    JnprDataTableJtwb: JnprDataTableJtwb,
    JnprDataTableObjectFactory: JnprDataTableObjectFactory,

    JnprWidgetChooser: JnprWidgetChooser,
    JnprWidgetChooserObjectFactory:JnprWidgetChooserObjectFactory,

    JnprDropDownComp:JnprDropDownComp,
    JnprInputBoxComp: JnprInputBoxComp,

    JnprUploader: Uploader,
    JnprUploaderProgressBar: UploaderProgressBar,
    JnprUploaderDataObjectFactory: UploaderDataObjectFactory,

    AutoComplete:AutoComplete,

    I18NFactory: i18nFactory,
    NavigatorComp: NavigatorComp,
    NavigatorStoreFactory: NavigatorStoreFactory,

    RudexTestComponents: RudexTestComponents,
    RudexTestComponentStore: RudexTestComponentStore,

    DropDownInputComp: DropDownInputComp,
    DropDownInputAppendCompSingle:DropDownInputAppendCompSingle,
    DropDownInputAppendCompMulti:DropDownInputAppendCompMulti,

    DropDownInputCompStore:getDropDownInputStore,

    FileSelector: FileSelector,
    XLSFileSelectorReader: XLSFileSelectorReader,
    FileSelectorStore:getFileSelectorStore,

    SimplifiedDataGrid: SimplifiedDataGrid,
    CloseButton: CloseButton,
    ExportComponent: ExportComponent,
    ExportService: ExportService,
    DatePicker: DatePicker,
    DatePickerStore: DatePickerStore,

    TabbedWrapperComp: TabbedWrapperComp,
    TabbedWrapperStore: TabbedWrapperStore,
    CheckBox: JnprCheckBox,
    CheckBoxStore: JnprCheckBoxStore,
    InputGrouping: InputGrouping,
    RadioOptionsGroupComp: RadioOptionsGroup,

    ConfirmationPopUpComp:ConfirmationPopUpComp,
    ConfirmationPopUpStore: ConfirmationPopUpStore,

    LoadingSpinner: LoadingSpinnerComp,
    LiveSearch: LiveSearch
};

var components = require('./components.json');
Object.keys(components).forEach(key=>{
    if(!components[key]){
        delete( comps[key] );
    }
});

module.exports = comps;
