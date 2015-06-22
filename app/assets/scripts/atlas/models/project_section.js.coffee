@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->


	Models.ProjectSection = Models.BaseFilterModel.extend
		urlRoot: '/api/v1/project_sections'
		parse: (resp) ->
			resp.id = String(resp.id)
			resp


	Models.ProjectSections = Models.BaseFilterCollection.extend

		model: Models.ProjectSection
		url: '/api/v1/project_sections'
		hasSingleActiveChild: false
		initializeActiveStatesOnReset: true

		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @