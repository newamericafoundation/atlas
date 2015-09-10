require('babel/register');

var express = require('express'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
	router = require('./app/routes/index'),
	fs = require('fs'),
	json2csv = require('nice-json2csv'),
	project = require('./app/models/project.js');

var app = express(),
	env = app.get('env'),
	port = process.env.PORT || 8081;

// Configure passport. Always run before initializing passport on the app instance.
require('./config/passport_config.js');

// Basic configuration.
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Use Prerender if in production.
if (env === 'production') {
	app.use(require('prerender-node')
		.set('prerenderToken', process.env['PRERENDER_TOKEN']));
}

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

// GZip serving middleware must be declared before static folder declaration. 
app.get([ '*.js' ], require('./app/middleware/serve_gzip.js'));
app.use(express.static('public'));

app.use(cookieParser());
app.use(methodOverride());
app.use(session({ 
    secret: 'Super_Big_Secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize passport.
app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: false
}));

// Use router (see ./app/routes directory).
app.use(router);

// Start server.
app.listen(port, function(err) { 
	if(err) { return console.log(err); }
	console.log('Listening on port ' + port + '.');
});