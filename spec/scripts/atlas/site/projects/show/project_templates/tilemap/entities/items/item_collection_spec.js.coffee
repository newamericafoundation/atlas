describe 'Atlas.Projects.Show.Tilemap.Entities.Model.ItemCollection', ->

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
			coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection json
			expect(coll.getValueList('key')).toEqual [ 'value1', 'value2', 'value3' ]


	describe 'getLatLongBounds', ->

		it 'returns latLng bounds as array of arrays', ->
			json = [
				{ lat: -40, long: +80 }
				{ lat: +79, long: +80 }
				{ lat: +40, long: +80 }
				{ lat: +80, long: +40 }
			]
			coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection json
			expect(coll.getLatLongBounds()).toEqual([ [- 40, 40], [80, 80] ])


	describe 'toLatLongMultiPoint', ->

		it 'returns latLng multipoint object', ->
			json = [
				{ lat: -40, long: 80 }
				{ lat: +79, long: 80 }
			]
			coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection json
			expect(coll.toLatLongMultiPoint()).toEqual([ [- 40, 80], [79, 80] ])