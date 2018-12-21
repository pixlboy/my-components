let React = require('react');
require('./inputbox.scss');
let InputBoxMixin = require('./InputBoxMixin');
import { Chip } from 'react-mdl';
import ClassNames from 'classnames';

var InputBoxDom = React.createClass({
    mixins: [InputBoxMixin],
    renderBlocks: function() {
        return (
            <div className="blocksContent">
                {this.state.blocks.map(
                    function(block) {
                        if (block != '')
                            return (
                                <Chip
                                    key={block}
                                    onClose={e => this.deleteBlock(block)}>
                                    {block}
                                </Chip>
                            );
                    }.bind(this)
                )}
            </div>
        );
    },
    render: function() {
        let buttonClass = ClassNames(
            `nxcsc-cm-buttons add-button ${this.props.buttonType || ""}`
        );
        return (
            <div className="inputBoxWrapper">
                {this.props.blocksBelowInput ? null : this.renderBlocks()}
                <div className="leftOverContent">
                    <input
                        placeholder={this.props.placeholder}
                        //value={this.state.remainingStr}
                        onMouseDown={this.mouseDown}
                        onKeyUp={this.keyDown}
                        ref="myInput"
                        maxLength={this.props.maxLength || ""}
                    />
                    {this.props.showAddButton ? (
                        <button
                            className={buttonClass}
                            onClick={() => this.keyDown('buttonClick')}
                        >
                            {this.props.buttonText}
                        </button>
                    ) : null}
                </div>
                {this.props.blocksBelowInput ? this.renderBlocks() : null}
            </div>
        );
    }
});

module.exports = InputBoxDom;
