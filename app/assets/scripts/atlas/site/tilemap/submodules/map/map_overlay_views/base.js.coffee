@Atlas.module "Tilemap.Map", (Map, App, Backbone, Marionette, $, _) ->

    # overlay view layers inherit from this object
	class Map.OverlayBaseView extends Marionette.Object

        initialize: () ->
            @listenTo App.vent, 'key:click display:mode:change', @updateAnimated
            @listenTo App.vent, 'value:mouseover value:mouseout value:click search:term:change', @update

            App.reqres.setHandler 'item:map:position', (item) =>
                identityPath = d3.geo.path().projection (d) -> return d
                feature = @_getFeatureByModel item
                longLatArrayCentroid = identityPath.centroid(feature)
                latLong = L.latLng longLatArrayCentroid[1], longLatArrayCentroid[0]
                map = Map.map
                return map.latLngToContainerPoint(latLong)

            @

        # Fade out, update entire overlaypane and fade back in.
        updateAnimated: () ->
            $el = $('.leaflet-overlay-pane')
            # call stop() to reset previously started animations
            $el.stop().animate { opacity: 0 }, 750, 'swing', () =>
                @update()
                $el.animate({ opacity: 1 }, 750)

        # Callback.
        onFeatureMouseOut: () ->
            App.vent.trigger 'item:mouseout'

        # Callback.
        onFeatureMouseOver: (feature) ->
            # console.log d3.geo.path().centroid(feature), Map.map.getPixelOrigin().x, Map.map.getPixelOrigin().y
            @bringFeatureToFront feature if @bringFeatureToFront?
            message = if feature._model? then feature._model else feature.id
            App.vent.trigger 'item:mouseover', message

        # Callback.
        onFeatureClick: (feature) ->
            if Map.map? and Map.map.ignoreNextClick
                App.commands.execute 'destroy:popup'
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
            filter = App.currentProjectModel.get('data').filter
            # filter = App.reqres.request 'filter'
            searchTerm = App.reqres.request 'search:term'
            model = feature._model
            if model?
                return model.getDisplayState(filter, searchTerm, App.currentDisplayMode)

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

        destroy: () ->
            @stopListening()
            @g.selectAll('path').remove()
            @g.remove()
            @svg.remove()
            @