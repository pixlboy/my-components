import {
    setInitialState,
    setItems,
    fitlerItems,
    setSelectedItem,
    setMultiSelectedItem,
    setDropDownStatus,
    setError
} from '../../../../components/drop_down_input_comp/actions';

describe('DropDownInputComp - Actions', () => {
    it('setInitialState()', () => {
        var results = setInitialState('test123');
        expect(results.type).toBe('SET_INITIAL_STATE');
        expect(results.payload).toBe('test123');
    });
    it('setItems()', () => {
        var results = setItems('test123');
        expect(results.type).toBe('SET_ITEMS');
        expect(results.payload).toBe('test123');
    });
    it('fitlerItems()', () => {
        var results = fitlerItems('test123');
        expect(results.type).toBe('FILTER_ITEMS');
        expect(results.payload).toBe('test123');
    });
    it('setSelectedItem()', () => {
        var results = setSelectedItem('test123');
        expect(results.type).toBe('SET_SELECTED_ITEM_VALUE');
        expect(results.payload).toBe('test123');
    });
    it('setMultiSelectedItem()', () => {
        var results = setMultiSelectedItem('test123');
        expect(results.type).toBe('SET_MULTI_SELECTED_ITEM');
        expect(results.payload).toBe('test123');
    });
    it('setDropDownStatus()', () => {
        var results = setDropDownStatus(true);
        expect(results.type).toBe('SET_DROPDOWN_STATUS');
        expect(results.payload).toBe(true);
    });
    it('setError()', () => {
        var results = setError(true);
        expect(results.type).toBe('SET_ERROR');
        expect(results.payload).toBe(true);
    });
});
