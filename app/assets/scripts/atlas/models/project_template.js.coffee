@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.ProjectTemplate = Models.BaseFilterModel.extend
		urlRoot: '/api/v1/project_templates'


	Models.ProjectTemplates = Models.BaseFilterCollection.extend
		model: Models.ProjectTemplate
		url: '/api/v1/project_templates'
		hasSingleActiveChild: true
		initializeActiveStatesOnReset: true
		comparator: 'order'
		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @