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
                        collection: coll
                    });
                    Map.overlayView = overlayView;
                    return overlayView.render();
                });
            };

            if (itemType === 'pin') {
                launch();
                return this;
            }

            var shp = new M.shapeFile.Collection().findWhere({ name: itemType + 's' });

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
"use strict";

Map.control = {

		// Centers map on specified target specified as latitude-longitude array.
		// @param {Array} latLng - Latitude-longitude array for centering.
		// @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
		// @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
		// @returns {object} this
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

		// Centers map on specified target specified as 2d point object.
		// @param {Object} location - Pixel location object for centering - { x: .., y: .. }.
		// @param {number} widthRatio=0.5 - Relative horizontal position the map is centered to (0 -> left, 1 -> right).
		// @param {number} heightRatio=0.5 - Relative vertical position the map is centered to (0 -> top, 1 -> bottom).
		// @returns {object} this
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

		// Returns view center.
		// @returns {Array} latLng - Array of latitude and longitude.
		getView: function getView() {
				var ll, map;
				map = this;
				ll = map.getBounds().getCenter();
				return [ll.lat, ll.lng];
		},

		// Changes zoom level, using map center as zoom center.
		// @param {number} dZoom - Zoom differential.
		// @returns {Array} this
		changeZoom: function changeZoom(dZoom) {
				var map, z;
				map = this;
				z = map.getZoom();
				map.setView(map.getView(), z + dZoom);
				return this;
		},

		// Sets zoom level, using map center as zoom center.
		// @param {number} zoom - New zoom level.
		// @returns {Array} this
		setZoom: function setZoom(zoom) {
				var map;
				map = this;
				map.setView(map.getView(), zoom);
				return this;
		}

};
'use strict';

(function () {
  Map.RootView = (function () {
    function RootView(options) {
      this.el = options.el;
      this.elId = this.el.substr(1);
      this.$el = $(this.el);
      _.extend(this, Backbone.Events);
      this;
    }

    RootView.prototype._getZoomLevel = function () {
      var width;
      width = this.$el.width();
      if (width > 1350) {
        return 5;
      }
      if (width > 700) {
        return 4;
      }
      return 3;
    };

    RootView.prototype._setupMap = function () {
      var zoomLevel;
      zoomLevel = this._getZoomLevel();
      this.map.setView([37.6, -95.665], zoomLevel);
      this.map.scrollWheelZoom.disable();
      _.extend(this.map, Map.control);
      this.map.ignoreNextClick = false;
      this.map.on('dragstart', (function (_this) {
        return function (e) {
          return Map.props.setUiState({
            isMapDragged: true
          });
        };
      })(this));
      this.map.on('dragend', (function (_this) {
        return function (e) {
          var items;
          Map.props.setUiState({
            isMapDragged: false
          });
          items = Map.props.project.get('data').items;
          if (e.distance > 15 && items.hovered != null) {
            return _this.map.ignoreNextClick = true;
          }
        };
      })(this));
      return Map.map = this.map;
    };

    RootView.prototype.getMapOptions = function () {
      return {
        attributionControl: true,
        zoomControl: false,
        inertia: false
      };
    };

    RootView.prototype.render = function () {
      L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw';
      this.map = L.mapbox.map(this.elId, 'rossvanderlinde.874ab107', this.getMapOptions());
      Map.props.setMap(this.map);
      this._setupMap();
      this.hideAttribution();
      return this;
    };

    RootView.prototype.hideAttribution = function () {
      return $('.leaflet-control-attribution').hide();
    };

    RootView.prototype.destroy = function () {
      if (this.map == null) {
        return;
      }
      this.map.clearAllEventListeners();
      this.map.remove();
      return this;
    };

    return RootView;
  })();
}).call(undefined);
'use strict';

