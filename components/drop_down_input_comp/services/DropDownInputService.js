import Item from '../entities/Item';

class DropDownService {
    getItems(itemList) {
        var lists = [];
        itemList.forEach(item => {
            lists.push(new Item(item));
        });
        return lists;
    }

    filterItems(items, term) {
        return items.filter(item => {
            return item.title.toLowerCase().indexOf(term.toLowerCase()) === 0 || item.value.toLowerCase().indexOf(term.toLowerCase()) === 0
        });
    }

    updateSelectedItem(items, value) {
        var selectedItem = null;
        items.forEach(item => {
            if (item.value == value) {
                item.selected = true;
                selectedItem = item;
            } else {
                item.selected = false;
            }
        });
        return {items: items, selectedItem: selectedItem};
    }

    updateMultiSelectedItem(items, item) {
        var selectedTerms = [];
        items.forEach(i => {
            if (i.value == item.value) {
                i.selected = !i.selected;
            }
            if (i.selected) {
                selectedTerms.push(i.title);
            }
        });
        return {items: items, selectedTerm: selectedTerms.join(",")};
    }

    getSelectedItems(items) {
        return items.filter(item => item.selected);
    }

    getSelectedItemValues(items) {
        return this.getSelectedItems(items).map(item => item.value).join(",");
    }

    getSelectedItemTitles(items) {
        return this.getSelectedItems(items).map(item => item.title).join(",");
    }

    _debounce(cb) {
        if (!this._functions) {
            this._functions = [];
        }
        this._functions.push(cb);

        if (!this._timeIds) {
            this._timeIds = [];
        }
        var _this = this;
        this._timeIds.push(setTimeout(function() {
            //when timeout happened, we need to run last function
            _this._functions.pop()();
            _this._functions = [];
            //and clear all the timeout
            _this._timeIds.forEach(function(timeId) {
                clearTimeout(timeId);
            });
        }, 500));
    }

}

module.exports = DropDownService;
