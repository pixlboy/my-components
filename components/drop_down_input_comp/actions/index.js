import * as actionType from './ActionType';

export const setInitialState = function(options) {
    return {type: actionType.SET_INITIAL_STATE, payload: options}
}

export const setItems = function(items) {
    return {type: actionType.SET_ITEMS, payload: items}
}

export const fitlerItems = function(term) {
    return {type: actionType.FILTER_ITEMS, payload: term}
}

export const setSelectedItem = function(value) {
    return {type: actionType.SET_SELECTED_ITEM_VALUE, payload: value}
}

export const setMultiSelectedItem = function(item) {
    return {type: actionType.SET_MULTI_SELECTED_ITEM, payload: item}
}

export const setDropDownStatus = function(open) {
    return {type: actionType.SET_DROPDOWN_STATUS, payload: open}
}

export const setError = function(bWrong) {
    return {type: actionType.SET_ERROR, payload: bWrong}
}

export const setDisabled = function(disabled){
    return {type: actionType.SET_DISABLED, payload: disabled}
}
