var path = require('path'),
	webpack = require('webpack');

module.exports = {

	entry: './app/assets/scripts/bundle.jsx',

	output: {
		path: path.resolve('./public/assets/scripts'),
		publicPath: 'http://localhost:8081/',
		filename: 'bundle.js',
		sourceMapFilename: 'bundle.js.map'
	},

	module: {
		loaders: [
			{
				test: /\.png/,
				loader: 'url?limit=1000'
			},
			{
	            test: /\.json$/,
	            loader: 'json-loader'
	        },
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: [ 'es2015', 'react' ]
				}
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

	plugins: []
	
}