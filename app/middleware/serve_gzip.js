import fs from 'fs'

import utilities from './utilities.js'

var { removeQueryString } = utilities

// Serve gzipped JavaScript if available.
// This middleware will not work if used before static routes are configured on express.
export default function serveGzipMiddleware(req, res, next) {
	var { url } = req, gzipUrl
	url = removeQueryString(url)
	gzipUrl = 'public' + url + '.gz'
	// check if file exists
	fs.readFile(gzipUrl, function(err) {
		// if not, continue with unmodified response
		if (err) { return next() }
		// change response url and encoding for gzipped files
		req.url = url + '.gz'
		res.set('Content-Encoding', 'gzip')
		// res.set('Cache-Control', 'public, max-age=3600')
		console.log('Found and served gzip version for: ' + req.url)
		next()
	})
}