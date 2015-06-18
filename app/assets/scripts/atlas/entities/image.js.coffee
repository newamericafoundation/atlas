@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entityConstructor: App.Models.Image
		entitiesConstructor: App.Models.Images
			
	App.reqres.setHandler 'image:entities', (options) ->
		entityManager.getEntities(options)

	App.reqres.setHandler 'image:entity', (query) ->
		entityManager.getEntity query