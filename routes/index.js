var express = require('express'),
	router = express.Router(),
	resources = ['projects', 'project_sections', 'project_templates', 'core_data'],
	jsManifest = require('../public/assets/scripts/rev-manifest.json'),
	cssManifest = require('../public/assets/styles/rev-manifest.json');

var manifest = { js: jsManifest, css: cssManifest };

resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

router.get('/*', function(req, res) {
	res.render('index.jade', manifest);
});

module.exports = router;