@Atlas.module 'Map', (Map, App, Backbone, Marionette, $, _) ->

    Map.control =

         # Centers map on specified target specified as latitude-longitude array.
         # @param {Array} latLng - Latitude-longitude array for centering.
         # @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
         # @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
         # @returns {object} this
        center: (latLng, widthRatio = 0.5, heightRatio = 0.5) ->
            map = @
            pt = map.latLngToContainerPoint(latLng)
            mapSize = map.getSize()
            map.panBy [ -mapSize.x * widthRatio + pt.x, -mapSize.y * heightRatio + pt.y ],
                animate: true
                duration: 0.5
            @


        # Centers map on specified target specified as 2d point object.
        # @param {Object} location - Pixel location object for centering - { x: .., y: .. }.
        # @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
        # @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
        # @returns {object} this
        centerToPixel: (location, widthRatio = 0.5, heightRatio = 0.5) ->
            map = @
            pt = location
            mapSize = map.getSize()
            map.panBy [-mapSize.x * widthRatio + pt.x, -mapSize.y * heightRatio + pt.y],
                animate: true
                duration: 0.5
            return @


        # Returns view center.
        # @returns {Array} latLng - Array of latitude and longitude.
        getView: ->
            map = @
            ll = map.getBounds().getCenter()
            [ll.lat, ll.lng]


        # Changes zoom level, using map center as zoom center.
        # @param {number} dZoom - Zoom differential.
        # @returns {Array} this
        changeZoom: (dZoom) ->
            map = @
            z = map.getZoom()
            map.setView(map.getView(), z + dZoom)
            @


        # Sets zoom level, using map center as zoom center.
        # @param {number} zoom - New zoom level.
        # @returns {Array} this
        setZoom: (zoom) ->
            map = @
            map.setView(map.getView(), zoom);
            @