@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entitiesConstructor: App.Models.ProjectTemplates

	# Hard-code entities to avoid network requests.
	coll = new App.Models.ProjectTemplates [
		{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" }
		{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" }
		{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" }
		{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
	]
	coll.initializeActiveStates()
	entityManager.entitiesCache = coll
		
	App.reqres.setHandler 'project:template:entities', ->
		entityManager.getEntities({ cache: true })