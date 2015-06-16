describe 'Atlas.Projects.Show.Tilemap.Entities.itemChecker', ->

	data = undefined
	checker = Atlas.Projects.Show.Tilemap.Entities.itemChecker

	describe 'findAndReplaceKey', ->

		it 'recognizes data having a standard key', ->
			data =
				lat: 100
				long: 150
			(checker.findAndReplaceKey(data, 'lat')).should.eql true
			(data).should.eql { lat: 100, long: 150 }

		it 'recognizes data with a key that is listed in the key format list', ->
			data =
				latitude: 100
				long: 150
			(checker.findAndReplaceKey(data, 'lat', ['lat', 'latitude'])).should.eql true
			(data).should.eql { lat: 100, long: 150 }


	describe 'pindrop', ->

		it 'recognizes and validates data with a latitude and longitude value; standardizes lat and long fields', ->
			data = 
				latitude: 100
				long: 150
			(checker.pindrop(data)).should.eql { recognized: true, errors: [] }
			(data).should.eql { lat: 100, long: 150, _itemType: 'pindrop' }

		it 'recognizes and returns error for data with either latitude or longitude missing.', ->
			data = 
				latitudezz: 100
				long: 150
			(checker.pindrop(data)).should.eql { recognized: true, errors: [ 'Latitude or longitude not found.' ] }


	describe 'state', ->

		it 'recognizes and does not give errors for data with a state key and a correct state name in capitalized case; completes fields', ->
			data = { name: 'New Jersey' }
			(checker.state(data)).should.eql { recognized: true, errors: [] }
			(data).should.eql { name: 'New Jersey', code: 'NJ', id: 34, _itemType: 'state' }

		it 'recognizes and returns error for data with a state key but incorrect state name or case', ->
			data = { name: 'new Jersey' }
			(checker.state(data)).should.eql { recognized: true, errors: [ 'new Jersey not recognized as a state. Possibly a typo.' ] }

		it 'does not recognize data without a name key', ->
			data = { stateName: 'new Jersey' }
			(checker.state(data)).should.eql { recognized: false }