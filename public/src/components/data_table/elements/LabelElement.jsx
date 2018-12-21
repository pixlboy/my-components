//jshint esversion:6
import React from 'react';

var LabelElement = React.createClass({

  render() {
    let props = this.props.data;
    return (<label htmlFor={'rc-input-' + props.id} className='rc-label'>
              {props.title}
            </label>);
  }

});

module.exports = LabelElement;
