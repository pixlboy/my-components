describe('mocks test', () => {
    it('mocking js', () => {
        expect(true).toBe(true);
    });
});

module.exports = {
    getNavigatorItemsMock: function(){

        var options = [
            {
                title: "step1",
                active: true
            },
            {
                title: "step2",
                active: true
            },
            {
                title: "step3",
                active: false
            },
            {
                title: "step4",
                active: false
            }
        ];

        return options;
    }
}
