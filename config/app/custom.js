var env = process.env.NODE_ENV;

export default function(app) {

	// Use Prerender if in production.
	if (env === 'production') {
		app.use(require('prerender-node')
			.set('prerenderToken', process.env['PRERENDER_TOKEN']));
	}

	return app;

}