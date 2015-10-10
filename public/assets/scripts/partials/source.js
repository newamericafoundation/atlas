'use strict';

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function fNOP() {},
        fBound = function fBound() {
      return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
'use strict';

if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
'use strict';

if (!Array.prototype.map) {

  Array.prototype.map = function (callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}
"use strict";

(function () {
  if (typeof ChartistHtml !== "undefined" && ChartistHtml !== null) {
    ChartistHtml.config.baseClass = "atlas-chart";
    ChartistHtml.config.colorSpectrum = ['#85026A', '#019fde'];
    ChartistHtml.config.tooltipTemplate = function (data) {
      return "<div><h1>" + data.label + "</h1><p>" + data.value + "</p></div>";
    };
    ChartistHtml.config.chartOptions.bar.options.base.seriesBarDistance = 28;
    ChartistHtml.config.labelOffsetCoefficient = 5;
  }
}).call(undefined);
'use strict';

(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });
}).call(undefined);
'use strict';

(function () {
  $.fn.ensureScript = function (globalName, path, next) {
    if (window[globalName] != null) {
      return next();
    }
    return $.ajax({
      url: path,
      contentType: 'text/javascript; charset=utf-8',
      dataType: 'script',
      success: next
    });
  };
}).call(undefined);
'use strict';

(function () {
  $.fn.extend({
    toggleModifierClass: function toggleModifierClass(baseClass, modifiers, modifierSign) {
      var $el, className, i, j, len, modifier, newClass, newModifier;
      if (modifierSign == null) {
        modifierSign = '--';
      }
      $el = $(this);
      if (!(modifiers instanceof Array)) {
        modifiers = modifiers[0];
      }
      for (i = j = 0, len = modifiers.length; j < len; i = ++j) {
        modifier = modifiers[i];
        className = baseClass + modifierSign + modifier;
        if ($el.hasClass(className)) {
          $el.removeClass(className);
          newModifier = modifiers[i + 1] != null ? modifiers[i + 1] : modifiers[0];
          if (newModifier !== modifier && newModifier !== '') {
            newClass = baseClass + modifierSign + newModifier;
            return $el.addClass(newClass);
          }
        }
      }
      return $el.addClass(baseClass + modifierSign + modifiers[0]);
    }
  });
}).call(undefined);
'use strict';

window.Map = {};

