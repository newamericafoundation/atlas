@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entitiesConstructor: App.Models.ProjectSections

	# Hard-code entities to avoid network requests.
	coll = new App.Models.ProjectSections [
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