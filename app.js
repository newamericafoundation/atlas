require('babel/register');

var express = require('express'),
	passport = require('passport'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    connectMongo = require('connect-mongo'),
    dbConnector = require('./db/connector.js'),
	router = require('./app/routes/index');

var app = express(),
	MongoStore = connectMongo(session),
	env = app.get('env'),
	port = process.env.PORT || 8081;

// Configure passport. Must run before initializing passport on the app instance.
require('./config/passport_config.js');


// require('./app/assets/images/utilities/icon_parser.js');

// Basic configuration.
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb', parameterLimit: 10000 }));

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

app.use(methodOverride());

dbConnector.then(function(db) {
	
	// Initialize session with database storage.
	app.use(session({
	    secret: 'Super_Big_Secret',
	    resave: false,
	    // store: new MongoStore({ db: db }),
	    // cookie: { maxAge: 1 * 3600 },
	    // collection: 'atlas_sessions',
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

});