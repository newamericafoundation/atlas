var express = require('express'),
	router = express.Router(),
	resources = [ 'projects', 'project_sections', 'project_templates', 'core_data', 'images', 'researchers' ],
	fingerprintManifest = require('./fingerprint-manifest'),
	json2csv = require('nice-json2csv'),
	WelcomeComponent = require('./../components/welcome.js'),
	React = require('react');

router.use(json2csv.expressDecorator);

resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

router.get('/*', function(req, res) {
	var factory, html,
		options = fingerprintManifest;
	if (req.url === '/welcome') {
		factory = React.createFactory(WelcomeComponent);
		html = React.renderToString(factory());
		options.reactOutput = html;
		options.bodyClass = 'atl-route__welcome_index';
	}
	res.render('index.jade', options);
});

router.post('/print', function(req, res) {
	var content = '<h1>' + req.body.title + '</h1>' + req.body.content;
	var content = '<h1>umm</h1><p>mm</p>';
	content += '<script>window.print();</script>'
	res.render('print.jade', fingerprintManifest);
});

module.exports = router;