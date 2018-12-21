import RadioOptionsGroupReducer from '../../../../components/radioOptionsGroup/reducers/RadioOptionsGroupReducer';
var config = [
    {
        title: 'option1',
        value: 'value1',
        selected: false
    }, {
        title: 'option2',
        value: 'value2',
        selected: false
    }, {
        title: 'option3',
        value: 'value3',
        selected: true
    }, {
        title: 'option4',
        value: 'value4',
        selected: false
    }
];

describe('RadioOptionsGroup - Reducers', () => {
    it('SET_VAL', () => {
        let results = {
            type: "SET_VAL",
            payload: 'test'
        }
        let newState = RadioOptionsGroupReducer({}, results);
        expect(newState.value).toBe("test");
    });

    it('SET_INITIAL_STATE', () => {
        let results = {
            type: "SET_INITIAL_STATE",
            payload: config
        }
        let newState = RadioOptionsGroupReducer({}, results);
        expect(newState.value).toBe("value3");
    });

});
