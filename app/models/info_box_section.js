var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base.js');


exports.Model = base.Model.extend();

exports.Collection = base.Collection.extend({

	model: exports.Model,

	getItemSections: function(item, variables) {
		return this.map(function(model) {
			var varId = model.get('variable_id'),
				variable = variables.findWhere({ id: varId });
			return {
				variable: variable,
				field: item.get(varId)
			};
		});
	}

});
