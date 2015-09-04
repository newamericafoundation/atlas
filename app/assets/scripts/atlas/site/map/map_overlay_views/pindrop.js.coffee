@Atlas.module "Map", (Map, App, Backbone, Marionette, $, _) ->

	class Map.PindropOverlayView extends Map.OverlayBaseView

        renderSvgContainer: () ->

            @svg = d3.select(Map.map.getPanes().overlayPane)
                .append('svg')
                .attr('class', 'deethree')

            @g = @svg.append('g')
                .attr('class', 'leaflet-zoom-hide')


        setMapEventListeners: () ->
            Map.map.on 'viewreset', @update.bind @
            Map.map.on 'click', @onMapClick.bind @

        render: () ->

            @renderSvgContainer() if @renderSvgContainer?

            @shape = App.Assets.svg.shapes.pindrop

            pindrop = [
                { path: @shape.paths.slice_1_of_2, className: 'map-pin__1-of-2' }
                { path: @shape.paths.slice_2_of_2,  className: 'map-pin__2-of-2' }
                { path: @shape.paths.slice_1_of_3, className: 'map-pin__1-of-3' }
                { path: @shape.paths.slice_2_of_3_a,  className: 'map-pin__2-of-3' }
                { path: @shape.paths.slice_2_of_3_b,  className: 'map-pin__2-of-3' }
                { path: @shape.paths.slice_3_of_3,  className: 'map-pin__3-of-3' }    
                { path: @shape.paths.outer, className: 'map-pin__outer' }
                { path: @shape.paths.inner, className: 'map-pin__inner' }
            ]

            @g.selectAll('g')
                .data @collection.features
                .enter()
                .append 'g'
                .attr { 'class': 'map-pin'}
                .on 'mouseover', @onFeatureMouseOver.bind @
                .on 'mouseout', @onFeatureMouseOut.bind @
                .on 'click', @onFeatureClick.bind @
                .selectAll 'path'
                .data pindrop 
                .enter()
                .append 'path'
                .attr
                    'd'    : (d) -> d.path
                    'class': (d) -> d.className

            @update()

            @onRender()

            @setMapEventListeners()


        getFills: (feature) ->
            filter = Map.props.project.get('data').filter
            valueIndeces = filter.getFriendlyIndeces(feature._model, 15)
            return if not valueIndeces? or valueIndeces.length is 0
            return valueIndeces.map (valueIndex) ->
                return App.CSS.Colors.toRgb(valueIndex-1)


        update: () ->

            getProjectedPoint = (long, lat) ->
                Map.map.latLngToLayerPoint(new L.LatLng(lat, long))

            projectPoint = (long, lat) ->
                point = getProjectedPoint(long, lat)
                @stream.point(point.x, point.y)
                @

            # Assuming a class name of the form .base__1-of-3, extracts numbers 1 and 3 in an array.
            # @returns {array}
            getIndecesFromClassName = (cls) ->
                indeces = cls.split('__')[1].split('-')
                if indeces[2]?
                    indeces = indeces = [ parseInt(indeces[0], 10), parseInt(indeces[2], 10) ]
                    return indeces

            transform = d3.geo.transform({ point: projectPoint })
            path = d3.geo.path().projection(transform)

            self = @

            @g.selectAll('g')
                .attr
                    transform: (d) ->
                        coord = d.geometry.coordinates
                        pt = getProjectedPoint coord[0], coord[1]
                        # The display coordinates for an SVG point to the upper left corner of an SVG.
                        #   To correctly center the map pin, subtract half the width and the full height.
                        x = pt.x - self.shape.dim.width/2
                        y = pt.y - self.shape.dim.height
                        "translate(#{x},#{y})"
                    class: (feature) ->
                        displayState = self.getFeatureDisplayState(feature)
                        cls = 'map-pin map-pin__element'
                        cls += " map-pin--#{displayState}" if displayState?
                        return cls

                .selectAll 'path'
                .attr
                    'class': (d, i) ->
                        baseClass = 'map-pin__element'
                        return d.className + ' ' + baseClass

                    # These sub-paths hold halves and thirds of the entire pin so that their
                    #   colors may be set dynamically based on how many color values need to be rendered.
                    # This method gets the fill colors as well as the indeces (1-of-3 means the first third)
                    #   and applies colors appropriately.
                    # Logic is complicated and poorly factored.
                    'fill': (d, i) ->
                        parentFeature = d3.select(@parentNode).datum()
                        colors = self.getFills(parentFeature)
                        return 'none' unless colors?
                        indeces = getIndecesFromClassName(d.className)
                        if indeces?
                            return colors[0] if colors.length is 1
                            if ((colors.length is 2) and (indeces[1] is 2)) or ((colors.length is 3) and (indeces[1] is 3)) or (colors.length > 3)
                                colorIndex = indeces[0]-1
                                return colors[colorIndex] if colors[colorIndex]?
                        return 'none'

            @resizeContainer(@collection, path, 100)

            @