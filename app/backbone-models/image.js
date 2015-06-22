var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/images',
	url: function() {
		return this.urlRoot + ("?name=" + (this.get('name')));
	},
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},
	getBackgroundImageCss: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});