@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	class Base.Collection extends Backbone.Collection

		_isCacheable: false

		fetch: ->
			cache = @constructor._cache
			if @_isCacheable and cache?
				@reset cache.models
			else
				Backbone.Collection.prototype.fetch.apply @, arguments
				@constructor._cache = @