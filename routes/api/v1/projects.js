var express = require('express'),
	router = express.Router(),
	Model = require('../../../models/project').Model,
	templates = require('../../../db/seeds/project_templates.json'),
	sections = require('../../../db/seeds/project_sections.json');

router.get('/', function(req, res) {
	var query = req.query;
	return Model.find(query).lean().exec(function(err, models) {
		if (err) { return console.log(err); }

		models.forEach(function(model) {
			model.id = { $oid: model._id };
			delete model._id;

			templates.forEach(function(template) {
				if (parseInt(model.project_template_id, 10) === template.id) {
					model.project_template = { name: template.name };
				}
			});

			sections.forEach(function(section) {
				if (parseInt(model.project_section_id, 10) === section.id) {
					model.project_section = { name: section.name };
				}
			});

		});
		res.json(models);
	});
});

module.exports = router;