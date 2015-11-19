module.exports = {

	entry: './app/assets/scripts/bundle.jsx',

	output: {
		path: path.resolve('./public/assets/scripts'),
		publicPath: 'http://localhost:8081/',
		filename: 'bundle.js'
	},

	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: [ 'es2015', 'react' ]
				}
			},
			{ 
				test: /\.scss$/, 
				loaders: [ "style", "css", "sass" ]
			}
		]
	},

	plugins: [
		// new webpack.optimize.UglifyJsPlugin({
		// 	mangle: {
		// 		except: [ '$super', '$', 'exports', 'require' ]
		// 	}
		// })
	]
	
}