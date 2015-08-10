@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	entityManager = new App.Base.EntityManager
		entityConstructor: App.Models.CoreDatum
		entitiesConstructor: App.Models.CoreData

	App.reqres.setHandler 'core:datum:entities', ->
		entityManager.getEntities { cache: true }

	App.reqres.setHandler 'core:datum:entity', (query) ->
		entityManager.getEntity query