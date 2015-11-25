// Entry point to the app.

// Allow ES6 syntax in all required files.
require('babel-core/register');

var NODE_ENV = process.env['NODE_ENV']

// Try loading development environment variables.
if (NODE_ENV !== 'production') {
	var dotenv;
	try {
		dotenv = require('dotenv');
		dotenv.load();
	} catch(err) {
		console.log(err);
	}
}

require('./server.js');