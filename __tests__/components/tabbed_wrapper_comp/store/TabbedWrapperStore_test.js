import TabbedWrapperStore from '../../../../components/tabbed_wrapper_comp/store/tabbedwrapper_store';

var S = function() {
    return TabbedWrapperStore('test');
}
describe('tabbedWrapperComp - Store', () => {

    it('getState() - default', () => {
        var defaultState = S().getState();
        expect(defaultState.tabindex).toBe(0);
        expect(defaultState.content).toBe("");
    });

    it('setContent()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.tabindex).toBe(1);
            expect(state.content).toBe("set new content from store");
        });
        S().setContent('set new content from store', 1);
        l();
    });

});
