@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class RichGeoJson extends Marionette.Object

		constructor: ->
			@type = 'FeatureCollection'
			@features = []

		onReady: (next) ->
			if @features.length > 0
				next()
				return
			@on 'sync', next


	# Create GeoJson elements based on item type.
	# Model references are injected in the GeoJson.
	Entities.itemGeoJsonInjecters = 

		pindrop: (itemCollection) ->

			richGeoJson = new RichGeoJson()

			for item in itemCollection.models
				richGeoJson.features.push item.toRichGeoJsonFeature()

			richGeoJson.trigger 'sync'
			richGeoJson


		state: (itemCollection) ->
			
			richGeoJson = new RichGeoJson()

			coreDatum = App.reqres.request 'core:datum:entity', 'us-states-10m'
			coreDatum.on 'sync', =>
				data = coreDatum.get('data')
				richGeoJson.features = topojson.feature(data, data.objects.states).features

				for feature in richGeoJson.features
					item = itemCollection.findWhere { id: feature.id }
					feature._model = item

				richGeoJson.trigger 'sync'

			return richGeoJson