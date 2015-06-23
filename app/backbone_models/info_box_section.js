var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');


exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});
