var express = require('express'),
	router = express.Router(),
	project = require('./../../../models/project.js'),
	dbConnector = require('./../../../../db/connector'),
	ObjectID = require('mongodb').ObjectID,
	base = require('./../../../models/base.js'),
	csv = require('csv');

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

router.get('/', function(req, res) {

	var complexQuery = processQueryParameters(req.query),
		queryParams = complexQuery.query,
		specialQueryParams = complexQuery.specialQuery,
		fields;

	if (!req.isAuthenticated()) {
		queryParams.is_live = "Yes";
	}

	fields = { encoded_image: 0 };

	if (queryParams.atlas_url == null) {
		fields.data = 0;
		fields.body_text = 0;
	}

	return dbConnector.then(function(db) {

		var collection, cursor;

		collection = db.collection('projects');

		cursor = collection.find(queryParams, fields);

		cursor.toArray(function(err, models) {

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

router.get('/image', function(req, res) {

	var queryParams = req.query || {},
		fields = { encoded_image: 1, image_credit: 1, atlas_url: 1 };
	
	if (!req.isAuthenticated()) {
		queryParams.is_live = "Yes";
	}

	return dbConnector.then(function(db) {

		var cursor = db.collection('projects').find(queryParams, fields);

		cursor.toArray(function(err, models) {
			if (err) { 
				console.dir(err); 
				return res.json([]); 
			}
			res.json(models);
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


// Print project data.
router.post('/print', function(req, res) {

	var queryParams = req.body || {},
		fileName = queryParams.atlas_url || 'file',
		fields = { data: 1, atlas_url: 1 };

	if (!req.isAuthenticated()) {
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