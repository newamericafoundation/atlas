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

mongoose.connect('mongodb://' + db_url.dev + ':27017/mongoid', function(err) {
	if (err) { return console.log(err); }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// serve gzip if it is available
app.get([ '*.js' ], function(req, res, next) {
	var gzipUrl = 'public' + req.url + '.gz';
	fs.readFile(gzipUrl, function(err) { 
		if (err) { return next(); }
		req.url = req.url + '.gz';
		res.set('Content-Encoding', 'gzip');
		console.log('gzip found and served for: ' + req.url)
		next();
	});
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(basicAuth('nafed', 'nafed148'));

app.use(router);

app.listen(8081);