var _ = require('underscore'),
	Backbone = require('backbone'),
	baseFilter = require('./base_filter'),
	$ = require('jquery');


Models.ProjectSection = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

Models.ProjectSections = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_sections',
	hasSingleActiveChild: false,
	initializeActiveStatesOnReset: true,
	initialize: function() {
		return this.on('initialize:active:states', function() {
			return App.vent.trigger('project:filter:change', this);
		});
	}
});