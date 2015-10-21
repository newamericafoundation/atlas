var AWS = require('aws-sdk');

AWS.config.region = 'us-west-2';

exports.handler = function(event, context) {

	var s3 = new AWS.S3();

	s3.listObjects({ Bucket: 'static.atlas.newamerica.org', MaxKeys: 10 }, function(err, data) {
		if (err) {
			return context.fail(err);
		}
		context.succeed(data);
	});

};