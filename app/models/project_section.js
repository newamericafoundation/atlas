var _ = require('underscore'),
	Backbone = require('backbone'),
	baseFilter = require('./base_filter'),
	seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({

	dbCollection: 'project_sections',

	dbSeed: seed,

	model: exports.Model,

	url: '/api/v1/project_sections',

	hasSingleActiveChild: false,

	initializeActiveStatesOnReset: true,

	initialize: function() {
		this.reset(seed);
	}

});