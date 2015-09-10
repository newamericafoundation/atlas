@Atlas.module 'Map', (Map) ->

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
				items = Map.props.project.get('data').items
				if e.distance > 15 and items.hovered? 
					@map.ignoreNextClick = true
			# Expose map to the module. 
			Map.map = @map
			
		getMapOptions: ->
			return {
				attributionControl: true
				zoomControl: false
				inertia: false
			}

		# Render view.
		render: ->
			L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw'
			@map = L.mapbox.map @elId, 'rossvanderlinde.874ab107', @getMapOptions()
			@$attribution = $('.leaflet-control-attribution')
			@$attribution.hide()
			@_setupMap()
			@_addControl()
			@


		# Add control buttons.
		_addControl: ->
			html = "<div class='atl__map-control'>
				<div id='atl__map-attribution' class='atl__map-control__button bg-img-info--black'></div> 
				<div id='atl__map-zoom-in'  class='atl__map-control__button bg-img-plus--black'></div>
				<div id='atl__map-zoom-out' class='atl__map-control__button bg-img-minus--black'></div>
				<div class='atl__help atl__help--left'>
					View <b>copyright</b> information about the map and <b>zoom</b> in and out.
				</div>
			</div>"
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