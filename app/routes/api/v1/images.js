import express from 'express';
import base from './../../../models/base.js';
import dbConnector from './../../../../db/connector';

import authMiddleware from './../../../middleware/auth.js';
import deleteMiddleware from './../../../middleware/crud/delete.js';
import newMiddleware from  './../../../middleware/crud/new.js';
import updateMiddleware from './../../../middleware/crud/update.js';
import showMiddleware from './../../../middleware/crud/show.js';

var router = express.router();

router.get('/', function(req, res) {

	var query = req.query;

	var fields;

	if (query.name == null) { 
		fields = { encoded: false };
	}

	return dbConnector.then(function(db) {

		var collection, cursor;

		collection = db.collection('images');

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