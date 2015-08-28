@Atlas.module "Map", (Map, App, Backbone, Marionette, $, _) ->

    # view constructor written using the module pattern (function returning an object, without a new keyword)
    class Map.PathOverlayView extends Map.OverlayBaseView

        # Brings feature to the top so its stroke is not covered by non-highlighted paths.
        bringFeatureToFront: (feature) ->
            @g.selectAll('path').sort (a, b) ->
                return -1 if a.id isnt feature.id
                return +1

        # Initialize.
        renderSvgContainer: () ->
            @svg = d3.select(Map.map.getPanes().overlayPane)
                .append('svg')
                .attr('class', 'deethree')
            # @appendPatternDefs()
            @g = @svg.append('g')
                .attr('class', 'leaflet-zoom-hide')

        # Backbone-like render method.
        render: () ->
            @renderSvgContainer() if @renderSvgContainer?
            @geoJson = @collection
            self = @
            @g.selectAll('path')
                .data @geoJson.features
                .enter()
                .append 'path'
                .on 'mouseover', @onFeatureMouseOver.bind(@)
                .on 'mouseout', @onFeatureMouseOut.bind(@)
                .on 'click', (d) ->
                    return if d3.event.defaultPrevented
                    self.onFeatureClick(d)
            @update()
            # TODO - move into a common onShow method
            @onRender()
            Map.map.on 'viewreset', @update.bind @
            Map.map.on 'click', @onMapClick.bind @
            @

        # Get projected point.
        # @param {number} long
        # @param {number} lat
        # @returns {object}
        getProjectedPoint = (long, lat) ->
            Map.map.latLngToLayerPoint(new L.LatLng(lat, long))

        # Get transform path.
        getPath: ->
            getProjectedPoint = (long, lat) ->
                Map.map.latLngToLayerPoint(new L.LatLng(lat, long))
            projectPoint = (long, lat) ->
                point = getProjectedPoint(long, lat)
                @stream.point(point.x, point.y)
                @
            transform = d3.geo.transform({ point: projectPoint })
            path = d3.geo.path().projection(transform)
            path

        # Get feature fill.
        # @param {object} feature
        # @returns {string} fill - Color string or stripe pattern url.
        getFill: (feature) ->
            
            filter = Map.props.project.get('data').filter
            valueIndeces = filter.getFriendlyIndeces(feature._model, 15)
            return if not valueIndeces? or valueIndeces.length is 0

            if valueIndeces.length is 1
                return App.CSS.Colors.toRgb(valueIndeces[0]-1)

            # Communicate with Comp.Setup.Component to create and retrieve stripe pattern id
            id = App.reqres.request('get:pattern:id', valueIndeces)
            return "url(#stripe-pattern-#{id})"


        # Apply transform and classes on paths.
        update: () ->
            console.log('updating paths')
            path = @getPath()
            geoJson = @collection
            @g.selectAll('path')
                .attr
                    'class': (feature) =>
                        displayState = @getFeatureDisplayState(feature)
                        cls = 'map-region map-region__element'
                        cls += " map-region--#{displayState}" if displayState?
                        return cls
                    'd': path
                    'fill': @getFill.bind @
                        
            @resizeContainer(geoJson, path, 0)
            @