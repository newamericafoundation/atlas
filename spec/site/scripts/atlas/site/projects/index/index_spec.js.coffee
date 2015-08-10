describe 'Atlas.Projects.Index', ->

	Index = Atlas.Projects.Index

	describe 'Index', ->

		it 'is a module', ->
			(Index?).should.equal true

		it 'does not start with its parent module', ->
			Index.startWithParent.should.equal false

		it 'has a controller', ->
			(Index.Controller?).should.equal true

		describe 'start', ->

			it 'starts the module', ->
				true.should.equal true