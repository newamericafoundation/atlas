var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');


exports.Model = base.Model.extend({
	
	urlRoot: '/api/v1/core_data',
	
	/** 
	 * Fetches core data model url by name key 
	 * @returns {string} name
	 */
	url: function() {
		return this.urlRoot + "?" + $.param({
			name: this.get('name')
		});
	},

	/** 
	 * Recognize and process server response.
	 * @param {object} resp - Server response.
	 * @returns {object} resp - Modified response.
	 */
	parse: function(resp) {
		return resp = this._removeArrayWrapper(resp);
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: 'api/v1/core_data'
});