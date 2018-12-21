var fields = ['title', 'value', 'selected'];

class Item {
    constructor(obj) {
        fields.forEach(key => {
            if (key == 'selected') {
                if ('selected' in obj)
                    this['selected'] = obj.selected;
                else
                    this['selected'] = false;
                }
            else {
                if (key in obj) {
                    this[key] = obj[key];
                }
            }
        });
    }
}

export default Item;
