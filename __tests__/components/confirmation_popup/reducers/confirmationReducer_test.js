import confirmationpopReducer from '../../../../components/confirmation_popup/reducers/confirmationpopReducer';
import { cancelPopUp, setVisible } from '../../../../components/confirmation_popup/actions';
describe('Confirmation popup Comp - Reducers', () => {
    it('BUTTON_CLICK', ()=>{
        var results = cancelPopUp({config:"", title: "title here", content:"ajajajajajja", buttons:'add'});
        var newState = confirmationpopReducer({}, results );
        expect(newState.config.content).toBe('ajajajajajja');
        expect(newState.config.title).toBe('title here');
        expect(newState.config.buttons).toBe('add');
    });

    it('setVisible()', () => {
        var results = setVisible({visible: true});
        var newState = confirmationpopReducer({}, results)
        expect(newState.visible.visible).toBe(true);
    });

});
