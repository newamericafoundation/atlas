@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.ProjectTemplate = Marionette.Accountant.FilterModel.extend
		urlRoot: '/api/v1/project_templates'


	Models.ProjectTemplates = Marionette.Accountant.FilterCollection.extend
		model: Models.ProjectTemplate
		url: '/api/v1/project_templates'
		hasSingleActiveChild: true
		initializeActiveStatesOnReset: true
		comparator: 'order'
		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @