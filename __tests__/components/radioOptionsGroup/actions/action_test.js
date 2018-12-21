import {setRadioButtonVal, setInitialState} from '../../../../components/radioOptionsGroup/actions';
describe('RadioOptionsGroup - Actions', () => {
    it('setRadioButtonVal()', () => {
        let results = setRadioButtonVal('test');
        expect(results.type).toBe('SET_VAL');
        expect(results.payload).toBe('test');
    });
    it('setInitialState()', () => {
        let results = setInitialState('test');
        expect(results.type).toBe('SET_INITIAL_STATE');
        expect(results.payload).toBe('test');
    });
});
