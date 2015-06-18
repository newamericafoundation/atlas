@Atlas.module 'Projects.Show.Tilemap.Map', (Map, App, Backbone, Marionette, $, _) ->

	Map.Controller = 

		show: ->
			global = if L? then L else undefined
			@fetchScript global, '/assets/vendor/mapbox.js', @showMain.bind(@)

		showMain: ->
			Map.rootView = new Map.RootView().render()#
			global = if d3? then d3 else undefined
			@$loading = $("<div class='loading-icon'><div>Loading...</div></div>")
			$('.atl__main').append @$loading
			@fetchScript global, '/assets/vendor/d3.min.js', @showOverlay.bind(@)
			
		showOverlay: ->
			@renderOverlayView()

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

		# Destroys view, including map base and overlay.
		destroy: ->
			Map.overlayView.destroy() if (Map.overlayView? and Map.overlayView.destroy?)
			Map.mapView.destroy() if (Map.mapView? and Map.mapView.destroy?)

		# Asynchronously fetch a global dependency.
		# @param {object} global - Use: global = if jQuery? then jQuery else undefined.
		# @param {string} path - Script path on the server.
		# @param {function} next - Callback.
		# @returns {object} this
		fetchScript: (global, path, next) ->
			if global?
				next()
			else
				$.ajax
					url: path
					dataType: 'script'
					success: next