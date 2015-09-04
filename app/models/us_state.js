var base = require('./base.js'),
	seed = require('./../../db/seeds/us_states.json');

exports.Model = base.Model.extend({



});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	dbSeed: 'us_states'

});