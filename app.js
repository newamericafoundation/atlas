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

// Require main server file - form this point onward, server code is written in ES6.
require('./server.js');