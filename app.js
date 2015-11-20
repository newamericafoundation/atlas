// Entry point to the app.

// Allow ES6 syntax in all required files.
require('babel-core/register');

// Try loading development environment variables.
if (process.env['NODE_ENV'] !== 'production') {
	var dotenv;
	try {
		dotenv = require('dotenv');
		dotenv.load();
	} catch(err) {
		console.log(err);
	}
}

require('./server.js');