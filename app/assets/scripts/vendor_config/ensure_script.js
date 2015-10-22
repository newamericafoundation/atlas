// Ensure a client-side script is loaded.
// @param {string} globalName - Name of the global exposed by the script.
// @param {string} path - Script path on the server.
// @param {function} next - Callback.
$.fn.ensureScript = function(globalName, path, next) {
	
	if (window[globalName]) {
		return next();
	}

	$.ajax({
		url: path,
		contentType: 'text/javascript; charset=utf-8',
		dataType: 'script',
		success: next
	});

};