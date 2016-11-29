import express from 'express'
import passport from 'passport'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import connectMongo from 'connect-mongo'

import dbConnector from './db/connector.js'
import router from './app/routes/index.js'
import serveGzipMiddleware from './app/middleware/serve_gzip.js'

const app = express()
const MongoStore = connectMongo(session)
const { NODE_ENV, PORT, PRERENDER_TOKEN } = process.env

app.set('views', __dirname + '/app/views')
app.set('view engine', 'jade')

require('./config/passport_config.js')

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000 }))

app.get([ '*.js', '*.json' ], serveGzipMiddleware)

app.use(express.static('public'))

app.use(methodOverride())
app.use(cookieParser())

function startServer(db) {
	app.use(session({
	    secret: 'Super_Big_Secret',
	    httpOnly: true,
	    saveUninitialized: false,
	    resave: true,
	    store: new MongoStore({
	    	db: db,
	    	collection: 'sessions',
	    	stringify: false
	    }),
	    cookie: { maxAge: 1 * 3600 * 1000 * 24 * 5 }
	}))
	app.use(passport.initialize())
	app.use(passport.session({
		resave: true,
		saveUninitialized: false
	}))
	app.use(function(req, res, next) {
		req.db = db
		next()
	})
	app.use(router)
	app.listen(PORT, function(err) {
		if(err) { return console.log(err) }
		console.log(`Listening on port ${PORT}.`)
	})
}

dbConnector.then(startServer)