(function () {
  Map.BaseOverlayView = (function () {
    function BaseOverlayView(options) {
      if (options == null) {
        options = {};
      }
      this.map = options.map;
      this.collection = options.collection;
      Map.props.App.reqres.setHandler('item:map:position', (function (_this) {
        return function (item) {
          return _this.getItemMapPosition(item);
        };
      })(this));
      this;
    }

    BaseOverlayView.prototype.setHeaderStripColor = function () {
      var indeces, project;
      project = Map.props.project;
      indeces = project.getFriendlyIndeces();
      if (indeces.length > 0) {
        return Map.props.App.commands.execute('set:header:strip:color', {
          color: Map.colors.toRgb(indeces[0] - 1)
        });
      } else {
        return Map.props.App.commands.execute('set:header:strip:color', 'none');
      }
    };

    BaseOverlayView.prototype.getItemMapPosition = function (item) {
      var feature, identityPath, latLong, longLatArrayCentroid, map;
      identityPath = d3.geo.path().projection(function (d) {
        return d;
      });
      feature = this.getFeatureByModel(item);
      longLatArrayCentroid = identityPath.centroid(feature);
      latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0]);
      map = Map.map;
      return map.latLngToContainerPoint(latLong);
    };

    BaseOverlayView.prototype.updateAnimated = function () {
      var $el;
      $el = $('.leaflet-overlay-pane');
      return $el.stop().animate({
        opacity: 0
      }, 750, 'swing', (function (_this) {
        return function () {
          _this.update();
          return $el.animate({
            opacity: 1
          }, 750);
        };
      })(this));
    };

    BaseOverlayView.prototype.onFeatureMouseOut = function (feature) {
      var items, project;
      project = Map.props.project;
      items = project.get('data').items;
      items.setHovered(-1);
      this.setHeaderStripColor();
      return Map.props.App.commands.execute('update:tilemap', {
        ignoreMapItems: true
      });
    };

    BaseOverlayView.prototype.onFeatureMouseOver = function (feature) {
      var items, model, project;
      if (this.bringFeatureToFront != null) {
        this.bringFeatureToFront(feature);
      }
      project = Map.props.project;
      items = project.get('data').items;
      model = feature._model != null ? feature._model : feature.id;
      items.setHovered(model);
      this.setHeaderStripColor();
      return Map.props.App.commands.execute('update:tilemap', {
        ignoreMapItems: true
      });
    };

    BaseOverlayView.prototype.onFeatureClick = function (feature) {
      var items, model, project;
      if (Map.map != null && Map.map.ignoreNextClick) {
        Map.map.ignoreNextClick = false;
        return;
      }
      if (d3.event.stopPropagation != null) {
        d3.event.stopPropagation();
      }
      model = feature._model;
      project = Map.props.project;
      items = project.get('data').items;
      items.setActive(model);
      Map.props.setUiState({
        isInfoBoxActive: true
      });
      Map.map.ignoreNextClick = false;
      return this.activeFeature = feature;
    };

    BaseOverlayView.prototype.onRender = function () {
      return $('.loading-icon').remove();
    };

    BaseOverlayView.prototype.onMapClick = function (e) {
      if (this.activeFeature != null) {
        this.activeFeature = void 0;
        return Map.props.App.vent.trigger('item:deactivate');
      }
    };

    BaseOverlayView.prototype.getFeatureByModel = function (model) {
      var feature, i, len, ref;
      ref = this.collection.features;
      for (i = 0, len = ref.length; i < len; i++) {
        feature = ref[i];
        if (feature._model === model) {
          return feature;
        }
      }
    };

    BaseOverlayView.prototype.getFeatureDisplayState = function (feature) {
      var filter, model, searchTerm;
      if (Map.props.uiState == null) {
        return;
      }
      filter = Map.props.project.get('data').filter;
      searchTerm = Map.props.uiState.searchTerm;
      model = feature._model;
      if (model != null) {
        return model.getDisplayState(filter, searchTerm);
      }
    };

    BaseOverlayView.prototype.getFill = function (feature) {
      var filter, id, valueIndeces;
      filter = Map.props.project.get('data').filter;
      valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
      if (valueIndeces == null || valueIndeces.length === 0) {
        return;
      }
      if (valueIndeces.length === 1) {
        return Map.colors.toRgb(valueIndeces[0] - 1);
      }
      id = Map.props.App.reqres.request('get:pattern:id', valueIndeces);
      return "url(#stripe-pattern-" + id + ")";
    };

    BaseOverlayView.prototype._areBoundsFinite = function (bounds) {
      return isFinite(bounds[0][0]) && isFinite(bounds[0][1]) && isFinite(bounds[1][0]) && isFinite(bounds[1][1]);
    };

    BaseOverlayView.prototype.resizeContainer = function (geoJson, path, extraExpansion) {
      var bottomRight, bounds, topLeft;
      bounds = path.bounds(geoJson);
      if (this._areBoundsFinite(bounds)) {
        bounds[0][0] -= extraExpansion;
        bounds[0][1] -= extraExpansion;
        bounds[1][0] += extraExpansion;
        bounds[1][1] += extraExpansion;
        topLeft = bounds[0];
        bottomRight = bounds[1];
        this.svg.attr({
          'width': bottomRight[0] - topLeft[0],
          'height': bottomRight[1] - topLeft[1] + 50
        });
        this.svg.style({
          'left': topLeft[0] + 'px',
          'top': topLeft[1] + 'px'
        });
        return this.g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
      }
    };

    BaseOverlayView.prototype.destroy = function () {
      if (this.stopListening != null) {
        this.stopListening();
      }
      this.g.selectAll('path').remove();
      this.g.remove();
      this.svg.remove();
      return this;
    };

    return BaseOverlayView;
  })();
}).call(undefined);
'use strict';

