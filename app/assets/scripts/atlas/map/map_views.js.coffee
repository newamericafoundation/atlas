	# This is a custom view constructor that uses d3 and Mapbox to render graphics.
	class Map.RootView

		constructor: (options) ->
			@el = options.el
			@elId = @el.substr(1)
			@$el = $(@el)
			_.extend(@, Backbone.Events)
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

			_.extend(@map, Map.control)

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
			@map = L.mapbox.map(@elId, 'rossvanderlinde.874ab107', @getMapOptions())
			Map.props.setMap(@map)
			@_setupMap()
			@hideAttribution()
			@

		hideAttribution: ->
			$('.leaflet-control-attribution').hide()

		# Destroy view. Clear Leaflet-specific event listeners.
		destroy: ->
			return unless @map?
			@map.clearAllEventListeners()
			@map.remove()
			@