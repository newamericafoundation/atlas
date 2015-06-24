var express = require('express'),
	router = express.Router(),
	base = require('../../../backbone_models/base'),
	dbConnector = require('./../../../../db/connector');

router.get('/', function(req, res) {

	var query = req.query;

	var fields;

	if (query.name == null) { 
		console.log('no encoded');
		fields = { encoded: false };
	}

	return dbConnector.connected().then(function(db) {

		var collection, cursor;

		collection = db.collection('images');

		console.dir(fields);

		if (fields != null) { 
			cursor = collection.find(query, fields); 
		} else {
			cursor = collection.find(query);
		}

		cursor.toArray(function(err, items) {
			if(err) { return console.dir(err); }
			res.json(base.Collection.prototype.parse(items));
		});

	});

});

module.exports = router;