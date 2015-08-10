var express = require('express'),
	router = express.Router(),
	resources = [ 'projects', 'project_sections', 'project_templates', 'core_data', 'images', 'researchers' ],
	fingerprintManifest = require('./fingerprint-manifest'),
	json2csv = require('nice-json2csv');

router.use(json2csv.expressDecorator);

// Use subroutes for data api, requiring resource-specific subrouters.
resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

var welcome_index = function(req, res) {
	var factory, html,
		options = fingerprintManifest;
	options.bodyClass = 'atl-route__welcome_index';
	res.render('index.jade', options);
};

var projects_show = function(req, res) {
	var options = fingerprintManifest,
		url = req.url;
	options.bodyClass = 'atl-route__projects_show';
	res.render('index.jade', options);
};

var projects_index = function(req, res) {
	var options = fingerprintManifest;
	res.render('index.jade', options);
};

// Main routes.
router.get('/', welcome_index);
router.get('/welcome', welcome_index);
router.get('/menu', projects_index);
router.get('/*', projects_show);

// Special print route that takes a title and html as post parameter.
router.post('/print', function(req, res) {
	req.body = req.body || {};
	req.body.title = req.body.title || 'Title';
	req.body.content = req.body.content || '<h1>umm</h1><p>mm</p>';
	var content = '<h1>' + req.body.title + '</h1>' + req.body.content;
	content += '<script>window.print();</script>'
	res.render('print.jade', fingerprintManifest);
});

module.exports = router;