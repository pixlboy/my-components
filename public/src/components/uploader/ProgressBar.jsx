let React = require( 'react' );
require( './progressBar.scss' );
let ProgressBarMixin = require( './ProgressBarMixin' );

import { ProgressBar } from 'react-mdl';

var BarItem = React.createClass( {
    render: function() {
        var file = this.props.file;
        var speed = "0 kb";
        if ( file.stats && 'readableSpeed' in file.stats )
            speed = file.stats.readableSpeed;

        return <div className='itemWrapper'>
            <div className='lineItem'>Uploading {file.file.name}</div>
            <ProgressBar progress={file.uploaded * 100} />
            <div className='lineItem'>Upload Speed: {speed}</div>
        </div>
    }
});

var UploaderProgressBar = React.createClass( {
    mixins: [ProgressBarMixin],
    render: function() {

        if ( this.state.files.length == 0 )
            return null;

        return (
            <div className='progressBarWrapper'>
                <i className="material-icons btnClose" onClick={this.close}>cancel</i>
                {this.state.files.map( function( file, idx ) {
                    return <BarItem key={idx+'_'+file.fileKey} file={file} />
                }) }
            </div> )

    }

});

module.exports = UploaderProgressBar;
