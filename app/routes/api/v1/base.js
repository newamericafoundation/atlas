var base = require('./../../../models/base');

module.exports = function(req, res, resource) {
	var query = req.query;

	var db = req.db;

	var collection = db.collection(resource);
	var cursor = collection.find(query);

	cursor.toArray(function(err, items) {
		if(err) { return console.dir(err); }
		res.json(base.Collection.prototype.parse(items));
	});

};