import Item from '../../../../components/drop_down_input_comp/entities/Item';

describe('DropDownInputComp - Entites - Item', () => {
    it('create new item', () => {
        var item = new Item({title: 'title123', value: 'value123', selected: true});
        expect(item.title).toBe('title123');
        expect(item.value).toBe('value123');
        expect(item.selected).toBe(true);

    });
});
