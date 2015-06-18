@Atlas.module "Projects.Show.Tilemap.Map", (Map, App, Backbone, Marionette, $, _) ->

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

        # Apply transform and classes on paths.
        update: () ->
            path = @getPath()
            geoJson = @collection
            @g.selectAll('path')
                .attr
                    'class': (feature) =>
                        featureClasses = @getFeatureClasses(feature, 'map-region')
                        if featureClasses?
                            return featureClasses.group + " " + (if featureClasses.elements[0]? then featureClasses.elements[0] else featureClasses.elementBase)
                        ""
                    'd': path
            @resizeContainer(geoJson, path, 0)
            @