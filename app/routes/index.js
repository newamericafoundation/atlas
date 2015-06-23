var express = require('express'),
	router = express.Router(),
	resources = [ 'projects', 'project_sections', 'project_templates', 'core_data', 'images', 'researchers' ],
	fingerprintManifest = require('./fingerprint-manifest'),
	json2csv = require('nice-json2csv');

router.use(json2csv.expressDecorator);

resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

router.get('/*', function(req, res) {
	res.render('index.jade', fingerprintManifest);
});

router.post('/print', function(req, res) {
	var content = '<h1>' + req.body.title + '</h1>' + req.body.content;
	var content = '<h1>umm</h1><p>mm</p>';
	content += '<script>window.print();</script>'
	res.render('print.jade', fingerprintManifest);
});

module.exports = router;