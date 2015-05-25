@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ProjectSectionModel extends Marionette.Accountant.FilterModel
		urlRoot: '/api/v1/project_sections'
		parse: (resp) ->
			resp#new App.Base.Entity()._adaptMongoId(resp)


	class Entities.ProjectSectionCollection extends Marionette.Accountant.FilterCollection

		model: Entities.ProjectSectionModel
		url: '/api/v1/project_sections'
		hasSingleActiveChild: false
		initializeActiveStatesOnReset: true

		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @


	entityManager = new App.Base.EntityManager
		entitiesConstructor: Entities.ProjectSectionCollection

	App.reqres.setHandler 'project:section:entities', ->
		entityManager.getEntities({ cache: true })