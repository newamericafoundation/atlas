@Atlas.module 'Map', (Map, App, Backbone, Marionette, $, _) ->

	Map.Controller = 

		show: ->
			$().ensureScript 'L', '/assets/vendor/mapbox.js', @showMain.bind(@)

		showMain: ->
			Map.rootView = new Map.RootView().render()
			@$loading = $("<div class='loading-icon'><div>Loading...</div></div>")
			$('.atl__main').append @$loading
			$().ensureScript 'd3', '/assets/vendor/d3.min.js', @showOverlay.bind(@)
			
		showOverlay: ->
			@renderOverlayView()

		renderOverlayView: ->

			items = App.reqres.request('item:entities') 
			itemType = items.getItemType()

			View = if itemType is 'state' then Map.PathOverlayView else Map.PindropOverlayView

			launch = (baseGeoData) ->
				coll = items.getRichGeoJson(baseGeoData)
				coll.onReady ->
					overlayView = new View()
					overlayView.collection = coll
					# expose to module
					Map.overlayView = overlayView
					overlayView.render()

			@getStateBaseGeoData launch

			@

		getStateBaseGeoData: (next) ->
			data = App['us-states-10m']
			if data?
				next data
			else
				$.ajax
					url: '/data/us-states-10m.js'
					dataType: 'script'
					success: () ->
						next App['us-states-10m']


		# Destroys view, including map base and overlay.
		destroy: ->
			Map.overlayView.destroy() if (Map.overlayView? and Map.overlayView.destroy?)
			Map.mapView.destroy() if (Map.mapView? and Map.mapView.destroy?)