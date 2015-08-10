# Ensure a client-side script is loaded.
# @param {string} globalName - Name of the global exposed by the script.
# @param {string} path - Script path on the server.
# @param {function} next - Callback.
$.fn.ensureScript = (globalName, path, next) ->
	return next() if window[globalName]?
	$.ajax
		url: path
		dataType: 'script'
		success: next