import ConfirmationPopUpComp from '../../../../components/confirmation_popup/store/confirmationpop_store';

var S = function() {
    return ConfirmationPopUpComp('test');
}
describe('confirmationpopup Comp - Store', () => {

    it('getState() - default', () => {
        var defaultState = S().getState();
        expect(defaultState.config.title).toBe("");
        expect(defaultState.config.content).toBe("");
        expect(defaultState.config.visible).toBe(false);
        expect(defaultState.config.buttons[0]).toBe(0);
        expect(defaultState.config.buttons[1]).toBe("default content");
    });

    it('setConfig()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.config.title).toBe("title here");
            expect(state.config.content).toBe("ajajajajajja");
            expect(state.config.visible).toBe(true);
            expect(state.config.buttons[0]).toBe("add");
            expect(state.config.buttons[1]).toBe("cancel");
        });
        S().setConfig({title: "title here", content:"ajajajajajja", buttons:['add', 'cancel'], visible:true});
        l();
    });


    it('setVisible()', () => {
        var l = S().subscribe(() => {
            var state = S().getState();
            expect(state.config.visible).toBe(true);
        });
        S().setVisible({visible:true});
        l();
    });


});
