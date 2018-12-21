import {
    cancelPopUp, setVisible
} from '../../../../components/confirmation_popup/actions';

describe('Confirmation popup Comp - Actions', () => {
    it('cancelPopUp()', () => {
        var results = cancelPopUp({title: "title here", content:"ajajajajajja", buttons:'add'});
        expect(results.type).toBe('BUTTON_CLICK');
        expect(results.payload.config.title).toBe("title here");
        expect(results.payload.config.content).toBe("ajajajajajja");
    });

    it('setVisible()', () => {
        var results = setVisible({visible: true});
        expect(results.type).toBe('SET_VISIBLE');
        expect(results.payload.visible.visible).toBe(true);
    });
});
