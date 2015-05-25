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
			expect(filter.children[0].get('variable_id')).toEqual('origin')

		it 'builds double nested structure', ->
			expect(filter.children[1].children[1].get('value')).toEqual('light')


	describe 'test grandchildren', ->

		it 'deactivates model', ->
			grandchild = filter.children[0].children[0]
			expect(grandchild.test({ 'origin': 'ethiopia' })).toEqual(true)

			grandchild.deactivate()
			expect(grandchild.test({ 'origin': 'ethiopia' })).toEqual(false)


	describe 'test children', ->

		it 'tests data that has tested data key', ->
			child = filter.children[0]
			expect(child.test({ 'origin': 'ethiopia' })).toEqual(true)

		it 'tests data that does not have tested data key', ->
			child = filter.children[0]
			expect(child.test({ 'roast': 'light' })).toEqual(false)


	describe 'test main', ->

		it 'tests data that has tested data key', ->
			expect(filter.test({ 'origin': 'ethiopia' })).toEqual(true)

		it 'tests data that does not have tested data key', ->
			expect(filter.test({ 'roast': 'light' })).toEqual(false)