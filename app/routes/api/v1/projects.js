var express = require('express'),
	bodyParser = require('body-parser'),
	project = require('./../../../models/project.js'),
	dbConnector = require('./../../../../db/connector'),
	ObjectID = require('mongodb').ObjectID,
	base = require('./../../../models/base.js'),
	authMiddleware = require('./../../../middleware/auth.js'),
	csv = require('csv');

var currentAuthMiddleware = (process.NODE_ENV === 'production') ? authMiddleware.ensureAuthenticated : authMiddleware.ensureNothing;

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

	if (!req.isAuthenticated() && (process.env.NODE_ENV !== 'development')) {
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

	return dbConnector.then(function(db) {

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

	}, (err) => { console.dir(err); return res.json([]); });

});

router.get('/:id', (req, res) => {

	var id = req.params.id;

	return dbConnector.then((db) => {
		var cursor = db.collection('projects').find({ _id: new ObjectID(id) });
		cursor.toArray((err, data) => {
			if (err) { 
				console.dir(err);
				return res.json({});
			}
			var datum = data[0];
			if(datum._id) {
				datum.id = datum._id;
				delete datum._id;
			}
			res.json(datum);
		});
	}, (err) => { console.dir(err); return res.json({}); });

});

router.post('/:id/edit', currentAuthMiddleware, (req, res) => {

	var id = req.params.id,
		project = JSON.parse(req.body.jsonString);

	// Delete id so that it is not set in the database (_id already set).
	delete project.id;

	return dbConnector.then((db) => {
		
		db.collection('projects').update({ _id: new ObjectID(id) }, project, (err, data) => {

			if (err) {
				console.dir(err);
				return res.json({
					'status': 'error',
					'message': 'Failed to update project.'
				});
			}

			return res.json({
				'status': 'success',
				'message': 'Project Updated Successfully.'
			});

		});
			

	}, (err) => { console.dir(err); return res.json({
		'status': 'error',
		'message': 'Could not connect to database.'
	}); });

});

router.post('/new', currentAuthMiddleware, (req, res) => {

	return dbConnector.then((db) => {

		var collection = db.collection('projects');

		var project = JSON.parse(req.body.jsonString);

		console.log('inserting');

		collection.insert(project, (err, data) => {

			if(err) { 

				console.dir(err);

				return setTimeout(() => {

					return res.json({
						'status': 'error',
						'message': 'Failed to save project.'
					});

				}, 0);

			}

			var savedProject = data.ops[0];

			console.log(savedProject);

			setTimeout(() => {

				res.json({ 
					status: 'success',
					message: 'Successfully saved project',
					id: savedProject._id
				});

			}, 0);

			

		});
		

	}, (err) => { 
		console.dir(err); 
		return res.json({ 
			status: 'error',
			message: 'Count not connect to database.'
		}); 
	});

});

router.delete('/:id', currentAuthMiddleware, (req, res) => {

	var id = req.params.id;

	dbConnector.then((db) => {

		db.collection('projects').remove({ _id: new ObjectID(id) }, (err, numberOfRemovedDocs) => {

			console.log(err, numberOfRemovedDocs);

			if(err) { 
				console.log('remove unsuccessful');
				return res.json({
					'status': 'error'
				});
			}

			console.log(`remove ${numberOfRemovedDocs} documents`);

			return res.json({
				'status': 'success'
			});

		});

	}, (err) => {

		console.dir(err);
		return res.json({
			status: 'error',
			message: 'Count not connect to database.'
		});

	});

});


// Print project data.
router.post('/print', function(req, res) {

	var queryParams = req.body || {},
		fileName = queryParams.atlas_url || 'file',
		fields = { data: 1, atlas_url: 1 };

	if (!req.isAuthenticated() && (process.env.NODE_ENV !== 'development')) {
		queryParams.is_live = "Yes";
	}

	return dbConnector.then(function(db) {

		var cursor = db.collection('projects').find(queryParams, fields);

		cursor.toArray(function(err, models) {
			if (err) { console.dir(err); }
			if ((models[0]) && (models[0].data) && (models[0].data.items)) {
				return res.csv(models[0].data.items, fileName + '.csv');
			}
			res.send();
		});

	}, (err) => { console.dir(err); return res.json([]); });

});

module.exports = router;