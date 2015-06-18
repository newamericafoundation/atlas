@Atlas.module 'Projects.Show.Tilemap.Map', (Map, App, Backbone, Marionette, $, _) ->

	# This is a custom view constructor that uses d3 and Mapbox to render graphics.
	Map.RootView = Marionette.Object.extend

		el: '#atl__map'

		initialize: (options) ->
			@elId = @el.substr(1)
			@$el = $(@el)
			@
			

		# Get optimal start zoom level corresponding to the width of the container.
		_getZoomLevel: ->
			# zoom breakpoints: 1350 -> 5, 700 -> 4, 400 -> 3
			width = @$el.width()
			return 5 if width > 1350
			return 4 if width > 700
			return 3

		# Set up map.
		_setupMap: ->
			zoomLevel = @_getZoomLevel()
			@map.setView [37.6, -95.665], zoomLevel 
			@map.scrollWheelZoom.disable()
			# add control convenience methods
			_.extend @map, Map.control
			@map.ignoreNextClick = false
			# do not register a map item click event if it is fired due to a map drag end
			@map.on 'dragend', (e) =>
				# use functionality only if there is sufficient drag
				#   as Leaflet sometimes detects slightly imperfect clicks as drags
				items = App.reqres.request 'item:entities'
				if e.distance > 15 and items.hovered? 
					@map.ignoreNextClick = true
			# Expose map to the module. 
			Map.map = @map
			

		# Render view.
		render: ->
			
			L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw'

			@map = L.mapbox.map @elId, 'rossvanderlinde.874ab107',
				attributionControl: true
				#maxZoom: 8
				#minZoom: 4
				#maxBounds: L.latLngBounds L.latLng(-90, -270), L.latLng(+90, +270)
				zoomControl: false
				inertia: false

			@$attribution = $('.leaflet-control-attribution')
			@$attribution.hide()

			@_setupMap()
			@_addControl()
			@


		# Add control buttons.
		_addControl: ->
			html = Marionette.Renderer.render('projects/show/project_templates/tilemap/templates/zoom_bar', {})
			@$el.append html
			@$zoomInButton = $('#atl__map-zoom-in')
			@$zoomOutButton = $('#atl__map-zoom-out')
			@$attributionButton = $('#atl__map-attribution')
			@_setZoomEvents()
			@_setAttributionEvents()


		#
		_setZoomEvents: () ->
			map = @map
			@$zoomInButton.on 'click', -> map.changeZoom +1
			@$zoomOutButton.on 'click', -> map.changeZoom -1
			@


		_setAttributionEvents: ->
			@$attributionButton
				.on 'click', => 
					@$attribution.toggle()



		# Clears zoom event listeners for zoom buttons.
		clearZoom: ->
			@$zoomInButton.off()
			@$zoomOutButton.off()
			@


		# Destroy view. Clear Leaflet-specific event listeners.
		destroy: ->
			@clearZoom()
			if @map
				@map.clearAllEventListeners()
				@map.remove()
			@