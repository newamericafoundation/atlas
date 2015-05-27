var express = require('express'),
	router = express.Router(),
	resources = ['projects', 'project_sections', 'project_templates', 'core_data'],
	fingerprintManifest = require('./fingerprint-manifest');

resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

router.get('/*', function(req, res) {
	res.render('index.jade', fingerprintManifest);
});

router.post('/print', function(req, res) {
	var content = '<h1>' + req.body.title + '</h1>' + req.body.content;
	res.setHeader('Content-disposition', 'attachment; filename=' + req.body.title + '.txt');
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	res.write(content);
	res.end();
});

module.exports = router;