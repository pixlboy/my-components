let React = require('react');

var SaveButtonConfigConfirm =  React.createClass({
  render: function(){
    return (
    <div className='divSaveBtnConfirm' >
    <p>
    All your applied filters will be lost, do you want to save them?
    </p>
    <input type='text'/>
    </div>
    );
  }
});

module.exports = SaveButtonConfigConfirm;