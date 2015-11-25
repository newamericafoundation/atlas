var path = require('path'),
	webpack = require('webpack'),
	AssetsPlugin = require('assets-webpack-plugin'),
	CompressionPlugin = require('compression-webpack-plugin');

module.exports = {

	entry: './app/assets/scripts/bundle.jsx',

	output: {
		path: path.resolve('./public/assets/scripts'),
		publicPath: 'http://localhost:8081/',
		filename: 'bundle-[hash].js'
	},

	module: {
		loaders: [
			{
	            test: /\.json$/,
	            loader: 'json-loader'
	        },
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: [ 'es2015', 'react' ]
				}
			},
			{ 
				test: /\.s?css$/,
				loaders: [ "style", "css", "sass" ]
			}
		]
	},

	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: [ '$super', '$', 'exports', 'require' ]
			}
		}),
		new AssetsPlugin({ filename: 'public/assets/scripts/rev-manifest.json', fullPath: false }),
		new CompressionPlugin()
	]
	
}