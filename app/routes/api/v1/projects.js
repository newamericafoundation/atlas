import express from 'express';
import bodyParser from 'body-parser';
import csv from 'csv';
import project from './../../../models/project.js';
import base from './../../../models/base.js';
import { ObjectID } from 'mongodb';

import authMiddleware from './../../../middleware/auth.js';

import deleteMiddleware from './../../../middleware/crud/delete.js';
import newMiddleware from  './../../../middleware/crud/new.js';
import updateMiddleware from './../../../middleware/crud/update.js';
import showMiddleware from './../../../middleware/crud/show.js';
import indexMiddleware from './../../../middleware/crud/index.js';

// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
var currentAuthMiddleware = (process.NODE_ENV === 'production') ? authMiddleware.ensureAuthenticated : authMiddleware.ensureNothing;
// var currentAuthMiddleware = authMiddleware.ensureAuthenticated;

var shouldHideDraftProjects = function(req) {
	// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
	return (process.env.NODE_ENV === 'production') ? !req.isAuthenticated() : false;
	// return (!req.isAuthenticated());
};

var router = express.Router();

// Separated query parameters into regular queries and specialty ones.
//   related_to specialty query specifies the id of the project the 
//   one in question is related to. This is done by comparing tags.
var processQueryParameters = function(queryParameters) {
	var res = { query: queryParameters },
		related_to = queryParameters.related_to;
	if (related_to) {
		res.specialQuery = { related_to: related_to };
		delete res.query.related_to;
	}
	return res;
};

router.get([ '/', '/image' ], function(req, res) {

	var complexQuery = processQueryParameters(req.query),
		queryParams = complexQuery.query,
		specialQueryParams = complexQuery.specialQuery,
		fields;

	if (shouldHideDraftProjects(req)) {
		queryParams.is_live = "Yes";
	}

	if (req.url === '/') {
		fields = { encoded_image: 0 };
		if (queryParams.atlas_url == null) {
			fields.data = 0;
			fields.body_text = 0;
		}
	} else if (req.url === '/image') {
		fields = { encoded_image: 1, image_credit: 1, atlas_url: 1 };
	}

	var db = req.db;

	db.collection('projects').find(queryParams, fields).toArray((err, models) => {
		if (err) { return console.dir(err); }
		models = base.Collection.prototype.parse(models);
		var coll = new project.Collection(models);

		// Get related models.
		if (specialQueryParams == null) {
			return res.json(coll.toJSON());
		} else {
			return res.json(coll.related_to(specialQueryParams.related_to));
		}

	});

});

// router.get('/', indexMiddleware.bind(this, { dbCollectionName: 'projects' }), (req, res) => {
// 	res.json(req.dbResponse);
// });

router.get('/:id', showMiddleware.bind(this, { dbCollectionName: 'projects' }), (req, res) => {
	res.json(req.dbResponse);
});

// authenticated requests
router.post('/:id/edit', currentAuthMiddleware, updateMiddleware.bind(this, { dbCollectionName: 'projects' }), (req, res) => {
	res.json(req.dbResponse);
});

router.post('/new', currentAuthMiddleware, newMiddleware.bind(this, { dbCollectionName: 'projects' }), (req, res) => {
	res.json(req.dbResponse);
});

router.delete('/:id', currentAuthMiddleware, deleteMiddleware.bind(this, { dbCollectionName: 'projects' }), (req, res) => {
	res.json(req.dbResponse);
});


// Print project data.
router.post('/print', function(req, res) {

	var queryParams = req.body || {},
		fileName = queryParams.atlas_url || 'file',
		fields = { data: 1, atlas_url: 1 };

	if (shouldHideDraftProjects(req)) {
		queryParams.is_live = "Yes";
	}

	var db = req.db;

	var cursor = db.collection('projects').find(queryParams, fields);

	cursor.toArray(function(err, models) {
		if (err) { console.dir(err); }
		if ((models[0]) && (models[0].data) && (models[0].data.items)) {
			return res.csv(models[0].data.items, fileName + '.csv');
		}
		res.send();
	});

});

module.exports = router;