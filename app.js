var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	app = express(),
	router = require('./routes/index'),
	basicAuth = require('basic-auth-connect');

var db_url = {
	'dev': 'localhost',
	'prod': 'ec2-52-25-41-189.us-west-2.compute.amazonaws.com'
};

mongoose.connect('mongodb://' + db_url.dev + ':27017/mongoid', function(err) {
	if (err) { return console.log(err); }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('*.gz', function(req, res, next) {
	//res.set('Content-Encoding', 'gzip');
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(basicAuth('nafed', 'nafed148'));

app.use(router);

app.listen(8081);