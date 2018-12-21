import {
    tabClick
} from '../../../../components/tabbed_wrapper_comp/actions';

describe('Tabbed WrapperComp - Actions', () => {
    it('tabClick()', () => {
        var results = tabClick('test default content', 0);
        expect(results.type).toBe('TAB_CLICKED');
        expect(results.payload.content).toBe("test default content");
        expect(results.payload.tabindex).toBe(0);
    });
});
