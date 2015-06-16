describe 'Atlas.Base.EntitiesApi', ->

	Mngr = Atlas.Base.EntityManager

	describe 'getEntities', ->

		it 'does not fire network request if the entities are cacheable', ->
			api = new Mngr()
			cache = { models: [ {}, {}, {} ] }
			api.entitiesCache = cache
			api.getEntities({ cache: true }).should.eql cache


	describe '_getCachedEntity', ->

		it 'returns undefined if the cache is empty', ->
			api = new Mngr()
			api._getCachedEntity({ key: 'value' })?.should.equal false