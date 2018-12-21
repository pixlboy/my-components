class RadioOptionsGroupService {

    setSelectedRadioValue(val) {
        return val;
    }

    getSelectedRadioValue(options) {
        var val = "";
        options.map((item, key) => {
            if (item.selected) {
                val = item.value;
            }
        });
        return val;
    }

    getRadioOptionTitle(val, options) {
        var selectedTitle= "";
        options.map((item, key) => {
            if (item.value == val) {
                selectedTitle = item.title;
            }
        });
        return selectedTitle;
    }
}
export default RadioOptionsGroupService;
