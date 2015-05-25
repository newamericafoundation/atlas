var express = require('express'),
	router = express.Router(),
	Model = require('../../../models/project_section').Model;

router.get('/', function(req, res) {
	var query = req.query;
	return Model.find(query).lean().exec(function(err, models) {
		if (err) { return console.log(err); }
		models.forEach(function(model) {
			model.id = model._id;
			delete model._id;
		});
		res.json(models);
	});
});

module.exports = router;