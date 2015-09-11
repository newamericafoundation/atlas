var express = require('express'),
	fingerprintManifest = require('./utilities/fingerprint_manifest.js'),
	json2csv = require('nice-json2csv');

var router = express.Router();
var resources = [ 'projects', 'project_sections', 'project_templates', 'core_data', 'images' ];

router.use(json2csv.expressDecorator);

router.get('/login', (req, res) => {
	res.render('login', fingerprintManifest);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Authentication routes.
router.use('/auth', require('./auth.js'));

// Use subroutes for data api, requiring resource-specific subrouters.
resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

// Main routes - routing done by client.
router.get([ '/', 'welcome', '/menu', '*' ], (req, res) => {
	var opt = fingerprintManifest;
	opt.user = req.user;
	res.render('index.jade', opt);
});

module.exports = router;