import express from 'express';
import json2csv from 'nice-json2csv';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import authRouter from './auth.js';
import staticRouter from './static.js';
import lambdaRouter from './lambda.js';

import { match, RoutingContext } from 'react-router';

import clientRoutes from './client.jsx';

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
router.get('*', (req, res) => {

	var opt = fingerprintManifest;
	opt.user = req.user;

	// match({ routes: clientRoutes, location: req.url }, (err, redirectLocation, renderProps) => {

	// 	if (!err) {
	// 		opt.reactOutput = ReactDOMServer.renderToString(<RoutingContext {...renderProps} />);
	// 	}

		res.render('index.jade', opt);
	// });

});

module.exports = router;