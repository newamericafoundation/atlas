var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'), 
	app = express(),
	router = require('./app/routes/index'),
	basicAuth = require('basic-auth-connect'),
	fs = require('fs'),
	port = process.env.PORT || 8081,
	config = require('./config/index.json'),
	env = app.get('env'),
	json2csv = require('nice-json2csv');

// Basic configuration.
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(json2csv.expressDecorator);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

// Connect to DB, with automatic retry after 5s.
var connectToDB = function() {
	return mongoose.connect('mongodb://' + config.dbUrl[env] + ':27017/mongoid', function(err) {
		if (err) {
			console.log('Failed to connect to database, retrying in 5s. Error:');
			console.dir(err);
			return setTimeout(connectToDB, 5000);
		}
		return console.log('Successfully connected to the database.');
	});
};
connectToDB();//

/*
 * Removes query string from url.
 * @param {string} url - E.g. assets/scripts/app.js?a=b
 * @returns {string} url - Result: assets/scripts/app.js
 */
var removeQueryString = function(url) {
	if (url.indexOf('?') > -1) {
		url = url.slice(0, url.indexOf('?'));
	}
	return url;
};

// Serve gzipped javascript if available
//   This must be declared before static routes are configured.
app.get([ '*.js' ], function(req, res, next) {
	var url, gzipUrl;
	url = req.url;
	url = removeQueryString(url);
	gzipUrl = 'public' + url + '.gz';
	// check if file exists
	fs.readFile(gzipUrl, function(err) {
		// if not, continue with unmodified response
		if (err) { return next(); }
		// change response url and encoding for gzipped files
		req.url = url + '.gz';
		res.set('Content-Encoding', 'gzip');
		console.log('Found and served gzip version for: ' + req.url);
		next();
	});
});

app.use(express.static('public'));

// Use router (see ./routes directory).
app.use(router);

// Start server.
app.listen(port, function(err) { 
	if(err) { return console.log(err); }
	console.log('Listening on port ' + port + '.')
});