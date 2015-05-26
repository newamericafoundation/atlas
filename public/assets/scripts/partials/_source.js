(function() {
  if (typeof ChartistHtml !== "undefined" && ChartistHtml !== null) {
    ChartistHtml.config.baseClass = "atlas-chart";
    ChartistHtml.config.colorSpectrum = ['#85026A', '#019fde'];
    ChartistHtml.config.tooltipTemplate = function(data) {
      return "<div><h1>" + data.label + "</h1><p>" + data.value + "</p></div>";
    };
    ChartistHtml.config.chartOptions.bar.options.base.seriesBarDistance = 28;
  }

}).call(this);

(function() {
  if (typeof CKEDITOR !== "undefined" && CKEDITOR !== null) {
    CKEDITOR.config.allowedContent = true;
    CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4';
    CKEDITOR.config.format_h4 = {
      element: 'h4',
      attributes: {
        'class': 'Notes under tables'
      }
    };
    CKEDITOR.config.toolbar = [['Source', '-', 'Undo', 'Redo', 'Cut', 'Copy', 'Paste', '-', 'Find', 'Replace'], ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'Link', 'Unlink', '-', 'Format', '-', 'TextColor', 'BGColor']];
    CKEDITOR.config.height = '500px';
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
  Marionette.Renderer.render = function(template, data) {
    var i, len, path, paths;
    if (window.JST == null) {
      window.JST = {};
    }
    if (window.JST_ATL == null) {
      window.JST_ATL = {};
    }
    paths = [JST["atlas/" + template], JST["atlas/site/" + template], JST_ATL['atlas/site/' + template + '.jst'], JST_ATL['atlas/' + template + '.jst']];
    for (i = 0, len = paths.length; i < len; i++) {
      path = paths[i];
      if (path) {
        return path(data);
      }
    }
    throw "Template " + template + " not found!";
  };

}).call(this);

(function() {
  this.Atlas = (function(Backbone, Marionette) {
    var App;
    App = new Marionette.Application();
    App.on('start', function() {
      var router;
      router = new App.Router.Router();
      App.rtr = router;
      if (Backbone.history) {
        Backbone.history.start({
          pushState: true
        });
      }
      return $(document).on('mousewheel', function(e) {
        App.vent.trigger('scroll');
        if (e.deltaY > 50) {
          App.vent.trigger('strong:scroll:up');
        }
        if (e.deltaY < -50) {
          App.vent.trigger('strong:scroll:down');
        }
        if (e.deltaX > 50) {
          App.vent.trigger('strong:scroll:left');
        }
        if (e.deltaX < -50) {
          return App.vent.trigger('strong:scroll:right');
        }
      });
    });
    return App;
  })(Backbone, Marionette);

}).call(this);

