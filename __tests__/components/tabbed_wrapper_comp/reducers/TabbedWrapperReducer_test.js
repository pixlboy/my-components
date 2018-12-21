import TabbedWrapperReducer from '../../../../components/tabbed_wrapper_comp/reducers/tabbedwrapperReducer';
import { tabClick } from '../../../../components/tabbed_wrapper_comp/actions';
describe('TabbedWrapperComp - Reducers', () => {
    it('TAB_CLICKED', ()=>{
        var results = tabClick('DEfault content from Reducer', 0);
        var newState = TabbedWrapperReducer({}, results );
        expect(newState.tabindex).toBe(0);
        expect(newState.content).toBe('DEfault content from Reducer');
    });

});
