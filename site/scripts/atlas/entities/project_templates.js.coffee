@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ProjectTemplateModel extends Marionette.Accountant.FilterModel
		urlRoot: '/api/v1/project_templates'

	class Entities.ProjectTemplateCollection extends Marionette.Accountant.FilterCollection
		model: Entities.ProjectTemplateModel
		url: '/api/v1/project_templates'
		hasSingleActiveChild: true
		initializeActiveStatesOnReset: true
		comparator: 'order'
		initialize: ->
			@on 'initialize:active:states', () ->
				App.vent.trigger 'project:filter:change', @

	entityManager = new App.Base.EntityManager
		entitiesConstructor: Entities.ProjectTemplateCollection

	# Hard-code entities to avoid network requests.
	coll = new Entities.ProjectTemplateCollection [
		{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" }
		{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" }
		{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" }
		{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
	]
	coll.initializeActiveStates()
	entityManager.entitiesCache = coll
		
	App.reqres.setHandler 'project:template:entities', ->
		entityManager.getEntities({ cache: true })