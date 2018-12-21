import * as actionType from '../actions/ActionType';
import DropDownService from '../services/DropDownInputService';

const dropDownInputReducers = (state = {}, action) => {
    let newState;
    let service = new DropDownService();
    switch (action.type) {

        case actionType.SET_INITIAL_STATE:
            var items = service.getItems(action.payload);
            var searchTerm = service.getSelectedItemTitles(items);
            var selectedItems = service.getSelectedItems(items);
            newState = Object.assign({}, state, {
                items: items,
                originalItems: items,
                selectedItem: selectedItems.length == 1
                    ? selectedItems[0]
                    : null,
                searchTerm: searchTerm
            });
            break;

        case actionType.SET_ITEMS:
            newState = Object.assign({}, state, {
                items: action.payload,
                selectedItem: null
            });
            break;

        case actionType.SET_DROPDOWN_STATUS:
            newState = Object.assign({}, state, {showDropDown: action.payload});
            break;

        case actionType.FILTER_ITEMS:
            newState = Object.assign({}, state, {
                items: service.filterItems(state.originalItems, action.payload),
                selectedItem: null,
                searchTerm: action.payload,
                error: false //whenever we start filtering, we need to hide the error style
            });
            break;

        case actionType.SET_SELECTED_ITEM_VALUE:
            var results = service.updateSelectedItem(state.originalItems, action.payload);
            newState = Object.assign({}, state, {
                items: results.items,
                selectedItem: results.selectedItem,
                showDropDown: false,
                searchTerm: results.selectedItem?results.selectedItem.title:'',
                error: false //whenever we start filtering, we need to hide the error style
            });
            break;

        case actionType.SET_MULTI_SELECTED_ITEM:
            var results = service.updateMultiSelectedItem(state.originalItems, action.payload);
            newState = Object.assign({}, state, {
                items: results.items,
                searchTerm: results.selectedTerm
            });
            break;

        case actionType.SET_ERROR:
            newState = Object.assign({}, state, {error: action.payload});
            break;
        case actionType.SET_DISABLED:
            newState = Object.assign({}, state, {disabled: action.payload});
            break;
        default:
            newState = Object.assign({}, state);
    }
    return newState;
}

export default dropDownInputReducers;
