@Atlas.module "Map", (Map, App, Backbone, Marionette, $, _) ->

    # overlay view layers inherit from this object
	class Map.OverlayBaseView extends Marionette.Object

        initialize: () ->
            @listenTo App.vent, 'key:click display:mode:change', @updateAnimated
            @listenTo App.vent, 'value:mouseover value:mouseout value:click search:term:change', @update
            App.reqres.setHandler 'item:map:position', (item) => @getItemMapPosition(item)
            @

        setHeaderStripColor: ->
            project = Map.props.project
            items = project.get('data').items
            filter = project.get('data').filter
            hoveredItem = items.hovered
            if hoveredItem?
                indeces = filter.getFriendlyIndeces(hoveredItem, 15)
                cls = "bg-c-#{indeces[0]}"
                App.commands.execute 'set:header:strip:color', { className: cls }
            else
                App.commands.execute 'set:header:strip:color', 'none'


        # Return pixel coordinates of a map display item's centroid.
        getItemMapPosition: (item) ->
            identityPath = d3.geo.path().projection (d) -> return d
            feature = @_getFeatureByModel item
            longLatArrayCentroid = identityPath.centroid(feature)
            latLong = L.latLng longLatArrayCentroid[1], longLatArrayCentroid[0]
            map = Map.map
            return map.latLngToContainerPoint(latLong)

        # Fade out, update entire overlaypane and fade back in.
        updateAnimated: () ->
            $el = $('.leaflet-overlay-pane')
            # call stop() to reset previously started animations
            $el.stop().animate { opacity: 0 }, 750, 'swing', () =>
                @update()
                $el.animate({ opacity: 1 }, 750)

        # Callback.
        onFeatureMouseOut: (feature) ->
            project = Map.props.project
            items = project.get('data').items
            items.setHovered -1
            @setHeaderStripColor()
            App.commands.execute 'update:tilemap'

        # Callback.
        onFeatureMouseOver: (feature) ->
            @bringFeatureToFront feature if @bringFeatureToFront?
            project = Map.props.project
            items = project.get('data').items
            model = if feature._model? then feature._model else feature.id
            items.setHovered model
            @setHeaderStripColor()
            App.commands.execute 'update:tilemap'

        # Callback.
        onFeatureClick: (feature) ->
            if Map.map? and Map.map.ignoreNextClick
                Map.map.ignoreNextClick = false
                return
            d3.event.stopPropagation() if d3.event.stopPropagation?
            message = if feature._model? then feature._model else feature.id
            App.vent.trigger 'item:activate', message
            Map.map.ignoreNextClick = false
            @activeFeature = feature

        onRender: -> 
            $('.loading-icon').remove()

        # Callback.
        onMapClick: (e) -> 
            if @activeFeature?
                @activeFeature = undefined
                App.vent.trigger 'item:deactivate'

        # Returns feature corresponding to model.
        _getFeatureByModel: (model) ->
            for feature in @collection.features
                return feature if (feature._model is model)

        # Returns display state of a feature.
        getFeatureDisplayState: (feature) ->
            display = Map.props.uiState.display
            filter = Map.props.project.get('data').filter
            searchTerm = App.reqres.request 'search:term'
            model = feature._model
            if model?
                return model.getDisplayState(filter, searchTerm, display)

        # Checks if bounds are finite.
        # @returns {boolean}
        _areBoundsFinite: (bounds) ->
            return isFinite(bounds[0][0]) and isFinite(bounds[0][1]) and isFinite(bounds[1][0]) and isFinite(bounds[1][1])

        # Resizes and repositions svg container and its direct child group.
        # @param {object} svg
        # @param {object} g
        # @param {object} geoJson
        # @param {object} path
        # @param {number} extraExpansion - Pixel amount the svg container is to be expanded by, in order to avoid clipping off parts of shapes close to the edge.
        resizeContainer: (geoJson, path, extraExpansion) ->
            bounds = path.bounds(geoJson)
            if @_areBoundsFinite bounds
                bounds[0][0] -= extraExpansion
                bounds[0][1] -= extraExpansion
                bounds[1][0] += extraExpansion
                bounds[1][1] += extraExpansion
                topLeft = bounds[0]
                bottomRight = bounds[1]
                @svg.attr { 'width': bottomRight[0] - topLeft[0], 'height': bottomRight[1] - topLeft[1] + 50 }
                @svg.style { 'left': topLeft[0] + 'px', 'top': topLeft[1] + 'px' }
                @g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")")

        # Destroy overlay view along with all event listeners.
        destroy: () ->
            @stopListening()
            @g.selectAll('path').remove()
            @g.remove()
            @svg.remove()
            @