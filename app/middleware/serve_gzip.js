import fs from 'fs'

import { removeQueryString } from './utilities.js'

/*
 * Serve gzipped JavaScript if available. 
 * Note: This middleware will not work if used before static routes are configured in Express.
 */
export default function serveGzipMiddleware(req, res, next) {
	var { url } = req
	url = removeQueryString(url)
	var gzipUrl = `public${url}.gz`
	// Check if file exists.
	fs.readFile(gzipUrl, function(err) {
		// If file does not exist, continue with unmodified response
		if (err) { return next() }
		// If the file does exist, hange response url and encoding for gzipped file
		req.url = `${url}.gz`
		res.set('Content-Encoding', 'gzip')
		console.log(`Found and served gzip version for: ${req.url}`)
		next()
	})
}