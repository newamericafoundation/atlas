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

			expect(model.toRichGeoJsonFeature()).toEqual
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
			expect(model.toRichGeoJsonFeature()).toEqual
				type: 'Feature'
				_model: model
				geometry:
					type: 'Point'
					coordinates: [ 145.0796161, -37.8602828 ]


	describe '_processValues', ->

		data = getJSONFixture 'project_data/complete/tilemap_pindrop.json'

		it 'removes leading and trailing whitespaces', ->
			expect(Model.prototype._processValues(data.data.items[0])).toEqual
				"name": "California"
				"region": "west"
				"population": 38000000
				"weather": "Excellent"

		it 'breaks by | character and removes leading and trailing whitespaces', ->
			expect(Model.prototype._processValues(data.data.items[1])).toEqual
				"name": "Georgia"
				"region": "southeast"
				"population": 10000000
				"weather": [ "Good", "Ok" ]

		it 'does not break by | character if there is a return character (\n), which indicates Markdown syntax.', ->
			expect(Model.prototype._processValues(data.data.items[2])).toEqual
				"name": "Vermont"
				"region": "northeast"
				"population": 600000
				"weather": "Ok|Nice when things are\njolly"