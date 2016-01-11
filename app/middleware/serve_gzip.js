import fs from 'fs'

import utilities from './utilities.js'

var { removeQueryString } = utilities

/*
 * Serve gzipped JavaScript if available.
 * This middleware will not work if used before static routes are configured on express.
 */
export default function serveGzipMiddleware(req, res, next) {
	var { url } = req, gzipUrl
	url = removeQueryString(url)
	gzipUrl = 'public' + url + '.gz'
	// Check if file exists.
	fs.readFile(gzipUrl, function(err) {
		// If file does not exist, continue with unmodified response
		if (err) { return next() }
		// If the file does exist, hange response url and encoding for gzipped file
		req.url = url + '.gz'
		res.set('Content-Encoding', 'gzip')
		console.log('Found and served gzip version for: ' + req.url)
		next()
	})
}