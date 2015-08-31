import fs from 'fs';

/*
 * Removes query string from url.
 * @param {string} url - E.g. assets/scripts/app.js?a=b
 * @returns {string} url - Result: assets/scripts/app.js
 */
var removeQueryString = function(url) {
	if (url.indexOf('?') > -1) {
		url = url.slice(0, url.indexOf('?'));
	}
	return url;
}; 

// Serve gzipped javascript if available
//   This must be declared before static routes are configured.
export default function(req, res, next) {
	var url, gzipUrl;
	url = req.url;
	url = removeQueryString(url);
	gzipUrl = 'public' + url + '.gz';
	// check if file exists
	fs.readFile(gzipUrl, function(err) {
		// if not, continue with unmodified response
		if (err) { return next(); }
		// change response url and encoding for gzipped files
		req.url = url + '.gz';
		res.set('Content-Encoding', 'gzip');
		console.log('Found and served gzip version for: ' + req.url);
		next();
	});
};