(function (Map) {

    Map.start = function () {
        return this.Controller.show();
    };

    Map.stop = function () {
        return this.Controller.destroy();
    };

    Map.Controller = {

        show: function show() {
            return $().ensureScript('L', '/assets/vendor/mapbox.js', this.showMain.bind(this));
        },

        showMain: function showMain() {
            Map.rootView = new Map.RootView({ el: '#atl__map' }).render();
            this.$loading = $("<div class='loader'><img src='/assets/images/spinner.gif'></div>");
            $('.atl__main').append(this.$loading);
            return $().ensureScript('d3', '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
        },

        showOverlay: function showOverlay() {

            var View, itemType, items, launch;
            items = Map.props.project.get('data').items;
            itemType = items.getItemType();

            var OverlayView = this.getOverlayViewConstructor(itemType);

            launch = function (baseGeoData) {

                var coll;

                coll = items.getRichGeoJson(baseGeoData);

                return coll.onReady(function () {
                    var overlayView = new OverlayView({
                        map: Map.map,
                        collection: coll,
                        props: Map.props,
                        colors: Map.colors,
                        svgPaths: Map.svgPaths
                    });
                    Map.overlayView = overlayView;
                    return overlayView.render();
                });
            };

            if (itemType === 'pin') {
                launch();
                return this;
            }

            var shps = new M.shapeFile.Collection();

            var shp = shps.findWhere({ name: itemType + 's' });

            shp.getGeoJsonFetchPromise().then(function (data) {
                launch(data);
            });

            return this;
        },

        getOverlayViewConstructor: function getOverlayViewConstructor(itemType) {
            if (itemType === 'pin') {
                return Map.PinOverlayView;
            }
            return Map.PathOverlayView;
        },

        destroy: function destroy() {
            if (Map.overlayView != null) {
                Map.overlayView.destroy();
            }
            if (Map.rootView != null) {
                return Map.rootView.destroy();
            }
        }

    };
})(window.Map);
// This is an object mixed into Leaflet's maps to provide additional functionality.

"use strict";

Map.control = {

    /*
        * Centers map on specified target specified as latitude-longitude array.
        * @param {Array} latLng - Latitude-longitude array for centering.
        * @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
        * @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
        * @returns {object} this
        */
    center: function center(latLng, widthRatio, heightRatio) {
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

    /*
     * Centers map on specified target specified as 2d point object.
     * @param {Object} location - Pixel location object for centering - { x: .., y: .. }.
     * @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
     * @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
     * @returns {object} this
     */
    centerToPixel: function centerToPixel(location, widthRatio, heightRatio) {
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

    /*
     * Returns view center.
     * @returns {Array} latLng - Array of latitude and longitude.
     */
    getView: function getView() {
        var ll, map;
        map = this;
        ll = map.getBounds().getCenter();
        return [ll.lat, ll.lng];
    },

    /*
        * Changes zoom level, using map center as zoom center.
        * @param {number} dZoom - Zoom differential.
        * @returns {Array} this
        */
    changeZoom: function changeZoom(dZoom) {
        var map, z;
        map = this;
        z = map.getZoom();
        map.setView(map.getView(), z + dZoom);
        return this;
    },

    /*
        * Sets zoom level, using map center as zoom center.
        * @param {number} zoom - New zoom level.
        * @returns {Array} this
        */
    setZoom: function setZoom(zoom) {
        var map;
        map = this;
        map.setView(map.getView(), zoom);
        return this;
    }

};
// This is a custom view constructor that uses d3 and Mapbox to render graphics.
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

Map.RootView = (function () {

	/*
  *
  *
  */

	function _class(options) {
		_classCallCheck(this, _class);

		this.el = options.el;
		this.elId = this.el.substr(1);
		this.$el = $(this.el);
		_.extend(this, Backbone.Events);
		return this;
	}

	/*
  * Get optimal start zoom level corresponding to the width of the container.
  *
  */

	_createClass(_class, [{
		key: '_getZoomLevel',
		value: function _getZoomLevel() {
			var width = this.$el.width();
			if (width > 1350) {
				return 5;
			}
			if (width > 700) {
				return 4;
			}
			return 3;
		}

		/*
   * Set up map.
   *
   */
	}, {
		key: '_setupMap',
		value: function _setupMap() {
			var _this = this;

			var zoomLevel = this._getZoomLevel();
			this.map.setView([37.6, -95.665], zoomLevel);
			this.map.scrollWheelZoom.disable();
			// add control convenience methods

			_.extend(this.map, Map.control);

			this.map.ignoreNextClick = false;
			// do not register a map item click event if it is fired due to a map drag end

			this.map.on('dragstart', function (e) {
				Map.props.setUiState({ isMapDragged: true });
			});

			this.map.on('dragend', function (e) {
				var items;
				Map.props.setUiState({ isMapDragged: false });
				// use functionality only if there is sufficient drag
				//   as Leaflet sometimes detects slightly imperfect clicks as drags
				items = Map.props.project.get('data').items;
				if (e.distance > 15 && items.hovered) {
					_this.map.ignoreNextClick = true;
				}
			});
			// Expose map to the module.
			Map.map = this.map;

			return this;
		}

		/*
   * Return map options.
   * @returns {object} options
   */
	}, {
		key: 'getMapOptions',
		value: function getMapOptions() {
			return {
				attributionControl: true,
				zoomControl: false,
				inertia: false
			};
		}

		/*
   * Render view.
   *
   */
	}, {
		key: 'render',
		value: function render() {
			L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw';
			this.map = L.mapbox.map(this.elId, 'rossvanderlinde.874ab107', this.getMapOptions());
			Map.props.setMap(this.map);
			this._setupMap();
			this.hideAttribution();
			return this;
		}

		/*
   * Hide attribution view.
   *
   */
	}, {
		key: 'hideAttribution',
		value: function hideAttribution() {
			$('.leaflet-control-attribution').hide();
		}

		/*
   * Destroy view. Clear Leaflet-specific event listeners.
   *
   */
	}, {
		key: 'destroy',
		value: function destroy() {
			if (!this.map) {
				return;
			}
			this.map.clearAllEventListeners();
			this.map.remove();
			return this;
		}
	}]);

	return _class;
})();
// overlay view layers inherit from this object
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

Map.BaseOverlayView = (function () {

    /*
     *
     *
     */

    function _class() {
        var _this = this;

        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, _class);

        for (var key in options) {
            this[key] = options[key];
        }
        Map.props.radio.reqres.setHandler('item:map:position', function (item) {
            return _this.getItemMapPosition(item);
        });
        return this;
    }

    /*
     *
     *
     */

    _createClass(_class, [{
        key: 'setMapEventListeners',
        value: function setMapEventListeners() {
            this.map.on('viewreset', this.update.bind(this));
            this.map.on('click', this.onMapClick.bind(this));
        }

        /*
         * Initialize.
         *
         */
    }, {
        key: 'renderSvgContainer',
        value: function renderSvgContainer() {
            this.svg = d3.select(this.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
            this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
        }

        /*
         *
         *
         */
    }, {
        key: 'setHeaderStripColor',
        value: function setHeaderStripColor() {
            var project, indeces;
            project = this.props.project;
            indeces = project.getFriendlyIndeces();
            if (indeces.length > 0) {
                Map.props.radio.commands.execute('set:header:strip:color', { color: Map.colors.toRgb(indeces[0] - 1) });
            } else {
                Map.props.radio.commands.execute('set:header:strip:color', 'none');
            }
        }

        /*
         * Return pixel coordinates of a map display item's centroid.
         *
         */
    }, {
        key: 'getItemMapPosition',
        value: function getItemMapPosition(item) {
            var identityPath, feature, longLatArrayCentroid, latLong, map;
            identityPath = d3.geo.path().projection(function (d) {
                return d;
            });
            feature = this.getFeatureByModel(item);
            longLatArrayCentroid = identityPath.centroid(feature);
            latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0]);
            map = Map.map;
            return map.latLngToContainerPoint(latLong);
        }

        /*
         * Fade out, update entire overlaypane and fade back in.
         *
         */
    }, {
        key: 'updateAnimated',
        value: function updateAnimated() {
            var _this2 = this;

            var $el = $('.leaflet-overlay-pane');
            // call stop() to reset previously started animations
            $el.stop().animate({ opacity: 0 }, 750, 'swing', function () {
                _this2.update();
                $el.animate({ opacity: 1 }, 750);
            });
        }

        /*
         * Callback.
         *
         */
    }, {
        key: 'onFeatureMouseOut',
        value: function onFeatureMouseOut(feature) {
            var project, items;
            project = Map.props.project;
            items = project.get('data').items;
            items.setHovered(-1);
            this.setHeaderStripColor();
            Map.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true });
        }

        /*
         * Callback.
         *
         */
    }, {
        key: 'onFeatureMouseOver',
        value: function onFeatureMouseOver(feature) {
            var project, items, model;
            if (this.bringFeatureToFront) {
                this.bringFeatureToFront(feature);
            }
            project = Map.props.project;
            items = project.get('data').items;
            model = feature._model ? feature._model : feature.id;
            items.setHovered(model);
            this.setHeaderStripColor();
            Map.props.radio.commands.execute('update:tilemap', { ignoreMapItems: true });
        }

        /*
         * Callback.
         *
         */
    }, {
        key: 'onFeatureClick',
        value: function onFeatureClick(feature) {
            var model, project, items;
            if (Map.map && Map.map.ignoreNextClick) {
                Map.map.ignoreNextClick = false;
                return;
            }
            if (d3.event.stopPropagation) {
                d3.event.stopPropagation();
            }
            model = feature._model;
            project = Map.props.project;
            items = project.get('data').items;
            items.setActive(model);
            Map.props.setUiState({ isInfoBoxActive: true });
            Map.map.ignoreNextClick = false;
            this.activeFeature = feature;
            return this;
        }

        /*
         *
         *
         */
    }, {
        key: 'onRender',
        value: function onRender() {
            $('.loading-icon').remove();
        }

        /*
         * Callback.
         *
         */
    }, {
        key: 'onMapClick',
        value: function onMapClick(e) {
            if (this.activeFeature) {
                this.activeFeature = undefined;
                Map.props.radio.vent.trigger('item:deactivate');
            }
        }

        /*
         * Returns feature corresponding to model.
         *
         */
    }, {
        key: 'getFeatureByModel',
        value: function getFeatureByModel(model) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.collection.features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var feature = _step.value;

                    if (feature._model === model) {
                        return feature;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /*
         * Returns display state of a feature.
         *
         */
    }, {
        key: 'getFeatureDisplayState',
        value: function getFeatureDisplayState(feature) {
            var filter, searchTerm, model;
            filter = Map.props.project.get('data').filter;
            searchTerm = Map.props.uiState.searchTerm;
            model = feature._model;
            if (model) {
                return model.getDisplayState(filter, searchTerm);
            }
        }

        /*
         * Get feature fill.
         * @param {object} feature
         * @returns {string} fill - Color string or stripe pattern url.
         */
    }, {
        key: 'getFill',
        value: function getFill(feature) {
            var filter, valueIndeces, id;
            filter = Map.props.project.get('data').filter;
            valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
            if (!valueIndeces || valueIndeces.length === 0) {
                return;
            }
            if (valueIndeces.length === 1) {
                return Map.colors.toRgb(valueIndeces[0] - 1);
            }
            // Communicate with Comp.Setup.Component to create and retrieve stripe pattern id
            id = Map.props.radio.reqres.request('get:pattern:id', valueIndeces);
            return 'url(#stripe-pattern-' + id + ')';
        }

        /*
         * Checks if bounds are finite.
         * @returns {boolean}
         */
    }, {
        key: '_areBoundsFinite',
        value: function _areBoundsFinite(bounds) {
            return isFinite(bounds[0][0]) && isFinite(bounds[0][1]) && isFinite(bounds[1][0]) && isFinite(bounds[1][1]);
        }

        /*
         * Resizes and repositions svg container and its direct child group.
         * @param {object} svg
         * @param {object} g
         * @param {object} geoJson
         * @param {object} path
         * @param {number} extraExpansion - Pixel amount the svg container is to be expanded by, in order to avoid clipping off parts of shapes close to the edge.
         */
    }, {
        key: 'resizeContainer',
        value: function resizeContainer(geoJson, path, extraExpansion) {
            var bounds = path.bounds(geoJson),
                topLeft,
                bottomRight;
            if (!this._areBoundsFinite(bounds)) {
                return;
            }
            bounds[0][0] -= extraExpansion;
            bounds[0][1] -= extraExpansion;
            bounds[1][0] += extraExpansion;
            bounds[1][1] += extraExpansion;
            topLeft = bounds[0];
            bottomRight = bounds[1];
            this.svg.attr({ 'width': bottomRight[0] - topLeft[0], 'height': bottomRight[1] - topLeft[1] + 50 });
            this.svg.style({ 'left': topLeft[0] + 'px', 'top': topLeft[1] + 'px' });
            this.g.attr("transform", 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');
            return this;
        }

        /*
         * Destroy overlay view along with all event listeners.
         *
         */
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.stopListening) this.stopListening();
            this.g.selectAll('path').remove();
            this.g.remove();
            this.svg.remove();
            return this;
        }
    }]);

    return _class;
})();
// view constructor written using the module pattern (function returning an object, without a new keyword)
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Map.PathOverlayView = (function (_Map$BaseOverlayView) {
    _inherits(_class, _Map$BaseOverlayView);

    function _class() {
        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(_class, [{
        key: 'bringFeatureToFront',

        /*
         * Brings feature to the top so its stroke is not covered by non-highlighted paths.
         */
        value: function bringFeatureToFront(feature) {
            this.g.selectAll('path').sort(function (a, b) {
                if (a.id !== feature.id) {
                    return -1;
                }
                return +1;
            });
        }

        /*
         * Backbone-like render method.
         */
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            this.renderSvgContainer();
            this.geoJson = this.collection;
            this.g.selectAll('path').data(this.geoJson.features).enter().append('path').on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', function (d) {
                if (d3.event.defaultPrevented) {
                    return;
                }
                _this.onFeatureClick(d);
            });
            this.update();
            // TODO - move into a common onShow method
            this.onRender();
            this.setMapEventListeners();
            return this;
        }

        /*
         * Get projected point.
         * @param {number} long
         * @param {number} lat
         * @returns {object}
         */
    }, {
        key: 'getProjectedPoint',
        value: function getProjectedPoint(long, lat) {
            this.map.latLngToLayerPoint(new L.LatLng(lat, long));
        }

        /*
         * Get transform path based on Leaflet map.
         * @param {array} latLongScaleOrigin
         * @param {array} latLongPosition
         * @returns {function} path
         */
    }, {
        key: 'getPath',
        value: function getPath(latLongScaleOrigin, latLongPosition) {
            var scale = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

            var map = this.map,
                transform,
                path;

            /*
             * Find the coordinates of a point from lat long coordinates.
             * @param {number} long - Longitude.
             * @param {number} lat - Latitude.
             */
            var projectPoint = function projectPoint(long, lat) {

                var regularPoint, scaleOrigin, position, modifiedPoint;

                regularPoint = map.latLngToLayerPoint(new L.LatLng(lat, long));

                if (!latLongScaleOrigin || !latLongPosition) {
                    this.stream.point(regularPoint.x, regularPoint.y);
                    return this;
                }

                scaleOrigin = map.latLngToLayerPoint(new L.LatLng(latLongScaleOrigin[0], latLongScaleOrigin[1]));
                position = map.latLngToLayerPoint(new L.LatLng(latLongPosition[0], latLongPosition[1]));

                modifiedPoint = {
                    x: position.x + (regularPoint.x - scaleOrigin.x) * scale,
                    y: position.y + (regularPoint.y - scaleOrigin.y) * scale
                };

                this.stream.point(modifiedPoint.x, modifiedPoint.y);
                return this;
            };

            transform = d3.geo.transform({ point: projectPoint });
            path = d3.geo.path().projection(transform);
            return path;
        }

        /*
         * Get scale and centroid modifiers that position Alaska, Hawaii and DC in a visible format.
         */
    }, {
        key: 'getUsStateProjectionModifiers',
        value: function getUsStateProjectionModifiers(usStateId) {
            var usStateLatLongCentroids = {
                '2': {
                    latLongScaleOrigin: [65.4169289, -153.4474854],
                    latLongPosition: [30.2065372, -134.6754338],
                    scale: 0.2
                },
                '15': {
                    latLongScaleOrigin: [20.8031863, -157.6043485],
                    latLongPosition: [],
                    scale: 1
                },
                '11': {
                    latLongScaleOrigin: [38.9093905, -77.0328359],
                    latLongPosition: [32.0680227, -70.8874945],
                    scale: 15
                }
            };
        }

        /*
         * Apply transform and classes on paths.
         */
    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            var path = this.getPath(),
                geoJson = this.collection;
            this.g.selectAll('path').attr({
                'class': function _class(feature) {
                    var displayState = _this2.getFeatureDisplayState(feature);
                    var cls = 'map-region map-region__element';
                    if (displayState) {
                        cls += ' map-region--' + displayState;
                    }
                    return cls;
                },
                'd': function d(feature) {
                    // access embedded Backbone model
                    var model = feature._model;
                    if (model && model.get('_itemType') === 'us_state' && model.get('id') === 2) {
                        return _this2.getPath([65.4169289, -153.4474854], [30.2065372, -134.6754338], 0.2)(feature);
                    }
                    if (model && model.get('_itemType') === 'us_state' && model.get('id') === 11) {
                        return _this2.getPath([38.9093905, -77.0328359], [32.0680227, -70.8874945], 15)(feature);
                    }
                    return _this2.getPath()(feature);
                },
                'fill': this.getFill.bind(this)
            });
            this.resizeContainer(geoJson, path, 0);
            return this;
        }
    }]);

    return _class;
})(Map.BaseOverlayView);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Map.PinOverlayView = (function (_Map$BaseOverlayView) {
    _inherits(_class, _Map$BaseOverlayView);

    function _class() {
        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(_class, [{
        key: 'getShapes',

        /*
         *
         *
         */
        value: function getShapes() {
            return [{ path: this.shape.paths.slice_1_of_2, className: 'map-pin__1-of-2' }, { path: this.shape.paths.slice_2_of_2, className: 'map-pin__2-of-2' }, { path: this.shape.paths.slice_1_of_3, className: 'map-pin__1-of-3' }, { path: this.shape.paths.slice_2_of_3_a, className: 'map-pin__2-of-3' }, { path: this.shape.paths.slice_2_of_3_b, className: 'map-pin__2-of-3' }, { path: this.shape.paths.slice_3_of_3, className: 'map-pin__3-of-3' }, { path: this.shape.paths.outer, className: 'map-pin__outer' }, { path: this.shape.paths.inner, className: 'map-pin__inner' }];
        }

        /*
         *
         *
         */
    }, {
        key: 'render',
        value: function render() {

            var pindrop;

            this.renderSvgContainer();

            this.shape = this.svgPaths.shapes.pindrop;

            // Get halves and thirds of the pin to apply corresponding coloring.
            pindrop = this.getShapes();

            this.g.selectAll('g').data(this.collection.features).enter().append('g').attr({ 'class': 'map-pin' }).on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', this.onFeatureClick.bind(this)).selectAll('path').data(pindrop).enter().append('path').attr({
                'd': function d(_d) {
                    return _d.path;
                },
                'class': function _class(d) {
                    return d.className;
                }
            });

            this.update();
            this.onRender();
            this.setMapEventListeners();
        }

        /*
         *
         *
         */
    }, {
        key: 'getFills',
        value: function getFills(feature) {
            var _this = this;

            var filter, valueIndeces;
            filter = this.props.project.get('data').filter;
            valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
            if (!valueIndeces || valueIndeces.length === 0) {
                return;
            }
            return valueIndeces.map(function (valueIndex) {
                return _this.colors.toRgb(valueIndex - 1);
            });
        }

        /*
         *
         *
         */
    }, {
        key: 'update',
        value: function update() {

            var transform,
                path,
                self = this,
                map = this.map;

            var getProjectedPoint = function getProjectedPoint(long, lat) {
                return map.latLngToLayerPoint(new L.LatLng(lat, long));
            };

            var projectPoint = function projectPoint(long, lat) {
                var point = getProjectedPoint(long, lat);
                this.stream.point(point.x, point.y);
                return this;
            };

            // Assuming a class name of the form .base__1-of-3, extracts numbers 1 and 3 in an array.
            // @returns {array}
            var getIndecesFromClassName = function getIndecesFromClassName(cls) {
                var indeces = cls.split('__')[1].split('-');
                if (indeces[2] != null) {
                    indeces = [parseInt(indeces[0], 10), parseInt(indeces[2], 10)];
                    return indeces;
                }
            };

            transform = d3.geo.transform({ point: projectPoint });
            path = d3.geo.path().projection(transform);

            this.g.selectAll('g').attr({
                transform: function transform(d) {
                    var coord, pt, x, y;
                    coord = d.geometry.coordinates;
                    pt = getProjectedPoint(coord[0], coord[1]);
                    // The display coordinates for an SVG point to the upper left corner of an SVG.
                    //   To correctly center the map pin, subtract half the width and the full height.
                    x = pt.x - self.shape.dim.width / 2;
                    y = pt.y - self.shape.dim.height;
                    return 'translate(' + x + ',' + y + ')';
                },
                'class': function _class(feature) {
                    var displayState, cls;
                    displayState = self.getFeatureDisplayState(feature);
                    cls = 'map-pin map-pin__element';
                    if (displayState) {
                        cls += ' map-pin--' + displayState;
                    }
                    return cls;
                }
            }).selectAll('path').attr({
                'class': function _class(d, i) {
                    var baseClass = 'map-pin__element';
                    return d.className + ' ' + baseClass;
                },

                // These sub-paths hold halves and thirds of the entire pin so that their
                //   colors may be set dynamically based on how many color values need to be rendered.
                // This method gets the fill colors as well as the indeces (1-of-3 means the first third)
                //   and applies colors appropriately.
                // Logic is complicated and poorly factored.
                'fill': function fill(d, i) {
                    var parentFeature, colors, indeces;
                    parentFeature = d3.select(this.parentNode).datum();
                    colors = self.getFills(parentFeature);
                    if (!colors) {
                        return 'none';
                    }
                    indeces = getIndecesFromClassName(d.className);
                    if (indeces) {
                        if (colors.length === 1) {
                            return colors[0];
                        }
                        if (colors.length === 2 && indeces[1] === 2 || colors.length === 3 && indeces[1] === 3 || colors.length > 3) {
                            var colorIndex = indeces[0] - 1;
                            if (colors[colorIndex]) {
                                return colors[colorIndex];
                            }
                        }
                    }
                    return 'none';
                }
            });

            this.resizeContainer(this.collection, path, 100);

            return this;
        }
    }]);

    return _class;
})(Map.BaseOverlayView);