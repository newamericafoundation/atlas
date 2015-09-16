    # view constructor written using the module pattern (function returning an object, without a new keyword)
    class Map.PathOverlayView extends Map.OverlayBaseView

        # Brings feature to the top so its stroke is not covered by non-highlighted paths.
        bringFeatureToFront: (feature) ->
            @g.selectAll('path').sort (a, b) ->
                return -1 if a.id isnt feature.id
                return +1

        # Initialize.
        renderSvgContainer: () ->
            this.svg = d3.select(this.map.getPanes().overlayPane)
                .append('svg')
                .attr('class', 'deethree')
            this.g = this.svg.append('g')
                .attr('class', 'leaflet-zoom-hide')

        # Backbone-like render method.
        render: () ->
            this.renderSvgContainer() if this.renderSvgContainer?
            this.geoJson = this.collection
            self = this
            this.g.selectAll('path')
                .data @geoJson.features
                .enter()
                .append 'path'
                .on('mouseover', this.onFeatureMouseOver.bind(this))
                .on('mouseout', this.onFeatureMouseOut.bind(this))
                .on 'click', (d) ->
                    return if d3.event.defaultPrevented
                    self.onFeatureClick(d)
            this.update()
            # TODO - move into a common onShow method
            this.onRender()
            this.map.on('viewreset', this.update.bind(this))
            this.map.on('click', this.onMapClick.bind(this))
            return this

        # Get projected point.
        # @param {number} long
        # @param {number} lat
        # @returns {object}
        getProjectedPoint = (long, lat) ->
            this.map.latLngToLayerPoint(new L.LatLng(lat, long))

        # Get transform path.
        getPath: ->
            self = this
            getProjectedPoint = (long, lat) ->
                self.map.latLngToLayerPoint(new L.LatLng(lat, long))
            projectPoint = (long, lat) ->
                point = getProjectedPoint(long, lat)
                this.stream.point(point.x, point.y)
                return this
            transform = d3.geo.transform({ point: projectPoint })
            path = d3.geo.path().projection(transform)
            path


        # Apply transform and classes on paths.
        update: () ->
            path = this.getPath()
            geoJson = this.collection
            this.g.selectAll('path')
                .attr
                    'class': (feature) =>
                        displayState = @getFeatureDisplayState(feature)
                        cls = 'map-region map-region__element'
                        cls += " map-region--#{displayState}" if displayState?
                        return cls
                    'd': path
                    'fill': @getFill.bind(@)
                        
            this.resizeContainer(geoJson, path, 0)
            return this