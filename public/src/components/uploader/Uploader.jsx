let React = require( 'react' );
require( './uploader.scss' );

let UploaderMixin = require( './UploaderMixin' );
import { ProgressBar } from 'react-mdl';
var Uploader = React.createClass( {
    mixins: [UploaderMixin],
    render: function() {

        var errorsDiv = null;
        var btnClass = null;

        if ( this.state.errors.length > 0 ) {
            errorsDiv = <div className='errors'>
                Errors:
                <ul>
                    {this.state.errors.map( error => {
                        return <li key={error}>- {error}</li>
                    }) }
                </ul>
            </div>
        }

        if(this.props.disableButton) {
            btnClass = "nxcsc-cm-buttons btnDisabled";
        } else {
            btnClass = "nxcsc-cm-buttons";
        }

        return <div className='jnprUploader'>
            <input type="file" ref={"SelectFile_" + this.props.appId}
                style={{ display: 'none' }} onChange={this._fileSelected}
                multiple={! this.props.singleFileUpload } />
            <button className={btnClass} onClick={this._openAttach} dangerouslySetInnerHTML={{__html : this.props.btnText || "Attach File(s)"}} />
            {errorsDiv}
        </div>;
    }

});

module.exports = Uploader;
