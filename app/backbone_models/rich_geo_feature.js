var _ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery');

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({
	initialize: function() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},
	model: exports.Model,
	onReady: function(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}
});