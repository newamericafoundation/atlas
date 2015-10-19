import express from 'express';
import json2csv from 'nice-json2csv';

import authRouter from './auth.js';
import staticRouter from './static.js';
import lambdaRouter from './lambda.js';

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
router.use('/auth', authRouter);

router.use('/static', staticRouter);
router.use('/lambda', lambdaRouter);

// Use subroutes for data api, requiring resource-specific subrouters.
resources.forEach(function(resource) {
	var url = '/api/v1/' + resource;
	router.use(url, require('.' + url));
});

// Main routes - routing done by client.
router.get([ '/', '/menu', '/welcome', '/:atlas_url', '*' ], (req, res) => {
	var opt = fingerprintManifest;
	opt.user = req.user;
	res.render('index.jade', opt);
});

module.exports = router;