@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entityConstructor: App.Models.Project
		entitiesConstructor: App.Models.Projects
			
	App.reqres.setHandler 'project:entities', (options) ->
		entityManager.getEntities(options)

	App.reqres.setHandler 'project:entity', (query) ->
		entityManager.getEntity query