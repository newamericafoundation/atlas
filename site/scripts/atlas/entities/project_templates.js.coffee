@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ProjectTemplateModel extends Marionette.Accountant.FilterModel
		urlRoot: '/api/v1/project_templates'
		parse: (resp) ->
			resp

	class Entities.ProjectTemplateCollection extends Marionette.Accountant.FilterCollection

		model: Entities.ProjectTemplateModel
		url: '/api/v1/project_templates'

		hasSingleActiveChild: true
		initializeActiveStatesOnReset: true

		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @


	entityManager = new App.Base.EntityManager
		entitiesConstructor: Entities.ProjectTemplateCollection
		
	App.reqres.setHandler 'project:template:entities', ->
		entityManager.getEntities({ cache: true })