@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.ProjectSection = Marionette.Accountant.FilterModel.extend
		urlRoot: '/api/v1/project_sections'
		parse: (resp) ->
			resp.id = String(resp.id)
			resp


	Models.ProjectSections = Marionette.Accountant.FilterCollection.extend

		model: Models.ProjectSection
		url: '/api/v1/project_sections'
		hasSingleActiveChild: false
		initializeActiveStatesOnReset: true

		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @