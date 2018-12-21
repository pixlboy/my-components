let React = require( 'react' );
require( './dropdown.scss' );
let SelectMixin = require( './SelectMixin' );
let ClassNames = require( 'classnames' );
import { Checkbox, Radio, RadioGroup } from 'react-mdl';

var CheckOption = React.createClass( {
   _check: function(e){
       this.props.changeCheckbox(this.props.item,  e.target.checked);
   },
   render: function(){
       return <Checkbox
       label={this.props.item.title}
       checked={this.props.item.selected}
       onChange={this._check}
       />
   }
});


var SelectComp = React.createClass( {

    mixins: [SelectMixin],

    defaultProps: {
        singleSelect: true
    },

    render: function() {

        var rows = null;
       if(this.state.showDropDown){
            var options = [];

            if(this.state.options.length==0){
                rows = <ul><li>No Items Found</li></ul>
            }else{
                this.state.options.forEach( (item, index) => {
                    if ( this.props.singleSelect ){
                       let classNames = ClassNames({singleItem: true, selected: this.state.selectedValue===item.value  });
                       options.push( <div key={index} value={item.value} className={classNames} onClick={this.selectSingleItem} >{item.title}</div> );
                    }
                    else
                        options.push( <li key={index}><CheckOption item={item} changeCheckbox={this.changeCheckbox} /></li> );
                });
                if ( this.props.singleSelect ) {
                    rows = <div className='singleSelectWrapper'>{options}</div>
                } else {
                    rows = <ul>{options}</ul>
                }
            }
        }

        var classNames = 'jnprDropDown ' + this.props.appId;

        return (
            <div className={classNames}>
                <div className={ClassNames({title: true, open: this.state.showDropDown })} onClick={this.toggleDropDown}>
                    <div className='content'>
                        {this.state.seletedTitles}
                    </div>
                </div>
                <div className='dropdownWrapper'>
                    {rows}
                </div>
            </div>
        );
    }

});

module.exports = SelectComp;
