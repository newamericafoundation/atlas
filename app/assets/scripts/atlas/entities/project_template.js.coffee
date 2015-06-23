@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entitiesConstructor: App.Models.ProjectTemplates

	# Populated from ./db/seeds/ on the server.
	coll = new App.Models.ProjectTemplates()

	coll.on 'initialize:active:states', () ->
		App.vent.trigger 'project:filter:change', @
		
	coll.initializeActiveStates()
	entityManager.entitiesCache = coll
		
	App.reqres.setHandler 'project:template:entities', ->
		entityManager.getEntities({ cache: true })