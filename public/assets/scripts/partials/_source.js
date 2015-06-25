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

(function() {
  Marionette.Renderer.render = function(template, data) {
    var i, len, path, paths;
    if (window.JST == null) {
      window.JST = {};
    }
    if (window.JST_ATL == null) {
      window.JST_ATL = {};
    }
    paths = [JST_ATL['atlas/site/' + template + '.jst'], JST_ATL['atlas/' + template + '.jst']];
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
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      var aArgs, fBound, fNOP, fToBind;
      if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }
      aArgs = Array.prototype.slice.call(arguments, 1);
      fToBind = this;
      fNOP = function() {};
      fBound = function() {
        var context;
        context = this instanceof fNOP ? this : oThis;
        return fToBind.apply(context, aArgs.concat(Array.prototype.slice.call(arguments)));
      };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }

}).call(this);

(function() {
  this.Atlas = (function(Backbone, Marionette) {
    var App;
    App = new Marionette.Application();
    App.uiState = {
      isCollapsed: false
    };
    App.on('start', function() {
      var router;
      console.log('Hi, Mom!');
      router = new App.Router.Router();
      App.router = router;
      if (Backbone.history) {
        return Backbone.history.start({
          pushState: true
        });
      }
    });
    return App;
  })(Backbone, Marionette);

}).call(this);

