# view constructor written using the module pattern (function returning an object, without a new keyword)
class Map.PathOverlayView extends Map.BaseOverlayView

    # Brings feature to the top so its stroke is not covered by non-highlighted paths.
    bringFeatureToFront: (feature) ->
        this.g.selectAll('path').sort (a, b) ->
            return -1 if a.id isnt feature.id
            return +1


    # Backbone-like render method.
    render: () ->
        this.renderSvgContainer() if this.renderSvgContainer?
        this.geoJson = this.collection
        this.g.selectAll('path')
            .data(this.geoJson.features)
            .enter()
            .append 'path'
            .on('mouseover', this.onFeatureMouseOver.bind(this))
            .on('mouseout', this.onFeatureMouseOut.bind(this))
            .on 'click', (d) =>
                return if d3.event.defaultPrevented
                this.onFeatureClick(d)
        this.update()
        # TODO - move into a common onShow method
        this.onRender();
        this.setMapEventListeners();
        return this;


    # Get projected point.
    # @param {number} long
    # @param {number} lat
    # @returns {object}
    getProjectedPoint = (long, lat) ->
        this.map.latLngToLayerPoint(new L.LatLng(lat, long));


    # Get transform path based on Leaflet map.
    # @param {array} latLongScaleOrigin
    # @param {array} latLongPosition
    # @returns {function} path
    getPath: (latLongScaleOrigin, latLongPosition, scale) ->

        map = this.map;

        scale ?= 1;

        # Find the coordinates of a point from lat long coordinates.
        # @param {number} long - Longitude.
        # @param {number} lat - Latitude.
        projectPoint = (long, lat) ->

            regularPoint = map.latLngToLayerPoint(new L.LatLng(lat, long))

            unless (latLongScaleOrigin? and latLongPosition?)
                this.stream.point(regularPoint.x, regularPoint.y)
                return this

            scaleOrigin = map.latLngToLayerPoint(new L.LatLng(latLongScaleOrigin[0], latLongScaleOrigin[1]))

            position = map.latLngToLayerPoint(new L.LatLng(latLongPosition[0], latLongPosition[1]))

            modifiedPoint =
                x: position.x + (regularPoint.x - scaleOrigin.x) * scale
                y: position.y + (regularPoint.y - scaleOrigin.y) * scale

            this.stream.point(modifiedPoint.x, modifiedPoint.y)

            return this

        transform = d3.geo.transform({ point: projectPoint });
        path = d3.geo.path().projection(transform);
        return path


    # Get scale and centroid modifiers that position Alaska, Hawaii and DC in a visible format.
    getUsStateProjectionModifiers: (usStateId) ->

        usStateLatLongCentroids:
            '2': 
                latLongScaleOrigin: [ 65.4169289, -153.4474854 ]
                latLongPosition: [ 30.2065372,-134.6754338 ]
                scale: 0.2
            '15': 
                latLongScaleOrigin: [ 20.8031863,-157.6043485 ]
                latLongPosition: [  ]
            '11': 
                latLongScaleOrigin: [ 38.9093905,-77.0328359 ]
                latLongPosition: [ 32.0680227,-70.8874945 ]
                scale: 15

        # 


    # Apply transform and classes on paths.
    update: () ->

        path = this.getPath();

        geoJson = this.collection;

        this.g.selectAll('path')

            .attr

                'class': (feature) =>
                    displayState = @getFeatureDisplayState(feature)
                    cls = 'map-region map-region__element'
                    cls += " map-region--#{displayState}" if displayState?
                    return cls

                'd': (feature) =>
                    # access embedded Backbone model
                    model = feature._model

                    if model? and (model.get('_itemType') is 'us_state') and (model.get('id') is 2)
                        return this.getPath([ 65.4169289, -153.4474854 ], [ 30.2065372,-134.6754338 ], 0.2)(feature)

                    if model? and (model.get('_itemType') is 'us_state') and (model.get('id') is 11)
                        return this.getPath([ 38.9093905,-77.0328359 ], [ 32.0680227,-70.8874945 ], 15)(feature)

                    this.getPath()(feature)

                'fill': this.getFill.bind(@)

        this.resizeContainer(geoJson, path, 0);

        return this;