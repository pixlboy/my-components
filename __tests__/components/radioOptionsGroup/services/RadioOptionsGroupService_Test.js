import RadioOptionsGroupService from '../../../../components/radioOptionsGroup/services/RadioOptionsGroupService';
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

describe('RadioOptionsGroup - Services', () => {
    let service = new RadioOptionsGroupService();

    it('selectRadioOption()', () => {
        let val = service.setSelectedRadioValue(config[0].value);
        expect(val).toBe("value1");
    });

    it('getSelectedRadioValue()', () => {
        let val = service.getSelectedRadioValue(config);
        expect(val).toBe("value3");
    });

    it('getRadioOptionTitle()', () => {
        let title = service.getRadioOptionTitle('value4', config);
        expect(title).toBe("option4");
    });

});
