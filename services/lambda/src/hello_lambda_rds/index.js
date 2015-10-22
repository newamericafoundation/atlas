var pg = require('pg');
var secretEnv = require('./rds_connect.json');

var connectPath = "postgres://" + secretEnv.RDS_USERNAME + 
	":" + secretEnv.RDS_PASSWORD + 
	"@" + secretEnv.RDS_HOSTNAME + 
//	":" + secretEnv.RDS_PORT + 
	"/" + secretEnv.RDS_DB_NAME;

exports.handler = function(event, context) {

	var client = new pg.Client(connectPath);

	client.connect(function(err) {
		if (err) { return context.fail(err); }
		context.succeed('connect');
		client.end();
	});

	// pg.connect(connectPath, function(err, client, done) {

	// 	if (err) {
	// 		return context.fail(err);
	// 	}

	// 	context.succeed('Connected to RDS database.');

	// });

}