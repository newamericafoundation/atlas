# overlay view layers inherit from this object
class Map.BaseOverlayView

    constructor: (options = {}) ->
        this.map = options.map;
        this.collection = options.collection;
        Map.props.radio.reqres.setHandler('item:map:position', (item) => @getItemMapPosition(item))
        return this;


    setMapEventListeners: () ->
        Map.map.on('viewreset', this.update.bind(this));
        Map.map.on('click', this.onMapClick.bind(this));

    # Initialize.
    renderSvgContainer: () ->
        this.svg = d3.select(this.map.getPanes().overlayPane)
            .append('svg')
            .attr('class', 'deethree');
        this.g = this.svg.append('g')
            .attr('class', 'leaflet-zoom-hide');

    setHeaderStripColor: ->
        project = Map.props.project
        indeces = project.getFriendlyIndeces()
        if indeces.length > 0
            Map.props.radio.commands.execute('set:header:strip:color', { color: Map.colors.toRgb(indeces[0] - 1) })
        else
            Map.props.radio.commands.execute('set:header:strip:color', 'none')

    # Return pixel coordinates of a map display item's centroid.
    getItemMapPosition: (item) ->
        identityPath = d3.geo.path().projection (d) -> return d
        feature = this.getFeatureByModel item
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
        # console.log('mousing out')
        project = Map.props.project
        items = project.get('data').items
        items.setHovered -1
        this.setHeaderStripColor()
        Map.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true })

    # Callback.
    onFeatureMouseOver: (feature) ->
        # console.log('mousing over')
        this.bringFeatureToFront feature if @bringFeatureToFront?
        project = Map.props.project
        items = project.get('data').items
        model = if feature._model? then feature._model else feature.id
        items.setHovered model
        this.setHeaderStripColor()
        Map.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true })

    # Callback.
    onFeatureClick: (feature) ->
        if Map.map? and Map.map.ignoreNextClick
            Map.map.ignoreNextClick = false
            return
        d3.event.stopPropagation() if d3.event.stopPropagation?
        model = feature._model
        project = Map.props.project
        items = project.get('data').items
        items.setActive model
        Map.props.setUiState({ isInfoBoxActive: true })
        Map.map.ignoreNextClick = false
        this.activeFeature = feature

    onRender: -> 
        $('.loading-icon').remove()

    # Callback.
    onMapClick: (e) -> 
        if this.activeFeature?
            this.activeFeature = undefined
            Map.props.radio.vent.trigger('item:deactivate')

    # Returns feature corresponding to model.
    getFeatureByModel: (model) ->
        for feature in @collection.features
            return feature if (feature._model is model)

    # Returns display state of a feature.
    getFeatureDisplayState: (feature) ->
        return unless Map.props.uiState?
        filter = Map.props.project.get('data').filter
        searchTerm = Map.props.uiState.searchTerm
        model = feature._model
        if model?
            return model.getDisplayState(filter, searchTerm)

    # Get feature fill.
    # @param {object} feature
    # @returns {string} fill - Color string or stripe pattern url.
    getFill: (feature) ->
        filter = Map.props.project.get('data').filter
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15)
        return if not valueIndeces? or valueIndeces.length is 0
        if valueIndeces.length is 1
            return Map.colors.toRgb(valueIndeces[0]-1)
        # Communicate with Comp.Setup.Component to create and retrieve stripe pattern id
        id = Map.props.radio.reqres.request('get:pattern:id', valueIndeces)
        return "url(#stripe-pattern-#{id})"

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
        if this._areBoundsFinite bounds
            bounds[0][0] -= extraExpansion
            bounds[0][1] -= extraExpansion
            bounds[1][0] += extraExpansion
            bounds[1][1] += extraExpansion
            topLeft = bounds[0]
            bottomRight = bounds[1]
            this.svg.attr { 'width': bottomRight[0] - topLeft[0], 'height': bottomRight[1] - topLeft[1] + 50 }
            this.svg.style { 'left': topLeft[0] + 'px', 'top': topLeft[1] + 'px' }
            this.g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")")

    # Destroy overlay view along with all event listeners.
    destroy: () ->
        if (this.stopListening)
            this.stopListening();
        this.g.selectAll('path').remove();
        this.g.remove();
        this.svg.remove();
        return this;