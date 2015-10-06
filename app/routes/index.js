import express from 'express';
import json2csv from 'nice-json2csv';
import AWS from 'aws-sdk';

import fingerprintManifest from './utilities/fingerprint_manifest.js';

var router = express.Router();
var resources = [ 'projects', 'project_sections', 'project_templates', 'images' ];

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

router.get('/static/:file_url', (req, res) => {
	var s3 = new AWS.S3(),
		params = { Bucket: 'static.atlas.newamerica.org', Key: req.params.file_url };
	s3.getObject(params).createReadStream().pipe(res);
});

// Main routes - routing done by client.
router.get([ '/', '/menu', '/welcome', '/:atlas_url', '*' ], (req, res) => {
	var opt = fingerprintManifest;
	opt.user = req.user;
	res.render('index.jade', opt);
});

module.exports = router;