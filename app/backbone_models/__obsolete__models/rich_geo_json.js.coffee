@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.RichGeoJson = Backbone.Model.extend

		initialize: ->
			_.extend(@, Backbone.Events)
			@type = 'FeatureCollection'
			@features = []

		onReady: (next) ->
			if @features.length > 0
				next()
				return
			@on 'sync', next