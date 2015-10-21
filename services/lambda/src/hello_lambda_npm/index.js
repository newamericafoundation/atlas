var request = require('request');

exports.handler = function(event, context) {

	request('http://www.google.com', function (err, response, body) {
		if (err) { return context.fail('cannot reach page'); }
	  	context.succeed(body);
	});

}