var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base.js');

exports.Model = base.Model.extend({
	
	urlRoot: '/api/v1/images',

	fields: [

		

	],
	
	/** 
	 * Fetches image model url by name key
	 * @returns {string} - Url plus name
	 */
	url: function() {
		return this.urlRoot + ("?name=" + (this.get('name')));
	},

	/**
	 * Recognize and process server response.
	 * @param {object} resp - Server response.
	 * @return {object} resp - Modified response.
	 */
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},

	/** Gets encoded url to use in CSS background-image. */
	getBackgroundImageCss: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},

	/** Gets html attribute. */
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});