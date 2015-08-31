var express = require('express'),
	fingerprintManifest = require('./fingerprint-manifest'),
	json2csv = require('nice-json2csv');

var router = express.Router();
var resources = [ 'projects', 'project_sections', 'project_templates', 'core_data', 'images' ];

router.use(json2csv.expressDecorator);

router.get('/login', (req, res) => {
	res.render('login');
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
	res.render('index.jade', fingerprintManifest);
});

// Print route that takes a title and html as post parameter, assemble a 
//   corresponding simple html page and calls window.print automatically.
router.post('/print', function(req, res) {
	req.body = req.body || {};
	req.body.title = req.body.title || 'Title';
	req.body.content = req.body.content || '<h1>umm</h1><p>mm</p>';
	var content = '<h1>' + req.body.title + '</h1>' + req.body.content;
	content += '<script>window.print();</script>'
	res.render('print.jade', fingerprintManifest);
});

module.exports = router;