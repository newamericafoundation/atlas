var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	app = express(),
	router = require('./routes/index'),
	basicAuth = require('basic-auth-connect'),
	fs = require('fs'),
	port = process.env.PORT || 8081;

// Basic configuration.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Database connection.
var db_url = {
	'dev': 'localhost',
	'prod': 'ec2-52-25-41-189.us-west-2.compute.amazonaws.com'
};
mongoose.connect('mongodb://' + db_url.prod + ':27017/mongoid', function(err) {
	if (err) { return console.dir(err); }
});

// Serve gzipped javascript if available
app.get([ '*.js' ], function(req, res, next) {
	var url = (req.url.indexOf('?') > -1) ? req.url.slice(0, req.url.indexOf('?')) : req.url,
		gzipUrl = 'public' + url + '.gz';
	// check if file exists
	fs.readFile(gzipUrl, function(err) {
		// if not, continue with unmodified response
		if (err) { return next(); }
		// change response url and encoding for gzipped files
		req.url = url + '.gz';
		res.set('Content-Encoding', 'gzip');
		console.log('Found and served gzip version for: ' + url);
		next();
	});
});

// Basic password protection.
app.use(basicAuth('nafed', 'nafed148'));

// Use router (see ./routes directory).
app.use(router);

// Start server.
app.listen(port, function(err) { 
	if(err) { return console.log(err); }
	console.log('Listening on port ' + port + '.')
});