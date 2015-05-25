@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	class Base.EntityManager extends Marionette.Object

		constructor: (options) ->
			if options?
				@entitiesConstructor = options.entitiesConstructor
				@entityConstructor = options.entityConstructor
			# single entity caches
			@entityCache = []

		# Loads all entities. Use for collections that are not queried.
		# @param {object} options - Options.
		# @returns {object} coll - The requested collection of entities.
		getEntities: (options) ->
			# return if already cached
			caching = options? and options.cache
			if caching
				cache = @entitiesCache
				return cache if cache?
			Constr = @entitiesConstructor
			coll = new Constr()
			if options? and options.queryString?
				coll.queryString = options.queryString
			coll.fetch({ reset: true })
			@entitiesCache = coll if caching
			return coll

		# TODO: core data caching does not work because tilemap apps rely on the sync event to start.
		# Loads single entity by query.
		# Assumes that a query-specific url method is implemented on the model constructor.
		# @param {object} query - Query object.
		# @param {options} options - Placeholder for future caching implementations.
		getEntity: (query, options) ->
			caching = options? and options.cache
			if caching
				cachedEntity = @_getCachedEntity(query)
				return cachedEntity if cachedEntity?
			Constr = @entityConstructor
			model = new Constr(query)
			model.fetch({ reset: true })
			@entityCache.push { query: query, entity: model } if caching
			return model

		# Get already cached entity.
		_getCachedEntity: (query) ->
			for cachedItem in @entityCache
				if _.isEqual cachedItem.query, query
					return cachedItem.entity