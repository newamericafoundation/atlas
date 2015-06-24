var express = require('express'),
	router = express.Router(),
	// Model = require('../../../models/project').Model,
	project = require('./../../../models/project.js'),
	projectSection = require('./../../../models/project_section.js'),
	projectTemplate = require('./../../../models/project_template.js'),
	base = require('./../../../models/base.js'),
	csv = require('csv');


var mongoose = require('mongoose');
var schema = new mongoose.Schema({}, { collection: 'projects' });
var Model = mongoose.model('Project', schema);

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
		query;

	queryParams.is_live = "Yes";
	query = Model.find(queryParams);

	query.select('-encoded_image');

	if (typeof queryParams.atlas_url === "undefined") {
		query.select('-data -body_text');
	}

	return query.lean().exec(function(err, models) {

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

router.get('/image', function(req, res) {
	var queryParams = req.query || {},
		query;
		
	queryParams.is_live = "Yes";
	query = Model.find(queryParams);
	query.select('encoded_image image_credit atlas_url -_id');
	query.lean().exec(function(err, models) {
		if (err) { console.dir(err); }
		res.json(models);
	});

});


var exists = function(variable) {
	return (typeof variable !== "undefined") && (variable != "null");
};

// Print project data.
router.post('/print', function(req, res) {

	var queryParams = req.body || {},
		query,
		fileName = queryParams.atlas_url || 'file';

	queryParams.is_live = "Yes";
	query = Model.find(queryParams);
	query.select('data atlas_url');//
	
	query.lean().exec(function(err, models) {
		if (err) { return console.dir(err); }
		if (exists(models[0]) && exists(models[0].data) && exists(models[0].data.items)) {
			return res.csv(models[0].data.items, fileName + '.csv');
		}
		res.send();
	});

});

module.exports = router;