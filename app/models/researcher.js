var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base.js');

exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});