(function() {
  this.Atlas.module('Router', function(Router, App, Backbone, Marionette, $, _) {
    Router.actions = ['welcome_index', 'projects_index', 'projects_show', 'about_index'];
    Router.actionHistory = [];
    Router.History = (function() {
      function History() {
        this._history = [];
      }

      History.prototype._actions = ['welcome_index', 'projects_index', 'projects_show', 'about_index'];

      History.prototype.add = function(action, options) {
        var obj;
        obj = {
          actionIndex: this._actions.indexOf(action)
        };
        _.extend(obj, options);
        return this._history.push(obj);
      };

      History.prototype.getSwipeDirection = function() {
        return 'left';
      };

      return History;

    })();
    Router.getActionIndex = function(action) {
      return Router.actions.indexOf(action);
    };
    Router.getCurrentActionIndex = function() {
      var currentAction;
      currentAction = Router.actionHistory[Router.actionHistory.length - 1];
      return Router.getActionIndex(Router.currentAction);
    };
    return Router.getPreviousActionIndex = function() {
      var previousAction;
      previousAction = Router.actionHistory[Router.actionHistory.length - 2];
      return Router.getActionIndex(previousAction);
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Router', function(Router, App, Backbone, Marionette, $, _) {
    return Router.Router = Marionette.AppRouter.extend({
      initialize: function() {
        return this.history = new Router.History();
      },
      routes: {
        'welcome': 'welcome_index',
        'about': 'about_index',
        'menu': 'projects_index',
        ':atlas_url': 'projects_show',
        '*notFound': 'welcome_index'
      },
      welcome_index: function() {
        Backbone.history.navigate('/welcome', {
          trigger: false
        });
        this.navigate('welcome_index');
        return App.Welcome.start();
      },
      about_index: function() {
        this.navigate('about_index');
        return App.About.start();
      },
      projects_index: function() {
        this.navigate('projects_index');
        App.Projects.start();
        return App.Projects.Index.start();
      },
      projects_show: function(atlas_url) {
        this.navigate('projects_show', {
          atlas_url: atlas_url
        });
        if (atlas_url == null) {
          atlas_url = this.atlas_url;
        }
        this.atlas_url = atlas_url;
        App.Projects.start();
        return App.Projects.Show.start(atlas_url);
      },
      navigate: function(action, params) {
        this.history.add(action, params);
        this._setCurrentAction(action);
        this._stopRoutableModules();
        return App.commands.execute('apply:route:specific:styling', action);
      },
      _stopRoutableModules: function() {
        App.Welcome.stop();
        App.About.stop();
        return App.Projects.stop();
      },
      _setCurrentAction: function(currentAction) {
        Router.actionHistory.push(currentAction);
        Router.currentAction = currentAction;
        App.vent.trigger('router:current:action:change', Router.getCurrentActionIndex());
        return this._setSwipeDirection();
      },
      _setSwipeDirection: function() {
        var cai, pai;
        cai = Router.getCurrentActionIndex();
        pai = Router.getPreviousActionIndex();
        if (cai < pai) {
          return App.swipeDirection = 'left';
        } else if (cai > pai) {
          return App.swipeDirection = 'right';
        } else {
          return App.swipeDirection = 'top';
        }
      }
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    return Base.Collection = (function(superClass) {
      extend(Collection, superClass);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype._isCacheable = false;

      Collection.prototype.fetch = function() {
        var cache;
        cache = this.constructor._cache;
        if (this._isCacheable && (cache != null)) {
          return this.reset(cache.models);
        } else {
          Backbone.Collection.prototype.fetch.apply(this, arguments);
          return this.constructor._cache = this;
        }
      };

      return Collection;

    })(Backbone.Collection);
  });

}).call(this);

(function() {
  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    return Base.Entity = Backbone.Model.extend({
      _adaptMongoId: function(resp) {
        if ((resp.id != null) && (resp.id.$oid != null) && _.isObject(resp.id)) {
          resp.id = resp.id['$oid'];
          return resp;
        }
        if ((resp._id != null) && (resp.id == null)) {
          resp.id = resp._id;
          delete resp._id;
          return resp;
        }
      }
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    return Base.EntityManager = (function(superClass) {
      extend(EntityManager, superClass);

      function EntityManager(options) {
        if (options != null) {
          this.entitiesConstructor = options.entitiesConstructor;
          this.entityConstructor = options.entityConstructor;
        }
        this.entityCache = [];
      }

      EntityManager.prototype.getEntities = function(options) {
        var Constr, cache, caching, coll;
        caching = (options != null) && options.cache;
        if (caching) {
          cache = this.entitiesCache;
          if (cache != null) {
            return cache;
          }
        }
        Constr = this.entitiesConstructor;
        coll = new Constr();
        if ((options != null) && (options.queryString != null)) {
          coll.queryString = options.queryString;
        }
        coll.fetch({
          reset: true
        });
        if (caching) {
          this.entitiesCache = coll;
        }
        return coll;
      };

      EntityManager.prototype.getEntity = function(query, options) {
        var Constr, cachedEntity, caching, model;
        caching = (options != null) && options.cache;
        if (caching) {
          cachedEntity = this._getCachedEntity(query);
          if (cachedEntity != null) {
            return cachedEntity;
          }
        }
        Constr = this.entityConstructor;
        model = new Constr(query);
        model.fetch({
          reset: true
        });
        if (caching) {
          this.entityCache.push({
            query: query,
            entity: model
          });
        }
        return model;
      };

      EntityManager.prototype._getCachedEntity = function(query) {
        var cachedItem, i, len, ref;
        ref = this.entityCache;
        for (i = 0, len = ref.length; i < len; i++) {
          cachedItem = ref[i];
          if (_.isEqual(cachedItem.query, query)) {
            return cachedItem.entity;
          }
        }
      };

      return EntityManager;

    })(Marionette.Object);
  });

}).call(this);

(function() {
  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    var view;
    view = {
      inAnimation: {
        startCSS: {},
        endCSS: {},
        restCSS: {}
      },
      outAnimation: {
        startCSS: {},
        endCSS: {},
        restCSS: {}
      }
    };
    return Base.Region = Marionette.Region.extend({
      show2: function(view, options) {
        var $currentEl, $el, anim, currentView, direction;
        if (this.currentView == null) {
          Marionette.Region.prototype.show.apply(this, [view, options]);
          return this;
        }
        $currentEl = void 0;
        $el = void 0;
        currentView = this.currentView;
        direction = App.swipeDirection;
        anim = {
          start: {
            view: {
              'position': 'absolute'
            }
          },
          end: {
            view: {},
            currentView: {}
          },
          rest: {
            view: {
              'position': ''
            }
          }
        };
        anim.start.view[direction] = '-100%';
        anim.end.view[direction] = '0';
        anim.rest.view[direction] = '';
        anim.end.currentView[direction] = '+100%';
        $currentEl = currentView.$el;
        view.render();
        $el = view.$el;
        $el.css(anim.start.view);
        this.$el.prepend($el);
        this.currentView = view;
        view._parent = this;
        $el.animate(anim.end.view, 1000, function() {
          return $el.css(anim.rest.view);
        });
        this.stopListening(currentView);
        currentView.stopListening();
        currentView.off();
        return $currentEl.animate(anim.end.currentView, 1000, function() {
          return currentView.destroy();
        });
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Assets', function(Assets, App, Backbone, Marionette, $, _) {
    return Assets.svg = {
      shapes: {
        pindrop_illustrator: {
          dim: {
            width: 612,
            height: 792
          },
          paths: {
            outer: "M306,14.8c145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3C160.8,570.1,43.8,421.4,43.8,277C43.8,131.8,160.8,14.8,306,14.8z",
            inner: "M306,175.8c-60.7,0-111.8,51.1-111.8,112.7S244.4,401.1,306,401.1S417.8,350,417.8,288.4S367.6,175.8,306,175.8z",
            slice_1_of_2: "M306,788.3C160.8,568.3,43.8,420.5,43.8,276.1C43.8,130.9,161.7,14.8,306,14.8v161c-60.7,0-111.8,50.2-111.8,111.8S244.4,401.1,306,401.1V788.3z",
            slice_2_of_2: "M306,401.1c60.7,0,111.8-50.2,111.8-111.8S367.6,175.8,306,175.8v-161c145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3V401.1z",
            slice_1_of_3: "M194.2,288.5c0-21.4,6.2-41.5,16.8-58.5V32.4C113,70.4,43.8,165.3,43.8,277c0,111,69.2,224.6,167.2,370.4V347.3C200.4,330.2,194.2,310.1,194.2,288.5z",
            slice_2_of_3_a: "M306,176.7c40,0,75.2,21.2,95,52.9v-197c-29.4-11.5-61.5-17.8-95-17.8s-65.6,6.3-95,17.6V230C230.9,198.1,266.4,176.7,306,176.7z",
            slice_2_of_3_b: "M306,400.2c-40,0-75.2-21.2-95-52.9v300.1c29.4,43.8,61.5,90.5,95,140.9c33.4-51,65.5-98.2,95-142.4V347.2C381.2,379,346,400.2,306,400.2z",
            slice_3_of_3: "M401,32.6v197c10.6,17.1,16.8,37.2,16.8,58.8s-6.2,41.7-16.8,58.8v298.7C498.3,500.5,568.2,387.7,568.2,277C568.2,166,499,70.7,401,32.6z"
          }
        },
        pindrop_new: {
          dim: {
            width: 30,
            height: 38.8235294117647
          },
          paths: {
            inner: "M15,8.618c-2.975,0-5.48,2.505-5.48,5.525S11.98,19.662,15,19.662S20.48,17.157,20.48,14.137S18.02,8.618,15,8.618z",
            outer: "M15,0.725c7.118,0,12.853,5.779,12.853,12.853S22.029,27.902,15,38.642C7.882,27.946,2.147,20.657,2.147,13.578C2.147,6.461,7.882,0.725,15,0.725z",
            slice_1_of_2: "M15,38.642C7.882,27.858,2.147,20.613,2.147,13.534C2.147,6.417,7.926,0.725,15,0.725v7.892c-2.975,0-5.48,2.461-5.48,5.48S11.98,19.662,15,19.662V38.642z",
            slice_1_of_3: "M9.52,14.142c0-1.049,0.304-2.034,0.824-2.868V1.588C5.539,3.451,2.147,8.103,2.147,13.578c0,5.441,3.392,11.01,8.196,18.157V17.025C9.824,16.186,9.52,15.201,9.52,14.142z",
            slice_2_of_2: "M15,19.662c2.975,0,5.48-2.461,5.48-5.48S18.02,8.618,15,8.618v-7.892c7.118,0,12.853,5.779,12.853,12.853S22.029,27.902,15,38.642V19.662z",
            slice_2_of_3_a: "M15,8.662c1.961,0,3.686,1.039,4.657,2.593v-9.657c-1.441-0.564-3.015-0.873-4.657-0.873s-3.216,0.309-4.657,0.863V11.275C11.319,9.711,13.059,8.662,15,8.662z",
            slice_2_of_3_b: "M15,19.618c-1.961,0-3.686-1.039-4.657-2.593v14.711c1.441,2.147,3.015,4.436,4.657,6.907c1.637-2.5,3.211-4.814,4.657-6.98V17.02C18.686,18.578,16.961,19.618,15,19.618z",
            slice_3_of_3: "M19.657,1.598v9.657c0.52,0.838,0.824,1.824,0.824,2.882s-0.304,2.044-0.824,2.882v14.642C24.426,24.534,27.853,19.005,27.853,13.578C27.853,8.137,24.461,3.466,19.657,1.598z"
          }
        },
        pindrop: {
          dim: {
            width: 30,
            height: 38.8
          },
          paths: {
            outer: 'M14.951,0.725c7.118,0,12.853,5.779,12.853,12.853S21.98,27.902,14.951,38.642C7.833,27.946,2.098,20.657,2.098,13.578C2.098,6.461,7.833,0.725,14.951,0.725z',
            inner: 'M14.951,8.662c-2.975,0-5.48,2.461-5.48,5.48S11.931,19.618,14.951,19.618S20.431,17.157,20.431,14.137S17.971,8.662,14.951,8.662z',
            left: 'M14.951,38.686C7.833,27.902,2.098,20.657,2.098,13.578C2.098,6.461,7.877,0.77,14.951,0.77v7.892c-2.975,0-5.48,2.461-5.48,5.48S11.931,19.618,14.951,19.618V38.686z',
            right: 'M14.951,19.662c2.975,0,5.48-2.461,5.48-5.48S17.971,8.662,14.951,8.662V0.725c7.118,0,12.853,5.779,12.853,12.853S21.98,27.902,14.951,38.642V19.662z'
          }
        },
        hex: {
          border: "M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3",
          yes: "70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5",
          no: "72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2,57.8,50",
          down: "M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z",
          up: "M38.4,53c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l14.4-14.4l0,0l0.3-0.3c0.8-0.8,2-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3l0.3,0.3l0,0l14.4,14.4c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0l-7.2-7.2v19.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1V45.8L38.4,53z",
          left: "M53,61.6c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0L32.4,53.5l0,0L32,53.1c-0.8-0.8-1.3-2-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1l0.3-0.3l0,0l14.4-14.4c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2l-7.2,7.2h19.1c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3H45.8L53,61.6z",
          right: "M47,38.4c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l14.4,14.4l0,0l0.3,0.3c0.8,0.8,1.3,2,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1l-0.3,0.3l0,0L53.3,67.8c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l7.2-7.2H35.1c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3h19.1L47,38.4z"
        }
      },
      _matchers: {
        absolutePath: /[MCSV]/g,
        relativePath: /[csv\-\,]/g,
        path: /[McCsSvVz]/g,
        number: /[\-\,]/g,
        all: /[McCsSvVz\-\,]/g
      },
      _getPathNumbers: function(svgPath) {
        return svgPath.split(this._matchers.all);
      },
      _getPathDelimiters: function(svgPath) {
        var delimiters;
        return delimiters = svgPath.match(this._matchers.all);
      },
      _moveMinusSigns: function(delimiters, numbers) {
        var delim, i, j, len, results;
        results = [];
        for (i = j = 0, len = delimiters.length; j < len; i = ++j) {
          delim = delimiters[i];
          if (delim === "-") {
            delimiters[i] = "";
            results.push(numbers[i + 1] = "-" + numbers[i + 1]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      _formatNumbers: function(numbers) {
        var i, j, len, number, results;
        results = [];
        for (i = j = 0, len = numbers.length; j < len; i = ++j) {
          number = numbers[i];
          if (!isNaN(number)) {
            results.push(numbers[i] = Math.round(parseFloat(number) * 1000) / 1000);
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      _parseNumbers: function(numbers) {
        var i, j, len, number, results;
        results = [];
        for (i = j = 0, len = numbers.length; j < len; i = ++j) {
          number = numbers[i];
          if (!isNaN(number)) {
            results.push(numbers[i] = parseFloat(number));
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      _scaleNumbers: function(numbers, scale) {
        var i, j, len, number, results;
        results = [];
        for (i = j = 0, len = numbers.length; j < len; i = ++j) {
          number = numbers[i];
          if (!isNaN(number)) {
            results.push(numbers[i] = number * scale);
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      _translateNumbers: function(numbers, delimiters, dx, dy) {
        var i, j, len, number, results;
        results = [];
        for (i = j = 0, len = numbers.length; j < len; i = ++j) {
          number = numbers[i];
          if (!isNaN(number)) {
            if (this._getCoordinateType(numbers, i, delimiters) === "x") {
              results.push(numbers[i] += dx);
            } else if (this._getCoordinateType(numbers, i, delimiters) === "y") {
              results.push(numbers[i] += dy);
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      _rebuild: function(delimiters, numbers) {
        var delim, i, j, len, res;
        res = "";
        for (i = j = 0, len = delimiters.length; j < len; i = ++j) {
          delim = delimiters[i];
          res += delim;
          if ((numbers[i + 1] != null) && (!isNaN(numbers[i + 1]))) {
            res += numbers[i + 1];
          }
        }
        return res;
      },
      scalePath: function(svgPath, transform) {
        var delimiters, dx, dy, numbers, scale;
        scale = (transform != null) && (transform.scale != null) ? transform.scale : 1;
        dx = (transform != null) && (transform.translate != null) && (transform.translate.x != null) ? transform.translate.x : 0;
        dy = (transform != null) && (transform.translate != null) && (transform.translate.y != null) ? transform.translate.y : 0;
        delimiters = this._getPathDelimiters(svgPath);
        numbers = this._getPathNumbers(svgPath);
        this._moveMinusSigns(delimiters, numbers);
        this._parseNumbers(numbers);
        this._scaleNumbers(numbers, scale);
        this._formatNumbers(numbers);
        return this._rebuild(delimiters, numbers);
      },
      scaleShape: function(shape, scale) {
        var key, ref, shp, value;
        shp = {
          dim: {},
          paths: {}
        };
        shp.dim.width = shape.dim.width * scale;
        shp.dim.height = shape.dim.height * scale;
        ref = shape.paths;
        for (key in ref) {
          value = ref[key];
          shp.paths[key] = this.scalePath(value, {
            scale: scale
          });
        }
        return shp;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Data', function(Data, App, Backbone, Marionette, $, _) {
    Data.states = [
      {
        "id": 1,
        "name": "Alabama",
        "code": "AL"
      }, {
        "id": 2,
        "name": "Alaska",
        "code": "AK"
      }, {
        "id": 60,
        "name": "American Samoa",
        "code": "AS"
      }, {
        "id": 4,
        "name": "Arizona",
        "code": "AZ"
      }, {
        "id": 5,
        "name": "Arkansas",
        "code": "AR"
      }, {
        "id": 6,
        "name": "California",
        "code": "CA"
      }, {
        "id": 8,
        "name": "Colorado",
        "code": "CO"
      }, {
        "id": 9,
        "name": "Connecticut",
        "code": "CT"
      }, {
        "id": 10,
        "name": "Delaware",
        "code": "DE"
      }, {
        "id": 11,
        "name": "District of Columbia",
        "code": "DC"
      }, {
        "id": 12,
        "name": "Florida",
        "code": "FL"
      }, {
        "id": 13,
        "name": "Georgia",
        "code": "GA"
      }, {
        "id": 66,
        "name": "Guam",
        "code": "GU"
      }, {
        "id": 15,
        "name": "Hawaii",
        "code": "HI"
      }, {
        "id": 16,
        "name": "Idaho",
        "code": "ID"
      }, {
        "id": 17,
        "name": "Illinois",
        "code": "IL"
      }, {
        "id": 18,
        "name": "Indiana",
        "code": "IN"
      }, {
        "id": 19,
        "name": "Iowa",
        "code": "IA"
      }, {
        "id": 20,
        "name": "Kansas",
        "code": "KS"
      }, {
        "id": 21,
        "name": "Kentucky",
        "code": "KY"
      }, {
        "id": 22,
        "name": "Louisiana",
        "code": "LA"
      }, {
        "id": 23,
        "name": "Maine",
        "code": "ME"
      }, {
        "id": 24,
        "name": "Maryland",
        "code": "MD"
      }, {
        "id": 25,
        "name": "Massachusetts",
        "code": "MA"
      }, {
        "id": 26,
        "name": "Michigan",
        "code": "MI"
      }, {
        "id": 27,
        "name": "Minnesota",
        "code": "MN"
      }, {
        "id": 28,
        "name": "Mississippi",
        "code": "MS"
      }, {
        "id": 29,
        "name": "Missouri",
        "code": "MO"
      }, {
        "id": 30,
        "name": "Montana",
        "code": "MT"
      }, {
        "id": 31,
        "name": "Nebraska",
        "code": "NE"
      }, {
        "id": 32,
        "name": "Nevada",
        "code": "NV"
      }, {
        "id": 33,
        "name": "New Hampshire",
        "code": "NH"
      }, {
        "id": 34,
        "name": "New Jersey",
        "code": "NJ"
      }, {
        "id": 35,
        "name": "New Mexico",
        "code": "NM"
      }, {
        "id": 36,
        "name": "New York",
        "code": "NY"
      }, {
        "id": 37,
        "name": "North Carolina",
        "code": "NC"
      }, {
        "id": 38,
        "name": "North Dakota",
        "code": "ND"
      }, {
        "id": 39,
        "name": "Ohio",
        "code": "OH"
      }, {
        "id": 40,
        "name": "Oklahoma",
        "code": "OK"
      }, {
        "id": 41,
        "name": "Oregon",
        "code": "OR"
      }, {
        "id": 42,
        "name": "Pennsylvania",
        "code": "PA"
      }, {
        "id": 72,
        "name": "Puerto Rico",
        "code": "PR"
      }, {
        "id": 44,
        "name": "Rhode Island",
        "code": "RI"
      }, {
        "id": 45,
        "name": "South Carolina",
        "code": "SC"
      }, {
        "id": 46,
        "name": "South Dakota",
        "code": "SD"
      }, {
        "id": 47,
        "name": "Tennessee",
        "code": "TN"
      }, {
        "id": 48,
        "name": "Texas",
        "code": "TX"
      }, {
        "id": 49,
        "name": "Utah",
        "code": "UT"
      }, {
        "id": 50,
        "name": "Vermont",
        "code": "VT"
      }, {
        "id": 51,
        "name": "Virginia",
        "code": "VA"
      }, {
        "id": 78,
        "name": "Virgin Islands of the U.S.",
        "code": "VI"
      }, {
        "id": 53,
        "name": "Washington",
        "code": "WA"
      }, {
        "id": 54,
        "name": "West Virginia",
        "code": "WV"
      }, {
        "id": 55,
        "name": "Wisconsin",
        "code": "WI"
      }, {
        "id": 56,
        "name": "Wyoming",
        "code": "WY"
      }
    ];
    return this;
  });

}).call(this);

(function() {
  this.Atlas.module('CSS', function(CSS, App, Backbone, Marionette, $, _) {
    CSS.Colors = {
      _list: [[133, 2, 106], [138, 1, 135], [140, 2, 165], [129, 10, 166], [118, 18, 167], [106, 23, 167], [93, 43, 171], [79, 56, 173], [77, 72, 177], [73, 87, 182], [67, 102, 186], [58, 116, 191], [44, 130, 195], [11, 144, 199], [50, 161, 217]],
      _hash: {},
      get: function(index) {
        if (_.isNumber(index)) {
          return this._list[index];
        }
        return this._hash[index];
      },
      interpolate: function(f) {
        var first, interpolated, last;
        first = this._list[0];
        last = this._list[this._list.length - 1];
        interpolated = [];
        interpolated.push(Math.round(first[0] * f + last[0] * (1 - f)));
        interpolated.push(Math.round(first[1] * f + last[1] * (1 - f)));
        interpolated.push(Math.round(first[2] * f + last[2] * (1 - f)));
        return "rgba(" + (interpolated.join(',')) + "," + 1. + ")";
      },
      interpolateRgb: function(f) {
        var first, interpolated, last;
        first = this._list[0];
        last = this._list[this._list.length - 1];
        interpolated = [];
        interpolated.push(Math.round(first[0] * f + last[0] * (1 - f)));
        interpolated.push(Math.round(first[1] * f + last[1] * (1 - f)));
        interpolated.push(Math.round(first[2] * f + last[2] * (1 - f)));
        return "rgb(" + (interpolated.join(',')) + ")";
      },
      toRgba: function(index, opacity) {
        if (opacity == null) {
          opacity = 1;
        }
        return "rgba(" + (this.get(index).join(',')) + "," + opacity + ")";
      },
      toRgb: function(index) {
        return "rgb(" + (this.get(index).join(',')) + ")";
      }
    };
    return CSS.ClassBuilder = {
      interpolate: function(i_k, k, n) {
        var i_n;
        if (n == null) {
          n = CSS.Colors._list.length;
        }
        return i_n = Math.round(1 + (n - 1) * (i_k - 1) / (k - 1));
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('CSS', function(CSS, App, Backbone, Marionette, $, _) {
    var templateList;
    CSS._getBackgroundSvg = function(options) {
      var html, pattern;
      if (options == null) {
        options = {};
      }
      if (options.color1 == null) {
        options.color1 = 'red';
      }
      if (options.color2 == null) {
        options.color2 = 'blue';
      }
      pattern = options.pattern || 'stripe';
      if (options.scale == null) {
        options.scale = 1;
      }
      return html = Marionette.Renderer.render("templates/svg/" + pattern, options);
    };
    CSS.getEncodedSvg = function(svg) {
      var url;
      url = "data:image/svg+xml;base64," + (window.btoa(svg));
      return "url('" + url + "')";
    };
    CSS.getBackgroundImage = function(options) {
      var svg;
      svg = CSS._getBackgroundSvg(options);
      return CSS.getEncodedSvg(svg);
    };
    return templateList = ['build', 'contract', 'dictionary', 'down', 'download'];
  });

}).call(this);

(function() {
  this.Atlas.module('Components', function(Components, App, Backbone, Marionette, $, _) {
    var hideTimeout;
    hideTimeout = void 0;
    this.on('start', function() {
      var hideFlash;
      hideFlash = function() {
        return $('.flash').fadeOut();
      };
      return hideTimeout = setTimeout(hideFlash, 1000);
    });
    return this.on('stop', function() {
      return clearTimeout(hideTimeout);
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Components', function(Components, App, Backbone, Marionette, $, _) {
    return App.commands.setHandler('apply:route:specific:styling', function(route, theme) {
      $('body').attr('class', 'atl-route--' + route);
      return $('.header__main h1').html((route === 'welcome_index' ? 'NEW AMERICA' : 'ATLAS'));
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    Entities.CoreDatumModel = (function(superClass) {
      extend(CoreDatumModel, superClass);

      function CoreDatumModel() {
        return CoreDatumModel.__super__.constructor.apply(this, arguments);
      }

      CoreDatumModel.prototype.urlRoot = '/api/v1/core_data';

      CoreDatumModel.prototype.url = function() {
        return this.urlRoot + "?" + $.param({
          name: this.get('name')
        });
      };

      CoreDatumModel.prototype.parse = function(resp) {
        return resp = this._getFirstModel(resp);
      };

      CoreDatumModel.prototype._getFirstModel = function(resp) {
        if (_.isArray(resp)) {
          resp = resp[0];
        }
        return resp;
      };

      return CoreDatumModel;

    })(Backbone.Model);
    Entities.CoreDatumCollection = (function(superClass) {
      extend(CoreDatumCollection, superClass);

      function CoreDatumCollection() {
        return CoreDatumCollection.__super__.constructor.apply(this, arguments);
      }

      CoreDatumCollection.prototype.model = Entities.CoreDatumModel;

      CoreDatumCollection.prototype.url = 'api/v1/core_data';

      return CoreDatumCollection;

    })(Backbone.Collection);
    entityManager = new App.Base.EntityManager({
      entityConstructor: Entities.CoreDatumModel,
      entitiesConstructor: Entities.CoreDatumCollection
    });
    App.reqres.setHandler('core:datum:entities', function() {
      return entityManager.getEntities({
        cache: true
      });
    });
    return App.reqres.setHandler('core:datum:entity', function(name) {
      return entityManager.getEntity({
        name: name
      }, {
        cache: false
      });
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    Entities.ProjectSectionModel = (function(superClass) {
      extend(ProjectSectionModel, superClass);

      function ProjectSectionModel() {
        return ProjectSectionModel.__super__.constructor.apply(this, arguments);
      }

      ProjectSectionModel.prototype.urlRoot = '/api/v1/project_sections';

      ProjectSectionModel.prototype.parse = function(resp) {
        return resp;
      };

      return ProjectSectionModel;

    })(Marionette.Accountant.FilterModel);
    Entities.ProjectSectionCollection = (function(superClass) {
      extend(ProjectSectionCollection, superClass);

      function ProjectSectionCollection() {
        return ProjectSectionCollection.__super__.constructor.apply(this, arguments);
      }

      ProjectSectionCollection.prototype.model = Entities.ProjectSectionModel;

      ProjectSectionCollection.prototype.url = '/api/v1/project_sections';

      ProjectSectionCollection.prototype.hasSingleActiveChild = false;

      ProjectSectionCollection.prototype.initializeActiveStatesOnReset = true;

      ProjectSectionCollection.prototype.initialize = function() {
        return this.on('initialize:active:states', function() {
          return App.vent.trigger('project:filter:change', this);
        });
      };

      return ProjectSectionCollection;

    })(Marionette.Accountant.FilterCollection);
    entityManager = new App.Base.EntityManager({
      entitiesConstructor: Entities.ProjectSectionCollection
    });
    return App.reqres.setHandler('project:section:entities', function() {
      return entityManager.getEntities({
        cache: true
      });
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    Entities.ProjectTemplateModel = (function(superClass) {
      extend(ProjectTemplateModel, superClass);

      function ProjectTemplateModel() {
        return ProjectTemplateModel.__super__.constructor.apply(this, arguments);
      }

      ProjectTemplateModel.prototype.urlRoot = '/api/v1/project_templates';

      ProjectTemplateModel.prototype.parse = function(resp) {
        return resp;
      };

      return ProjectTemplateModel;

    })(Marionette.Accountant.FilterModel);
    Entities.ProjectTemplateCollection = (function(superClass) {
      extend(ProjectTemplateCollection, superClass);

      function ProjectTemplateCollection() {
        return ProjectTemplateCollection.__super__.constructor.apply(this, arguments);
      }

      ProjectTemplateCollection.prototype.model = Entities.ProjectTemplateModel;

      ProjectTemplateCollection.prototype.url = '/api/v1/project_templates';

      ProjectTemplateCollection.prototype.hasSingleActiveChild = true;

      ProjectTemplateCollection.prototype.initializeActiveStatesOnReset = true;

      ProjectTemplateCollection.prototype.initialize = function() {
        return this.on('initialize:active:states', function() {
          return App.vent.trigger('project:filter:change', this);
        });
      };

      return ProjectTemplateCollection;

    })(Marionette.Accountant.FilterCollection);
    entityManager = new App.Base.EntityManager({
      entitiesConstructor: Entities.ProjectTemplateCollection
    });
    return App.reqres.setHandler('project:template:entities', function() {
      return entityManager.getEntities({
        cache: true
      });
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    Entities.ProjectModel = (function(superClass) {
      extend(ProjectModel, superClass);

      function ProjectModel() {
        return ProjectModel.__super__.constructor.apply(this, arguments);
      }

      ProjectModel.prototype.urlRoot = '/api/v1/projects';

      ProjectModel.prototype.url = function() {
        return this.urlRoot + ("?atlas_url=" + (this.get('atlas_url')));
      };

      ProjectModel.prototype.exists = function() {
        var json, key, keyCount;
        keyCount = 0;
        json = this.toJSON();
        for (key in json) {
          keyCount += 1;
        }
        return keyCount !== 1;
      };

      ProjectModel.prototype.parse = function(resp) {
        resp = this._removeArrayWrapper(resp);
        resp = this._removeSpacesFromTemplateName(resp);
        resp = this._adaptMongoId(resp);
        return resp = this._parseIntegerFields(resp, ['project_section_id', 'project_template_id']);
      };

      ProjectModel.prototype.compositeFilter = function(projectSections, projectTemplates) {
        var sectionsFilter, templatesFilter;
        if ((projectSections == null) || (projectSections.length === 0)) {
          return true;
        }
        if ((projectTemplates == null) || (projectTemplates.length === 0)) {
          return true;
        }
        sectionsFilter = this.filter(projectSections, 'project_section');
        templatesFilter = this.filter(projectTemplates, 'project_template');
        this.trigger('visibility:change', sectionsFilter && templatesFilter);
        return sectionsFilter && templatesFilter;
      };

      ProjectModel.prototype.filter = function(collection, foreignKey) {
        if ((collection != null) && (collection.test != null)) {
          return collection.test(this, foreignKey);
        }
        return true;
      };

      ProjectModel.prototype._adaptMongoId = function(resp) {
        if ((resp.id != null) && (resp.id.$oid != null) && _.isObject(resp.id)) {
          resp.id = resp.id['$oid'];
          return resp;
        }
        if ((resp._id != null) && (resp.id == null)) {
          resp.id = resp._id;
          delete resp._id;
          return resp;
        }
      };

      ProjectModel.prototype._removeArrayWrapper = function(resp) {
        if (_.isArray(resp) && (resp.length === 1)) {
          resp = resp[0];
        }
        return resp;
      };

      ProjectModel.prototype._removeSpacesFromTemplateName = function(resp) {
        if ((resp.template != null) && (resp.template.name != null)) {
          resp.template.name = resp.template.name.replace(/\s+/g, '');
        }
        return resp;
      };

      ProjectModel.prototype._parseIntegerFields = function(resp, integerKeys) {
        var i, key, len;
        if (integerKeys == null) {
          integerKeys = [];
        }
        for (i = 0, len = integerKeys.length; i < len; i++) {
          key = integerKeys[i];
          if ((resp != null) && (resp[key] != null)) {
            resp[key] = parseInt(resp[key], 10);
          }
        }
        return resp;
      };

      return ProjectModel;

    })(Backbone.Model);
    Entities.ProjectCollection = (function(superClass) {
      extend(ProjectCollection, superClass);

      function ProjectCollection() {
        return ProjectCollection.__super__.constructor.apply(this, arguments);
      }

      ProjectCollection.prototype.initialize = function() {
        return this.on('reset', this.filter);
      };

      ProjectCollection.prototype.model = Entities.ProjectModel;

      ProjectCollection.prototype.url = function() {
        var base;
        base = '/api/v1/projects';
        if (this.queryString != null) {
          return base + "?" + this.queryString;
        }
        return base;
      };

      ProjectCollection.prototype.comparator = function(model1, model2) {
        var i1, i2;
        i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0;
        i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0;
        if (model1.get('title') < model2.get('title')) {
          i1 += 1;
        } else {
          i2 += 1;
        }
        return i2 - i1;
      };

      ProjectCollection.prototype.filter = function(projectSections, projectTemplates) {
        var i, len, model, ref;
        if (projectSections == null) {
          projectSections = App.reqres.request('project:section:entities');
        }
        if (projectTemplates == null) {
          projectTemplates = App.reqres.request('project:template:entities');
        }
        ref = this.models;
        for (i = 0, len = ref.length; i < len; i++) {
          model = ref[i];
          model.compositeFilter(projectSections, projectTemplates);
        }
        return this;
      };

      return ProjectCollection;

    })(App.Base.Collection);
    entityManager = new App.Base.EntityManager({
      entityConstructor: Entities.ProjectModel,
      entitiesConstructor: Entities.ProjectCollection
    });
    App.reqres.setHandler('project:entities', function(options) {
      return entityManager.getEntities(options);
    });
    return App.reqres.setHandler('project:entity', function(atlas_url) {
      return entityManager.getEntity({
        atlas_url: atlas_url
      });
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Site', function(Site, App, Backbone, Marionette, $, _) {
    this.startWithParent = true;
    App.swipeDirection = 'left';
    App.addRegions({
      headerRegion: {
        selector: '#header',
        regionClass: Marionette.Region
      },
      contentRegion: {
        selector: '#atl',
        regionClass: App.Base.Region
      }
    });
    return App.reqres.setHandler('isResearcherLoggedIn', function() {
      return $('meta[name="researcher-signed-in"]').attr('content') === 'true';
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Welcome', function(Welcome, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Welcome', function(Welcome, App, Backbone, Marionette, $, _) {
    return Welcome.Controller = {
      show: function() {
        var rootView;
        rootView = this.getRootView();
        return App.contentRegion.show(rootView);
      },
      getRootView: function() {
        return new Welcome.RootView();
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Welcome', function(Welcome, App, Backbone, Marionette, $, _) {
    return Welcome.RootView = (function(superClass) {
      extend(RootView, superClass);

      function RootView() {
        return RootView.__super__.constructor.apply(this, arguments);
      }

      RootView.prototype.tagName = 'div';

      RootView.prototype.className = 'welcome';

      RootView.prototype.template = 'welcome/templates/root';

      RootView.prototype.initialize = function() {
        return this.listenTo(App.vent, 'mouse:move', this._setColor);
      };

      RootView.prototype._setColor = function(mouse) {
        var color;
        color = App.CSS.Colors.interpolate(mouse.x);
        this.$('.welcome__strip').css('background-color', color);
        return this.$('.welcome__title__alias').css('color', color);
      };

      RootView.prototype._unsetColor = function() {
        this.$('.banner__strip').css('background-color', '');
        return this.$('.banner__title__alias').css('color', '');
      };

      RootView.prototype.events = {
        'click #welcome__main-nav__button': 'toggle'
      };

      RootView.prototype.toggle = function(e) {
        e.preventDefault();
        App.vent.trigger('project:filter:change');
        return Backbone.history.navigate('menu', {
          trigger: true
        });
      };

      return RootView;

    })(Marionette.LayoutView);
  });

}).call(this);

(function() {
  this.Atlas.module('Header', function(Header, App, Backbone, Marionette, $, _) {
    this.startWithParent = true;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Header', function(Header, App, Backbone, Marionette, $, _) {
    return Header.Controller = {
      show: function() {
        var navCirclesView, rootView, stripView;
        rootView = this.getRootView();
        App.headerRegion.show(rootView);
        navCirclesView = this.getNavCirclesView();
        rootView.getRegion('navCircles').show(navCirclesView);
        stripView = this.getStripView();
        rootView.getRegion('strip').show(stripView);
        return Header.rootView = rootView;
      },
      getNavCirclesView: function() {
        return new Header.NavCirclesView({
          collection: Header.navCirclesCollection
        });
      },
      getStripView: function() {
        return new Header.StripView();
      },
      getRootView: function() {
        return new Header.RootView();
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Header', function(Header, App, Backbone, Marionette, $, _) {
    return Header.navCirclesCollection = new Backbone.Collection([
      {
        url: '/welcome'
      }, {
        url: '/menu'
      }, {
        url: '/pindrop'
      }, {
        url: '/about'
      }
    ]);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Header', function(Header, App, Backbone, Marionette, $, _) {
    Header.NavCircleView = (function(superClass) {
      extend(NavCircleView, superClass);

      function NavCircleView() {
        return NavCircleView.__super__.constructor.apply(this, arguments);
      }

      NavCircleView.prototype.tagName = 'li';

      NavCircleView.prototype.className = 'nav-circle';

      NavCircleView.prototype.template = 'header/templates/nav_circle';

      NavCircleView.prototype.events = {
        'click': 'navigate'
      };

      NavCircleView.prototype.navigate = function(e) {
        var href;
        e.preventDefault();
        href = this.model.get('url');
        return Backbone.history.navigate(href, {
          trigger: true
        });
      };

      NavCircleView.prototype.activate = function() {
        return this.$el.addClass('nav-circle--active');
      };

      NavCircleView.prototype.deactivate = function() {
        return this.$el.removeClass('nav-circle--active');
      };

      return NavCircleView;

    })(Marionette.ItemView);
    Header.NavCirclesView = (function(superClass) {
      extend(NavCirclesView, superClass);

      function NavCirclesView() {
        return NavCirclesView.__super__.constructor.apply(this, arguments);
      }

      NavCirclesView.prototype.initialize = function() {
        return this.listenTo(App.vent, 'router:current:action:change', function(index) {
          return this.children.each(function(child, childIndex) {
            if (index === childIndex) {
              return child.activate();
            } else {
              return child.deactivate();
            }
          });
        });
      };

      NavCirclesView.prototype.tagName = 'div';

      NavCirclesView.prototype.className = 'header__nav-circles';

      NavCirclesView.prototype.template = 'header/templates/nav_circles';

      NavCirclesView.prototype.childView = Header.NavCircleView;

      NavCirclesView.prototype.childViewContainer = 'ul';

      return NavCirclesView;

    })(Marionette.CompositeView);
    Header.StripView = (function(superClass) {
      extend(StripView, superClass);

      function StripView() {
        return StripView.__super__.constructor.apply(this, arguments);
      }

      StripView.prototype.tagName = 'div';

      StripView.prototype.className = 'header__strip';

      StripView.prototype.template = 'header/templates/strip';

      StripView.prototype.initialize = function() {
        var baseClassName;
        baseClassName = 'header__strip';
        return App.commands.setHandler('set:header:strip:color', (function(_this) {
          return function(options) {
            if (options === 'none') {
              _this.$el.attr('class', _this.className);
              return _this.$el.css('background-color', '');
            } else if (options.color != null) {
              _this.$el.attr('class', baseClassName);
              return _this.$el.css('background-color', options.color);
            } else if (options.className != null) {
              _this.$el.css('background-color', '');
              _this.$el.attr('class', baseClassName);
              return _this.$el.addClass(options.className);
            }
          };
        })(this));
      };

      return StripView;

    })(Marionette.ItemView);
    return Header.RootView = (function(superClass) {
      extend(RootView, superClass);

      function RootView() {
        return RootView.__super__.constructor.apply(this, arguments);
      }

      RootView.prototype.tagName = 'div';

      RootView.prototype.className = 'header';

      RootView.prototype.template = 'header/templates/root';

      RootView.prototype.events = {
        'click #header__welcome-link': 'navigate'
      };

      RootView.prototype.navigate = function(e) {
        e.preventDefault();
        return Backbone.history.navigate('/welcome', {
          trigger: true
        });
      };

      RootView.prototype.regions = {
        navCircles: '#header__nav-circles',
        strip: '#header__strip'
      };

      return RootView;

    })(Marionette.LayoutView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    return Index.NavView = (function(superClass) {
      extend(NavView, superClass);

      function NavView() {
        return NavView.__super__.constructor.apply(this, arguments);
      }

      NavView.prototype.tagName = 'div';

      NavView.prototype.className = 'atl__nav';

      NavView.prototype.template = 'projects/index/templates/nav/root';

      NavView.prototype.regions = {
        sectionFilter: '#atl__project-section-filter',
        templateFilter: '#atl__project-template-filter'
      };

      return NavView;

    })(Marionette.LayoutView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    Index.ProjectSectionView = (function(superClass) {
      extend(ProjectSectionView, superClass);

      function ProjectSectionView() {
        return ProjectSectionView.__super__.constructor.apply(this, arguments);
      }

      ProjectSectionView.prototype.tagName = 'li';

      ProjectSectionView.prototype.className = 'toggle-button toggle-button--black';

      ProjectSectionView.prototype.inactiveSubclassName = 'toggle-button--inactive';

      ProjectSectionView.prototype.template = 'projects/index/templates/nav/project_section';

      ProjectSectionView.prototype.events = {
        'click': 'toggleActiveState'
      };

      ProjectSectionView.prototype.toggleActiveState = function(e) {
        this.model.toggleActiveState();
        return App.vent.trigger('project:filter:change');
      };

      return ProjectSectionView;

    })(Marionette.Accountant.FilterItemView);
    return Index.ProjectSectionsView = (function(superClass) {
      extend(ProjectSectionsView, superClass);

      function ProjectSectionsView() {
        return ProjectSectionsView.__super__.constructor.apply(this, arguments);
      }

      ProjectSectionsView.prototype.tagName = 'ul';

      ProjectSectionsView.prototype.className = 'atl__project-section-filter';

      ProjectSectionsView.prototype.childView = Index.ProjectSectionView;

      ProjectSectionsView.prototype.onShow = App.vent.trigger('project:filter:change');

      return ProjectSectionsView;

    })(Marionette.CollectionView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    Index.ProjectTemplateView = (function(superClass) {
      extend(ProjectTemplateView, superClass);

      function ProjectTemplateView() {
        return ProjectTemplateView.__super__.constructor.apply(this, arguments);
      }

      ProjectTemplateView.prototype.template = 'projects/index/templates/nav/project_template';

      ProjectTemplateView.prototype.tagName = 'li';

      ProjectTemplateView.prototype.className = 'icon-button';

      ProjectTemplateView.prototype.activeSubclassName = 'icon-button--active';

      ProjectTemplateView.prototype.events = {
        'click': 'toggle'
      };

      ProjectTemplateView.prototype.toggle = function() {
        this.model.toggleActiveState();
        return App.vent.trigger('project:filter:change');
      };

      ProjectTemplateView.prototype.onShow = function() {
        return this._disableIfPolicyBrief();
      };

      ProjectTemplateView.prototype._disableIfPolicyBrief = function() {
        var modelId;
        modelId = this.model.get('id');
        if (modelId === 2) {
          return this.$el.addClass('hidden');
        }
      };

      return ProjectTemplateView;

    })(Marionette.Accountant.FilterItemView);
    return Index.ProjectTemplatesView = (function(superClass) {
      extend(ProjectTemplatesView, superClass);

      function ProjectTemplatesView() {
        return ProjectTemplatesView.__super__.constructor.apply(this, arguments);
      }

      ProjectTemplatesView.prototype.tagName = 'ul';

      ProjectTemplatesView.prototype.className = 'atl__project-template-filter';

      ProjectTemplatesView.prototype.childView = Index.ProjectTemplateView;

      ProjectTemplatesView.prototype.onShow = App.vent.trigger('project:filter:change');

      return ProjectTemplatesView;

    })(Marionette.CollectionView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    Index.ProjectView = (function(superClass) {
      extend(ProjectView, superClass);

      function ProjectView() {
        return ProjectView.__super__.constructor.apply(this, arguments);
      }

      ProjectView.prototype.tagName = 'a';

      ProjectView.prototype.className = 'atl__project';

      ProjectView.prototype.template = 'projects/index/templates/projects/project';

      ProjectView.prototype.onShow = function() {
        this.$el.attr('href', this.model.get('atlas_url'));
        this.listenTo(this.model, 'visibility:change', function(isVisible) {
          if (isVisible) {
            return this.$el.removeClass('atl__project--hidden');
          } else {
            return this.$el.addClass('atl__project--hidden');
          }
        });
        if (this.model.get('project_template_id') === 1) {
          this.$el.addClass('atl__project--explainer');
        }
        if (this.model.get('is_section_overview') === 'Yes') {
          return this.$el.addClass('atl__project--overview');
        }
      };

      ProjectView.prototype.events = {
        'click': 'launchProject',
        'mouseenter': 'applyBackgroundColor',
        'mouseleave': 'removeBackgroundColor'
      };

      ProjectView.prototype.launchProject = function(e) {
        var href;
        e.preventDefault();
        href = this.model.get('atlas_url');
        return Backbone.history.navigate(href, {
          trigger: true
        });
      };

      ProjectView.prototype.applyBackgroundColor = function() {
        var color, index;
        index = this.model.collection.indexOf(this.model);
        color = App.CSS.Colors.toRgba(modulo(index, 15), 0.8);
        this.$('.atl__project__text').css('background-color', color);
        return App.commands.execute('set:header:strip:color', {
          color: color
        });
      };

      ProjectView.prototype.removeBackgroundColor = function() {
        this.$('.atl__project__text').css('background-color', '');
        return App.commands.execute('set:header:strip:color', 'none');
      };

      return ProjectView;

    })(Marionette.ItemView);
    return Index.ProjectsView = (function(superClass) {
      extend(ProjectsView, superClass);

      function ProjectsView() {
        return ProjectsView.__super__.constructor.apply(this, arguments);
      }

      ProjectsView.prototype.tagName = 'div';

      ProjectsView.prototype.className = 'atl__projects';

      ProjectsView.prototype.childView = Index.ProjectView;

      ProjectsView.prototype.initialize = function() {
        return this.listenTo(App.vent, 'project:filter:change', this._filterChildren);
      };

      ProjectsView.prototype.onShow = function() {
        return this._filterChildren();
      };

      ProjectsView.prototype._filterChildren = function() {
        return this.collection.filter();
      };

      return ProjectsView;

    })(Marionette.CollectionView);
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show', function(Show, App, Backbone, Marionette, $, _) {
    this.projectTemplates = {
      "Tilemap": {
        theme: 'dark'
      },
      "Explainer": {
        theme: 'light'
      },
      "Policy Brief": {
        theme: 'light'
      },
      "Polling": {
        theme: 'light'
      }
    };
    return this.getTheme = function() {
      if (this.projectTemplates[this.currentProjectTemplate] != null) {
        return this.projectTemplates[this.currentProjectTemplate].theme;
      }
      return 'dark';
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Explainer', function(Explainer, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      Explainer.Controller.show();
      return this;
    });
  });

}).call(this);

(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Atlas.module('Projects.Show.Explainer', function(Explainer, App, Backbone, Marionette, $, _) {
    var getAtlasChartData, toSentenceCase;
    Explainer.processGoogleChart = function($el, index) {
      var $chartContainer, chart, chartData, chartType, className, options, selector, src;
      className = 'ct-chart-' + index;
      selector = '.' + className;
      $chartContainer = $('<div></div>');
      $($el.parent()).append($chartContainer);
      $chartContainer.attr('class', 'ct-chart ' + className);
      src = $el.attr('src');
      chart = new Atlas.Components.Chart.GoogleChartProcessor(src);
      chartData = chart.getChartData();
      chartType = chart.getChartType();
      options = {
        'Line': {},
        'Pie': {
          labelDirection: 'explode',
          labelOffset: 30
        }
      };
      if (chartType === 'Line' || chartType === 'Pie') {
        new Chartist[chartType](selector, chartData, options[chartType]);
      }
      return this;
    };
    toSentenceCase = function(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
    getAtlasChartData = function($el) {
      var data, subtype, type;
      data = {};
      data.series = [];
      data.labels = [];
      type = $el.attr('data-type');
      type = toSentenceCase(type);
      data.type = type;
      subtype = $el.attr('data-options') != null ? $el.attr('data-options') : $el.attr('data-subtype');
      data.subtype = subtype != null ? subtype.split(',') : [];
      $el.find('.atlas-chart__series').each(function() {
        var $this, d, name, series;
        $this = $(this);
        name = $this.attr('data-name');
        series = {};
        d = $this.html().split(',');
        if (type === "Line" || type === "Bar") {
          d = _.map(d, function(el) {
            return parseFloat(el);
          });
          series.data = d;
          series.name = name;
          if (type === "Bar") {
            series = d;
          }
        } else if (type === "Pie") {
          series = parseFloat(d[0]);
          data.labels.push(name);
        }
        return data.series.push(series);
      });
      if (type === "Line" || type === "Bar") {
        data.labels = $el.find('.atlas-chart__labels').html().split(',');
      }
      return data;
    };
    return Explainer.processAtlasChart = function($el, index) {
      var $chartContainer, chart, className, data, options, ref, selector, width;
      width = $el.width();
      className = 'ct-chart-' + index;
      selector = '.' + className;
      data = getAtlasChartData($el);
      $chartContainer = $('<div></div>');
      $el.append($chartContainer);
      $chartContainer.attr('class', 'ct-chart ' + className);
      options = {
        'Line': {
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
          })
        },
        'Pie': {
          labelDirection: 'explode',
          labelOffset: 30
        },
        'Bar': {
          stackBars: (indexOf.call(data.subtype, 'stacked') >= 0),
          horizontalBars: (indexOf.call(data.subtype, 'horizontal') >= 0),
          axisX: {
            offset: 30
          },
          axisY: {
            offset: (indexOf.call(data.subtype, 'long-horizontal-labels') >= 0) ? width / 2 - 40 : 80
          }
        }
      };
      if ((ref = data.type) === 'Line' || ref === 'Pie' || ref === 'Bar') {
        chart = new Chartist[data.type](selector, {
          series: data.series,
          labels: data.labels
        }, options[data.type]);
        return chart.on('created', function() {
          var $seriesArray, seriesArrayLength;
          $seriesArray = $el.find('.ct-series');
          seriesArrayLength = $seriesArray.length;
          return $seriesArray.each(function(index, value) {
            var $series, color;
            color = App.CSS.Colors.interpolateRgb(1 - (index / (seriesArrayLength - 1)));
            $series = $(this);
            return $series.find('line, path').css('stroke', color);
          });
        });
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Explainer', function(Explainer, App, Backbone, Marionette, $, _) {
    return Explainer.Controller = {
      show: function() {
        var relatedPagesView, rootView;
        rootView = this.getRootView();
        App.appContentRegion.show(rootView);
        relatedPagesView = this.getRelatedPagesView();
        return rootView.getRegion('related').show(relatedPagesView);
      },
      getRootView: function() {
        var model, view;
        model = new Backbone.Model(App.currentProjectData);
        view = new Explainer.RootView({
          model: model
        });
        return view;
      },
      getRelatedPagesView: function() {
        var coll, id;
        id = App.currentProjectModel.id;
        coll = App.reqres.request('project:entities', {
          queryString: "related_to=" + id,
          cache: false
        });
        return new Explainer.RelatedPagesView({
          collection: coll
        });
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Explainer', function(Explainer, App, Backbone, Marionette, $, _) {
    var TocView;
    Explainer.RelatedPageView = Marionette.ItemView.extend({
      tagName: 'li',
      className: '',
      template: 'projects/show/project_templates/explainer/templates/related_page'
    });
    Explainer.RelatedPagesView = Marionette.CompositeView.extend({
      initialize: function() {
        return this.listenTo(this.collection, 'reset', (function(_this) {
          return function() {
            if (_this.collection.length > 0) {
              return _this.$el.show();
            }
          };
        })(this));
      },
      tagName: 'div',
      className: 'atl__related',
      template: 'projects/show/project_templates/explainer/templates/related_pages',
      childView: Explainer.RelatedPageView,
      childViewContainer: 'ul',
      onShow: function() {
        return this.$el.hide();
      }
    });
    TocView = Marionette.ItemView.extend({
      el: '#atl__toc__list ul',
      events: {
        'click a': 'triggerScroll'
      },
      triggerScroll: function(e) {
        return App.vent.trigger('scroll');
      },
      isEmpty: function() {
        return this.$el.html() === "";
      }
    });
    return Explainer.RootView = Marionette.LayoutView.extend({
      initialize: function() {
        return this.listenTo(App.vent, 'scroll', function() {
          return this._setStickyNavLayout();
        });
      },
      tagName: 'div',
      className: 'fill-parent',
      template: 'projects/show/project_templates/explainer/templates/root',
      regions: {
        toc: '#atl__toc',
        related: '#atl__related',
        content: '#atl__content'
      },
      onShow: function() {
        this._processAtlasCharts();
        this._buildToc();
        return this._setStickyNavLayout();
      },
      onBeforeDestroy: function() {
        if (this.chartManager != null) {
          this.chartManager.destroy();
        }
        if (this.tocView != null) {
          return this.tocView.destroy();
        }
      },
      _setStickyNavLayout: function(subClasses) {
        var $elem, className, scrollTop;
        scrollTop = $('#atl__main').scrollTop();
        className = "atl__page-nav";
        $elem = this.$("." + className);
        if (scrollTop > $('.atl__title-bar').height()) {
          return $elem.addClass(className + "--fixed");
        } else {
          return $elem.removeClass(className + "--fixed");
        }
      },
      _processAtlasCharts: function() {
        if (typeof ChartistHtml !== "undefined" && ChartistHtml !== null) {
          this.chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'));
          return this.chartManager.render();
        }
      },
      _processGoogleCharts: function() {
        return this.$('img').each(function(index, value) {
          $(this).attr('style', '');
          return Explainer.processGoogleChart($(this), index);
        });
      },
      _buildToc: function() {
        this.$('#atl__toc__list').toc({
          selectors: 'h1,h2',
          container: '.static-content',
          templates: {
            h2: _.template('<%= title %>'),
            h3: _.template('<%= title %>')
          },
          smoothScrolling: function(target, options, callback) {
            return $(target).smoothScroll();
          }
        });
        this.tocView = new TocView();
        if (this.tocView.isEmpty()) {
          return $('.atl__toc').hide();
        }
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.Projects.Show.PolicyBrief = this.Atlas.Projects.Show.Explainer;

}).call(this);

(function() {
  this.Atlas.Projects.Show.Polling = this.Atlas.Projects.Show.Explainer;

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    Tilemap.submoduleKeys = ['Entities', 'Filter', 'Search', 'Legend', 'Info', 'Headline', 'Map', 'InfoBox', 'Popup'];
    return this.on('start', function() {
      this.Controller.showMainView();
      return this.Controller.startSubmodules();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    return Tilemap.Controller = {
      showMainView: function() {
        var view;
        view = this.getView();
        return App.appContentRegion.show(view);
      },
      startSubmodules: function() {
        var i, len, ref, results, submoduleKey;
        ref = Tilemap.submoduleKeys;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          submoduleKey = ref[i];
          results.push(Tilemap.submodules[submoduleKey].start());
        }
        return results;
      },
      getView: function() {
        return new Tilemap.View();
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    return Tilemap.View = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl__main fill-parent',
      template: 'projects/show/project_templates/tilemap/templates/root',
      initialize: function() {
        return this.listenTo(App.vent, 'subview:ready', function(subviewHash) {
          var key, results, value;
          results = [];
          for (key in subviewHash) {
            value = subviewHash[key];
            results.push(this.getRegion(key).show(value));
          }
          return results;
        });
      },
      regions: {
        headline: '#atl__headline',
        search: '#atl__search',
        filter: '#atl__filter',
        legend: '#atl__legend',
        infoBox: '#atl__info-box',
        build: '#atl__build',
        map: '#atl__map',
        info: '#atl__info',
        popup: '#atl__popup'
      },
      preventDefault: function(e) {
        return e.preventDefault();
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Submodules', function(Submodules, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return App.reqres.setHandler('value:hovered', function() {
      var f, l;
      f = App.reqres.request('filter:value:hovered');
      l = App.reqres.request('legend:value:hovered');
      if ((f !== -1) && (f != null)) {
        return f;
      }
      return l;
    });
  });

}).call(this);

(function() {
  this.Atlas.module("Projects.Show.Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.Controller.show();
      App.reqres.setHandler('filter:value:hovered', function() {
        return Filter.valueHoverIndex;
      });
      return App.reqres.setHandler('filter', function() {
        return Filter.filter;
      });
    });
    return this.on('stop', function() {
      this.Controller.tearDown();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module("Projects.Show.Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    return Filter.Controller = {
      show: function() {
        var filter, keysView, rootView, valuesView;
        filter = this._buildFilter();
        rootView = new Filter.RootView({
          model: filter
        });
        Filter.filter = filter;
        keysView = this.getKeysView();
        valuesView = this.getValuesView();
        Filter.valuesView = valuesView;
        App.vent.trigger('subview:ready', {
          'filter': rootView
        });
        rootView.getRegion('keys').show(keysView);
        return rootView.getRegion('values').show(valuesView);
      },
      tearDown: function() {
        return Filter.filter.stopListening();
      },
      _buildFilter: function() {
        var filters, items, variables;
        items = App.reqres.request('item:entities');
        variables = App.reqres.request('variable:entities');
        filters = App.reqres.request('filter:entities');
        return new Filter.Model(Filter.buildFilterTree(items, variables, filters));
      },
      getKeysView: function() {
        return new Filter.KeysView({
          collection: new Backbone.Collection(Filter.filter.children)
        });
      },
      getValuesView: function() {
        var ValuesCollection, ValuesModel, valuesCollection, valuesModel;
        ValuesCollection = Backbone.Collection.extend({
          rebuild: function() {
            return this.reset(Filter.filter.getActiveChild().children);
          }
        });
        ValuesModel = Backbone.Model.extend({
          rebuild: function() {
            return this.set('long_description', Filter.filter.getActiveChild().get('long_description'));
          }
        });
        valuesCollection = new ValuesCollection();
        valuesCollection.rebuild();
        valuesModel = new ValuesModel();
        valuesModel.rebuild();
        return new Filter.ValuesView({
          collection: valuesCollection,
          model: valuesModel
        });
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module("Projects.Show.Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    Filter.ValueModel = Marionette.Accountant.CompositeModel.extend({
      test: function(d, options) {
        var j, key, len, res, val, value;
        if (d == null) {
          return false;
        }
        if ((!this.get('_isActive')) && (!((options != null) && options.ignoreState))) {
          return false;
        }
        res = false;
        key = this.parent.get('variable_id');
        value = d[key];
        if (!_.isArray(value)) {
          value = [value];
        }
        for (j = 0, len = value.length; j < len; j++) {
          val = value[j];
          res = res || this.testValue(val);
        }
        return res;
      },
      testValue: function(value) {
        var res;
        res = false;
        if (this._isNumericFilter()) {
          if ((value < this.get('max')) && (value > this.get('min'))) {
            res = true;
          }
        } else {
          if (value === this.get('value')) {
            res = true;
          }
        }
        return res;
      },
      _isNumericFilter: function() {
        return (this.get('min') != null) && (this.get('max') != null);
      },
      isActive: function() {
        return this.get('_isActive');
      },
      activate: function() {
        this.set('_isActive', true);
        return this;
      },
      deactivate: function() {
        this.set('_isActive', false);
        return this;
      },
      toggle: function() {
        this.set('_isActive', !this.isActive());
        return this;
      },
      isParentActive: function() {
        return this.parent === this.parent.parent.getActiveChild();
      },
      handleClick: function() {
        var activeKeyIndex, keyIndex;
        this.toggle();
        keyIndex = this.parent.get('_index');
        return activeKeyIndex = this.parent.parent.get('activeIndex');
      },
      getBackgroundColorClass: function() {
        var filter;
        filter = this.parent.parent;
        return filter.getBackgroundColorClass(this.get('_index'));
      }
    });
    Filter.KeyModel = Marionette.Accountant.CompositeModel.extend({
      childModel: Filter.ValueModel,
      activateAllChildren: function() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.activate();
        }
        return this;
      },
      deactivateAllChildren: function() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.deactivate();
        }
        return this;
      },
      toggleAllChildren: function() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.toggle();
        }
        return this;
      },
      isActive: function() {
        return this.get('_isActive');
      },
      activate: function() {
        this.set('_isActive', true);
        return this;
      },
      deactivate: function() {
        this.set('_isActive', false);
        this.activateAllChildren();
        return this;
      },
      toggle: function() {
        this.set('_isActive', !this.get('_isActive'));
        return this;
      },
      toggleOne: function(childIndex) {
        return this.children[childIndex].toggle();
      },
      getValueIndeces: function(model) {
        var child, data, dataIndeces, i, j, len, ref;
        data = _.isFunction(model.toJSON) ? model.toJSON() : model;
        dataIndeces = [];
        ref = this.children;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          child = ref[i];
          if (child.test(data)) {
            dataIndeces.push(i);
          }
        }
        return dataIndeces;
      },
      getValue: function(index) {
        return this.children[index].get('value');
      },
      test: function(data, options) {
        var child, j, len, ref, result;
        result = false;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          if (child.test(data, options)) {
            result = true;
          }
        }
        return result;
      },
      getBackgroundColorClass: function() {
        var valueIndex;
        valueIndex = this.parent.children.indexOf(this);
        return this.parent.getBackgroundColorClass(valueIndex);
      }
    });
    return Filter.Model = Marionette.Accountant.CompositeModel.extend({
      childModel: Filter.KeyModel,
      initialize: function() {
        this.listenTo(App.vent, 'value:click', function(index) {
          if (this.getActiveChild().children[index] != null) {
            return this.getActiveChild().children[index].handleClick();
          }
        });
        return this.listenTo(App.vent, 'key:click', function(index) {
          return this.setActiveChildByIndex(index);
        });
      },
      test: function(data) {
        return this.getActiveChild().test(data);
      },
      setActiveChildByIndex: function(activeChildIndex) {
        if (this.children[activeChildIndex] !== this.getActiveChild()) {
          this.getActiveChild().deactivate();
          this.children[activeChildIndex].activate();
          return true;
        }
        return false;
      },
      getActiveChild: function() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          if (child.isActive()) {
            return child;
          }
        }
      },
      getBackgroundColorClass: function(valueIndex) {
        var colorIndex, i, k;
        k = this.getValueCountOnActiveKey();
        i = valueIndex + 1;
        colorIndex = App.CSS.ClassBuilder.interpolate(i, k);
        return "bg-c-" + colorIndex;
      },
      getMatchingValue: function(model) {
        var ind;
        ind = this.getValueIndeces(model)[0];
        if (this.getActiveChild().children[ind] != null) {
          return this.getActiveChild().children[ind].get('value');
        }
        return void 0;
      },
      getValueCountOnActiveKey: function() {
        return this.getActiveChild().children.length;
      },
      getValueIndeces: function(model) {
        var ach;
        ach = this.getActiveChild();
        return ach.getValueIndeces(model);
      },
      evaluate: function(model) {
        var d, result;
        d = model.toJSON();
        return result = {
          tested: true,
          keyIndex: 1,
          valueIndeces: 4,
          totalValues: 8
        };
      },
      getItemListByOption: function(keyIndex) {
        var ach, data, datum, gch, j, len, list;
        ach = this.getActiveChild();
        gch = ach.children[keyIndex];
        list = [];
        data = this.parent.data.data.data;
        for (j = 0, len = data.length; j < len; j++) {
          datum = data[j];
          if (gch.test(datum, {
            ignoreState: true
          })) {
            list.push(datum.state);
          }
        }
        return list;
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Filter', function(Filter, App, Backbone, Marionette, $, _) {
    Filter.buildFilterTree = function(items, variables, filters) {
      var filterTree, filterVariables;
      if (filters == null) {
        filters = [];
      }
      filterVariables = filters.map(function(filter, index) {
        var nd, o, variable;
        variable = filter.getVariableModel();
        o = {
          variable_id: variable.get('id'),
          display_title: variable.get('display_title'),
          short_description: variable.get('short_description'),
          long_description: variable.get('long_description'),
          type: filter.get('type'),
          _isActive: (index === 0 ? true : false)
        };
        nd = filter.get('numerical_dividers');
        if (nd != null) {
          o.values = Filter.buildNumericalFilter(nd);
        } else {
          o.values = _.map(items.getValueList(o.variable_id), function(item) {
            return {
              value: item
            };
          });
        }
        _.map(o.values, function(val) {
          val._isActive = true;
          return val;
        });
        return o;
      });
      filterTree = {
        variables: filterVariables
      };
      return filterTree;
    };
    Filter.buildNumericalFilterValue = function(min, max) {
      var filterValue;
      filterValue = {
        min: min,
        max: max
      };
      if (min === -1000000) {
        filterValue.value = "Less than " + max;
      } else if (max === +1000000) {
        filterValue.value = "Greater than " + min;
      } else {
        filterValue.value = "Between " + min + " and " + max;
      }
      return filterValue;
    };
    return Filter.buildNumericalFilter = function(dividerString) {
      var i, j, numericalFilter, ref, values;
      values = _.map(dividerString.split('|'), function(member, index) {
        if (member === "") {
          if (index === 0) {
            return -1000000;
          }
          return +1000000;
        }
        return parseInt(member, 10);
      });
      numericalFilter = [];
      for (i = j = 0, ref = values.length - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        numericalFilter.push(Filter.buildNumericalFilterValue(values[i], values[i + 1]));
      }
      return numericalFilter;
    };
  });

}).call(this);

(function() {
  this.Atlas.module("Projects.Show.Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    Filter.ValueView = Marionette.ItemView.extend({
      tagName: 'li',
      className: 'toggle-button',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_value',
      initialize: function() {
        this.updateActiveState();
        return this.listenTo(this.model, 'change:_isActive', this.updateActiveState);
      },
      onShow: function() {
        var cls;
        cls = this.model.getBackgroundColorClass();
        return this.$('.toggle-button__background').attr('class', "toggle-button__background " + cls);
      },
      events: {
        'click': 'triggerValueClick',
        'mouseenter': 'triggerValueMouseOver',
        'mouseleave': 'triggerValueMouseOut'
      },
      updateActiveState: function() {
        if (this.model.isActive()) {
          this.$el.removeClass('toggle-button--inactive');
        } else {
          this.$el.addClass('toggle-button--inactive');
        }
        return this;
      },
      triggerValueClick: function(e) {
        var modelIndex;
        if (e != null) {
          e.stopPropagation();
        }
        modelIndex = this._getModelIndex();
        App.vent.trigger('value:click', modelIndex);
        return this;
      },
      triggerValueMouseOver: function() {
        var modelIndex;
        modelIndex = this._getModelIndex();
        Filter.valueHoverIndex = modelIndex;
        App.vent.trigger('value:mouseover', modelIndex);
        return this;
      },
      triggerValueMouseOut: function() {
        Filter.valueHoverIndex = -1;
        App.vent.trigger('value:mouseout');
        return this;
      },
      _getModelIndex: function() {
        return this.model.collection.models.indexOf(this.model);
      }
    });
    Filter.ValuesView = Marionette.CompositeView.extend({
      tagName: 'div',
      className: 'atl__filter-values',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_values',
      childView: Filter.ValueView,
      childViewContainer: 'ul',
      initialize: function() {
        this.listenTo(App.vent, 'key:click', this.rebuild);
        return this.listenTo(this.model, 'change', this.render);
      },
      rebuild: function() {
        this.model.rebuild();
        return this.collection.rebuild();
      }
    });
    Filter.KeyView = Marionette.ItemView.extend({
      tagName: 'li',
      className: 'button',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_key',
      childView: Filter.ValueView,
      childViewContainer: 'ul',
      initialize: function() {
        this.updateActiveState();
        return this.listenTo(this.model, 'change:_isActive', this.updateActiveState);
      },
      events: {
        'click': 'handleClick'
      },
      updateActiveState: function() {
        if (this.model.isActive()) {
          return this.$el.addClass('button--active');
        } else {
          return this.$el.removeClass('button--active');
        }
      },
      handleClick: function(e) {
        var modelIndex;
        e.stopPropagation();
        if (!this.model.isActive()) {
          modelIndex = this._getModelIndex();
          App.vent.trigger('key:click', modelIndex);
        }
        return this;
      },
      _getModelIndex: function() {
        return this.model.collection.models.indexOf(this.model);
      }
    });
    Filter.KeysView = Marionette.CompositeView.extend({
      tagName: 'div',
      className: '',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_keys',
      childView: Filter.KeyView,
      childViewContainer: 'ul'
    });
    return Filter.RootView = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl__filter',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/root',
      regions: {
        keys: '#filter__keys',
        values: '#filter__values'
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    return Headline.Controller = {
      show: function() {
        var rootView;
        rootView = this.getRootView();
        return App.vent.trigger('subview:ready', {
          'headline': rootView
        });
      },
      getRootView: function() {
        var rootView;
        rootView = new Headline.RootView({
          model: App.currentProjectModel
        });
        return rootView;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    return Headline.RootView = Marionette.ItemView.extend({
      template: 'projects/show/project_templates/tilemap/submodules/headline/templates/root',
      className: 'atl__headline'
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.Controller = {
      show: function() {
        var rootView;
        rootView = this.getRootView();
        return App.vent.trigger('subview:ready', {
          'info': rootView
        });
      },
      getRootView: function() {
        var filter, items, model, view;
        filter = App.reqres.request('filter');
        items = App.reqres.request('item:entities');
        model = new Info.Model();
        model.update(filter, items);
        view = new Info.RootView({
          model: model
        });
        return view;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.Model = Backbone.Model.extend({
      initialize: function() {
        return this.listenTo(App.vent, 'mouseover:value', function() {
          return this.updateInfo;
        });
      },
      update: function() {
        var filter, hoveredValueIndex, info, items;
        filter = App.reqres.request('filter');
        items = App.reqres.request('item:entities');
        hoveredValueIndex = App.reqres.request('filter:value:hovered');
        info = Info.modelBuilder(filter, items, hoveredValueIndex);
        return this.set(info);
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.modelBuilder = function(filter, items) {
      var activeFilterChild, filterValue, formatItemList, hoveredItem, matchingItems, obj, valueIndex, varId;
      formatItemList = function(items) {
        if (items.length === 0) {
          return ' ';
        }
        if (items.length === 1) {
          return items[0];
        }
        if (items.length === 2) {
          return items[0] + " and " + items[1];
        }
        if (items.length === 3) {
          return items[0] + ", " + items[1] + " and " + items[2];
        }
        return items[0] + ", " + items[1] + " and " + (items.length - 2) + " others";
      };
      obj = {
        key: ' ',
        value: ' ',
        items: ' '
      };
      matchingItems = [];
      activeFilterChild = filter.getActiveChild();
      obj.key = activeFilterChild.get('short_description');
      varId = activeFilterChild.get('variable_id');
      valueIndex = App.reqres.request('value:hovered');
      if (valueIndex !== -1) {
        filterValue = activeFilterChild.children[valueIndex];
        items.each(function(item) {
          var itemJSON;
          itemJSON = item.toJSON();
          if ((filterValue != null) && (filterValue.test != null) && filterValue.test(itemJSON, {
            ignoreState: true
          })) {
            return matchingItems.push(itemJSON.name);
          }
        });
        obj.items = formatItemList(matchingItems);
        if (filterValue != null) {
          obj.value = filterValue.get('value');
        }
      }
      if (items.hovered != null) {
        hoveredItem = items.hovered;
        obj.items = hoveredItem.get('name');
        obj.value = hoveredItem.get(varId);
      }
      return obj;
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.RootView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__info',
      template: 'projects/show/project_templates/tilemap/submodules/info/templates/root',
      initialize: function() {
        return this.listenTo(App.vent, 'value:mouseover value:mouseout item:mouseover item:mouseout key:click', function(index) {
          this.model.update(index);
          return this.render();
        });
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.listenTo(App.vent, 'item:activate strong:scroll:down', this.Controller.createAndReveal);
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    return InfoBox.Controller = {
      createAndReveal: function() {
        if (InfoBox.rootView == null) {
          InfoBox.rootView = InfoBox.Controller.getRootView();
          App.vent.trigger('subview:ready', {
            'infoBox': InfoBox.rootView
          });
          return InfoBox.rootView.reveal();
        }
      },
      hideAndDestroy: function() {
        if (InfoBox.rootView != null) {
          InfoBox.rootView.hideAndDestroy();
          delete InfoBox.rootView;
          return App.vent.trigger('item:deactivate');
        }
      },
      getRootView: function() {
        var activeItem, infoBoxModelObject, rootView;
        activeItem = App.reqres.request('item:entities').active;
        infoBoxModelObject = InfoBox.getModelObject(activeItem);
        rootView = new InfoBox.RootView(infoBoxModelObject);
        return rootView;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    InfoBox.SectionsCollection = Backbone.Collection.extend();
    InfoBox.Model = Backbone.Model.extend({
      defaults: {
        name: 'General Project Info'
      }
    });
    InfoBox.getModelObject = function(item) {
      var collection, collectionData, model;
      model = item != null ? item : App.currentProjectModel;
      collectionData = item != null ? this.getItemSectionsCollection(item) : this.getSummaryCollection();
      collection = new InfoBox.SectionsCollection(collectionData);
      return {
        model: model,
        collection: collection
      };
      return new InfoBox.Model(modelData);
    };
    InfoBox.getItemSectionsCollection = function(item) {
      var infoBoxSections, sections, variables;
      infoBoxSections = App.reqres.request('info:box:section:entities');
      variables = App.reqres.request('variable:entities');
      return sections = _.map(infoBoxSections.models, function(infoBoxSection) {
        var obj, text, variable, variableDisplayTitle, variableId;
        variableId = infoBoxSection.get('variable_id');
        variable = variables.findWhere({
          id: variableId
        });
        variableDisplayTitle = variable != null ? variable.get('display_title') : "Section";
        text = item.get(variableId);
        if (text != null) {
          if (_.isNumber(text)) {
            text = text.toString();
          }
          if (!_.isArray(text)) {
            text = marked(text);
          }
        }
        obj = {
          heading: variableDisplayTitle,
          text: text
        };
        return obj;
      });
    };
    return InfoBox.getSummaryCollection = function() {
      var i, j, len, ref, sections;
      sections = [];
      ref = [1, 2, 3, 4];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        sections.push({
          heading: 'Section ' + i,
          text: 'Text for section.'
        });
      }
      return sections;
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    var TocView;
    InfoBox.SectionView = Marionette.CompositeView.extend({
      tagName: 'li',
      className: 'atl__info-box__item',
      template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/section'
    });
    TocView = Marionette.ItemView.extend({
      el: '#atl__toc__list ul',
      events: {
        'click a': 'triggerScroll'
      },
      triggerScroll: function(e) {
        return App.vent.trigger('scroll');
      },
      isEmpty: function() {
        return this.$el.html() === "";
      }
    });
    return InfoBox.RootView = Marionette.CompositeView.extend({
      initialize: function() {
        return this.listenTo(App.vent, 'scroll', function() {
          return this._setStickyNavLayout();
        });
      },
      tagName: 'div',
      className: 'atl__info-box fill-parent',
      template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/root',
      childView: InfoBox.SectionView,
      childViewContainer: '#atl__info-box__list',
      events: {
        'click #atl__info-box__close': 'purgeView'
      },
      getHtml: function() {
        var html;
        html = "";
        this.children.each(function(child) {
          child.render();
          return html += child.el.innerHTML;
        });
        return html;
      },
      onBeforeShow: function() {
        return this.$('.static-content').html(this.getHtml());
      },
      onShow: function() {
        this._buildToc();
        return this._setStickyNavLayout();
      },
      onBeforeDestroy: function() {
        if (this.tocView != null) {
          return this.tocView.destroy();
        }
      },
      _setStickyNavLayout: function(subClasses) {
        var $elem, className, scrollTop;
        scrollTop = $('.atl__info-box').scrollTop();
        className = "atl__page-nav";
        $elem = this.$("." + className);
        if (scrollTop > $('.atl__title-bar').height()) {
          return $elem.addClass(className + "--fixed");
        } else {
          return $elem.removeClass(className + "--fixed");
        }
      },
      reveal: function() {
        var $app;
        $app = $('.atl');
        $app.addClass('atl__info-box--active');
        $('#atl__map').addClass('blur');
        return this;
      },
      _buildToc: function() {
        $('#atl__toc__list').toc({
          selectors: 'h1,h2',
          container: '.static-content',
          templates: {
            h2: _.template('<%= title %>'),
            h3: _.template('<%= title %>')
          }
        });
        this.tocView = new TocView();
        if (this.tocView.isEmpty()) {
          return $('.atl__toc').hide();
        }
      },
      hide: function() {
        var $app;
        $app = $('.atl');
        $app.removeClass('atl__info-box--active');
        $('#atl__map').removeClass('blur');
        return this;
      },
      hideAndDestroy: function() {
        var $app;
        $app = $('.atl');
        $app.removeClass('atl__info-box--active');
        $('#atl__map').removeClass('blur');
        $app.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (function(_this) {
          return function(e) {
            return _this.destroy();
          };
        })(this));
        return this;
      },
      purgeView: function() {
        return InfoBox.Controller.hideAndDestroy();
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      var filter;
      this.Controller.show();
      App.reqres.setHandler('legend:value:hovered', function() {
        return Legend.valueHoverIndex;
      });
      filter = App.reqres.request('filter');
      return this.listenTo(App.vent, 'key:click', function() {
        return Legend.rootView.collection.reset(filter.getActiveChild().children);
      });
    });
    return this.on('stop', function() {
      App.reqres.removeHandler('legend:value:hovered');
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    return Legend.Controller = {
      show: function() {
        var rootView;
        rootView = this.getRootView();
        Legend.rootView = rootView;
        return App.vent.trigger('subview:ready', {
          'legend': rootView
        });
      },
      getRootView: function() {
        var coll, filter, rootView;
        filter = App.reqres.request('filter');
        coll = new Backbone.Collection(filter.getActiveChild().children);
        rootView = new Legend.RootView({
          collection: coll
        });
        return rootView;
      }
    };
  });

}).call(this);

(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Atlas.module('Projects.Show.Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    Legend.IconView = Marionette.ItemView.extend({
      tagName: 'li',
      className: 'atl__legend__icon',
      template: 'projects/show/project_templates/tilemap/submodules/legend/templates/icon',
      onShow: function() {
        var cls;
        cls = this.model.getBackgroundColorClass();
        return this.$('.hexicon__hex').attr('class', "hexicon__hex " + cls);
      },
      events: {
        'mouseenter': 'onMouseOver',
        'mouseleave': 'onMouseOut',
        'click': 'triggerValueClick'
      },
      highlight: function() {
        return this.$el.addClass('atl__legend__icon--highlighted');
      },
      dehighlight: function() {
        return this.$el.removeClass('atl__legend__icon--highlighted');
      },
      toggleActiveState: function() {
        return this.$el.toggleClass('atl__legend__icon--inactive');
      },
      onMouseOver: function() {
        var cls, filter, modelIndex;
        modelIndex = this._getModelIndex();
        Legend.valueHoverIndex = modelIndex;
        App.vent.trigger('value:mouseover', modelIndex);
        filter = App.reqres.request('filter');
        cls = filter.getBackgroundColorClass(modelIndex);
        return App.commands.execute('set:header:strip:color', {
          className: cls
        });
      },
      onMouseOut: function() {
        App.commands.execute('set:header:strip:color', 'none');
        Legend.valueHoverIndex = -1;
        return App.vent.trigger('value:mouseout', -1);
      },
      triggerValueClick: function() {
        var modelIndex;
        modelIndex = this._getModelIndex();
        return App.vent.trigger('value:click', modelIndex);
      },
      _getModelIndex: function() {
        return this.model.collection.models.indexOf(this.model);
      }
    });
    return Legend.RootView = Marionette.CollectionView.extend({
      tagName: 'ul',
      className: 'atl__legend',
      template: 'projects/show/project_templates/tilemap/submodules/legend/templates/root',
      childView: Legend.IconView,
      initialize: function() {
        this.listenTo(App.vent, 'value:click', this.setActiveState);
        return this.listenTo(App.vent, 'item:mouseover item:mouseout value:mouseover value:mouseout', this.setHighlighting);
      },
      setActiveState: function(index) {
        var child;
        child = this.children.findByIndex(index);
        return child.toggleActiveState();
      },
      setHighlighting: function() {
        var filter, hoveredItem, indeces;
        hoveredItem = App.reqres.request('item:entities').hovered;
        filter = App.reqres.request('filter');
        if (hoveredItem != null) {
          indeces = filter.getValueIndeces(hoveredItem);
        } else {
          indeces = [App.reqres.request('filter:value:hovered')];
        }
        return this.children.each(function(child, childIndex) {
          if (indexOf.call(indeces, childIndex) >= 0) {
            return child.highlight();
          } else {
            return child.dehighlight();
          }
        });
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Projects.Show.Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Projects.Show.Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
    return Map.Controller = {
      show: function() {
        var global;
        global = typeof L !== "undefined" && L !== null ? L : void 0;
        return this.fetchScript(global, '/assets/vendor/mapbox.js', this.showMain.bind(this));
      },
      showMain: function() {
        var global;
        Map.rootView = new Map.RootView().render();
        global = typeof d3 !== "undefined" && d3 !== null ? d3 : void 0;
        return this.fetchScript(global, '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
      },
      showOverlay: function() {
        return this.renderOverlayView();
      },
      renderOverlayView: function() {
        var View, coll, itemType, items;
        items = App.reqres.request('item:entities');
        itemType = items.getItemType();
        View = itemType === 'state' ? Map.PathOverlayView : Map.PindropOverlayView;
        coll = items.getRichGeoJson();
        coll.onReady(function() {
          var overlayView;
          overlayView = new View();
          overlayView.collection = coll;
          Map.overlayView = overlayView;
          return overlayView.render();
        });
        return this;
      },
      destroy: function() {
        if ((Map.overlayView != null) && (Map.overlayView.destroy != null)) {
          Map.overlayView.destroy();
        }
        if ((Map.mapView != null) && (Map.mapView.destroy != null)) {
          return Map.mapView.destroy();
        }
      },
      fetchScript: function(global, path, next) {
        if (global != null) {
          return next();
        } else {
          return $.ajax({
            url: path,
            dataType: 'script',
            success: next
          });
        }
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
    return Map.RootView = Marionette.Object.extend({
      el: '#atl__map',
      initialize: function(options) {
        this.elId = this.el.substr(1);
        this.$el = $(this.el);
        this.$zoomInButton = $('#atl__map-zoom-in');
        this.$zoomOutButton = $('#atl__map-zoom-out');
        return this;
      },
      setZoom: function($zoomInButton, $zoomOutButton) {
        var map;
        map = this.map;
        $zoomInButton.on('click', function() {
          map.changeZoom(+1);
          return this;
        });
        $zoomOutButton.on('click', function() {
          map.changeZoom(-1);
          return this;
        });
        return this;
      },
      clearZoom: function() {
        this.$zoomInButton.off;
        this.$zoomOutButton.off;
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
      render: function() {
        var zoomLevel;
        zoomLevel = this._getZoomLevel();
        L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw';
        this.map = L.mapbox.map(this.elId, 'rossvanderlinde.9d7bb969', {
          attributionControl: false,
          maxBounds: L.latLngBounds(L.latLng(-90, -270), L.latLng(+90, +270)),
          zoomControl: false,
          inertia: false
        });
        this.map.setView([37.6, -95.665], zoomLevel);
        this.map.scrollWheelZoom.disable();
        _.extend(this.map, Map.control);
        this.map.ignoreNextClick = false;
        this.map.on('dragend', (function(_this) {
          return function(e) {};
        })(this));
        Map.map = this.map;
        this.addControl();
        return this;
      },
      addControl: function() {
        var $zoomInButton, $zoomOutButton, html;
        html = Marionette.Renderer.render('projects/show/project_templates/tilemap/templates/zoom_bar', {});
        this.$el.append(html);
        $zoomInButton = $('#atl__map-zoom-in');
        $zoomOutButton = $('#atl__map-zoom-out');
        return this.setZoom($zoomInButton, $zoomOutButton);
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
  this.Atlas.module('Projects.Show.Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.listenTo(App.vent, 'item:mouseover', this.Controller.create);
      this.listenTo(App.vent, 'item:mouseout', this.Controller.purge);
      return App.commands.setHandler('destroy:popup', (function(_this) {
        return function() {
          return _this.Controller.purge();
        };
      })(this));
    });
    return this.on('stop', function() {
      App.commands.removeHandler('destroy:popup');
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    return Popup.Controller = {
      create: function() {
        if (Popup.rootView == null) {
          Popup.rootView = Popup.Controller.getRootView();
          return App.vent.trigger('subview:ready', {
            'popup': Popup.rootView
          });
        }
      },
      purge: function() {
        if (Popup.rootView != null) {
          Popup.rootView.destroy();
          return delete Popup.rootView;
        }
      },
      getRootView: function() {
        var hoveredItem, items, popupModel, rootView;
        items = App.reqres.request('item:entities');
        hoveredItem = items.hovered;
        popupModel = Popup.getModel(hoveredItem);
        rootView = new Popup.RootView({
          model: hoveredItem
        });
        return rootView;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    Popup.Model = Backbone.Model.extend({
      defaults: {
        name: 'something'
      }
    });
    return Popup.getModel = function(item) {
      return new Popup.Model({
        name: item.get('name')
      });
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    return Popup.RootView = Marionette.ItemView.extend({
      tagName: 'a',
      className: 'atl__popup',
      template: 'projects/show/project_templates/tilemap/submodules/popup/templates/root',
      events: {
        'click': 'activateModel',
        'hover': 'preventDefault',
        'mouseover': 'preventDefault',
        'mouseout': 'preventDefault'
      },
      activateModel: function() {
        return App.vent.trigger('item:activate', this.model);
      },
      onShow: function() {
        var pos;
        if (this.model.get('_itemType') === 'state') {
          this.$el.addClass('atl__popup--center');
        }
        pos = App.reqres.request('item:map:position', this.model);
        this.$el.css({
          top: pos.y,
          left: pos.x
        });
        return this._renderLogo();
      },
      _renderLogo: function() {
        var html;
        html = Marionette.Renderer.render("projects/show/project_templates/tilemap/submodules/popup/templates/logo");
        return this.$('#atl__popup__content__logo').html(html);
      },
      preventDefault: function(e) {
        return e.preventDefault();
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.Controller.show();
      Search.term = "";
      return App.reqres.setHandler('search:term', function() {
        return Search.term;
      });
    });
    return this.on('stop', function() {
      this.stopListening();
      return App.reqres.removeHandler('search:term');
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    return Search.Controller = {
      show: function() {
        var rootView;
        rootView = new Search.RootView();
        return App.vent.trigger('subview:ready', {
          'search': rootView
        });
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    return Search.RootView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__search',
      template: 'projects/show/project_templates/tilemap/submodules/search/templates/root',
      events: {
        'keyup input': 'changeSearchTerm'
      },
      changeSearchTerm: function(e) {
        Search.term = $(e.target)[0].value;
        return App.vent.trigger('search:term:change');
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    Entities.FilterModel = Backbone.Model.extend({
      getVariableModel: function() {
        var variables;
        variables = App.reqres.request('variable:entities');
        return variables.findWhere({
          id: this.get('variable_id')
        });
      }
    });
    return Entities.FilterCollection = Backbone.Collection.extend({
      model: Entities.FilterModel
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      var data, filters;
      data = App.currentProjectData.data;
      if (data != null) {
        filters = new Entities.FilterCollection(data.filters);
      }
      return App.reqres.setHandler('filter:entities', function() {
        return filters;
      });
    });
  });

}).call(this);

(function() {


}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      var data, infoBoxSections;
      data = App.currentProjectData.data;
      if (data != null) {
        infoBoxSections = new Entities.ItemCollection(data.infobox_variables, {
          parse: true
        });
      }
      return App.reqres.setHandler('info:box:section:entities', function() {
        return infoBoxSections;
      });
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.itemChecker = {
      check: function(data) {},
      findAndReplaceKey: function(data, standardKey, keyFormatList) {
        var found, i, kf, len;
        found = false;
        if (keyFormatList == null) {
          keyFormatList = [standardKey];
        }
        for (i = 0, len = keyFormatList.length; i < len; i++) {
          kf = keyFormatList[i];
          if (data[kf]) {
            found = true;
            if (kf !== standardKey) {
              data[standardKey] = data[kf];
              delete data[kf];
            }
          }
        }
        return found;
      },
      pindrop: function(data) {
        var errors, foundLat, foundLong;
        errors = [];
        foundLat = this.findAndReplaceKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
        foundLong = this.findAndReplaceKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long']);
        if (foundLat && foundLong) {
          data._itemType = 'pindrop';
          return {
            recognized: true,
            errors: []
          };
        } else if (foundLat || foundLong) {
          return {
            recognized: true,
            errors: ['Latitude or longitude not found.']
          };
        }
        return {
          recognized: false
        };
      },
      state: function(data) {
        var errors, stateData;
        errors = [];
        if (data.name != null) {
          stateData = _.where(Atlas.Data.states, {
            name: data.name
          });
          if ((stateData != null) && stateData.length > 0) {
            data.id = stateData[0].id;
            data.code = stateData[0].code;
            data._itemType = 'state';
          } else {
            errors.push(data.name + ' not recognized as a state. Possibly a typo.');
          }
          return {
            recognized: true,
            errors: errors
          };
        }
        return {
          recognized: false
        };
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var RichGeoJson;
    RichGeoJson = (function(superClass) {
      extend(RichGeoJson, superClass);

      function RichGeoJson() {
        this.type = 'FeatureCollection';
        this.features = [];
      }

      RichGeoJson.prototype.onReady = function(next) {
        if (this.features.length > 0) {
          next();
          return;
        }
        return this.on('sync', next);
      };

      return RichGeoJson;

    })(Marionette.Object);
    return Entities.itemGeoJsonInjecters = {
      pindrop: function(itemCollection) {
        var i, item, len, ref, richGeoJson;
        richGeoJson = new RichGeoJson();
        ref = itemCollection.models;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          richGeoJson.features.push(item.toRichGeoJsonFeature());
        }
        richGeoJson.trigger('sync');
        return richGeoJson;
      },
      state: function(itemCollection) {
        var coreDatum, richGeoJson;
        richGeoJson = new RichGeoJson();
        coreDatum = App.reqres.request('core:datum:entity', 'us-states-10m');
        coreDatum.on('sync', (function(_this) {
          return function() {
            var data, feature, i, item, len, ref;
            data = coreDatum.get('data');
            richGeoJson.features = topojson.feature(data, data.objects.states).features;
            ref = richGeoJson.features;
            for (i = 0, len = ref.length; i < len; i++) {
              feature = ref[i];
              item = itemCollection.findWhere({
                id: feature.id
              });
              feature._model = item;
            }
            return richGeoJson.trigger('sync');
          };
        })(this));
        return richGeoJson;
      }
    };
  });

}).call(this);

(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    Entities.ItemModel = Backbone.Model.extend({
      parse: function(data) {
        this._processValues(data);
        Entities.itemChecker.pindrop(data);
        Entities.itemChecker.state(data);
        return data;
      },
      _processValues: function(data) {
        var key, value;
        for (key in data) {
          value = data[key];
          if ((value != null) && (value.indexOf != null) && (value.split != null) && (value.trim != null)) {
            if ((value.indexOf("|") > -1) && (value.indexOf("\n") === -1)) {
              value = value.split("|");
              value = _.map(value, function(val) {
                return val.trim();
              });
              data[key] = value;
            } else {
              data[key] = value.trim();
            }
          }
        }
        return data;
      },
      toLatLongPoint: function() {
        var lat, long;
        lat = this.get('lat');
        long = this.get('long');
        if (lat == null) {
          lat = -37.8602828;
        }
        if (long == null) {
          long = 145.0796161;
        }
        return [lat, long];
      },
      toLongLatPoint: function() {
        return this.toLatLongPoint().reverse();
      },
      toRichGeoJsonFeature: function() {
        var geoJson;
        geoJson = {
          type: 'Feature',
          _model: this,
          geometry: {
            type: 'Point',
            coordinates: this.toLongLatPoint()
          }
        };
        return geoJson;
      },
      getLayerClasses: function(filter, valueHoverIndex, searchTerm, baseClass) {
        var classNames, d, elementBaseClass, filterIndeces, highlightedClass, i, inactiveClass, isFiltered, j, k, layerClasses, len, neutralClass;
        if (baseClass == null) {
          baseClass = 'map-region';
        }
        highlightedClass = baseClass + '--highlighted';
        inactiveClass = baseClass + '--inactive';
        neutralClass = baseClass + '--neutral';
        elementBaseClass = baseClass + '__element';
        layerClasses = {
          group: baseClass,
          elementBase: elementBaseClass,
          elements: []
        };
        classNames = [];
        d = this.toJSON();
        if (App.currentDisplayMode === 'filter') {
          isFiltered = filter.test(d);
          filterIndeces = filter.getValueIndeces(d);
          k = filter.getValueCountOnActiveKey();
          if (isFiltered && (filterIndeces != null)) {
            for (j = 0, len = filterIndeces.length; j < len; j++) {
              i = filterIndeces[j];
              if ((i > -1) && isFiltered) {
                layerClasses.elements.push(elementBaseClass + " " + (filter.getBackgroundColorClass(i)));
              }
              if (i === valueHoverIndex) {
                layerClasses.group = baseClass + ' ' + highlightedClass;
              }
            }
          } else {
            layerClasses.group = baseClass + ' ' + inactiveClass;
          }
        } else if (App.currentDisplayMode === 'search') {
          if (this.matchesSearchTerm(searchTerm)) {
            layerClasses.group = baseClass + ' ' + neutralClass;
            layerClasses.elements = [''];
          } else {
            layerClasses.group = baseClass + ' ' + inactiveClass;
            layerClasses.elements = [''];
          }
        }
        return layerClasses;
      },
      matchesSearchTerm: function(searchTerm) {
        var name;
        name = this.get('name');
        if (!((searchTerm.toLowerCase != null) && (name.toLowerCase != null))) {
          return false;
        }
        name = name.toLowerCase();
        searchTerm = searchTerm.toLowerCase();
        if (name === "") {
          return false;
        }
        if (name.indexOf(searchTerm) === -1) {
          return false;
        }
        return true;
      }
    });
    return Entities.ItemCollection = Backbone.Collection.extend({
      model: Entities.ItemModel,
      getItemType: function() {
        var itemType;
        itemType = this.models[0].get('_itemType');
        return itemType;
      },
      setActive: function(activeModel) {
        var id;
        if ((_.isObject(activeModel)) && (indexOf.call(this.models, activeModel) >= 0)) {
          this.active = activeModel;
        } else {
          id = parseInt(activeModel, 10);
          this.active = id === -1 ? void 0 : this.findWhere({
            id: id
          });
        }
        return this;
      },
      setHovered: function(hoveredModel) {
        var id;
        if ((_.isObject(hoveredModel)) && (indexOf.call(this.models, hoveredModel) >= 0)) {
          this.hovered = hoveredModel;
        } else {
          id = parseInt(hoveredModel, 10);
          this.hovered = id === -1 ? void 0 : this.findWhere({
            id: id
          });
        }
        return this;
      },
      getValueList: function(key) {
        var j, l, len, len1, model, ref, val, value, valueList;
        valueList = [];
        ref = this.models;
        for (j = 0, len = ref.length; j < len; j++) {
          model = ref[j];
          value = model.get(key);
          if (_.isArray(value)) {
            for (l = 0, len1 = value.length; l < len1; l++) {
              val = value[l];
              if (indexOf.call(valueList, val) < 0) {
                valueList.push(val);
              }
            }
          } else {
            if (indexOf.call(valueList, value) < 0) {
              valueList.push(value);
            }
          }
        }
        return valueList;
      },
      getSortedValueList: function(key) {},
      getLatLongBounds: function() {
        var j, lat, len, long, maxLat, maxLong, minLat, minLong, model, ref;
        ref = this.models;
        for (j = 0, len = ref.length; j < len; j++) {
          model = ref[j];
          lat = model.get('lat');
          long = model.get('long');
          if ((typeof minLat === "undefined" || minLat === null) || (minLat > lat)) {
            minLat = lat;
          }
          if ((typeof maxLat === "undefined" || maxLat === null) || (maxLat < lat)) {
            maxLat = lat;
          }
          if ((typeof minLong === "undefined" || minLong === null) || (minLong > long)) {
            minLong = long;
          }
          if ((typeof maxLong === "undefined" || maxLong === null) || (maxLong < long)) {
            maxLong = long;
          }
        }
        return [[minLat, minLong], [maxLat, maxLong]];
      },
      toLatLongMultiPoint: function() {
        var j, len, model, ref, res;
        res = [];
        ref = this.models;
        for (j = 0, len = ref.length; j < len; j++) {
          model = ref[j];
          res.push(model.toLatLongPoint());
        }
        return res;
      },
      getRichGeoJson: function() {
        var type;
        type = this.getItemType();
        return Entities.itemGeoJsonInjecters[type](this);
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      var data, items, setHeaderStripColor;
      data = App.currentProjectData.data;
      if (data != null) {
        items = new Entities.ItemCollection(data.items, {
          parse: true
        });
      }
      App.reqres.setHandler('item:entities', (function(_this) {
        return function(query) {
          var id;
          if (items != null) {
            if (_.isObject(query)) {
              return items.findWhere(query);
            }
            if (query != null) {
              id = parseInt(query, 10);
              return items.findWhere({
                id: id
              });
            }
          }
          return items;
        };
      })(this));
      setHeaderStripColor = function() {
        var cls, filter, hoveredItem, i;
        items = App.reqres.request('item:entities');
        filter = App.reqres.request('filter');
        hoveredItem = items.hovered;
        if (hoveredItem != null) {
          i = filter.getValueIndeces(hoveredItem);
          cls = filter.getBackgroundColorClass(i[0]);
          return App.commands.execute('set:header:strip:color', {
            className: cls
          });
        } else {
          return App.commands.execute('set:header:strip:color', 'none');
        }
      };
      this.listenTo(App.vent, 'item:activate', function(modelOrId) {
        return items.setActive(modelOrId);
      });
      this.listenTo(App.vent, 'item:deactivate', function() {
        return items.setActive(-1);
      });
      this.listenTo(App.vent, 'item:mouseover', function(modelOrId) {
        items.setHovered(modelOrId);
        return setHeaderStripColor();
      });
      return this.listenTo(App.vent, 'item:mouseout', function() {
        items.setHovered(-1);
        return setHeaderStripColor();
      });
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    Entities.VariableModel = Backbone.Model.extend();
    return Entities.VariableCollection = Backbone.Collection.extend({
      model: Entities.VariableModel
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Entities', function(Entities, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      var data, variables;
      data = App.currentProjectData.data;
      if (data != null) {
        variables = new Entities.VariableCollection(data.variables);
      }
      return App.reqres.setHandler('variable:entities', function(query) {
        return variables;
      });
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Projects.Show.Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
    return Map.OverlayBaseView = (function(superClass) {
      extend(OverlayBaseView, superClass);

      function OverlayBaseView() {
        return OverlayBaseView.__super__.constructor.apply(this, arguments);
      }

      OverlayBaseView.prototype.initialize = function() {
        this.listenTo(App.vent, 'key:click display:mode:change', this.updateAnimated);
        this.listenTo(App.vent, 'value:mouseover value:mouseout value:click search:term:change', this.update);
        App.reqres.setHandler('item:map:position', (function(_this) {
          return function(item) {
            var feature, identityPath, latLong, longLatArrayCentroid, map;
            identityPath = d3.geo.path().projection(function(d) {
              return d;
            });
            feature = _this._getFeatureByModel(item);
            longLatArrayCentroid = identityPath.centroid(feature);
            latLong = L.latLng(longLatArrayCentroid[1], longLatArrayCentroid[0]);
            map = Map.map;
            return map.latLngToContainerPoint(latLong);
          };
        })(this));
        return this;
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

      OverlayBaseView.prototype.onFeatureMouseOut = function() {
        return App.vent.trigger('item:mouseout');
      };

      OverlayBaseView.prototype.onFeatureMouseOver = function(feature) {
        var message;
        if (this.bringFeatureToFront != null) {
          this.bringFeatureToFront(feature);
        }
        message = feature._model != null ? feature._model : feature.id;
        return App.vent.trigger('item:mouseover', message);
      };

      OverlayBaseView.prototype.onFeatureClick = function(feature) {
        var message;
        if ((Map.map != null) && Map.map.ignoreNextClick) {
          App.commands.execute('destroy:popup');
          Map.map.ignoreNextClick = false;
          return;
        }
        if (d3.event.stopPropagation != null) {
          d3.event.stopPropagation();
        }
        message = feature._model != null ? feature._model : feature.id;
        App.vent.trigger('item:activate', message);
        return this.activeFeature = feature;
      };

      OverlayBaseView.prototype.onMapClick = function(e) {
        if (this.activeFeature != null) {
          this.activeFeature = void 0;
          return App.vent.trigger('item:deactivate');
        }
      };

      OverlayBaseView.prototype._getFeatureByModel = function(model) {
        var feature, i, len, ref;
        ref = this.collection.features;
        for (i = 0, len = ref.length; i < len; i++) {
          feature = ref[i];
          if (feature._model === model) {
            return feature;
          }
        }
      };

      OverlayBaseView.prototype.getFeatureClasses = function(feature, baseClass) {
        var cls, filter, model, searchTerm, valueHoverIndex;
        filter = App.reqres.request('filter');
        model = feature._model;
        valueHoverIndex = App.reqres.request('value:hovered');
        searchTerm = App.reqres.request('search:term');
        if (model != null) {
          cls = model.getLayerClasses(filter, valueHoverIndex, searchTerm, baseClass);
          return cls;
        }
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

  this.Atlas.module("Projects.Show.Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
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

      PathOverlayView.prototype.init = function() {
        this.svg = d3.select(Map.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
        return this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
      };

      PathOverlayView.prototype.draw = function() {
        var self;
        this.geoJson = this.collection;
        self = this;
        this.g.selectAll('path').data(this.geoJson.features).enter().append('path').on('mouseover', this.onFeatureMouseOver.bind(this)).on('mouseout', this.onFeatureMouseOut.bind(this)).on('click', function(d) {
          if (d3.event.defaultPrevented) {
            return;
          }
          return self.onFeatureClick(d);
        });
        this.update();
        Map.map.on('viewreset', this.update.bind(this));
        Map.map.on('click', this.onMapClick.bind(this));
        return this;
      };

      getProjectedPoint = function(long, lat) {
        return Map.map.latLngToLayerPoint(new L.LatLng(lat, long));
      };

      PathOverlayView.prototype.getPath = function() {
        var path, projectPoint, transform;
        getProjectedPoint = function(long, lat) {
          return Map.map.latLngToLayerPoint(new L.LatLng(lat, long));
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
              var featureClasses;
              featureClasses = _this.getFeatureClasses(feature, 'map-region');
              if (featureClasses != null) {
                return featureClasses.group + " " + (featureClasses.elements[0] != null ? featureClasses.elements[0] : featureClasses.elementBase);
              }
              return "";
            };
          })(this),
          'd': path
        });
        this.resizeContainer(geoJson, path, 0);
        return this;
      };

      PathOverlayView.prototype.render = function() {
        if (this.init) {
          this.init();
        }
        return this.draw();
      };

      return PathOverlayView;

    })(Map.OverlayBaseView);
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Projects.Show.Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
    return Map.PindropOverlayView = (function(superClass) {
      extend(PindropOverlayView, superClass);

      function PindropOverlayView() {
        return PindropOverlayView.__super__.constructor.apply(this, arguments);
      }

      PindropOverlayView.prototype.render = function() {
        this.svg = d3.select(Map.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
        this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
        return this.draw();
      };

      PindropOverlayView.prototype.setMapEventListeners = function() {
        Map.map.on('viewreset', this.update.bind(this));
        return Map.map.on('click', this.onMapClick.bind(this));
      };

      PindropOverlayView.prototype.draw = function() {
        var pindrop;
        this.shape = App.Assets.svg.shapes.pindrop_new;
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
        return this.setMapEventListeners();
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
          "class": function(d) {
            return self.getFeatureClasses(d, 'map-pin').group;
          }
        }).selectAll('path').attr({
          'class': function(d, i) {
            var baseClass, classIndex, classTree, classes, cls, indeces, parentFeature;
            parentFeature = d3.select(this.parentNode).datum();
            classTree = self.getFeatureClasses(parentFeature, 'map-pin');
            classes = classTree.elements;
            baseClass = classTree.elementBase;
            indeces = getIndecesFromClassName(d.className);
            if (indeces != null) {
              if (classes.length === 1) {
                return d.className + " " + classes[0];
              }
              if (((classes.length === 2) && (indeces[1] === 2)) || ((classes.length === 3) && (indeces[1] === 3)) || (classes.length > 3)) {
                classIndex = indeces[0] - 1;
                cls = classes[classIndex] != null ? classes[classIndex] : baseClass;
                return d.className + " " + cls;
              }
              return 'path--empty';
            }
            return d.className;
          }
        });
        this.resizeContainer(this.collection, path, 100);
        return this;
      };

      return PindropOverlayView;

    })(Map.OverlayBaseView);
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      return this.Controller.showIndex();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    return Index.Controller = {
      showIndex: function() {
        var navView, projectsView, rootView;
        rootView = new Index.RootView();
        App.contentRegion.show(rootView);
        projectsView = this.getProjectsView();
        navView = new Index.NavView();
        rootView.getRegion('banner').show(navView);
        rootView.getRegion('projects').show(projectsView);
        rootView.getRegion('sideBar').show(new Index.SideBarView());
        navView.getRegion('sectionFilter').show(this.getProjectSectionsView());
        return navView.getRegion('templateFilter').show(this.getProjectTemplatesView());
      },
      getProjectsView: function() {
        var projects;
        projects = App.request("project:entities", {
          cache: true
        });
        projects.filter();
        return new Index.ProjectsView({
          collection: projects
        });
      },
      getProjectSectionsView: function() {
        var projectSections;
        projectSections = App.request("project:section:entities", {
          cache: true
        });
        projectSections.initializeActiveStates();
        return new Index.ProjectSectionsView({
          collection: projectSections
        });
      },
      getProjectTemplatesView: function() {
        var projectTemplates;
        projectTemplates = App.request("project:template:entities", {
          cache: true
        });
        projectTemplates.initializeActiveStates();
        return new Index.ProjectTemplatesView({
          collection: projectTemplates
        });
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    Index.SideBarView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__side-bar fill-parent',
      template: 'projects/index/templates/side_bar',
      events: {
        'click a': 'navigate'
      },
      navigate: function(e) {
        return '1' === '2';
      }
    });
    return Index.RootView = (function(superClass) {
      extend(RootView, superClass);

      function RootView() {
        return RootView.__super__.constructor.apply(this, arguments);
      }

      RootView.prototype.tagName = 'div';

      RootView.prototype.className = 'atl fill-parent';

      RootView.prototype.template = 'projects/index/templates/root';

      RootView.prototype.childViewContainer = '.project-container';

      RootView.prototype.regions = {
        banner: '#atl__nav',
        projects: '#atl__projects',
        sideBar: '#atl__side-bar'
      };

      return RootView;

    })(Marionette.LayoutView);
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show', function(Show, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function(atlas_url) {
      var project;
      App.currentDisplayMode = 'filter';
      App.commands.setHandler('change:display:mode', function(mode) {
        App.currentDisplayMode = mode;
        return App.vent.trigger('display:mode:change');
      });
      Show.Controller.show();
      project = App.reqres.request('project:entity', atlas_url);
      project.on('sync', (function(_this) {
        return function() {
          if (project.exists()) {
            App.currentProjectData = project.toJSON();
            App.currentProjectModel = project;
            if (project.get('project_template_id') === 1) {
              $('.atl').addClass('atl--light');
            }
            _this.currentProjectTemplate = App.currentProjectData.project_template.name;
            return Show[_this.currentProjectTemplate].start();
          }
          return Backbone.history.navigate('welcome', {
            trigger: true
          });
        };
      })(this));
      return this;
    });
    this.on('stop', function() {
      return this.stopListening();
    });
    return this;
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show', function(Show, App, Backbone, Marionette, $, _) {
    return Show.Controller = {
      show: function() {
        Show.rootView = this.getRootView();
        App.contentRegion.show(Show.rootView, {
          preventDestroy: true
        });
        Show.rootView.getRegion('sideBar').show(this.getSideBarView());
        return App.appContentRegion = Show.rootView.getRegion('main');
      },
      getSideBarView: function() {
        return new Show.SideBarView();
      },
      getRootView: function() {
        return new Show.RootView();
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show', function(Show, App, Backbone, Marionette, $, _) {
    Show.SideBarView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__side-bar fill-parent',
      template: 'projects/show/templates/side_bar',
      events: {
        'click a': 'navigate'
      },
      navigate: function(e) {
        var entity, method;
        e.preventDefault();
        e.stopPropagation();
        entity = $(e.currentTarget).attr('data-method');
        method = this["_" + entity];
        if (method != null) {
          return method();
        }
      },
      _projects: function() {
        return Backbone.history.navigate('menu', {
          trigger: true
        });
      },
      _edit: function() {
        Backbone.history.navigate('');
        return window.location.href = "projects/" + App.currentProjectData.id + "/edit";
      },
      _collapse: function() {
        return $('.atl').toggleClass('atl--collapsed');
      }
    });
    return Show.RootView = Marionette.LayoutView.extend({
      template: 'projects/show/templates/root',
      className: 'atl atl--filter-display',
      regions: {
        sideBar: '#atl__side-bar',
        main: '#atl__main'
      },
      events: {
        'click .atl__binary-toggle__link': 'toggleDisplay'
      },
      toggleDisplay: function(e) {
        var $app, $target, activate;
        e.preventDefault();
        $target = $(e.target);
        $app = $('.atl');
        activate = function(mode) {
          $('.atl__binary-toggle__link').removeClass('atl__binary-toggle__link--active');
          $target.addClass('atl__binary-toggle__link--active');
          return App.commands.execute('change:display:mode', mode);
        };
        if ($target.attr('id') === 'atl__set-filter-display') {
          activate('filter');
          $app.addClass('atl--filter-display');
          $app.removeClass('atl--search-display');
        }
        if ($target.attr('id') === 'atl__set-search-display') {
          activate('search');
          $app.addClass('atl--search-display');
          return $app.removeClass('atl--filter-display');
        }
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('About', function(About, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('About', function(About, App, Backbone, Marionette, $, _) {
    return About.Controller = {
      show: function() {
        var rootView;
        rootView = this.getRootView();
        return App.contentRegion.show(rootView);
      },
      getRootView: function() {
        return new About.RootView();
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module('About', function(About, App, Backbone, Marionette, $, _) {
    return About.RootView = (function(superClass) {
      extend(RootView, superClass);

      function RootView() {
        return RootView.__super__.constructor.apply(this, arguments);
      }

      RootView.prototype.tagName = 'div';

      RootView.prototype.className = 'about bg-c-off-white';

      RootView.prototype.template = 'about/templates/root';

      return RootView;

    })(Marionette.LayoutView);
  });

}).call(this);
