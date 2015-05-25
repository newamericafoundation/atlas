describe 'Atlas.Base.EntitiesApi', ->

	Mngr = Atlas.Base.EntityManager

	describe 'getEntities', ->

		it 'does not fire network request if the entities are cacheable', ->
			api = new Mngr()
			cache = { models: [ {}, {}, {} ] }
			api.entitiesCache = cache
			expect(api.getEntities({ cache: true })).toEqual(cache)


	describe '_getCachedEntity', ->

		it 'returns undefined if the cache is empty', ->
			api = new Mngr()
			expect(api._getCachedEntity({ key: 'value' })).toEqual undefined