import { setItems } from '../../../../components/input_grouping_component/actions';

describe('FileSelector - Actions', () => {
    it('setItems()', () => {
        var results = setItems('test', 10);
        expect(results.type).toBe('SET_ITEMS');
        expect(results.payload).toBe('test');
        expect(results.maxTextLength).toBe(10);
    });
});
