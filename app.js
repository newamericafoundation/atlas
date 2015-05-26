var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	app = express(),
	router = require('./routes/index'),
	basicAuth = require('basic-auth-connect'),
	fs = require('fs');

var db_url = {
	'dev': 'localhost',
	'prod': 'ec2-52-25-41-189.us-west-2.compute.amazonaws.com'
};

mongoose.connect('mongodb://' + db_url.prod + ':27017/mongoid', function(err) {
	if (err) { return console.dir(err); }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Serve gzip if it is available
app.get([ '*.js' ], function(req, res, next) {
	var gzipUrl = 'public' + req.url + '.gz';
	fs.readFile(gzipUrl, function(err) { 
		if (err) { return next(); }
		req.url = req.url + '.gz';
		res.set('Content-Encoding', 'gzip');
		console.log('Found and served gzip version for: ' + req.url)
		next();
	});
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(basicAuth('nafed', 'nafed148'));

app.use(router);

app.listen(8081, function(err) { 
	if(err) { return console.log(err); }
	console.log('Listening on port 8081.')
});