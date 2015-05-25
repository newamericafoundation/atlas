@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.CoreDatumModel extends Backbone.Model
		urlRoot: '/api/v1/core_data'
		url: ->
			@urlRoot + "?" + $.param({ name: @get('name') })

		parse: (resp) ->
			resp = @_getFirstModel resp

		_getFirstModel: (resp) ->
			resp = resp[0] if _.isArray(resp)
			resp

	class Entities.CoreDatumCollection extends Backbone.Collection
		model: Entities.CoreDatumModel
		url: 'api/v1/core_data'

	entityManager = new App.Base.EntityManager
		entityConstructor: Entities.CoreDatumModel
		entitiesConstructor: Entities.CoreDatumCollection

	App.reqres.setHandler 'core:datum:entities', ->
		entityManager.getEntities { cache: true }

	App.reqres.setHandler 'core:datum:entity', (name) ->
		entityManager.getEntity { name: name }, { cache: false }