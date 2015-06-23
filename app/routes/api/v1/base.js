var util = require('../../../models/util');

module.exports = function(req, res, resource) {
	var Model = require('../../../models/' + resource).Model;
	var query = req.query;
	return Model.find(query).lean().exec(function(err, models) {
		if (err) { return console.log(err); }
		models.forEach(function(model) {
			util.adaptId(model);
		});
		res.json(models);
	});
};