export function removeQueryString(url) {
	if (url.indexOf('?') > -1) {
		url = url.slice(0, url.indexOf('?'))
	}
	return url
}