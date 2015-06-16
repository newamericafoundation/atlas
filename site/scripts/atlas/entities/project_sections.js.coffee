@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ProjectSectionModel extends Marionette.Accountant.FilterModel
		urlRoot: '/api/v1/project_sections'
		parse: (resp) ->
			resp.id = String(resp.id)
			resp


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


	# Hard-code entities to avoid network requests.
	coll = new Entities.ProjectSectionCollection [
		{ "id": "0", "name": "Early Education" }
		{ "id": "1", "name": "PreK-12 Education" }
		{ "id": "2", "name": "Higher Education" }
		{ "id": "3", "name": "Learning Technologies" }
		{ "id": "4", "name": "Dual Language Learners" }
		{ "id": "5", "name": "Workforce Development" }
		{ "id": "6", "name": "Federal Education Budget" }
	]
	coll.initializeActiveStates()
	entityManager.entitiesCache = coll


	App.reqres.setHandler 'project:section:entities', ->
		entityManager.getEntities({ cache: true })