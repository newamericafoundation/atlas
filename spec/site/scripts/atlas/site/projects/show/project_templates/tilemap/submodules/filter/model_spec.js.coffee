describe 'Atlas.Projects.Show.Tilemap.Filter.Model', ->

	obj = undefined
	filter = undefined

	beforeEach ->

		obj = 
			activeIndex: 0
			variables: [
					variable_id: 'origin',
					_isActive: true,
					options: [
						{ value: 'ethiopia', _isActive: true }
						{ value: 'indonesia', _isActive: true }
						{ value: 'nicaragua', _isActive: true }
					] 
				,
					variable_id: 'roast',
					_isActive: true,
					options: [
						{ value: 'dark', _isActive: true }
						{ value: 'light', _isActive: true }
					] 
			]

		filter = new Atlas.Projects.Show.Tilemap.Filter.Model obj


	describe 'constructor', ->

		it 'builds nested structure', ->
			filter.children[0].get('variable_id').should.equal 'origin'

		it 'builds double nested structure', ->
			filter.children[1].children[1].get('value').should.equal 'light'


	describe 'test grandchildren', ->

		it 'deactivates model', ->
			grandchild = filter.children[0].children[0]
			grandchild.test({ 'origin': 'ethiopia' }).should.equal true

			grandchild.deactivate()
			grandchild.test({ 'origin': 'ethiopia' }).should.equal false


	describe 'test children', ->

		it 'tests data that has tested data key', ->
			child = filter.children[0]
			child.test({ 'origin': 'ethiopia' }).should.equal true

		it 'tests data that does not have tested data key', ->
			child = filter.children[0]
			child.test({ 'roast': 'light' }).should.equal false


	describe 'test main', ->

		it 'tests data that has tested data key', ->
			filter.test({ 'origin': 'ethiopia' }).should.equal true

		it 'tests data that does not have tested data key', ->
			filter.test({ 'roast': 'light' }).should.equal false