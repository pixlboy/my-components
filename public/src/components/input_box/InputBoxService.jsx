class InputBoxService {
    constructor() {
        this._blocks = [];
        this._inputStr = '';
        this.acceptSpace = false;
    }

    setInput(inputStr, acceptSpace) {
        this.acceptSpace = acceptSpace;
        if (inputStr != null && inputStr != undefined && inputStr.length > 0)
            this._inputStr = inputStr;
        this._process();
    }

    getBlocks(initial) {
        //this is to get all the blocks, used for initial set
        if (initial) {
            if (this._blocks.length < 1) {
                return [];
            }else {
                return this._blocks;
            }
        } else {
            //otherwise, we should not give back all blocks, this is used for keep user typing
            if (this._blocks.length <= 1) {
                return [];
            }
            else {
                var tmpArray = [];
                var length = this._blocks.length;
                for (var i = 0; i < length; i++) {
                    tmpArray.push(this._blocks[i].trim());
                }
                return tmpArray;
            }
        }
    }

    getRemainingStr() {
        if(this.acceptSpace){
            return "";
        }

        if (this._blocks.length <= 1) {
            return this._inputStr;
        }else {
            return "";
        }
    }

    getOriginalInput() {
        return this._inputStr;
    }

    getFormattedInput() {
        return this._blocks
            .filter(block => {
                return block != '';
            })
            .join(',');
    }

    deleteBlock(block) {
        for (var i = 0; i < this._blocks.length; i++) {
            if (this._blocks[i] === block) {
                this._blocks.splice(i, 1);
                this._inputStr = this._blocks.join(',');
                break;
            }
        }

        return this.getBlocks(true);
    }

    //method used to process input
    _process() {
        let blocks = [];
        if(this.acceptSpace){
            blocks = this._inputStr.split(/[,;]/);
            for (var i = blocks.length - 1; i >= 0; i--) {
                blocks[i] = blocks[i].trim();
            }
            this._blocks = Array.from(new Set(blocks));
        }else{
            blocks = this._inputStr.split(/[,;\s]/);
            this._blocks = Array.from(new Set(blocks));
        }
    }
}
module.exports = InputBoxService;
