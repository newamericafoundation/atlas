var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/core_data',
	url: function() {
		return this.urlRoot + "?" + $.param({
			name: this.get('name')
		});
	},
	parse: function(resp) {
		return resp = this._removeArrayWrapper(resp);
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: 'api/v1/core_data'
});