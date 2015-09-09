var base = require('./base.js');

exports.Model = base.Model.extend({
	
	fields: [

		

	],

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

	/** Gets encoded url to use as a CSS background-image. */
	getUrl: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/jpeg;base64," + encoded + "')";
		}
	},

	/** Gets html attribute. */
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}

});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	apiUrl: '/api/v1/images'

});