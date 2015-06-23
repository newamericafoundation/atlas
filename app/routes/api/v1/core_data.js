var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	coreDatum = require('./../../../backbone_models/core_datum'),
	dbConnector = require('./../../../../db/connector');

router.get('/', function(req, res, next) {
	var query = req.query;

	return dbConnector.connected().then(function(db) {

		var collection = db.collection('core_data');
		var cursor = collection.find({});

		cursor.toArray(function(err, items) {
			if(err) { return console.dir(err); }
			res.json(coreDatum.Collection.prototype.parse(items));
		});

	});

});

module.exports = router;