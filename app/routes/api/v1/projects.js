var express = require('express'),
	router = express.Router(),
	Model = require('../../../models/project').Model,
	util = require('../../../models/util'),
	templates = require('../../../../db/seeds/project_templates.json'),
	sections = require('../../../../db/seeds/project_sections.json'),
	csv = require('csv');

// Set template name.
var setTemplateName = function(model) {
	templates.forEach(function(template) {
		if (model.project_template_id === template.id) {
			model.project_template_name = template.name;
		}
	});
	return model;
};

// Set project section names.
var setSectionNames = function(model) {
	model.project_section_names = [];
	if(model.project_section_ids) {
		sections.forEach(function(section) {
			if (model.project_section_ids.indexOf(section.id) > -1) {
				model.project_section_names.push(section.name);
			}
		});
	}
	return model;
};

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
			referenceModelTags;

		models.forEach(function(model) {
			util.adaptId(model);
			setTemplateName(model);
			setSectionNames(model);			
		});

		if (typeof specialQueryParams !== "undefined") {
			referenceModel = util.findById(models, specialQueryParams.related_to);
			referenceModelTags = referenceModel.tags;
			models.forEach(function(model) {
				if (util.isTagShared(model.tags, referenceModelTags) && (model.id !== referenceModel.id)) {
					selectedModels.push(model);
				}
			});
		} else {
			selectedModels = models;
		}

		res.json(selectedModels);

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