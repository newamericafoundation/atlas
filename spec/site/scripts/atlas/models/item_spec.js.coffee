describe 'Atlas.Models.Items', ->

	Models = Atlas.Models.Items

	describe 'getValueList', ->

		it 'returns value list for a given data key, removing duplicates', ->
			json = [
				{ key: 'value1' }
				{ key: 'value2' }
				{ key: 'value1' }
				{ key: 'value3' }
				{ key: 'value2' }
				{ key: 'value2' }
			]
			coll = new Models json
			coll.getValueList('key').should.eql [ 'value1', 'value2', 'value3' ]


	describe 'getLatLongBounds', ->

		it 'returns latLng bounds as array of arrays', ->
			json = [
				{ lat: -40, long: +80 }
				{ lat: +79, long: +80 }
				{ lat: +40, long: +80 }
				{ lat: +80, long: +40 }
			]
			coll = new Models json
			coll.getLatLongBounds().should.eql [ [- 40, 40], [80, 80] ]


	describe 'toLatLongMultiPoint', ->

		it 'returns latLng multipoint object', ->
			json = [
				{ lat: -40, long: 80 }
				{ lat: +79, long: 80 }
			]
			coll = new Models json
			coll.toLatLongMultiPoint().should.eql [ [- 40, 80], [79, 80] ]


describe 'Atlas.Projects.Show.Tilemap.Entities.itemChecker', ->

	data = undefined
	model = new Atlas.Models.Item()

	describe 'findAndReplaceKey', ->

		it 'recognizes data having a standard key', ->
			data =
				lat: 100
				long: 150
			(model._findAndReplaceKey(data, 'lat')).should.eql true
			(data).should.eql { lat: 100, long: 150 }

		it 'recognizes data with a key that is listed in the key format list', ->
			data =
				latitude: 100
				long: 150
			(model._findAndReplaceKey(data, 'lat', ['lat', 'latitude'])).should.eql true
			(data).should.eql { lat: 100, long: 150 }


	describe 'pindrop', ->

		it 'recognizes and validates data with a latitude and longitude value; standardizes lat and long fields', ->
			data = 
				latitude: 100
				long: 150
			(model._checkPindrop(data)).should.eql { recognized: true, errors: [] }
			(data).should.eql { lat: 100, long: 150, _itemType: 'pindrop' }

		it 'recognizes and returns error for data with either latitude or longitude missing.', ->
			data = 
				latitudezz: 100
				long: 150
			(model._checkPindrop(data)).should.eql { recognized: true, errors: [ 'Latitude or longitude not found.' ] }


	describe 'state', ->

		it 'recognizes and does not give errors for data with a state key and a correct state name in capitalized case; completes fields', ->
			data = { name: 'New Jersey' }
			(model._checkState(data)).should.eql { recognized: true, errors: [] }
			(data).should.eql { name: 'New Jersey', code: 'NJ', id: 34, _itemType: 'state' }

		it 'recognizes and returns error for data with a state key but incorrect state name or case', ->
			data = { name: 'new Jersey' }
			(model._checkState(data)).should.eql { recognized: true, errors: [ 'new Jersey not recognized as a state. Possibly a typo.' ] }

		it 'does not recognize data without a name key', ->
			data = { stateName: 'new Jersey' }
			(model._checkState(data)).should.eql { recognized: false }




describe 'Atlas.Models.Item', ->

	Model = Atlas.Models.Item

	describe 'toRichGeoFeature', ->

		it 'returns a GeoJSON point feature using lat and long attributes as coordinates', ->
			json = 
				lat: 1
				long: 2
				name: 'some name'
				attribute: 'some attribute'

			model = new Model json

			model.toRichGeoJsonFeature().should.eql
				type: 'Feature'
				_model: model
				geometry:
					type: 'Point'
					coordinates: [2, 1]


		it 'use default values Melbourne, Australia values if either latitude or longitude are not defined', ->
			json =
				name: 'some name'
				attribute: 'some attribute'
			model = new Model json
			model.toRichGeoJsonFeature().should.eql
				type: 'Feature'
				_model: model
				geometry:
					type: 'Point'
					coordinates: [ 145.0796161, -37.8602828 ]


	describe '_processValues', ->

		data = fixtures.tilemap_pindrop

		it 'removes leading and trailing whitespaces', ->
			console.log(data.data.items[0])
			Model.prototype._processValues(data.data.items[0]).should.eql
				"name": "California"
				"region": "west"
				"population": 38000000
				"weather": "Excellent"

		it 'breaks by | character and removes leading and trailing whitespaces', ->
			Model.prototype._processValues(data.data.items[1]).should.eql
				"name": "Georgia"
				"region": "southeast"
				"population": 10000000
				"weather": [ "Good", "Ok" ]

		it 'does not break by | character if there is a return character (\n), which indicates Markdown syntax.', ->
			Model.prototype._processValues(data.data.items[2]).should.eql
				"name": "Vermont"
				"region": "northeast"
				"population": 600000
				"weather": "Ok|Nice when things are\njolly"

	describe 'matchesSearchTerm', ->

		it 'matches search term on the name attribute', ->
			m = new Model
				name: 'Fancy Name'
			m.matchesSearchTerm('ncy n').should.equal true