(function () {
  var extend = function extend(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      hasProp = ({}).hasOwnProperty;

  Map.PathOverlayView = (function (superClass) {
    var getProjectedPoint;

    extend(PathOverlayView, superClass);

    function PathOverlayView() {
      return PathOverlayView.__super__.constructor.apply(this, arguments);
    }

    PathOverlayView.prototype.bringFeatureToFront = function (feature) {
      return this.g.selectAll('path').sort(function (a, b) {
        if (a.id !== feature.id) {
          return -1;
        }
        return +1;
      });
    };

    PathOverlayView.prototype.renderSvgContainer = function () {
      this.svg = d3.select(this.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
      return this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
    };

    PathOverlayView.prototype.render = function () {
      var self;
      if (this.renderSvgContainer != null) {
        this.renderSvgContainer();
      }
      this.geoJson = this.collection;
      self = this;
      this.g.selectAll('path').data(this.geoJson.features).enter().append('path').on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', function (d) {
        if (d3.event.defaultPrevented) {
          return;
        }
        return self.onFeatureClick(d);
      });
      this.update();
      this.onRender();
      this.map.on('viewreset', this.update.bind(this));
      this.map.on('click', this.onMapClick.bind(this));
      return this;
    };

    getProjectedPoint = function (long, lat) {
      return this.map.latLngToLayerPoint(new L.LatLng(lat, long));
    };

    PathOverlayView.prototype.getPath = function () {
      var path, projectPoint, self, transform;
      self = this;
      getProjectedPoint = function (long, lat) {
        return self.map.latLngToLayerPoint(new L.LatLng(lat, long));
      };
      projectPoint = function (long, lat) {
        var point;
        point = getProjectedPoint(long, lat);
        this.stream.point(point.x, point.y);
        return this;
      };
      transform = d3.geo.transform({
        point: projectPoint
      });
      path = d3.geo.path().projection(transform);
      return path;
    };

    PathOverlayView.prototype.update = function () {
      var geoJson, path;
      path = this.getPath();
      geoJson = this.collection;
      this.g.selectAll('path').attr({
        'class': (function (_this) {
          return function (feature) {
            var cls, displayState;
            displayState = _this.getFeatureDisplayState(feature);
            cls = 'map-region map-region__element';
            if (displayState != null) {
              cls += " map-region--" + displayState;
            }
            return cls;
          };
        })(this),
        'd': path,
        'fill': this.getFill.bind(this)
      });
      this.resizeContainer(geoJson, path, 0);
      return this;
    };

    return PathOverlayView;
  })(Map.BaseOverlayView);
}).call(undefined);
'use strict';

