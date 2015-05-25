@Atlas.module 'Projects.Show.Tilemap.Map', (Map, App, Backbone, Marionette, $, _) ->

	Map.Controller = 

		show: ->
			# needs mapbox.js
			Map.rootView = new Map.RootView().render()

			#needs d3.js
			@renderOverlayView()

		destroy: ->
			Map.overlayView.destroy() if (Map.overlayView? and Map.overlayView.destroy?)
			Map.mapView.destroy() if (Map.mapView? and Map.mapView.destroy?)

		renderOverlayView: ->
			items = App.reqres.request('item:entities')
			itemType = items.getItemType()
			View = if itemType is 'state' then Map.PathOverlayView else Map.PindropOverlayView
			coll = items.getRichGeoJson()
			coll.onReady ->
				overlayView = new View()
				overlayView.collection = coll
				# expose to module
				Map.overlayView = overlayView
				overlayView.render()
			@