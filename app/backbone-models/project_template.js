var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');


Models.ProjectTemplate = Models.BaseFilterModel.extend({
	urlRoot: '/api/v1/project_templates'
});

Models.ProjectTemplates = Models.BaseFilterCollection.extend({
	model: exports.Model,
	url: '/api/v1/project_templates',
	hasSingleActiveChild: true,
	initializeActiveStatesOnReset: true,
	comparator: 'order',
	initialize: function() {
		return this.on('initialize:active:states', function() {
			return App.vent.trigger('project:filter:change', this);
		});
	}
});