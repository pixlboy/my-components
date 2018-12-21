import DropDownInputStore from '../../../../components/drop_down_input_comp/store/DropDownInputStore';
import DropDownService from '../../../../components/drop_down_input_comp/services/DropDownInputService';

var config = [
    {
        title: 'option1',
        value: 'value1'
    }, {
        title: 'option2',
        value: 'value2'
    }, {
        title: 'option3',
        value: 'value3'
    }, {
        title: 'option4',
        value: 'value4'
    }
];
var getItems = function() {
    var s = new DropDownService();
    return s.getItems(config);
}
var S = function() {
    return DropDownInputStore('test');
}
describe('DropDownInputComp - Store', () => {

    it('getState() - default', () => {
        var defaultState = S().getState();
        expect(defaultState.originalItems.length).toBe(0);
        expect(defaultState.items.length).toBe(0);
        expect(defaultState.selectedItem).toBe(null);
        expect(defaultState.showDropDown).toBe(false);
        expect(defaultState.searchTerm).toBe("");
        expect(defaultState.error).toBe(false);
    });
    it('setInitialState() - no preselected', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(4);
            expect(state.selectedItem).toBe(null);
            expect(state.searchTerm).toBe("");
        });
        S().setInitialState(config);
        l();
    });
    it('setInitialState() - yes preselected', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(4);
            expect(state.selectedItem).toBe(null);
            expect(state.searchTerm).toBe("option1,option2");
        });
        var configs = JSON.parse(JSON.stringify(config));
        configs[0].selected = true;
        configs[1].selected = true;
        S().setInitialState(configs);
        l();
    });
    it('filterItems()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(1);
            expect(state.items[0].value).toBe('value3');
        });
        S().filterItems('option3');
        l();
        l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(0);
        });
        S().filterItems('abc');
        l();
    });
    it('setSelectedItemValue()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(4);
            expect(state.items[2].selected).toBe(true);
            expect(state.selectedItem.value).toBe('value3');
        });
        S().setSelectedItemValue('value3');
    });
    it('setMultiSelectedItem()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.originalItems.length).toBe(4);
            expect(state.items.length).toBe(4);
            expect(state.items[0].selected).toBe(true);
        });
        S().setMultiSelectedItem(S().getState().items[0]);
    });

});
