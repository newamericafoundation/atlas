// Entry point to the app.
// To keep consistency among other projects that work off the boilerplate, do not modify this file.
// Instead, add project-specific configurations under ./config/app/custom.js.

// Allow ES6 syntax in all required files.
require('babel/register');

var express = require('express'),
	passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    connectMongo = require('connect-mongo'),
    dbConnector = require('./db/connector.js'),
	router = require('./app/routes/index.js');

var appConfig = require('./config/app/variables.json');

var env = process.env.NODE_ENV,
	app = express(),
	MongoStore = connectMongo(session),
	port = process.env.PORT || 8081;

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

// Configure passport. Must run before initializing passport on the app instance.
require('./config/passport_config.js');

// Basic configuration.
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));

// GZip serving middleware must be declared before static folder declaration. 
app.get([ '*.js' ], require('./app/middleware/serve_gzip.js'));

app.use(express.static('public'));

app.use(methodOverride());
app.use(cookieParser());

// Load custom configuration.
require('./config/app/custom.js')(app);

dbConnector.then(function(db) {
	
	// Initialize session with database storage.
	app.use(session({
	    secret: 'Super_Big_Secret',
	    saveUninitialized: false,
	    resave: true,
	    store: new MongoStore({ 
	    	db: db,
	    	collection: 'atlas_sessions',
	    	stringify: false
	    }),
	    cookie: { maxAge: 1 * 3600 * 1000 }
	}));

	// Initialize passport.
	app.use(passport.initialize());
	app.use(passport.session({
		resave: true,
		saveUninitialized: false
	}));

	app.use(function(req, res, next) {
		req.db = db;
		next();
	});

	// Use router (see ./app/routes directory).
	app.use(router);

	// Start server.
	app.listen(port, function(err) { 
		if(err) { return console.log(err); }
		console.log('Listening on port ' + port + '.');
	});

});