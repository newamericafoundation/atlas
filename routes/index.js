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

module.exports = router;