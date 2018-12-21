var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  watch: true,
  //devtool: 'source-map',
  //devtool: 'cheap-module-eval-source-map', //this one is used for debuggable purpose in ngcsc, but we need to use above one to make it work in IE verticalscrolling
  entry: {
    'jnpr-vendors': path.resolve(__dirname, 'public/src/vendors.jsx'),
    'jnpr-components': path.resolve(__dirname, 'public/src/index.jsx')
  },
  
  output: {
    library: 'JnprCL',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  
  module: {
    
    noParse: [ "react","jquery", "jquery-ui/ui/core","jquery-ui/ui/resizable","jquery-ui/ui/tooltip","jquery-ui/ui/datepicker" ],
    
    loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
        test: /.jsx$/,
        exclude: [path.resolve(__dirname, '/node_modules/')],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, '/node_modules/'),
          path.resolve(__dirname, '/public/lib/')],
        loader: 'babel-loader',
        query: {
          compact: false
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
        loader: 'imports?define=>false'
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },{
	        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
	        loader: "file"
	      }]
  },
  resolve: {
    root: path.resolve('./public'),
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.scss']
  },
  externals: {
    d3: true,
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['jnpr-vendors']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
   
   
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])]
};
