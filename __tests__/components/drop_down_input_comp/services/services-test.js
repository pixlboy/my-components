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

describe('DropDownInputComp - Services', () => {
    it('getItems()', () => {
        var s = new DropDownService();
        var lists = s.getItems(config);
        expect(lists.length).toBe(4);
        for (var i = 0; i < lists.length; i++) {
            expect(lists[i].title).toBe('option' + (i + 1));
            expect(lists[i].value).toBe('value' + (i + 1));
            expect(lists[i].selected).toBe(false);
        }
    });

    it('filterItems()', () => {
        var s = new DropDownService();
        var items = s.getItems(config);
        expect(items.length).toBe(4);
        var filteredItems = s.filterItems(items, 'value3');
        expect(filteredItems.length).toBe(1);
        expect(filteredItems[0].title).toBe('option3');
        var filteredItems = s.filterItems(items, 'option');
        expect(filteredItems.length).toBe(4);
    });

    it('updateSelectedItem()', () => {
        var s = new DropDownService();
        var items = s.getItems(config);
        expect(items.length).toBe(4);

        var results = s.updateSelectedItem(items, 'value4');
        expect(results.items.length).toBe(4);
        expect(results.selectedItem.title).toBe('option4');
        expect(results.selectedItem.value).toBe('value4');
        expect(results.selectedItem.selected).toBe(true);

        for (var i = 0; i < results.length - 1; i++) {
            expect(results[i].title).toBe('option' + (i + 1));
            expect(results[i].value).toBe('value' + (i + 1));
            expect(results[i].selected).toBe(false);
        }
    });

    it('updateMultiSelectedItem()', () => {
        var s = new DropDownService();
        var items = s.getItems(config);
        expect(items.length).toBe(4);

        items[0].selected = true;
        items[1].selected = true;

        var results = s.updateMultiSelectedItem(items, items[1]);
        expect(results.items.length).toBe(4);
        expect(results.selectedTerm).toBe('option1');
        expect(results.items[1].selected).toBe(false);

        results = s.updateMultiSelectedItem(items, items[1]);
        expect(results.items.length).toBe(4);
        expect(results.selectedTerm).toBe('option1,option2');
        expect(results.items[1].selected).toBe(true);

    });

    it('getSelectedItemValues()', () => {
        var s = new DropDownService();
        var items = s.getItems(config);
        expect(items.length).toBe(4);

        items[0].selected = true;
        items[1].selected = true;

        expect(s.getSelectedItemValues(items)).toBe('value1,value2');
    });

    it('getSelectedItemTitles()', () => {
        var s = new DropDownService();
        var items = s.getItems(config);
        expect(items.length).toBe(4);

        items[0].selected = true;
        items[1].selected = true;

        expect(s.getSelectedItemTitles(items)).toBe('option1,option2');
    });

});
