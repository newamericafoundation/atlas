var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	Model = require('../../../models/image').Model,
	base = require('../../../backbone_models/base'),
	dbConnector = require('./../../../../db/connector');

router.get('/', function(req, res) {

	var query = req.query;

	/*var fields;

	if (query.name == null) { 
		console.log('no encoded');
		fields = { encoded: 0 };
	}

	return dbConnector.connected().then(function(db) {

		var collection = db.collection('images');
		var cursor = collection.find(query, fields);

		cursor.toArray(function(err, items) {
			if(err) { return console.dir(err); }
			res.json(base.Collection.prototype.parse(items));
		});

	});*/

	var mongoQuery = Model.find(query);

	if (query.name == null) { 
		mongoQuery.select("-encoded"); 
	}

	return mongoQuery.lean().exec(function(err, models) {
		if (err) { return console.log(err); }
		res.json(base.Collection.prototype.parse(models));
	});

});

module.exports = router;