(function () {
  var extend = function extend(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      hasProp = ({}).hasOwnProperty;

  Map.PinOverlayView = (function (superClass) {
    extend(PinOverlayView, superClass);

    function PinOverlayView() {
      return PinOverlayView.__super__.constructor.apply(this, arguments);
    }

    PinOverlayView.prototype.renderSvgContainer = function () {
      this.svg = d3.select(Map.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
      return this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
    };

    PinOverlayView.prototype.setMapEventListeners = function () {
      Map.map.on('viewreset', this.update.bind(this));
      return Map.map.on('click', this.onMapClick.bind(this));
    };

    PinOverlayView.prototype.render = function () {
      var pindrop;
      if (this.renderSvgContainer != null) {
        this.renderSvgContainer();
      }
      this.shape = Map.svgPaths.shapes.pindrop;
      pindrop = [{
        path: this.shape.paths.slice_1_of_2,
        className: 'map-pin__1-of-2'
      }, {
        path: this.shape.paths.slice_2_of_2,
        className: 'map-pin__2-of-2'
      }, {
        path: this.shape.paths.slice_1_of_3,
        className: 'map-pin__1-of-3'
      }, {
        path: this.shape.paths.slice_2_of_3_a,
        className: 'map-pin__2-of-3'
      }, {
        path: this.shape.paths.slice_2_of_3_b,
        className: 'map-pin__2-of-3'
      }, {
        path: this.shape.paths.slice_3_of_3,
        className: 'map-pin__3-of-3'
      }, {
        path: this.shape.paths.outer,
        className: 'map-pin__outer'
      }, {
        path: this.shape.paths.inner,
        className: 'map-pin__inner'
      }];
      this.g.selectAll('g').data(this.collection.features).enter().append('g').attr({
        'class': 'map-pin'
      }).on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', this.onFeatureClick.bind(this)).selectAll('path').data(pindrop).enter().append('path').attr({
        'd': function d(_d) {
          return _d.path;
        },
        'class': function _class(d) {
          return d.className;
        }
      });
      this.update();
      this.onRender();
      return this.setMapEventListeners();
    };

    PinOverlayView.prototype.getFills = function (feature) {
      var filter, valueIndeces;
      filter = Map.props.project.get('data').filter;
      valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
      if (valueIndeces == null || valueIndeces.length === 0) {
        return;
      }
      return valueIndeces.map(function (valueIndex) {
        return Map.colors.toRgb(valueIndex - 1);
      });
    };

    PinOverlayView.prototype.update = function () {
      var getIndecesFromClassName, getProjectedPoint, path, projectPoint, self, transform;
      getProjectedPoint = function (long, lat) {
        return Map.map.latLngToLayerPoint(new L.LatLng(lat, long));
      };
      projectPoint = function (long, lat) {
        var point;
        point = getProjectedPoint(long, lat);
        this.stream.point(point.x, point.y);
        return this;
      };
      getIndecesFromClassName = function (cls) {
        var indeces;
        indeces = cls.split('__')[1].split('-');
        if (indeces[2] != null) {
          indeces = indeces = [parseInt(indeces[0], 10), parseInt(indeces[2], 10)];
          return indeces;
        }
      };
      transform = d3.geo.transform({
        point: projectPoint
      });
      path = d3.geo.path().projection(transform);
      self = this;
      this.g.selectAll('g').attr({
        transform: function transform(d) {
          var coord, pt, x, y;
          coord = d.geometry.coordinates;
          pt = getProjectedPoint(coord[0], coord[1]);
          x = pt.x - self.shape.dim.width / 2;
          y = pt.y - self.shape.dim.height;
          return "translate(" + x + "," + y + ")";
        },
        "class": function _class(feature) {
          var cls, displayState;
          displayState = self.getFeatureDisplayState(feature);
          cls = 'map-pin map-pin__element';
          if (displayState != null) {
            cls += " map-pin--" + displayState;
          }
          return cls;
        }
      }).selectAll('path').attr({
        'class': function _class(d, i) {
          var baseClass;
          baseClass = 'map-pin__element';
          return d.className + ' ' + baseClass;
        },
        'fill': function fill(d, i) {
          var colorIndex, colors, indeces, parentFeature;
          parentFeature = d3.select(this.parentNode).datum();
          colors = self.getFills(parentFeature);
          if (colors == null) {
            return 'none';
          }
          indeces = getIndecesFromClassName(d.className);
          if (indeces != null) {
            if (colors.length === 1) {
              return colors[0];
            }
            if (colors.length === 2 && indeces[1] === 2 || colors.length === 3 && indeces[1] === 3 || colors.length > 3) {
              colorIndex = indeces[0] - 1;
              if (colors[colorIndex] != null) {
                return colors[colorIndex];
              }
            }
          }
          return 'none';
        }
      });
      this.resizeContainer(this.collection, path, 100);
      return this;
    };

    return PinOverlayView;
  })(Map.BaseOverlayView);
}).call(undefined);