(function() {
  this.Atlas.module('Router', function(Router, App, Backbone, Marionette, $, _) {
    Router.actions = ['welcome_index', 'projects_index', 'projects_show', 'about_index'];
    Router.actionHistory = [];
    return Router.History = (function() {
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
        this._history.push(obj);
        return this;
      };

      History.prototype.getCurrentActionIndex = function() {
        var len;
        len = this._history.length;
        return this._history[len - 1].actionIndex;
      };

      History.prototype.getPreviousActionIndex = function() {
        var len;
        len = this._history.length;
        if (len >= 2) {
          return this._history[len - 2].actionIndex;
        }
      };

      History.prototype.getLastActionByIndex = function(actionIndex) {
        var hist, i, j, len, ref;
        len = this._history.length;
        for (i = j = ref = len - 1; j >= 0; i = j += -1) {
          hist = this._history[i];
          if (hist.actionIndex === actionIndex) {
            return hist;
          }
        }
      };

      History.prototype.setSwipeDirection = function() {
        var cai, pai;
        cai = this.getCurrentActionIndex();
        pai = this.getPreviousActionIndex();
        if (cai < pai) {
          return App.swipeDirection = 'left';
        } else if (cai > pai) {
          return App.swipeDirection = 'right';
        } else {
          return App.swipeDirection = 'top';
        }
      };

      return History;

    })();
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
        'menu': 'projects_index',
        'show': 'projects_show',
        ':atlas_url': 'projects_show',
        '*notFound': 'welcome_index'
      },
      welcome_index: function(param) {
        Backbone.history.navigate('/welcome', {
          trigger: false
        });
        this.navigate('welcome_index', param);
        return App.Welcome.start();
      },
      about_index: function(param) {
        this.navigate('about_index');
        return App.About.start();
      },
      projects_index: function(param) {
        this.navigate('projects_index', param);
        App.Projects.start();
        return App.Projects.Index.start();
      },
      projects_show: function(atlas_url, param) {
        var lastShowAction, previous_atlas_url;
        lastShowAction = this.history.getLastActionByIndex(2);
        if (lastShowAction != null) {
          previous_atlas_url = lastShowAction.atlas_url;
        }
        if (atlas_url == null) {
          atlas_url = previous_atlas_url;
        }
        if (atlas_url == null) {
          atlas_url = 'mapping-college-readiness';
        }
        if (param == null) {
          param = {};
        }
        param.atlas_url = atlas_url;
        this.navigate('projects_show', param);
        Backbone.history.navigate("/" + atlas_url, {
          trigger: false
        });
        App.Projects.start();
        return App.Projects.Show.start(atlas_url);
      },
      navigate: function(action, params) {
        this.history.add(action, params);
        this._stopRoutableModules();
        App.vent.trigger('router:current:action:change', this.history.getCurrentActionIndex());
        return App.commands.execute('apply:route:specific:styling', action);
      },
      navigateApp: function(url, trigger) {
        if (trigger == null) {
          trigger = true;
        }
        return Backbone.history.navigate(url, {
          trigger: trigger
        });
      },
      _stopRoutableModules: function() {
        App.Welcome.stop();
        App.About.stop();
        return App.Projects.stop();
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
  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    return Base.AttributionView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__attribution bg-img-info--black',
      template: 'templates/misc/attribution',
      events: {
        'click': 'toggleActiveState'
      },
      toggleActiveState: function(e) {
        e.stopPropagation();
        return this.$el.toggleClass('atl__attribution--active');
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    return Base.DisplayToggleView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__display-toggle'
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Base', function(Base, App, Backbone, Marionette, $, _) {
    Base.SearchModel = Backbone.Model.extend({
      defaults: {
        placeholder: 'Search'
      }
    });
    return Base.SearchView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__search',
      template: 'templates/misc/search',
      initialize: function() {
        if (this.model == null) {
          return this.model = new Base.SearchModel();
        }
      },
      events: {
        'keyup input': 'changeSearchTerm'
      },
      changeSearchTerm: function(e) {
        var term;
        term = $(e.target)[0].value;
        App.searchTerm = term;
        return App.vent.trigger('search:term:change', term);
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
  this.Atlas.module('Util', function(Util, App, Backbone, Marionette, $, _) {
    return App.commands.setHandler('apply:route:specific:styling', function(route, theme) {
      $('body').attr('class', 'atl-route--' + route);
      $('.header__main h1').html((route === 'welcome_index' ? 'NEW AMERICA' : 'ATLAS'));
      return App.commands.execute('set:header:strip:color');
    });
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
  this.Atlas.module('Util', function(Util, App, Backbone, Marionette, $, _) {
    return Util.formatCheckers = {
      isMarkdown: function(string) {
        if (!_.isString(string)) {
          return false;
        }
      },
      isAtlasArray: function(string) {
        if (!_.isString(string)) {
          return false;
        }
        return (string.indexOf("|") > -1) && (string.indexOf("\n") === -1);
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Util', function(Util, App, Backbone, Marionette, $, _) {
    return Util.formatters = {
      htmlToHtml: function(html) {
        var $html, newHtml;
        $html = $(html);
        $html.find('a').attr('target', '_blank');
        newHtml = $('<div></div>').append($html.clone()).html();
        return newHtml;
      },
      atlasArrayToArray: function(atlasArray) {
        var arr;
        arr = atlasArray.split("|");
        arr = _.map(arr, function(item) {
          return item.trim();
        });
        return arr;
      },
      removeLineBreaks: function(string) {
        string = String(string);
        return string.replace(/(\r\n|\n|\r)/gm, '');
      },
      removeSpaces: function(string) {
        string = String(string);
        return string.replace(/\s+/g, '');
      },
      hyphenate: function(string) {
        string = String(string);
        return string.replace('ommunication', 'ommuni-cation');
      },
      mdToHtml: function(string) {
        var html;
        if (string != null) {
          html = marked(string);
        }
        if (html != null) {
          return this.htmlToHtml(html);
        }
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Util', function(Util, App, Backbone, Marionette, $, _) {
    if (Util.templateHelpers == null) {
      Util.templateHelpers = {};
    }
    return Util.templateHelpers.addDashOnLongWord = function(word) {
      if (word == null) {
        return word;
      }
      word = String(word);
      if (word.length < 11) {
        return word;
      }
      return word.slice(0, -4) + '-' + word.slice(-4);
    };
  });

}).call(this);

(function() {
  
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var base = require('./base'),
	baseFilter = require('./base_filter'), 
	coreDatum = ('./core_datum'), 
	filter = require('./filter'), 
	image = require('./image'), 
	infoBoxSection = require('./info_box_section'), 
	item = require('./item'), 
	project = require('./project'), 
	projectSection = require('./project_section'), 
	projectTemplate = require('./project_template'), 
	researcher = require('./researcher'), 
	richGeoFeature = require('./rich_geo_feature'), 
	variable = require('./variable');

window.Atlas.module('Models', function(Models) {

	Models.BaseModel = base.Model;
	Models.BaseCollection = base.Collection;

	Models.BaseFilterModel = baseFilter.Model;
	Models.BaseFilterCollection = baseFilter.Collection;

	Models.CoreDatum = coreDatum.Model;
	Models.CoreData = coreDatum.Collection;

	Models.Filter = filter.Model;
	Models.Filters = filter.Collection;

	Models.Image = image.Model;
	Models.Images = image.Collection;

	Models.InfoBoxSection = infoBoxSection.Model;
	Models.InfoBoxSections = infoBoxSection.Collection;

	Models.Item = item.Model;
	Models.Items = item.Collection;

	Models.Project = project.Model;
	Models.Projects = project.Collection;

	Models.ProjectSection = projectSection.Model;
	Models.ProjectSections = projectSection.Collection;

	Models.ProjectTemplate = projectTemplate.Model;
	Models.ProjectTemplates = projectTemplate.Collection;

	Models.Researcher = researcher.Model;
	Models.Researchers = researcher.Collection;

	Models.RichGeoFeature = richGeoFeature.Model;
	Models.RichGeoFeatures = richGeoFeature.Collection;
	
	Models.Variable = variable.Model;
	Models.Variables = variable.Collection;
	
});
},{"./base":2,"./base_filter":3,"./filter":4,"./image":5,"./info_box_section":6,"./item":7,"./project":8,"./project_section":9,"./project_template":10,"./researcher":11,"./rich_geo_feature":12,"./variable":13}],2:[function(require,module,exports){
var Backbone = (window.Backbone),
	_ = (window._),
	$ = (window.$);

exports.Model = Backbone.Model.extend({

	parse: function(data) {
		data = this._adaptMongoId(data);
		return data;
	},

	/*
	 * Adds fields of a foreign collection, referenced by a foreign id within the model.
	 * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
	 *                                  the former references a single value, the latter an array.
	 * @param {object} foreignCollection
	 * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
	 * @returns {object} this - The model instance, with 'model_name' field added.
	 */
	addForeignField: function(foreignIdKey, foreignCollection, fieldKey) {

		var newKey, 
			foreignModel, foreignIds, foreignId,
			singleForeignIdKey, // if foreignIdKey holds an array
			foreignFields = [],
			i, max;

		if (foreignIdKey.slice(-2) === 'id') {
			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({id: this.get(foreignIdKey)});
			this.set(newKey, foreignModel.get(fieldKey));
		} else if (foreignIdKey.slice(-3) === 'ids') {
			foreignIds = this.get(foreignIdKey);
			for(i = 0, max = foreignIds.length; i < max; i += 1) {
				foreignId = foreignIds[i];
				// simple pluralization
				newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
				foreignModel = foreignCollection.findWhere({id: foreignId});
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey));
				}
			}
			this.set(newKey, foreignFields);
		}

		return this;

	},

	_findAndReplaceKey: function(data, standardKey, keyFormatList) {
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

	_adaptMongoId: function(data) {
		if ((data._id != null)) {
			if ((data._id.$oid != null)) {
				data.id = String(data._id.$oid);
			} else {
				data.id = String(data._id);
			}
			delete data._id;
		} else if ((data.id != null) && (data.id.$oid != null)) {
			data.id = String(data.id.$oid);
		}
		return data;
	},

	_removeArrayWrapper: function(resp) {
		if (_.isArray(resp) && (resp.length === 1)) {
			resp = resp[0];
		}
		return resp;
	},

	_removeLineBreaks: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
		}
		return resp;
	},

	_removeSpaces: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/\s+/g, '');
		}
		return resp;
	},

	_processStaticHtml: function(resp, key) {
		var $html, html, newHtml;
		html = resp[key];
		$html = $(html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		resp[key] = newHtml;
		return resp;
	},

	getMarkdownHtml: function(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	}

});

exports.Collection = Backbone.Collection.extend({
	model: exports.Model,

	parse: function(resp) {
		var i, max,
			item;
		if (exports.Model.prototype.parse == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}

});
},{}],3:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$),
	indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

exports.Model = base.Model.extend({
	_activate: function() {
		return this.set('_isActive', true);
	},
	_deactivate: function() {
		return this.set('_isActive', false);
	},
	toggleActiveState: function() {
		if (this.isActive()) {
			if (!((this.collection != null) && this.collection.hasSingleActiveChild)) {
				return this._deactivate();
			}
		} else {
			this._activate();
			if ((this.collection != null) && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	},
	isActive: function() {
		return this.get('_isActive');
	},
	test: function(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) {
			return false;
		}
		id = this.get('id');
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) {
			return id === foreignId;
		}
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) {
			return (indexOf.call(foreignIds, id) >= 0);
		}
		return false;
	}
});

exports.Collection = base.Collection.extend({
	initialize: function() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},
	model: exports.Model,
	hasSingleActiveChild: false,
	deactivateSiblings: function(activeChild) {
		var i, len, model, ref, results;
		ref = this.models;
		results = [];
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model !== activeChild) {
				results.push(model._deactivate());
			} else {
				results.push(void 0);
			}
		}
		return results;
	},
	initializeActiveStates: function() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : (index === 0 ? true : false));
		}
		return this.trigger('initialize:active:states');
	},
	test: function(testedModel, foreignKey) {
		var i, len, model, ref;
		ref = this.models;
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model.test(testedModel, foreignKey)) {
				return true;
			}
		}
		return false;
	}
});
},{"./base":2}],4:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	getVariableModel: function(variables) {
		return variables.findWhere({
			id: this.get('variable_id')
		});
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],5:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/images',
	url: function() {
		return this.urlRoot + ("?name=" + (this.get('name')));
	},
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},
	getBackgroundImageCss: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});
},{"./base":2}],6:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);


exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});

},{"./base":2}],7:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	rgf = require('./rich_geo_feature'),
	$ = (window.$),
	states = require('./../../db/seeds/states.json');

var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

exports.Model = base.Model.extend({
	parse: function(data) {
		this._processValues(data);
		this._checkPindrop(data);
		this._checkState(data);
		return data;
	},
	_processValues: function(data) {
		var key, value;
		for (key in data) {
			value = data[key];
			if (_.isString(value)) {
				if ((value.indexOf("|") > -1) && (value.indexOf("\n") === -1)) {
					data[key] = _.map(value.split('|'), function(item) {
						return item.trim();
					});
				} else {
					data[key] = value.trim();
				}
			}
		}
		return data;
	},
	_checkPindrop: function(data) {
		var errors, foundLat, foundLong;
		errors = [];
		foundLat = this._findAndReplaceKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		foundLong = this._findAndReplaceKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long']);
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
	_checkState: function(data) {
		var errors, stateData;
		errors = [];
		if (data.name != null) {
			stateData = _.where(states, {
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
	},
	getImageName: function() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
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
	getLayerClasses: function(filter, valueHoverIndex, searchTerm, baseClass, currentDisplayMode) {
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
		if (currentDisplayMode === 'filter') {
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
		} else if (currentDisplayMode === 'search') {
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


exports.Collection = base.Collection.extend({
	model: exports.Model,
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
		return [
			[minLat, minLong],
			[maxLat, maxLong]
		];
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
	richGeoJsonBuilders: {
		state: function(collection, baseGeoData) {
			var data, richGeoJson, setup;
			richGeoJson = new rgf.Collection();
			setup = function(data) {
				var feature, item, j, len, ref;
				richGeoJson.features = topojson.feature(data, data.objects.states).features;
				ref = richGeoJson.features;
				for (j = 0, len = ref.length; j < len; j++) {
					feature = ref[j];
					item = collection.findWhere({
						id: feature.id
					});
					feature._model = item;
				}
				return richGeoJson.trigger('sync');
			};
			setup(baseGeoData);
			return richGeoJson;
		},
		pindrop: function(collection) {
			var item, j, len, ref, richGeoJson;
			richGeoJson = new rgf.Collection();
			ref = collection.models;
			for (j = 0, len = ref.length; j < len; j++) {
				item = ref[j];
				richGeoJson.features.push(item.toRichGeoJsonFeature());
			}
			richGeoJson.trigger('sync');
			return richGeoJson;
		}
	},
	getRichGeoJson: function(baseGeoData) {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this, baseGeoData);
	}
});
},{"./../../db/seeds/states.json":16,"./base":2,"./rich_geo_feature":12}],8:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	filter = require('./filter'),
	infoBoxSection = require('./info_box_section'),
	variable = require('./variable'),
	item = require('./item'),
	$ = (window.$);


exports.Model = base.Model.extend({

	urlRoot: '/api/v1/projects',

	// API queries that need to be handled custom.
	// For every key, there is an this.is_#{key} method that filters a model.
	customQueryKeys: [ 'related_to' ],

	url: function() {
		return this.urlRoot + ("?atlas_url=" + (this.get('atlas_url')));
	},

	buildUrl: function() {
		return "http://build.atlas.newamerica.org/projects/" + (this.get('id')) + "/edit";
	},

	exists: function() {
		var json, key, keyCount;
		keyCount = 0;
		json = this.toJSON();
		for (key in json) {
			keyCount += 1;
		}
		return (keyCount !== 1) && (json.id != null);
	},

	parse: function(resp) {
		resp = this._adaptMongoId(resp);
		resp = this._removeArrayWrapper(resp);
		resp = this._removeSpaces(resp, 'template_name');
		resp = this._processStaticHtml(resp, 'body_text');
		return resp;
	},

	compositeFilter: function(projectSections, projectTemplates) {
		var filter, sectionsFilter, templatesFilter;
		sectionsFilter = this.filter(projectSections, 'project_section');
		templatesFilter = this.filter(projectTemplates, 'project_template');
		filter = sectionsFilter && templatesFilter;
		this.trigger('visibility:change', filter);
		return filter;
	},

	/*
	 * Custom query method.
	 * @param {string} projectId
	 * @returns {boolean}
	 */
	isRelatedTo: function(project) {
		var self = this, prj, tags0, tags1, i, max;
		if (this === project) { return false; }
		tags0 = this.get('tags');
		tags1 = project.get('tags');
		if (tags0 === '' || tags1 === '') { return false; }
		tags0 = tags0.split(',');
		tags1 = tags1.split(',');
		for (i = 0, max = tags0.length; i < max; i += 1) {
			if (tags1.indexOf(tags0[i]) > -1) { return true; }
		}
		return false;
	},

	filter: function(collection, foreignKey) {
		if ((collection != null) && (collection.test != null)) {
			return collection.test(this, foreignKey);
		}
		return true;
	},

	getImageAttributionHtml: function() {
		return this.getMarkdownHtml('image_credit');
	},

	buildData: function() {
		var data;
		data = this.get('data');
		if (data != null) {
			data.filters = new filter.Collection(data.filters, {
				parse: true
			});
			data.infobox_variables = new infoBoxSection.Collection(data.infobox_variables, {
				parse: true
			});
			data.variables = new variable.Collection(data.variables, {
				parse: true
			});
			data.items = new item.Collection(data.items, {
				parse: true
			});
		}
	}

});

exports.Collection = base.Collection.extend({

	initialize: function() {
		return this.on('reset', this.filter);
	},

	model: exports.Model,

	url: function() {
		var base;
		base = '/api/v1/projects';
		if (this.queryString != null) {
			return base + "?" + this.queryString;
		}
		return base;
	},

	comparator: function(model1, model2) {
		var i1, i2;
		i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0;
		i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0;
		if (model1.get('title') < model2.get('title')) {
			i1 += 1;
		} else {
			i2 += 1;
		}
		return i2 - i1;
	},

	filter: function(projectSections, projectTemplates) {
		var i, len, model, ref;
		if ((projectSections.models == null) || (projectSections.models.length === 0)) {
			return;
		}
		if ((projectTemplates.models == null) || (projectTemplates.models.length === 0)) {
			return;
		}
		if (this.models.length === 0) {
			return;
		}
		ref = this.models;
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			model.compositeFilter(projectSections, projectTemplates);
		}
		return this;
	},

	parse: function(resp) {
		var i, max,
			item;
		if (exports.Model.prototype.parse == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}
	
});
},{"./base":2,"./filter":4,"./info_box_section":6,"./item":7,"./variable":13}],9:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	baseFilter = require('./base_filter'),
	$ = (window.$),
	seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_sections',
	hasSingleActiveChild: false,
	initializeActiveStatesOnReset: true,
	initialize: function() {
		this.reset(seed);
	}
});
},{"./../../db/seeds/project_sections.json":14,"./base_filter":3}],10:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	baseFilter = require('./base_filter'),
	$ = (window.$),
	seed = require('./../../db/seeds/project_templates.json');


exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_templates'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_templates',
	hasSingleActiveChild: true,
	initializeActiveStatesOnReset: true,
	comparator: 'order',
	initialize: function() {
		this.reset(seed);
	}
});
},{"./../../db/seeds/project_templates.json":15,"./base_filter":3}],11:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],12:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	$ = (window.$);

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({
	initialize: function() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},
	model: exports.Model,
	onReady: function(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}
});
},{}],13:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);


exports.Model = base.Model.extend();

exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],14:[function(require,module,exports){
module.exports=[
	{ "id": "0", "name": "Early Education" },
	{ "id": "1", "name": "PreK-12 Education" },
	{ "id": "2", "name": "Higher Education" },
	{ "id": "3", "name": "Learning Technologies" },
	{ "id": "4", "name": "Dual Language Learners" },
	{ "id": "5", "name": "Workforce Development" },
	{ "id": "6", "name": "Federal Education Budget" }
]
},{}],15:[function(require,module,exports){
module.exports=[
	{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" },
	{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" },
	{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" },
	{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
]
},{}],16:[function(require,module,exports){
module.exports=[
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
]
},{}]},{},[1]);

;


}).call(this);

(function() {
  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    entityManager = new App.Base.EntityManager({
      entityConstructor: App.Models.CoreDatum,
      entitiesConstructor: App.Models.CoreData
    });
    App.reqres.setHandler('core:datum:entities', function() {
      return entityManager.getEntities({
        cache: true
      });
    });
    return App.reqres.setHandler('core:datum:entity', function(query) {
      return entityManager.getEntity(query);
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    entityManager = new App.Base.EntityManager({
      entityConstructor: App.Models.Image,
      entitiesConstructor: App.Models.Images
    });
    App.reqres.setHandler('image:entities', function(options) {
      return entityManager.getEntities(options);
    });
    return App.reqres.setHandler('image:entity', function(query) {
      return entityManager.getEntity(query);
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var entityManager;
    entityManager = new App.Base.EntityManager({
      entityConstructor: App.Models.Project,
      entitiesConstructor: App.Models.Projects
    });
    App.reqres.setHandler('project:entities', function(options) {
      return entityManager.getEntities(options);
    });
    return App.reqres.setHandler('project:entity', function(query) {
      return entityManager.getEntity(query);
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var coll, entityManager;
    entityManager = new App.Base.EntityManager({
      entitiesConstructor: App.Models.ProjectSections
    });
    coll = new App.Models.ProjectSections();
    coll.on('initialize:active:states', function() {
      return App.vent.trigger('project:filter:change', this);
    });
    coll.initializeActiveStates();
    entityManager.entitiesCache = coll;
    return App.reqres.setHandler('project:section:entities', function() {
      return entityManager.getEntities({
        cache: true
      });
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var coll, entityManager;
    entityManager = new App.Base.EntityManager({
      entitiesConstructor: App.Models.ProjectTemplates
    });
    coll = new App.Models.ProjectTemplates();
    coll.on('initialize:active:states', function() {
      return App.vent.trigger('project:filter:change', this);
    });
    coll.initializeActiveStates();
    entityManager.entitiesCache = coll;
    return App.reqres.setHandler('project:template:entities', function() {
      return entityManager.getEntities({
        cache: true
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
    App.reqres.setHandler('current:project', function() {
      return App.currentProjectModel;
    });
    App.vent.on('current:project:change', function(project) {
      return App.currentProjectModel = project;
    });
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

}).call(this);

(function() {
  this.Atlas.module('Welcome', function(Welcome, App, Backbone, Marionette, $, _) {
    var el;
    this.startWithParent = false;
    el = $('#atl')[0];
    this.on('start', function() {
      var c;
      c = React.createElement(Comp.Welcome, {
        app: App
      });
      return React.render(c, el);
    });
    return this.on('stop', function() {
      React.unmountComponentAtNode(el);
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Header', function(Header, App, Backbone, Marionette, $, _) {
    this.startWithParent = true;
    this.on('start', function() {
      this.Controller.show();
      return App.commands.setHandler('set:header:text', function(text) {
        return Header.rootView.setText(text);
      });
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
        url: '/show'
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
            if ((options == null) || (options === 'none')) {
              _this.$el.attr('class', _this.className);
              return _this.$el.css('background-color', '');
            } else if (options.color != null) {
              _this.$el.attr('class', _this.className);
              return _this.$el.css('background-color', options.color);
            } else if (options.className != null) {
              _this.$el.css('background-color', '');
              _this.$el.attr('class', _this.className);
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

      RootView.prototype.initialize = function() {
        return this.listenTo(App.vent, 'current:project:change', function(project) {
          this.model = project;
          return this.setText();
        });
      };

      RootView.prototype.events = {
        'click #header__welcome-link': 'navigate'
      };

      RootView.prototype.navigate = function(e) {
        e.preventDefault();
        return Backbone.history.navigate('/welcome', {
          trigger: true
        });
      };

      RootView.prototype.setText = function(text) {
        var html, title;
        title = this.model != null ? this.model.get('title') : void 0;
        html = title != null ? '&#8594; ' + title + ' (Beta)' : '';
        return $('.header__main__title').html(html);
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
        if (modelId === "2") {
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

      ProjectView.prototype.initialize = function() {
        return this.listenTo(this.model, 'visibility:change', function(isVisible) {
          if (isVisible) {
            return this.$el.removeClass('hidden');
          } else {
            return this.$el.addClass('hidden');
          }
        });
      };

      ProjectView.prototype.onRender = function() {
        this._setLinkUrl();
        return this._applyThemeStyling();
      };

      ProjectView.prototype.onBeforeDestroy = function() {
        if (this.attributionView != null) {
          return this.attributionView.destroy();
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
        App.currentThemeColor = this.getColor().replace('0.8', '1.0');
        return Backbone.history.navigate(href, {
          trigger: true
        });
      };

      ProjectView.prototype._applyThemeStyling = function() {
        if (this.model.get('project_template_id') === "1") {
          this.$el.addClass('atl__project--explainer');
        }
        if (this.model.get('is_section_overview') === 'Yes') {
          return this.$el.addClass('atl__project--overview');
        }
      };

      ProjectView.prototype._setLinkUrl = function() {
        return this.$el.attr('href', this.model.get('atlas_url'));
      };

      ProjectView.prototype.applyBackgroundColor = function() {
        var color;
        color = this.getColor();
        this.$('.atl__project__text').css('background-color', color);
        return App.commands.execute('set:header:strip:color', {
          color: color
        });
      };

      ProjectView.prototype.removeBackgroundColor = function() {
        this.$('.atl__project__text').css('background-color', '');
        return App.commands.execute('set:header:strip:color', 'none');
      };

      ProjectView.prototype.getColor = function() {
        var color, index;
        index = this.model.collection.indexOf(this.model);
        return color = App.CSS.Colors.toRgba(modulo(index, 15), 0.8);
      };

      ProjectView.prototype.addBackgroundImage = function(datum, i) {
        var url;
        url = "url('data:image/png;base64," + (datum.encoded_image.replace(/(\r\n|\n|\r)/gm, "")) + "')";
        this.$('.atl__project__background').css('background-image', url);
        return this.$('.atl__project__background__initials').fadeOut();
      };

      ProjectView.prototype.appendBackgroundImageAttribution = function(datum) {
        var $html, credit, linkHtml;
        credit = datum.image_credit;
        if (credit != null) {
          $html = $(marked(credit));
          $html.find('a').attr('target', '_blank');
          linkHtml = $html.html();
          this.attributionView = new App.Base.AttributionView({
            model: new Backbone.Model({
              linkHtml: linkHtml
            })
          });
          this.attributionView.render();
          return this.$el.append(this.attributionView.$el);
        }
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
        this.listenTo(App.vent, 'project:filter:change', this._filterCollection);
        return this.on('render:collection', this._filterCollection);
      };

      ProjectsView.prototype.onShow = function() {
        return this._addImages();
      };

      ProjectsView.prototype._filterCollection = function() {
        var projectSections, projectTemplates;
        projectSections = App.reqres.request('project:section:entities');
        projectTemplates = App.reqres.request('project:template:entities');
        return this.collection.filter(projectSections, projectTemplates);
      };

      ProjectsView.prototype._addImages = function() {
        return $.ajax({
          url: 'api/v1/projects/image',
          type: 'get',
          success: (function(_this) {
            return function(data) {
              var dataWithImage, datum, j, len;
              dataWithImage = [];
              for (j = 0, len = data.length; j < len; j++) {
                datum = data[j];
                if (datum.encoded_image != null) {
                  dataWithImage.push(datum);
                }
              }
              return _this.children.each(function(child) {
                var atlas_url, index, k, len1, results;
                atlas_url = child.model.get('atlas_url');
                index = 0;
                results = [];
                for (k = 0, len1 = dataWithImage.length; k < len1; k++) {
                  datum = dataWithImage[k];
                  index += 1;
                  if (datum.atlas_url === atlas_url) {
                    child.addBackgroundImage(datum, index);
                    results.push(child.appendBackgroundImageAttribution(datum, index));
                  } else {
                    results.push(void 0);
                  }
                }
                return results;
              });
            };
          })(this)
        });
      };

      return ProjectsView;

    })(Marionette.CollectionView);
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Explainer', function(Explainer, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    return this.on('start', function() {
      var model;
      model = App.currentProjectModel;
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
      getReactView: function() {
        var c, coll, id, model;
        model = App.currentProjectModel;
        id = model.get('id');
        coll = App.reqres.request('project:entities', {
          queryString: "related_to=" + id,
          cache: false
        });
        return c = React.createElement(Comp.Projects.Show.Explainer, {
          model: model,
          collection: coll
        });
      },
      getRootView: function() {
        var view;
        view = new Explainer.RootView({
          model: App.currentProjectModel
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
        this._setStickyNavLayout();
        return this._setThemeColor();
      },
      onBeforeDestroy: function() {
        if (this.chartManager != null) {
          this.chartManager.destroy();
        }
        if (this.tocView != null) {
          return this.tocView.destroy();
        }
      },
      _setThemeColor: function() {
        var $bg, color;
        $bg = this.$('.atl__title-bar__background');
        color = App.currentThemeColor;
        if (color != null) {
          return $bg.css('background-color', color);
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
        this.tocView = new TocView({
          el: $('#atl__toc__list ul')
        });
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
    var setItemEventListeners;
    this.startWithParent = false;
    Tilemap.submoduleKeys = ['Filter', 'Search', 'Legend', 'Info', 'Headline', 'Map', 'InfoBox', 'Popup'];
    setItemEventListeners = (function(_this) {
      return function() {
        var items, setHeaderStripColor;
        items = App.reqres.request('item:entities');
        setHeaderStripColor = function() {
          var cls, filter, hoveredItem, i;
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
        _this.listenTo(App.vent, 'item:activate', function(modelOrId) {
          return items.setActive(modelOrId);
        });
        _this.listenTo(App.vent, 'item:deactivate', function() {
          return items.setActive(-1);
        });
        _this.listenTo(App.vent, 'item:mouseover', function(modelOrId) {
          items.setHovered(modelOrId);
          return setHeaderStripColor();
        });
        return _this.listenTo(App.vent, 'item:mouseout', function() {
          items.setHovered(-1);
          return setHeaderStripColor();
        });
      };
    })(this);
    this.on('start', function() {
      setItemEventListeners();
      this.Controller.showMainView();
      return this.Controller.startSubmodules();
    });
    return this.on('stop', function() {
      return this.stopListening();
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
        this.listenTo(App.vent, 'subview:ready', function(subviewHash) {
          var key, results, value;
          results = [];
          for (key in subviewHash) {
            value = subviewHash[key];
            results.push(this.getRegion(key).show(value));
          }
          return results;
        });
        $(window).on('resize', this.collapseIfSettingsBarIsOverflowing.bind(this));
        this.listenTo(App.vent, 'show:component:ready', this.collapseIfSettingsBarIsOverflowing.bind(this));
        return App.reqres.setHandler('is:settings:bar:overflowing', (function(_this) {
          return function() {
            return _this.isSettingsBarOverflowing();
          };
        })(this));
      },
      onBeforeDestroy: function() {
        return $(window).off('resize', this.collapseIfSettingsBarIsOverflowing.bind(this));
      },
      filterHeight: 0,
      headlineHeight: 0,
      headerHeight: 0,
      isSettingsBarOverflowing: function() {
        var availableHeight, space, tolerance, useHeight;
        tolerance = 60;
        useHeight = this._getFilterHeight() + this._getHeadlineHeight() + this._getHeaderHeight() + tolerance;
        availableHeight = $(window).height();
        space = availableHeight - useHeight;
        return space < 0;
      },
      collapseIfSettingsBarIsOverflowing: function() {
        if (this.isSettingsBarOverflowing()) {
          return $('.atl').addClass('atl--collapsed');
        } else if (!App.uiState.isCollapsed) {
          return $('.atl').removeClass('atl--collapsed');
        }
      },
      _getFilterHeight: function() {
        return this._getHeight($('.atl__filter'), 'filter');
      },
      _getHeadlineHeight: function() {
        return this._getHeight($('.atl__headline'), 'headline');
      },
      _getHeaderHeight: function() {
        return this._getHeight($('#header'), 'header');
      },
      _getHeight: function($el, name) {
        var currentHeight, height;
        currentHeight = $el.height();
        if (this[name + 'Height'] == null) {
          this[name + 'Height'] = 0;
        }
        if (this[name + 'Height'] < currentHeight) {
          height = this[name + 'Height'] = currentHeight;
        } else {
          height = this[name + 'Height'];
        }
        return height;
      },
      regions: {
        infoBox: '#atl__info-box',
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
  this.Atlas.module('Projects.Show.Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      return this.Controller.show();
    });
    return this.on('stop', function() {
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    return Headline.Controller = {
      show: function() {
        Headline.rootView = this.getRootView();
        Headline.rootView.render();
        return App.vent.trigger('show:component:ready');
      },
      destroy: function() {
        return Headline.rootView.destroy();
      },
      getRootView: function() {
        var rootView;
        rootView = new Headline.RootView({
          el: '.atl__headline',
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
      className: 'atl__headline',
      events: {
        'click .link': 'openInfoBox',
        'click .atl__headline__title': 'openInfoBox'
      },
      openInfoBox: function() {
        return App.commands.execute('activate:info:box');
      }
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
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module("Projects.Show.Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    return Filter.Controller = {
      show: function() {
        var filter;
        filter = this._buildFilter();
        Filter.rootView = new Filter.RootView({
          el: '.atl__filter',
          model: filter
        });
        Filter.filter = filter;
        Filter.keysView = this.getKeysView();
        Filter.valuesView = this.getValuesView();
        Filter.rootView.render();
        App.vent.trigger('show:component:ready');
        Filter.rootView.getRegion('keys').show(Filter.keysView);
        return Filter.rootView.getRegion('values').show(Filter.valuesView);
      },
      destroy: function() {
        Filter.filter.stopListening();
        return Filter.rootView.destroy();
      },
      _buildFilter: function() {
        var data, filters, items, model, variables;
        model = App.currentProjectModel;
        data = model.get('data');
        items = data.items;
        variables = data.variables;
        filters = data.filters;
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
        var display_title, formatters, long_description, nd, o, short_description, type, variable, variable_id;
        formatters = App.Util.formatters;
        variable = filter.getVariableModel(variables);
        variable_id = variable.get('id');
        display_title = variable.get('display_title');
        short_description = variable.get('short_description');
        long_description = variable.getMarkdownHtml('long_description');
        type = filter.get('type');
        o = {
          variable_id: variable_id,
          display_title: display_title,
          short_description: short_description,
          long_description: long_description,
          type: filter.get(type),
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
      templateHelpers: App.Util.formatters,
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
      className: 'atl__filter__values',
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
      className: 'atl__filter__keys',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_keys',
      childView: Filter.KeyView,
      childViewContainer: 'ul'
    });
    return Filter.RootView = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl__filter',
      template: 'projects/show/project_templates/tilemap/submodules/filter/templates/root',
      regions: {
        keys: '#atl__filter__keys',
        values: '#atl__filter__values'
      }
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
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.Controller = {
      show: function() {
        Info.rootView = this.getRootView();
        return Info.rootView.render();
      },
      destroy: function() {
        return Info.rootView.destroy();
      },
      getRootView: function() {
        var filter, items, model, view;
        filter = App.reqres.request('filter');
        items = App.reqres.request('item:entities');
        model = new Info.Model();
        model.update(filter, items);
        view = new Info.RootView({
          el: '.atl__info',
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
      this.listenTo(App.vent, 'item:activate', this.Controller.updateAndReveal.bind(this.Controller));
      return App.commands.setHandler('activate:info:box', this.Controller.updateAndReveal.bind(this.Controller));
    });
    return this.on('stop', function() {
      this.stopListening();
      return this.Controller.destroy();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    return InfoBox.Controller = {
      create: function() {
        InfoBox.rootView = this._getRootView();
        return InfoBox.rootView.render();
      },
      updateAndReveal: function() {
        this.update();
        return this.reveal();
      },
      update: function() {
        this.destroy();
        this._ensureContainer();
        return this.create();
      },
      reveal: function() {
        return InfoBox.rootView.reveal();
      },
      hide: function() {
        InfoBox.rootView.hide();
        return App.vent.trigger('item:deactivate');
      },
      destroy: function() {
        if (InfoBox.rootView != null) {
          return InfoBox.rootView.destroy();
        }
      },
      _ensureContainer: function() {
        var $atl;
        $atl = $('.atl__main');
        if ($atl.find('.atl__info-box').length === 0) {
          return $atl.append('<div class="atl__info-box"></div>');
        }
      },
      _getRootView: function() {
        var rootView;
        rootView = new InfoBox.RootView({
          model: this._getModel().model,
          collection: this._getModel().collection,
          el: '.atl__info-box'
        });
        return rootView;
      },
      _getModel: function() {
        var activeItem, model;
        activeItem = App.reqres.request('item:entities').active;
        model = InfoBox.getModelObject(activeItem);
        return model;
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    var getSectionHtml;
    InfoBox.SectionsCollection = Backbone.Collection.extend();
    InfoBox.Model = App.Models.BaseModel.extend({
      defaults: {
        name: 'General Project Info'
      }
    });
    InfoBox.getModelObject = function(item) {
      var collectionData, model;
      model = item != null ? item : App.currentProjectModel;
      collectionData = item != null ? this.getItemSectionsCollection(item) : void 0;
      return {
        model: model,
        collection: collectionData != null ? new InfoBox.SectionsCollection(collectionData) : void 0
      };
      return new InfoBox.Model(modelData);
    };
    InfoBox.getItemSectionsCollection = function(item) {
      var infoBoxSections, sections, variables;
      infoBoxSections = App.reqres.request('info:box:section:entities');
      variables = App.reqres.request('variable:entities');
      return sections = _.map(infoBoxSections.models, function(infoBoxSection) {
        var obj, sectionTitle, text, variable, variableId;
        variableId = infoBoxSection.get('variable_id');
        variable = variables.findWhere({
          id: variableId
        });
        sectionTitle = variable != null ? variable.get('display_title') : "Section";
        text = item.get(variableId);
        obj = {
          heading: sectionTitle,
          text: getSectionHtml(text)
        };
        return obj;
      });
    };
    return getSectionHtml = function(raw) {
      var formatters, html;
      if ((raw == null) || _.isArray(raw)) {
        return raw;
      }
      if (_.isNumber(raw)) {
        return raw.toString();
      }
      html = marked(raw);
      formatters = App.Util.formatters;
      return formatters.htmlToHtml(html);
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
      events: {
        'click a': 'triggerScroll'
      },
      triggerScroll: function(e) {
        return App.vent.trigger('scroll');
      },
      isEmpty: function() {
        return this.$el.children().length < 2;
      }
    });
    return InfoBox.RootView = Marionette.ItemView.extend({
      initialize: function() {
        return this.listenTo(App.vent, 'scroll', function() {
          return this._setStickyNavLayout();
        });
      },
      tagName: 'div',
      className: 'atl__info-box fill-parent',
      template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/root',
      events: {
        'click .atl__info-box__close': 'purgeView'
      },
      templateHelpers: App.Util.formatters,
      getCollectionHtml: function() {
        var html;
        if (this.collection != null) {
          html = "";
          this.collection.each((function(_this) {
            return function(model) {
              var view;
              view = new InfoBox.SectionView({
                model: model
              });
              view.render();
              return html += view.el.innerHTML;
            };
          })(this));
          return html;
        }
      },
      onRender: function() {
        this.$('.static-content').html(this.getCollectionHtml());
        this._buildToc();
        this._setStickyNavLayout();
        this._setImage();
        if (this.collection == null) {
          return this._setThemeBackground();
        }
      },
      onBeforeDestroy: function() {
        if (this.attributionView != null) {
          this.attributionView.destroy();
        }
        if (this.tocView != null) {
          return this.tocView.destroy();
        }
      },
      reveal: function() {
        var $app;
        $app = $('.atl');
        $app.addClass('atl__info-box--active');
        return this;
      },
      hide: function() {
        var $app;
        $app = $('.atl');
        $app.removeClass('atl__info-box--active');
        return this;
      },
      hideAndDestroy: function() {
        var $app;
        $app = $('.atl');
        $app.removeClass('atl__info-box--active');
        $app.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (function(_this) {
          return function(e) {
            return _this.destroy();
          };
        })(this));
        return this;
      },
      purgeView: function() {
        return InfoBox.Controller.hide();
      },
      showAttributionLink: function(e) {
        return $(e.target).toggleClass('atl__attribution--active');
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
        this.tocView = new TocView({
          el: $('#atl__toc__list ul')
        });
        if (this.tocView.isEmpty()) {
          return $('.atl__toc').hide();
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
      _setImage: function() {
        var $el, imageName, img;
        $el = this.$('.atl__title-bar__background');
        $el.css('background-color', 'rgba(50, 50, 50, 0.1)');
        if (!((this.model != null) && (this.model.getImageName != null))) {
          return;
        }
        imageName = this.model.getImageName();
        if (imageName != null) {
          img = App.reqres.request('image:entity', {
            name: imageName
          });
          return img.on('sync', (function(_this) {
            return function() {
              var backgroundImageCss;
              backgroundImageCss = img.getBackgroundImageCss();
              if (backgroundImageCss != null) {
                $el.css('background-color', 'initial');
                $el.css('background-image', backgroundImageCss);
                return _this._appendImageAttribution(img.getAttributionHtml());
              }
            };
          })(this));
        }
      },
      _appendImageAttribution: function(html) {
        var view;
        view = new App.Base.AttributionView({
          model: new Backbone.Model({
            linkHtml: html
          })
        });
        view.render();
        $('.atl__title-bar').append(view.$el);
        return this.attributionView = view;
      },
      _setThemeBackground: function() {
        var $bg, $titleBar, color;
        $titleBar = this.$('.atl__title-bar');
        $bg = this.$('.atl__title-bar__background');
        $titleBar.removeClass('atl__title-bar--image');
        $titleBar.addClass('atl__title-bar--solid');
        color = App.currentThemeColor;
        if (color != null) {
          return $bg.css('background-color', color);
        } else {
          return $bg.css('background-color', '');
        }
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.Controller.show();
      return App.reqres.setHandler('legend:value:hovered', function() {
        return Legend.valueHoverIndex;
      });
    });
    return this.on('stop', function() {
      App.reqres.removeHandler('legend:value:hovered');
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    return Legend.Controller = {
      show: function() {
        Legend.rootView = this.getRootView();
        return Legend.rootView.render();
      },
      destroy: function() {
        return Legend.rootView.destroy();
      },
      getRootView: function() {
        var coll, filter, rootView;
        filter = App.reqres.request('filter');
        coll = new Backbone.Collection(filter.getActiveChild().children);
        rootView = new Legend.RootView({
          collection: coll,
          el: '.atl__legend'
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
      onRender: function() {
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
    return Legend.RootView = Marionette.CompositeView.extend({
      tagName: 'div',
      className: 'atl__legend',
      template: 'projects/show/project_templates/tilemap/submodules/legend/templates/root',
      childView: Legend.IconView,
      childViewContainer: 'ul',
      initialize: function() {
        this.listenTo(App.vent, 'value:click', this.setActiveState);
        this.listenTo(App.vent, 'item:mouseover item:mouseout value:mouseover value:mouseout', this.setHighlighting);
        return this.listenTo(App.vent, 'key:click', function() {
          var filter;
          filter = App.reqres.request('filter');
          return this.collection.reset(filter.getActiveChild().children);
        });
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
  this.Atlas.module('Projects.Show.Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.listenTo(App.vent, 'item:mouseover', this.Controller.create);
      this.listenTo(App.vent, 'item:mouseout', this.Controller.destroy);
      return App.commands.setHandler('destroy:popup', (function(_this) {
        return function() {
          return _this.Controller.destroy();
        };
      })(this));
    });
    return this.on('stop', function() {
      App.commands.removeHandler('destroy:popup');
      this.Controller.destroy();
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
          return Popup.rootView.render();
        }
      },
      destroy: function() {
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
        this._ensureContainer();
        rootView = new Popup.RootView({
          model: hoveredItem,
          el: '.atl__popup'
        });
        return rootView;
      },
      _ensureContainer: function() {
        var $atl;
        $atl = $('.atl__main');
        if ($atl.find('.atl__popup').length === 0) {
          return $atl.append('<div class="atl__popup"></div>');
        }
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
      onRender: function() {
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
        this.$loading = $("<div class='loading-icon'><div>Loading...</div></div>");
        $('.atl__main').append(this.$loading);
        return this.fetchScript(global, '/assets/vendor/d3.min.js', this.showOverlay.bind(this));
      },
      showOverlay: function() {
        return this.renderOverlayView();
      },
      renderOverlayView: function() {
        var View, itemType, items, launch;
        items = App.reqres.request('item:entities');
        itemType = items.getItemType();
        View = itemType === 'state' ? Map.PathOverlayView : Map.PindropOverlayView;
        launch = function(baseGeoData) {
          var coll;
          coll = items.getRichGeoJson(baseGeoData);
          return coll.onReady(function() {
            var overlayView;
            overlayView = new View();
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
        data = App['us-states-10m'];
        if (data != null) {
          return next(data);
        } else {
          return $.ajax({
            url: '/data/us-states-10m.js',
            dataType: 'script',
            success: function() {
              return next(App['us-states-10m']);
            }
          });
        }
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
            items = App.reqres.request('item:entities');
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
        html = Marionette.Renderer.render('projects/show/project_templates/tilemap/templates/zoom_bar', {});
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
  this.Atlas.module('Projects.Show.Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function() {
      this.Controller.show();
      App.searchTerm = "";
      return App.reqres.setHandler('search:term', function() {
        return App.searchTerm;
      });
    });
    return this.on('stop', function() {
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show.Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    return Search.Controller = {
      show: function() {
        Search.view = new App.Base.SearchView({
          el: $('.atl__search'),
          model: new Backbone.Model({
            placeholder: 'Search Project'
          })
        });
        return Search.view.render();
      },
      destroy: function() {
        return Search.view.destroy();
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
        Map.map.ignoreNextClick = false;
        return this.activeFeature = feature;
      };

      OverlayBaseView.prototype.onRender = function() {
        return $('.loading-icon').remove();
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
          cls = model.getLayerClasses(filter, valueHoverIndex, searchTerm, baseClass, App.currentDisplayMode);
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

      PathOverlayView.prototype.renderSvgContainer = function() {
        this.svg = d3.select(Map.map.getPanes().overlayPane).append('svg').attr('class', 'deethree');
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
        this.onRender();
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
        return new Index.ProjectsView({
          collection: projects
        });
      },
      getProjectSectionsView: function() {
        var projectSections;
        projectSections = App.request("project:section:entities", {
          cache: true
        });
        return new Index.ProjectSectionsView({
          collection: projectSections
        });
      },
      getProjectTemplatesView: function() {
        var projectTemplates;
        projectTemplates = App.request("project:template:entities", {
          cache: true
        });
        return new Index.ProjectTemplatesView({
          collection: projectTemplates
        });
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Index', function(Index, App, Backbone, Marionette, $, _) {
    Index.SideBarView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__side-bar fill-parent',
      template: 'projects/index/templates/side_bar'
    });
    return Index.RootView = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl fill-parent',
      template: 'projects/index/templates/root',
      childViewContainer: '.project-container',
      regions: {
        banner: '#atl__nav',
        projects: '#atl__projects',
        sideBar: '#atl__side-bar'
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Projects.Show', function(Show, App, Backbone, Marionette, $, _) {
    this.startWithParent = false;
    this.on('start', function(atlas_url) {
      var project, setDataRequestHandlers;
      App.currentDisplayMode = 'filter';
      Show.Controller.show();
      App.commands.setHandler('change:display:mode', function(mode) {
        App.currentDisplayMode = mode;
        return App.vent.trigger('display:mode:change');
      });
      setDataRequestHandlers = function(project) {
        var data;
        data = project.get('data');
        if (data != null) {
          App.reqres.setHandler('filter:entities', function() {
            return data.filters;
          });
          App.reqres.setHandler('info:box:section:entities', function() {
            return data.infobox_variables;
          });
          App.reqres.setHandler('variable:entities', function() {
            return data.variables;
          });
          return App.reqres.setHandler('item:entities', (function(_this) {
            return function(query) {
              var id;
              if (data.items != null) {
                if (_.isObject(query)) {
                  return data.items.findWhere(query);
                }
                if (query != null) {
                  id = parseInt(query, 10);
                  return data.items.findWhere({
                    id: id
                  });
                }
              }
              return data.items;
            };
          })(this));
        }
      };
      project = App.reqres.request('project:entity', {
        atlas_url: atlas_url
      });
      project.on('sync', (function(_this) {
        return function() {
          var templateName;
          if (project.exists()) {
            App.vent.trigger('current:project:change', project);
            templateName = project.get('project_template_name');
            project.buildData();
            setDataRequestHandlers(project);
            return Show[templateName].start();
          } else {
            return Backbone.history.navigate('welcome', {
              trigger: true
            });
          }
        };
      })(this));
      return this;
    });
    this.on('stop', function() {
      this.stopListening();
      return App.vent.trigger('current:project:change', void 0);
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
        return new Show.SideBarView({
          model: App.currentProjectModel
        });
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
      initialize: function() {
        return this.listenTo(App.vent, 'current:project:change', function(project) {
          this.model = project;
          return this.updateLinkUrl();
        });
      },
      tagName: 'div',
      className: 'atl__side-bar fill-parent',
      template: 'projects/show/templates/side_bar',
      events: {
        'click .atl__side-bar__icon': 'navigate'
      },
      navigate: function(e) {
        var $target, entity, method, tagName;
        $target = $(e.target);
        tagName = $target.prop('tagName').toLowerCase().trim();
        if (tagName === 'form' || tagName === 'input') {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        entity = $(e.currentTarget).attr('data-method');
        method = this["_" + entity].bind(this);
        if (method != null) {
          return method(e);
        }
      },
      _projects: function() {
        return Backbone.history.navigate('menu', {
          trigger: true
        });
      },
      _edit: function() {
        var url;
        Backbone.history.navigate('');
        url = App.currentProjectModel.buildUrl();
        return window.location.href = url;
      },
      _collapse: function(e) {
        var $target, cannotExpand, isCollapsed;
        isCollapsed = App.uiState.isCollapsed || $('.atl').hasClass('atl--collapsed');
        cannotExpand = App.reqres.request('is:settings:bar:overflowing');
        if (!(isCollapsed && cannotExpand)) {
          App.uiState.isCollapsed = !App.uiState.isCollapsed;
          $('.atl').toggleClass('atl--collapsed');
          $target = $(e.target);
          if ($target.hasClass('atl__side-bar__icon')) {
            $target = $($target.children()[0]);
          }
          return $target.toggleClass('bg-img-expand--off-white');
        }
      },
      _help: function(e) {
        return $('.atl').toggleClass('atl--help');
      },
      _print: function() {
        return window.print();
      },
      updateLinkUrl: function() {
        if (this.model != null) {
          return this.$('input[type=hidden]').attr('value', this.model.get('atlas_url'));
        }
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
        'click #atl__set-filter-display': 'setFilterDisplay',
        'click #atl__set-search-display': 'setSearchDisplay'
      },
      initialize: function() {
        return this.listenTo(App.vent, 'current:project:change', function(project) {
          this.model = project;
          this.setTemplateNameModifierClass();
          return this.setInfoBoxModifierClass();
        });
      },
      setTemplateNameModifierClass: function() {
        if (this.model != null) {
          return this.$el.addClass('atl--' + this.model.get('project_template_name').toLowerCase());
        }
      },
      setInfoBoxModifierClass: function() {
        var data;
        if (this.model != null) {
          data = this.model.get('data');
          if (data != null) {
            if (data.infobox_variables.length < 2) {
              return this.$el.addClass('atl__info-box--narrow');
            }
          }
        }
      },
      setFilterDisplay: function(e) {
        e.preventDefault();
        $('.atl').removeClass('atl--search-display').addClass('atl--filter-display');
        $('#atl__set-search-display').removeClass('atl__binary-toggle__link--active');
        $('#atl__set-filter-display').addClass('atl__binary-toggle__link--active');
        return App.commands.execute('change:display:mode', 'filter');
      },
      setSearchDisplay: function(e) {
        e.preventDefault();
        $('.atl').removeClass('atl--filter-display').addClass('atl--search-display');
        $('#atl__set-filter-display').removeClass('atl__binary-toggle__link--active');
        $('#atl__set-search-display').addClass('atl__binary-toggle__link--active');
        return App.commands.execute('change:display:mode', 'search');
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('About', function(About, App, Backbone, Marionette, $, _) {
    var el;
    this.startWithParent = false;
    el = $('#atl')[0];
    this.on('start', function() {
      var c;
      c = React.createElement(Comp.About, {
        app: App
      });
      return React.render(c, el);
    });
    return this.on('stop', function() {
      React.unmountComponentAtNode(el);
      return this.stopListening();
    });
  });

}).call(this);
