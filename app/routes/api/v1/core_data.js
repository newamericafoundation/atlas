var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	Model = require('../../../models/core_datum').Model,
	util = require('../../../models/util');


router.get('/', function(req, res, next) {
	var query = req.query;

	return Model.find(query).lean().exec(function(err, models) {
		if (err) { return console.log(err); }
		models.forEach(function(model) {
			util.adaptId(model);
		});
		res.json(models);
	});
	
});

module.exports = router;