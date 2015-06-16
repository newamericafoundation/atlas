describe 'Atlas.Projects.Show.Tilemap.Entities.ItemModel', ->

	Model = Atlas.Projects.Show.Tilemap.Entities.ItemModel

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