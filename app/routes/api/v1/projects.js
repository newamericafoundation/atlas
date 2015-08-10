var express = require('express'),
	router = express.Router(),
	project = require('./../../../models/project.js'),
	projectSection = require('./../../../models/project_section.js'),
	projectTemplate = require('./../../../models/project_template.js'),
	dbConnector = require('./../../../../db/connector'),
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

	queryParams.is_live = "Yes";

	fields = { encoded_image: 0 };

	if (typeof queryParams.atlas_url === "undefined") {
		fields.data = 0;
		fields.body_text = 0;
	}

	return dbConnector.connected().then(function(db) {

		var collection, cursor;

		collection = db.collection('projects');

		cursor = collection.find(queryParams, fields);

		cursor.toArray(function(err, models) {
			if (err) { return console.dir(err); }

			var selectedModels = [],
				referenceModel,
				referenceModelTags,
				resp = [];

			models = base.Collection.prototype.parse(models);

			var coll = new project.Collection(models),
				temp = new projectTemplate.Collection(),
				sect = new projectSection.Collection();

			coll.each(function(mod) {
				mod.addForeignField('project_template_id', temp, 'name');
				mod.addForeignField('project_section_ids', sect, 'name');
			});

			// Get related models.
			if (specialQueryParams == null) {
				return res.json(coll.toJSON());
			} else {

				referenceModel = coll.findWhere({ id: specialQueryParams.related_to });
				if (referenceModel == null) { return res.json([]); }
				
				coll.each(function(model) {
					if (model.isRelatedTo(referenceModel)) {
						resp.push(model.toJSON());
					}
				});

				return res.json(resp);
			}

		});

	});

});

router.get('/image', function(req, res) {

	var queryParams = req.query || {},
		fields = { encoded_image: 1, image_credit: 1, atlas_url: 1 };
		
	queryParams.is_live = "Yes";

	return dbConnector.connected().then(function(db) {

		var cursor = db.collection('projects').find(queryParams, fields);

		cursor.toArray(function(err, models) {
			if (err) { console.dir(err); }
			res.json(models);
		});

	});

});


// Print project data.
router.post('/print', function(req, res) {

	var queryParams = req.body || {},
		fileName = queryParams.atlas_url || 'file',
		fields = { data: 1, atlas_url: 1 };

	var exists = function(variable) {
		return (typeof variable !== "undefined") && (variable != "null");
	};

	queryParams.is_live = "Yes";

	return dbConnector.connected().then(function(db) {

		var cursor = db.collection('projects').find(queryParams, fields);

		cursor.toArray(function(err, models) {
			if (err) { console.dir(err); }
			if (exists(models[0]) && exists(models[0].data) && exists(models[0].data.items)) {
				return res.csv(models[0].data.items, fileName + '.csv');
			}
			res.send();
		});

	});

});

module.exports = router;