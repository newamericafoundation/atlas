this.Atlas.module('Map', function(Map) {

  	return Map.control = {

	    // Centers map on specified target specified as latitude-longitude array.
	    // @param {Array} latLng - Latitude-longitude array for centering.
	    // @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
	    // @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
	    // @returns {object} this
	    center: function(latLng, widthRatio, heightRatio) {
			var map, mapSize, pt;
			if (widthRatio == null) {
			  widthRatio = 0.5;
			}
			if (heightRatio == null) {
			  heightRatio = 0.5;
			}
			map = this;
			pt = map.latLngToContainerPoint(latLng);
			mapSize = map.getSize();
			map.panBy([-mapSize.x * widthRatio + pt.x, -mapSize.y * heightRatio + pt.y], {
			  animate: true,
			  duration: 0.5
			});
			return this;
	    },

	    // Centers map on specified target specified as 2d point object.
	    // @param {Object} location - Pixel location object for centering - { x: .., y: .. }.
	    // @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
	    // @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
	    // @returns {object} this
	    centerToPixel: function(location, widthRatio, heightRatio) {
			var map, mapSize, pt;
			if (widthRatio == null) {
			  widthRatio = 0.5;
			}
			if (heightRatio == null) {
			  heightRatio = 0.5;
			}
			map = this;
			pt = location;
			mapSize = map.getSize();
			map.panBy([-mapSize.x * widthRatio + pt.x, -mapSize.y * heightRatio + pt.y], {
			  animate: true,
			  duration: 0.5
			});
			return this;
	    },

	    // Returns view center.
	    // @returns {Array} latLng - Array of latitude and longitude.
	    getView: function() {
			var ll, map;
			map = this;
			ll = map.getBounds().getCenter();
			return [ll.lat, ll.lng];
	    },

	    // Changes zoom level, using map center as zoom center.
	    // @param {number} dZoom - Zoom differential.
	    // @returns {Array} this
	    changeZoom: function(dZoom) {
			var map, z;
			map = this;
			z = map.getZoom();
			map.setView(map.getView(), z + dZoom);
			return this;
	    },

	    // Sets zoom level, using map center as zoom center.
	    // @param {number} zoom - New zoom level.
	    // @returns {Array} this
	    setZoom: function(zoom) {
			var map;
			map = this;
			map.setView(map.getView(), zoom);
			return this;
	    }

	};

});