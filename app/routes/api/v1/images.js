import express from 'express';
import base from './../../../models/base.js';

import authMiddleware from './../../../middleware/auth.js';
import deleteMiddleware from './../../../middleware/crud/delete.js';
import newMiddleware from  './../../../middleware/crud/new.js';
import updateMiddleware from './../../../middleware/crud/update.js';
import showMiddleware from './../../../middleware/crud/show.js';

// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
//var currentAuthMiddleware = (process.NODE_ENV === 'production') ? authMiddleware.ensureAuthenticated : authMiddleware.ensureNothing;
var currentAuthMiddleware = authMiddleware.ensureAuthenticated;

var router = express.Router();

router.get('/', function(req, res) {

	var query = req.query;

	var fields;

	if (query.name == null) { 
		fields = { encoded: false };
	}

	var db = req.db;

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

router.get('/:id', showMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
	res.json(req.dbResponse);
});

// authenticated requests
router.post('/:id/edit', currentAuthMiddleware, updateMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
	res.json(req.dbResponse);
});

router.post('/new', currentAuthMiddleware, newMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
	res.json(req.dbResponse);
});

router.delete('/:id', currentAuthMiddleware, deleteMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
	res.json(req.dbResponse);
});

module.exports = router;