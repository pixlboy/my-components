import InputGroupingReducer from '../../../../components/input_grouping_component/reducers/InputGroupingReducer';
describe('InputGrouping - Reducers', () => {
    it('SET_ITEMS', ()=>{
        var results =
            {
                type: "SET_ITEMS",
                payload:'test',
                textLength : 10
            }
        var newState = InputGroupingReducer({}, results );
        expect(newState.currentTextlength).toBe(4);
    });
   
});
