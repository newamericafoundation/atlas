var AWS = require('aws-sdk'),
	env = process.env.NODE_ENV,
	vars = require('./config_variables.json');

export default function(app) {

	AWS.config.region = vars.general['aws_availability_zone'];

	// Use Prerender if in production.
	if (env === 'production') {
		app.use(require('prerender-node')
			.set('prerenderToken', process.env['PRERENDER_TOKEN']));
	}

	return app;

}