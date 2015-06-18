var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	Model = require('../../../models/image').Model,
	util = require('../../../models/util');

router.get('/', function(req, res, next) {
	var queryParams = req.query,
		query;
	query = Model.find(queryParams);
	if (queryParams.name == null) { query.select("-encoded"); }
	return query.lean().exec(function(err, models) {
		if (err) { return console.log(err); }
		models.forEach(function(model) {
			util.adaptId(model);
		});
		res.json(models);
	});
});

module.exports = router;