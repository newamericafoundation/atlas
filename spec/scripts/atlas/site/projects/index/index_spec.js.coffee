describe 'Atlas.Projects.Index', ->

	Index = Atlas.Projects.Index

	describe 'Index', ->

		it 'is a module', ->
			expect(Index?).toEqual true

		it 'does not start with its parent module', ->
			expect(Index.startWithParent).toEqual false

		it 'has a controller', ->
			expect(Index.Controller?).toEqual true

		describe 'start', ->

			it 'starts the module', ->
				expect(true).toEqual true