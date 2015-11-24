export default {

	/*
	 * Removes query string from url.
	 * @param {string} url - E.g. assets/scripts/app.js?a=b
	 * @returns {string} url - Result: assets/scripts/app.js
	 */
	removeQueryString: function(url) {
		if (url.indexOf('?') > -1) {
			url = url.slice(0, url.indexOf('?'))
		}
		return url
	}

}