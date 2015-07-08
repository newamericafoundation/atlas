var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');

exports.Model = base.Model.extend({
	/**
	 * Find by variable_id in a specified variables collection.
	 * @param {object} variables
	 * @returns {object}
	 */	
	getVariableModel: function(variables) {
		return variables.findWhere({
			id: this.get('variable_id')
		});
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model
});