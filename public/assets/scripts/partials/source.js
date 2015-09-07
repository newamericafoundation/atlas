(function() {
  if (typeof ChartistHtml !== "undefined" && ChartistHtml !== null) {
    ChartistHtml.config.baseClass = "atlas-chart";
    ChartistHtml.config.colorSpectrum = ['#85026A', '#019fde'];
    ChartistHtml.config.tooltipTemplate = function(data) {
      return "<div><h1>" + data.label + "</h1><p>" + data.value + "</p></div>";
    };
    ChartistHtml.config.chartOptions.bar.options.base.seriesBarDistance = 28;
    ChartistHtml.config.labelOffsetCoefficient = 5;
  }

}).call(this);

(function() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  });

}).call(this);

(function() {
  $.fn.ensureScript = function(globalName, path, next) {
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

}).call(this);

(function() {
  $.fn.extend({
    toggleModifierClass: function(baseClass, modifiers, modifierSign) {
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
          newModifier = (modifiers[i + 1] != null ? modifiers[i + 1] : modifiers[0]);
          if ((newModifier !== modifier) && (newModifier !== '')) {
            newClass = baseClass + modifierSign + newModifier;
            return $el.addClass(newClass);
          }
        }
      }
      return $el.addClass(baseClass + modifierSign + modifiers[0]);
    }
  });

}).call(this);

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

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
if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

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
window.Atlas = new Marionette.Application();
(function() {
  this.Atlas.module('Map', function(Map) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.Controller.destroy();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Map', function(Map) {
    return Map.control = {
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
      getView: function() {
        var ll, map;
        map = this;
        ll = map.getBounds().getCenter();
        return [ll.lat, ll.lng];
      },
      changeZoom: function(dZoom) {
        var map, z;
        map = this;
        z = map.getZoom();
        map.setView(map.getView(), z + dZoom);
        return this;
      },
      setZoom: function(zoom) {
        var map;
        map = this;
        map.setView(map.getView(), zoom);
        return this;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Map', function(Map) {
    return Map.Controller = {
      show: function() {
        return $().ensureScript('L', '/assets/vendor/mapbox.js', this.showMain.bind(this));
      },
      showMain: function() {
        Map.rootView = new Map.RootView().render();
        this.$loading = $("<div class='loading-icon'><div>Loading...</div></div>");
        $('.atl__main').append(this.$loading);
        return $().ensureScript('d3', '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
      },
      showOverlay: function() {
        var View, itemType, items, launch;
        items = Map.props.project.get('data').items;
        itemType = items.getItemType();
        View = itemType === 'state' ? Map.PathOverlayView : Map.PindropOverlayView;
        launch = function(baseGeoData) {
          var coll;
          coll = items.getRichGeoJson(baseGeoData);
          return coll.onReady(function() {
            var overlayView;
            overlayView = new View();
            overlayView.map = Map.map;
            overlayView.collection = coll;
            Map.overlayView = overlayView;
            return overlayView.render();
          });
        };
        this.getStateBaseGeoData(launch);
        return this;
      },
      getStateBaseGeoData: function(next) {
        var data;
        data = Map.props.App['us-states-10m'];
        if (data != null) {
          return next(data);
        }
        return $.ajax({
          url: '/data/us-states-10m.js',
          dataType: 'script',
          success: function() {
            return next(Map.props.App['us-states-10m']);
          }
        });
      },
      destroy: function() {
        if (Map.overlayView != null) {
          Map.overlayView.destroy();
        }
        if (Map.rootView != null) {
          return Map.rootView.destroy();
        }
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Map', function(Map) {
    return Map.RootView = Marionette.Object.extend({
      el: '#atl__map',
      initialize: function(options) {
        this.elId = this.el.substr(1);
        this.$el = $(this.el);
        return this;
      },
      _getZoomLevel: function() {
        var width;
        width = this.$el.width();
        if (width > 1350) {
          return 5;
        }
        if (width > 700) {
          return 4;
        }
        return 3;
      },
      _setupMap: function() {
        var zoomLevel;
        zoomLevel = this._getZoomLevel();
        this.map.setView([37.6, -95.665], zoomLevel);
        this.map.scrollWheelZoom.disable();
        _.extend(this.map, Map.control);
        this.map.ignoreNextClick = false;
        this.map.on('dragend', (function(_this) {
          return function(e) {
            var items;
            items = Map.props.project.get('data').items;
            if (e.distance > 15 && (items.hovered != null)) {
              return _this.map.ignoreNextClick = true;
            }
          };
        })(this));
        return Map.map = this.map;
      },
      render: function() {
        L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw';
        this.map = L.mapbox.map(this.elId, 'rossvanderlinde.874ab107', {
          attributionControl: true,
          zoomControl: false,
          inertia: false
        });
        this.$attribution = $('.leaflet-control-attribution');
        this.$attribution.hide();
        this._setupMap();
        this._addControl();
        return this;
      },
      _addControl: function() {
        var html;
        html = "<div class='atl__map-control'> <div id='atl__map-attribution' class='atl__map-control__button bg-img-info--black'></div> <div id='atl__map-zoom-in'  class='atl__map-control__button bg-img-plus--black'></div> <div id='atl__map-zoom-out' class='atl__map-control__button bg-img-minus--black'></div> <div class='atl__help atl__help--left'> View <b>copyright</b> information about the map and <b>zoom</b> in and out. </div> </div>";
        this.$el.append(html);
        this.$zoomInButton = $('#atl__map-zoom-in');
        this.$zoomOutButton = $('#atl__map-zoom-out');
        this.$attributionButton = $('#atl__map-attribution');
        this._setZoomEvents();
        return this._setAttributionEvents();
      },
      _setZoomEvents: function() {
        var map;
        map = this.map;
        this.$zoomInButton.on('click', function() {
          return map.changeZoom(+1);
        });
        this.$zoomOutButton.on('click', function() {
          return map.changeZoom(-1);
        });
        return this;
      },
      _setAttributionEvents: function() {
        return this.$attributionButton.on('click', (function(_this) {
          return function() {
            return _this.$attribution.toggle();
          };
        })(this));
      },
      clearZoom: function() {
        this.$zoomInButton.off();
        this.$zoomOutButton.off();
        return this;
      },
      destroy: function() {
        this.clearZoom();
        if (this.map) {
          this.map.clearAllEventListeners();
          this.map.remove();
        }
        return this;
      }
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Map", function(Map) {
    return Map.OverlayBaseView = (function(superClass) {
      extend(OverlayBaseView, superClass);

      function OverlayBaseView() {
        return OverlayBaseView.__super__.constructor.apply(this, arguments);
      }

      OverlayBaseView.prototype.initialize = function() {
        Map.props.App.reqres.setHandler('item:map:position', (function(_this) {
          return function(item) {
            return _this.getItemMapPosition(item);
          };
        })(this));
        return this;
      };

      OverlayBaseView.prototype.setHeaderStripColor = function() {
        var cls, filter, hoveredItem, indeces, items, project;
        project = Map.props.project;
        items = project.get('data').items;
        filter = project.get('data').filter;
        hoveredItem = items.hovered;
        if (hoveredItem != null) {
          indeces = filter.getFriendlyIndeces(hoveredItem, 15);
          cls = "bg-c-" + indeces[0];
          return Map.props.App.commands.execute('set:header:strip:color', {
            className: cls
          });
        } else {
          return Map.props.App.commands.execute('set:header:strip:color', 'none');
        }
      };

      OverlayBaseView.prototype.getItemMapPosition = function(item) {
        var feature, identityPath, latLong, longLatArrayCentroid, map;
        identityPath = d3.geo.path().projection(function(d) {
          return d;
        });
        feature = this.getFeatureByModel(item);
        longLatArrayCentroid = identityPath.centroid(feature);
        latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0]);
        map = Map.map;
        return map.latLngToContainerPoint(latLong);
      };

      OverlayBaseView.prototype.updateAnimated = function() {
        var $el;
        $el = $('.leaflet-overlay-pane');
        return $el.stop().animate({
          opacity: 0
        }, 750, 'swing', (function(_this) {
          return function() {
            _this.update();
            return $el.animate({
              opacity: 1
            }, 750);
          };
        })(this));
      };

      OverlayBaseView.prototype.onFeatureMouseOut = function(feature) {
        var items, project;
        project = Map.props.project;
        items = project.get('data').items;
        items.setHovered(-1);
        this.setHeaderStripColor();
        return Map.props.App.commands.execute('update:tilemap');
      };

      OverlayBaseView.prototype.onFeatureMouseOver = function(feature) {
        var items, model, project;
        if (this.bringFeatureToFront != null) {
          this.bringFeatureToFront(feature);
        }
        project = Map.props.project;
        items = project.get('data').items;
        model = feature._model != null ? feature._model : feature.id;
        items.setHovered(model);
        this.setHeaderStripColor();
        return Map.props.App.commands.execute('update:tilemap');
      };

      OverlayBaseView.prototype.onFeatureClick = function(feature) {
        var items, model, project;
        if ((Map.map != null) && Map.map.ignoreNextClick) {
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

      OverlayBaseView.prototype.onRender = function() {
        return $('.loading-icon').remove();
      };

      OverlayBaseView.prototype.onMapClick = function(e) {
        if (this.activeFeature != null) {
          this.activeFeature = void 0;
          return Map.props.App.vent.trigger('item:deactivate');
        }
      };

      OverlayBaseView.prototype.getFeatureByModel = function(model) {
        var feature, i, len, ref;
        ref = this.collection.features;
        for (i = 0, len = ref.length; i < len; i++) {
          feature = ref[i];
          if (feature._model === model) {
            return feature;
          }
        }
      };

      OverlayBaseView.prototype.getFeatureDisplayState = function(feature) {
        var display, filter, model, searchTerm;
        if (Map.props.uiState == null) {
          return;
        }
        display = Map.props.uiState.display;
        filter = Map.props.project.get('data').filter;
        searchTerm = Map.props.App.reqres.request('search:term');
        model = feature._model;
        if (model != null) {
          return model.getDisplayState(filter, searchTerm, display);
        }
      };

      OverlayBaseView.prototype.getFill = function(feature) {
        var filter, id, valueIndeces;
        filter = Map.props.project.get('data').filter;
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
        if ((valueIndeces == null) || valueIndeces.length === 0) {
          return;
        }
        if (valueIndeces.length === 1) {
          return Map.colors.toRgb(valueIndeces[0] - 1);
        }
        id = Map.props.App.reqres.request('get:pattern:id', valueIndeces);
        return "url(#stripe-pattern-" + id + ")";
      };

      OverlayBaseView.prototype._areBoundsFinite = function(bounds) {
        return isFinite(bounds[0][0]) && isFinite(bounds[0][1]) && isFinite(bounds[1][0]) && isFinite(bounds[1][1]);
      };

      OverlayBaseView.prototype.resizeContainer = function(geoJson, path, extraExpansion) {
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

      OverlayBaseView.prototype.destroy = function() {
        this.stopListening();
        this.g.selectAll('path').remove();
        this.g.remove();
        this.svg.remove();
        return this;
      };

      return OverlayBaseView;

    })(Marionette.Object);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Map", function(Map) {
    return Map.PathOverlayView = (function(superClass) {
      var getProjectedPoint;

      extend(PathOverlayView, superClass);

      function PathOverlayView() {
        return PathOverlayView.__super__.constructor.apply(this, arguments);
      }

      PathOverlayView.prototype.bringFeatureToFront = function(feature) {
        return this.g.selectAll('path').sort(function(a, b) {
          if (a.id !== feature.id) {
            return -1;
          }
          return +1;
        });
      };

      PathOverlayView.prototype.renderSvgContainer = function() {
        this.svg = d3.select(this.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
        return this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
      };

      PathOverlayView.prototype.render = function() {
        var self;
        if (this.renderSvgContainer != null) {
          this.renderSvgContainer();
        }
        this.geoJson = this.collection;
        self = this;
        this.g.selectAll('path').data(this.geoJson.features).enter().append('path').on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', function(d) {
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

      getProjectedPoint = function(long, lat) {
        return this.map.latLngToLayerPoint(new L.LatLng(lat, long));
      };

      PathOverlayView.prototype.getPath = function() {
        var path, projectPoint, self, transform;
        self = this;
        getProjectedPoint = function(long, lat) {
          return self.map.latLngToLayerPoint(new L.LatLng(lat, long));
        };
        projectPoint = function(long, lat) {
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

      PathOverlayView.prototype.update = function() {
        var geoJson, path;
        path = this.getPath();
        geoJson = this.collection;
        this.g.selectAll('path').attr({
          'class': (function(_this) {
            return function(feature) {
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

    })(Map.OverlayBaseView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Map", function(Map) {
    return Map.PindropOverlayView = (function(superClass) {
      extend(PindropOverlayView, superClass);

      function PindropOverlayView() {
        return PindropOverlayView.__super__.constructor.apply(this, arguments);
      }

      PindropOverlayView.prototype.renderSvgContainer = function() {
        this.svg = d3.select(Map.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
        return this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
      };

      PindropOverlayView.prototype.setMapEventListeners = function() {
        Map.map.on('viewreset', this.update.bind(this));
        return Map.map.on('click', this.onMapClick.bind(this));
      };

      PindropOverlayView.prototype.render = function() {
        var pindrop;
        if (this.renderSvgContainer != null) {
          this.renderSvgContainer();
        }
        this.shape = Map.svgPaths.shapes.pindrop;
        pindrop = [
          {
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
          }
        ];
        this.g.selectAll('g').data(this.collection.features).enter().append('g').attr({
          'class': 'map-pin'
        }).on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', this.onFeatureClick.bind(this)).selectAll('path').data(pindrop).enter().append('path').attr({
          'd': function(d) {
            return d.path;
          },
          'class': function(d) {
            return d.className;
          }
        });
        this.update();
        this.onRender();
        return this.setMapEventListeners();
      };

      PindropOverlayView.prototype.getFills = function(feature) {
        var filter, valueIndeces;
        filter = Map.props.project.get('data').filter;
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
        if ((valueIndeces == null) || valueIndeces.length === 0) {
          return;
        }
        return valueIndeces.map(function(valueIndex) {
          return Map.colors.toRgb(valueIndex - 1);
        });
      };

      PindropOverlayView.prototype.update = function() {
        var getIndecesFromClassName, getProjectedPoint, path, projectPoint, self, transform;
        getProjectedPoint = function(long, lat) {
          return Map.map.latLngToLayerPoint(new L.LatLng(lat, long));
        };
        projectPoint = function(long, lat) {
          var point;
          point = getProjectedPoint(long, lat);
          this.stream.point(point.x, point.y);
          return this;
        };
        getIndecesFromClassName = function(cls) {
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
          transform: function(d) {
            var coord, pt, x, y;
            coord = d.geometry.coordinates;
            pt = getProjectedPoint(coord[0], coord[1]);
            x = pt.x - self.shape.dim.width / 2;
            y = pt.y - self.shape.dim.height;
            return "translate(" + x + "," + y + ")";
          },
          "class": function(feature) {
            var cls, displayState;
            displayState = self.getFeatureDisplayState(feature);
            cls = 'map-pin map-pin__element';
            if (displayState != null) {
              cls += " map-pin--" + displayState;
            }
            return cls;
          }
        }).selectAll('path').attr({
          'class': function(d, i) {
            var baseClass;
            baseClass = 'map-pin__element';
            return d.className + ' ' + baseClass;
          },
          'fill': function(d, i) {
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
              if (((colors.length === 2) && (indeces[1] === 2)) || ((colors.length === 3) && (indeces[1] === 3)) || (colors.length > 3)) {
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

      return PindropOverlayView;

    })(Map.OverlayBaseView);
  });

}).call(this);
