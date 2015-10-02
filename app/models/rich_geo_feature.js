var _ = require('underscore'),
	Backbone = require('backbone');

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({

	model: exports.Model,

	/*
     *
     *
     */
	initialize: function() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},


    /*
     *
     *
     */
	onReady: function(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}
	
});