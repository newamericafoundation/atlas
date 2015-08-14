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
      App.dataCache = {};
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
    Router.actions = ['welcome_index', 'projects_index', 'projects_show', 'about_index', 'dashboard_index'];
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
        'about': 'about_index',
        'menu': 'projects_index',
        'show': 'projects_show',
        ':atlas_url': 'projects_show',
        '*notFound': 'welcome_index'
      },
      renderReactLayout: function(opt) {
        var c, el;
        if (opt == null) {
          opt = {};
        }
        el = $('body')[0];
        opt.App = App;
        c = React.createElement(Comp.Layout, opt);
        return React.render(c, el);
      },
      renderReactCustomLayout: function(opt) {
        var c, el;
        if (opt == null) {
          opt = {};
        }
        el = $('body')[0];
        opt.App = App;
        c = React.createElement(Comp.Dashboard, opt);
        return React.render(c, el);
      },
      navigate: function(url, options) {
        if (options == null) {
          options = {
            trigger: true
          };
        }
        if (options.trigger == null) {
          options.trigger = true;
        }
        return Backbone.history.navigate(url, options);
      },
      welcome_index: function(param) {
        Backbone.history.navigate('/welcome', {
          trigger: false
        });
        this._initiateNavigation('welcome_index', param);
        return this.renderReactLayout({
          route: 'welcome_index',
          theme: 'none',
          headerTitle: 'New America',
          routableComponentName: 'Welcome'
        });
      },
      about_index: function(param) {
        this._initiateNavigation('about_index');
        return this.renderReactLayout({
          route: 'about_index',
          headerTitle: 'Atlas',
          routableComponentName: 'About'
        });
      },
      projects_index: function(param) {
        this._initiateNavigation('projects_index', param);
        return this.renderReactLayout({
          route: 'projects_index',
          theme: 'atlas',
          headerTitle: 'Atlas',
          routableComponentName: 'Projects.Index'
        });
      },
      projects_show: function(atlas_url, param) {
        if (param == null) {
          param = {};
        }
        atlas_url = this._getAtlasUrl(atlas_url);
        param.atlas_url = atlas_url;
        App.currentAtlasUrl = atlas_url;
        this._initiateNavigation('projects_show', param);
        return this.renderReactLayout({
          route: 'projects_show',
          theme: 'atlas',
          headerTitle: 'Atlas',
          routableComponentName: 'Projects.Show'
        });
      },
      dashboard_index: function() {
        this._initiateNavigation('dashboard_index');
        return this.renderReactCustomLayout({
          route: 'dashboard_index',
          theme: 'naf',
          isInternal: true,
          headerTitle: 'My New America'
        });
      },
      _getAtlasUrl: function(atlas_url) {
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
        return atlas_url;
      },
      _initiateNavigation: function(action, params) {
        this.history.add(action, params);
        App.vent.trigger('router:current:action:change', this.history.getCurrentActionIndex());
        $('body').attr('class', 'atl-route--' + action);
        return App.commands.execute('set:header:strip:color');
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
  this.Atlas.module('CSS', function(CSS, App, Backbone, Marionette, $, _) {
    CSS.Colors = {
      _list: [[133, 2, 106], [138, 1, 135], [140, 2, 165], [129, 10, 166], [118, 18, 167], [106, 23, 167], [93, 43, 171], [79, 56, 173], [77, 72, 177], [73, 87, 182], [67, 102, 186], [58, 116, 191], [44, 130, 195], [11, 144, 199], [50, 161, 217]],
      _hash: {},
      get: function(index) {
        return this._list[index];
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
        var color;
        if ((index != null) && (this.get(index) != null)) {
          color = "rgb(" + (this.get(index).join(',')) + ")";
        }
        return color;
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
      currency: function(v) {
        var formatter;
        if (typeof numeral === "undefined" || numeral === null) {
          return v;
        }
        formatter = v > 999 ? '($0a)' : '($0)';
        return numeral(v).format(formatter);
      },
      number: function(v) {
        var formatter;
        if (typeof numeral === "undefined" || numeral === null) {
          return v;
        }
        formatter = v > 99999 ? '(0a)' : '(0)';
        return numeral(v).format(formatter);
      },
      percent: function(v) {
        return v + '%';
      },
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

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var base = require('./base.js'),
    baseFilter = require('./base_filter.js'),
    coreDatum = './core_datum.js',
    filter = require('./filter.js'),
    image = require('./image.js'),
    infoBoxSection = require('./info_box_section.js'),
    item = require('./item.js'),
    project = require('./project.js'),
    projectSection = require('./project_section.js'),
    projectTemplate = require('./project_template.js'),
    researcher = require('./researcher.js'),
    richGeoFeature = require('./rich_geo_feature.js'),
    variable = require('./variable.js');

window.Atlas.module('Models', function (Models) {

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

},{"./base.js":2,"./base_filter.js":4,"./filter.js":5,"./image.js":6,"./info_box_section.js":7,"./item.js":8,"./project.js":9,"./project_section.js":10,"./project_template.js":11,"./researcher.js":12,"./rich_geo_feature.js":13,"./variable.js":14}],2:[function(require,module,exports){
'use strict';

var Backbone = window.Backbone,
    _ = window._,
    $ = window.$;

exports.Model = Backbone.Model.extend({

	/** 
  * Recognize and process data.
  * @param {object} data - Data as key-value pairs.
  * @returns {object} data - Modified data.
  */
	parse: function parse(data) {
		data = this._adaptMongoId(data);
		return data;
	},

	/**
  * Adds fields of a foreign collection, referenced by a foreign id within the model.
  * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
  *                                  the former references a single value, the latter an array.
  * @param {object} foreignCollection
  * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
  * @returns {object} this - The model instance, with 'model_name' field added.
  */
	addForeignField: function addForeignField(foreignIdKey, foreignCollection, fieldKey) {

		var newKey,
		    foreignModel,
		    foreignIds,
		    foreignId,
		    singleForeignIdKey,
		    // if foreignIdKey holds an array
		foreignFields = [],
		    i,
		    max;

		if (foreignIdKey.slice(-2) === 'id') {
			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({ id: this.get(foreignIdKey) });
			this.set(newKey, foreignModel.get(fieldKey));
		} else if (foreignIdKey.slice(-3) === 'ids') {
			foreignIds = this.get(foreignIdKey);
			for (i = 0, max = foreignIds.length; i < max; i += 1) {
				foreignId = foreignIds[i];
				// simple pluralization
				newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
				foreignModel = foreignCollection.findWhere({ id: foreignId });
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey));
				}
			}
			this.set(newKey, foreignFields);
		}

		return this;
	},

	/**
  * Finds and replaces key.
  * @param {object} data - Data as key-value pairs.
  * @param {string} standardKey
  * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
  * @returns {boolean} found - Whether the key is found in the data.
  */
	_findAndReplaceKey: function _findAndReplaceKey(data, standardKey, keyFormatList) {
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

	/**
  * Adapts Mongoid ID.
  * @param {object} data - Data as key-value pairs.
  * @returns {object} data - Modified data.
  */
	_adaptMongoId: function _adaptMongoId(data) {
		if (data._id != null) {
			if (data._id.$oid != null) {
				data.id = String(data._id.$oid);
			} else {
				data.id = String(data._id);
			}
			delete data._id;
		} else if (data.id != null && data.id.$oid != null) {
			data.id = String(data.id.$oid);
		}
		return data;
	},

	/**
  * Remove the array wrapper, if response is one-member array.
  * @param {object} resp - Server resonse.
  * @returns {object} resp - Modified response.
  */
	_removeArrayWrapper: function _removeArrayWrapper(resp) {
		if (_.isArray(resp) && resp.length === 1) {
			resp = resp[0];
		}
		return resp;
	},

	/**
  * Remove all line breaks from field.
  * @param {object} resp - Server response.
  * @param {string} key - Response key.
  * @returns {object} resp - Modified response.
  */
	_removeLineBreaks: function _removeLineBreaks(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
		}
		return resp;
	},

	/**
  * Removes all spaces from field.
  * @param {object} resp - Server response.
  * @param {string} key - Response key.
  * @returns {object} resp - Modified response.
  */
	_removeSpaces: function _removeSpaces(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/\s+/g, '');
		}
		return resp;
	},

	/**
  * Process static html on a key.
  * @param {object} resp - Server response.
  * @param {string} key
  * @returns {object} resp - Modified response.
  */
	_processStaticHtml: function _processStaticHtml(resp, key) {
		var $html, html, newHtml;
		html = resp[key];
		$html = $(html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		resp[key] = newHtml;
		return resp;
	},

	/**
  * Get markdown html.
  * @param {string} key
  * @returns {} newHtml
  */
	getMarkdownHtml: function getMarkdownHtml(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	},

	/**
  * Set table of contents for html data under a given key.
  * @param {string} key
  * @returns {object} this
  */
	setHtmlToc: function setHtmlToc(key) {

		var html, $containedHtml, arr;

		html = this.get(key);
		if (html == null) {
			return;
		}

		arr = [];

		$containedHtml = $('<div></div>').append($(html));

		$containedHtml.children().each(function () {

			var $el = $(this),
			    tagName = $el.prop('tagName'),
			    content = $el.html(),
			    tocId = content.replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();

			if (tagName.toLowerCase == null) {
				return;
			}
			tagName = tagName.toLowerCase();

			if (['h1', 'h2'].indexOf(tagName) > -1) {
				$('<span id="toc-' + tocId + '"></span>').insertBefore($el);
				arr.push({
					id: tocId,
					tagName: tagName,
					content: content
				});
			}
		});

		this.set(key, $containedHtml.html());
		this.set(key + '_toc', arr);
	}

});

exports.Collection = Backbone.Collection.extend({

	model: exports.Model,

	/**
  * Recognize and process server response.
  * @param {object} resp - Server response.
  * @returns {object} resp - Modified response.
  */
	parse: function parse(resp) {
		var i, max, item;
		if (exports.Model.prototype.parse == null) {
			return resp;
		}
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}

});

},{}],3:[function(require,module,exports){
// Compiled from Marionette.Accountant

'use strict';

var Backbone = window.Backbone,
    _ = window._,
    $ = window.$;

exports.Model = Backbone.Model.extend({

    constructor: function constructor() {
        Backbone.Model.apply(this, arguments);
        this.children = [];
        this.doAccounting();
    },

    /*
     * Find key that holds array values within model.
     *
     */
    _getChildrenKey: function _getChildrenKey() {
        var key, ref, value;
        ref = this.attributes;
        for (key in ref) {
            value = ref[key];
            if (_.isArray(value)) {
                return key;
            }
        }
    },

    doAccounting: function doAccounting() {
        var ChildModelConstructor, child, childModel, children, childrenKey, i, j, len, max, results;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            max = children.length;
            results = [];
            for (i = j = 0, len = children.length; j < len; i = ++j) {
                child = children[i];
                childModel = new ChildModelConstructor(child);
                childModel.parent = this;
                childModel.set('_index', i);
                results.push(this.children.push(childModel));
            }
            return results;
        }
    },

    /*
     * Separate 
     */
    createModelTree: function createModelTree() {
        var self = this,
            ChildModelConstructor,
            childModel,
            children,
            childrenKey;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            children.forEach(function (child, i) {
                var childModel = new ChildModelConstructor(child);
                childModel.parent = self;
                childModel.set('_index', i);
                self.children.push(childModel);
            });
        }
    },

    toJSON: function toJSON() {
        return Backbone.Model.prototype.toJSON.apply(this);
    },

    toNestedJSON: function toNestedJSON() {
        var child, childrenKey, j, json, len, nestedJson, ref;
        json = this.toJSON();
        if (typeof json['_index'] !== 'undefined') {
            delete json['_index'];
        }
        if (this.children) {
            childrenKey = this.get('_childrenKey');
            json[childrenKey] = [];
            ref = this.children;
            for (j = 0, len = ref.length; j < len; j++) {
                child = ref[j];
                nestedJson = child.toNestedJSON != null ? child.toNestedJSON() : child.toJSON();
                delete nestedJson['_index'];
                json[childrenKey].push(nestedJson);
            }
            delete json['_childrenKey'];
        }
        return json;
    },

    getChildIndex: function getChildIndex() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    },

    getSiblingCount: function getSiblingCount() {
        if (this.parent) {
            return this.parent.children.length;
        }
        return -1;
    },

    getNextSibling: function getNextSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if (ci !== -1 && sc !== -1 && ci < sc) {
            return this.parent.children[ci + 1];
        }
    },

    getPreviousSibling: function getPreviousSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if (ci !== -1 && sc !== -1 && ci > 0) {
            return this.parent.children[ci - 1];
        }
    }

});

},{}],4:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js');

exports.Model = base.Model.extend({

	/** Activates model. Takes no collection filter logic into consideration - hence internal only. */
	activate: function activate() {
		return this.set('_isActive', true);
	},

	/** Deactivates model. Takes no collection filter logic into consideration - hence internal only. */
	deactivate: function deactivate() {
		return this.set('_isActive', false);
	},

	/** Toggle the model's active state. */
	toggleActiveState: function toggleActiveState() {
		if (this.isActive()) {
			if (!(this.collection != null && this.collection.hasSingleActiveChild)) {
				return this.deactivate();
			}
		} else {
			this.activate();
			if (this.collection != null && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	},

	/** Get active state. */
	isActive: function isActive() {
		return this.get('_isActive');
	},

	/** 
  * Tests whether a tested model satisfies a belongs_to relation with the model instance under a specified foreign key. 
  * Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
  * @param {object} testedModel
  * @param {string} foreignKey
  * @returns {boolean}
  */
	test: function test(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) {
			return false;
		}
		id = this.get('id');
		// If there is a single id, test for equality.
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) {
			return id === foreignId;
		}
		// If there are multiple ids, test for inclusion.
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) {
			return foreignIds.indexOf(id) >= 0;
		}
		return false;
	}

});

exports.Collection = base.Collection.extend({

	model: exports.Model,

	/** Initializes active state of the collection's models. */
	initialize: function initialize() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},

	hasSingleActiveChild: false,

	/**
  * Deactivate all siblings of an active child element.
  * @param {} activeChild - Active child model instance from where the method is usually called
  * @returns {array} results
  */
	deactivateSiblings: function deactivateSiblings(activeChild) {
		var i, len, model, ref, results;
		ref = this.models;
		results = [];
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model !== activeChild) {
				results.push(model.deactivate());
			} else {
				results.push(void 0);
			}
		}
		return results;
	},

	/** 
  * Set and initialize active state of the collection's models. 
  * If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
  * Otherwise, all models are set as active. 
  */
	initializeActiveStates: function initializeActiveStates() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : index === 0 ? true : false);
		}
		return this.trigger('initialize:active:states');
	},

	/**
  * 
  * @param {object} testedModel - 
  * @param {string} foreignKey - 
  * @returns {boolean}
  */
	test: function test(testedModel, foreignKey) {
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

},{"./base.js":2}],5:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    baseComposite = require('./base_composite.js');

var LocalBaseModel = baseComposite.Model.extend({

    isActive: function isActive() {
        return this.get('_isActive');
    },

    activate: function activate() {
        this.set('_isActive', true);
        return this;
    },

    deactivate: function deactivate() {
        this.set('_isActive', false);
        return this;
    },

    toggle: function toggle() {
        this.set('_isActive', !this.isActive());
        return this;
    },

    activateAllChildren: function activateAllChildren() {
        this.children.forEach(function (child) {
            child.activate();
        });
        return this;
    },

    deactivateAllChildren: function deactivateAllChildren() {
        this.children.forEach(function (child) {
            child.deactivate();
        });
        return this;
    },

    toggleAllChildren: function toggleAllChildren() {
        this.children.forEach(function (child) {
            child.toggle();
        });
        return this;
    },

    /*
     * Deactivate all siblings, not including self.
     *
     */
    deactivateSiblings: function deactivateSiblings() {
        var self = this,
            siblingsIncludingSelf;
        if (this.parent == null) {
            return;
        }
        siblingsIncludingSelf = this.parent.children;
        siblingsIncludingSelf.forEach(function (sibling) {
            if (sibling !== self) {
                sibling.deactivate();
            }
        });
    },

    /*
     * Get sibling index.
     *
     */
    getSiblingIndex: function getSiblingIndex() {
        var siblingsIncludingSelf = this.parent.children;
        return siblingsIncludingSelf.indexOf(this);
    },

    /* 
     * If every sibling in order got integer indeces between 1 and n, interpolate for instance.
     * @param {number} n - Top friendly integer.
     * @returns {number}
     */
    getFriendlySiblingIndex: function getFriendlySiblingIndex(n) {
        var i = this.getSiblingIndex(),
            max = this.getSiblingCountIncludingSelf();
        return Math.round(i * (n - 1) / (max - 1) + 1);
    },

    getSiblingCountIncludingSelf: function getSiblingCountIncludingSelf() {
        return this.parent.children.length;
    }

});

// Copied from client.

exports.FilterValue = LocalBaseModel.extend({

    test: function test(d, options) {
        var j, key, len, res, val, value;
        if (d == null) {
            return false;
        }
        if (!this.get('_isActive') && !(options != null && options.ignoreState)) {
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

    testValue: function testValue(value) {
        var res;
        res = false;
        if (this._isNumericFilter()) {
            if (value < this.get('max') && value >= this.get('min')) {
                res = true;
            }
        } else {
            if (value === this.get('value')) {
                res = true;
            }
        }
        return res;
    },

    _isNumericFilter: function _isNumericFilter() {
        return this.get('min') != null && this.get('max') != null;
    },

    isParentActive: function isParentActive() {
        return this.parent === this.parent.parent.getActiveChild();
    },

    handleClick: function handleClick() {
        var activeKeyIndex, keyIndex;
        this.toggle();
        keyIndex = this.parent.get('_index');
        return activeKeyIndex = this.parent.parent.get('activeIndex');
    }

});

exports.FilterKey = LocalBaseModel.extend({

    childModel: exports.FilterValue,

    /*
     * Toggle item as it were 'clicked on'. 
     * If the value is being activated, all its siblings need to be deactivated.
     *
     */
    clickToggle: function clickToggle() {
        if (this.isActive()) {
            return;
        } else {
            this.deactivateSiblings();
            this.activate();
        }
    },

    toggleOne: function toggleOne(childIndex) {
        return this.children[childIndex].toggle();
    },

    getValueIndeces: function getValueIndeces(model) {
        var child, data, dataIndeces, i, j, len, ref;
        data = model != null && _.isFunction(model.toJSON) ? model.toJSON() : model;
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

    getValue: function getValue(index) {
        return this.children[index].get('value');
    },

    test: function test(data, options) {
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
    }

});

exports.FilterTree = LocalBaseModel.extend({

    childModel: exports.FilterKey,

    test: function test(data) {
        return this.getActiveChild().test(data);
    },

    setActiveChildByIndex: function setActiveChildByIndex(activeChildIndex) {
        if (this.children[activeChildIndex] !== this.getActiveChild()) {
            this.getActiveChild().deactivate();
            this.children[activeChildIndex].activate();
            return true;
        }
        return false;
    },

    getActiveChild: function getActiveChild() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.isActive()) {
                return child;
            }
        }
    },

    getMatchingValue: function getMatchingValue(model) {
        var ind;
        ind = this.getValueIndeces(model)[0];
        if (this.getActiveChild().children[ind] != null) {
            return this.getActiveChild().children[ind].get('value');
        }
        return void 0;
    },

    getValueCountOnActiveKey: function getValueCountOnActiveKey() {
        return this.getActiveChild().children.length;
    },

    getValueIndeces: function getValueIndeces(model) {
        var ach;
        ach = this.getActiveChild();
        return ach.getValueIndeces(model);
    },

    getFriendlyIndeces: function getFriendlyIndeces(model, scaleMax) {
        var maxIndex, valueIndeces;
        valueIndeces = this.getValueIndeces(model);
        maxIndex = this.getValueCountOnActiveKey();
        return valueIndeces.map(function (valIndex) {
            var friendlyIndex;
            friendlyIndex = Math.round(valIndex * (scaleMax - 1) / (maxIndex - 1) + 1);
            return friendlyIndex;
        });
    },

    getItemListByOption: function getItemListByOption(keyIndex) {
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

},{"./../utilities/formatters.js":15,"./base.js":2,"./base_composite.js":3}],6:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js');

exports.Model = base.Model.extend({

	urlRoot: '/api/v1/images',

	/** 
  * Fetches image model url by name key
  * @returns {string} - Url plus name
  */
	url: function url() {
		return this.urlRoot + ("?name=" + this.get('name'));
	},

	/**
  * Recognize and process server response.
  * @param {object} resp - Server response.
  * @return {object} resp - Modified response.
  */
	parse: function parse(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},

	/** Gets encoded url to use in CSS background-image. */
	getBackgroundImageCss: function getBackgroundImageCss() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},

	/** Gets html attribute. */
	getAttributionHtml: function getAttributionHtml() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});

},{"./base.js":2}],7:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js');

exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});

},{"./base.js":2}],8:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js'),
    rgf = require('./rich_geo_feature.js'),
    states = require('./../../db/seeds/states.json');

var indexOf = [].indexOf || function (item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

/** 
 * @constructor
 * Note on methods toLatLongPoint, toRichGeoJson: these methods assume that the model instance has a lat and long fields. 
 */
exports.Model = base.Model.extend({
	/** 
  * Recognize and process data.
  * @param {object} data
  * @returns {object} data - Modified data.
  */
	parse: function parse(data) {
		this._processValues(data);
		this._checkPindrop(data);
		this._checkState(data);
		return data;
	},

	/** 
  * Splits up values separated by '|' and removes leading and trailing whitespaces.
  * Values are not split if there is a return character (assume text).
  * Values are converted into arrays only if there is a '|' character.
  * @param {object} data - Data object with key-value pairs.
  * @returns {object} data - Modified data.
  */
	_processValues: function _processValues(data) {
		var key, value;
		for (key in data) {
			value = data[key];
			if (_.isString(value)) {
				if (value.indexOf("|") > -1 && value.indexOf("\n") === -1) {
					data[key] = _.map(value.split('|'), function (item) {
						return item.trim();
					});
				} else {
					data[key] = value.trim();
				}
			}
		}
		return data;
	},

	/** 
  * Recognizes, validates and returns a pindrop item.
  * @param {object} data
  * @returns {object} - Validation summary object.
  */
	_checkPindrop: function _checkPindrop(data) {
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

	/** 
  * Recognizes, validates and returns a US state.
  * @param {object} data
  * @returns {object} - Validation summary object.
  */
	_checkState: function _checkState(data) {
		var errors, stateData;
		errors = [];
		if (data.name != null) {
			stateData = _.where(states, {
				name: data.name
			});
			if (stateData != null && stateData.length > 0) {
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

	/** 
  * Get and format image name.
  * @returns {string} name - Lower-cased name without line breaks.
  */
	getImageName: function getImageName() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
	},

	/** 
  * Sets latitude and longitude as a simple array.
  * @returns {array} - Spatial data point as simple array [Lat, Long].
  */
	toLatLongPoint: function toLatLongPoint() {
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

	/** 
  * Reverses [Lat, Long] point and sets longitude and latitude as a simple array.
  * @returns {array} - Spatial data point as simple array [Long, Lat].
  */
	toLongLatPoint: function toLongLatPoint() {
		return this.toLatLongPoint().reverse();
	},

	/**
  * Creates geoJson object from current model.
  * @returns {object} geoJson.
  */
	toRichGeoJsonFeature: function toRichGeoJsonFeature() {
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

	/**
  * Returns display state.
  * @param {}
  * @returns {string} displayState - Element of [ 'neutral', 'highlighted', 'inactive' ]
  */
	getDisplayState: function getDisplayState(filter, searchTerm, currentDisplayMode) {

		var filterIndeces, valueHoverIndex, isFiltered;

		if (currentDisplayMode === 'filter') {

			filterIndeces = filter.getValueIndeces(this);
			valueHoverIndex = filter.state.valueHoverIndex;
			isFiltered = filterIndeces.length > 0;

			if (!isFiltered) {
				return 'inactive';
			}

			if (filterIndeces.indexOf(valueHoverIndex) > -1) {
				return 'highlighted';
			}

			return;
		}

		if (this.matchesSearchTerm(searchTerm)) {
			return 'neutral';
		}
		return 'inactive';
	},

	/** 
  * Returns layer classnames to be applied on the model.
  * Classnames consist of group classes and element classes.
  * Group classes specifiy generic styles such as highlighted, inactive, neutral.
  * Element classes style components of the graphics corresponding to the item. E.g. map-pin dividers
  * @param {object} filter - Filter object.
  * @param {object} valueHoverIndex - Index of hovered value.
  * @param {string} searchTerm
  * @param {string} baseClass - Base class.
  * @param {} currentDisplayMode
  * @returns {object} layerClasses - Object with three keys: group, element base, and elements (array)
  */
	getLayerClasses: function getLayerClasses(filter, searchTerm, baseClass, currentDisplayMode) {

		var filterIndeces, layerClasses, displayState;

		if (baseClass == null) {
			baseClass = 'map-region';
		}

		layerClasses = {
			group: baseClass,
			elementBase: baseClass + '__element'
		};

		displayState = this.getDisplayState(filter, searchTerm, currentDisplayMode);
		if (displayState != null) {
			layerClasses.group += ' ' + baseClass + '--' + displayState;
		}

		return layerClasses;
	},

	/** 
  * Evaluates whether the name attribute matches a search term.
  * @param {string} searchTerm
  * @returns {boolean} - Match result.
  */
	matchesSearchTerm: function matchesSearchTerm(searchTerm) {
		var name;
		name = this.get('name');
		if (searchTerm == null || searchTerm.toLowerCase == null) {
			return false;
		}
		if (name == null || name.toLowerCase == null) {
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

	/** 
  * Gets item type first model in a collection.
  * @returns {string} itemType
  */
	getItemType: function getItemType() {
		var itemType;
		itemType = this.models[0].get('_itemType');
		return itemType;
	},

	/** 
  * Set active model under collection active field.
  * @param {} activeModel - Active model or its id.
  * @returns {object} this
  */
	setActive: function setActive(activeModel) {
		var id;
		if (_.isObject(activeModel) && indexOf.call(this.models, activeModel) >= 0) {
			this.active = activeModel;
		} else {
			id = parseInt(activeModel, 10);
			this.active = id === -1 ? void 0 : this.findWhere({
				id: id
			});
		}
		return this;
	},

	/** 
  * Set hovered model under collection hovered field.
  * @param {} hoveredModel - Hovered model or its id.
  * @returns {object} this
  */
	setHovered: function setHovered(hoveredModel) {
		var id;
		if (_.isObject(hoveredModel) && indexOf.call(this.models, hoveredModel) >= 0) {
			this.hovered = hoveredModel;
		} else {
			id = parseInt(hoveredModel, 10);
			this.hovered = id === -1 ? void 0 : this.findWhere({
				id: id
			});
		}
		return this;
	},

	/** 
  * Gets lists of values for a given key.
  * @param {string} key - Any key in models.
  * @returns {array} valueList - List of values for specified key.
  */
	getValueList: function getValueList(key) {
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

	/** TODO: Gets value list sorted by frequency in the data. */
	getSortedValueList: function getSortedValueList(key) {},

	/** 
  * Assumes the model has a latitude and longitude fields.
  * Must first go through parse method to make sure these fields are named correctly.
  * @returns {array} array of arrays - Latitude and longitude bounds, two arrays with two elements each.
  */
	getLatLongBounds: function getLatLongBounds() {
		var j, lat, len, long, maxLat, maxLong, minLat, minLong, model, ref;
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			lat = model.get('lat');
			long = model.get('long');
			if (typeof minLat === "undefined" || minLat === null || minLat > lat) {
				minLat = lat;
			}
			if (typeof maxLat === "undefined" || maxLat === null || maxLat < lat) {
				maxLat = lat;
			}
			if (typeof minLong === "undefined" || minLong === null || minLong > long) {
				minLong = long;
			}
			if (typeof maxLong === "undefined" || maxLong === null || maxLong < long) {
				maxLong = long;
			}
		}
		return [[minLat, minLong], [maxLat, maxLong]];
	},

	/** 
  * Creates single array from lat, long arrays of each model into one array (array of arrays).
  * @returns {array} res - Returns array of arrays. E.g. [[lat, long], [lat, long]]
  */
	toLatLongMultiPoint: function toLatLongMultiPoint() {
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
		state: function state(collection, baseGeoData) {
			var data, richGeoJson, setup;
			richGeoJson = new rgf.Collection();
			setup = function (data) {
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
		pindrop: function pindrop(collection) {
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

	/** 
  * The feature is either ready to use or triggers a sync event on itself once it is.
  * @returns {} - Generic Rich GeoJson feature.
  */
	getRichGeoJson: function getRichGeoJson(baseGeoData) {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this, baseGeoData);
	}

});

},{"./../../db/seeds/states.json":18,"./base.js":2,"./rich_geo_feature.js":13}],9:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    formatters = require('./../utilities/formatters.js'),
    base = require('./base.js'),
    filter = require('./filter.js'),
    infoBoxSection = require('./info_box_section.js'),
    variable = require('./variable.js'),
    item = require('./item.js');

exports.Model = base.Model.extend({

    urlRoot: '/api/v1/projects',

    /** API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. */
    customQueryKeys: ['related_to'],

    /** 
     * Returns the URL of the Atlas API that holds the data for the project. 
     * @returns {string} url
     */
    url: function url() {
        return this.urlRoot + ("?atlas_url=" + this.get('atlas_url'));
    },

    /** 
     * Returns the URL of the Build.Atlas API that holds the data for the project. 
     * @returns {string} buildUrl
     */
    buildUrl: function buildUrl() {
        return "http://build.atlas.newamerica.org/projects/" + this.get('id') + "/edit";
    },

    /** 
     * Conversts model object to json
     * Checks if it has mandatory fields (id and more than one key). 
     * returns {boolean} - Whether madatory fields exist
     */
    exists: function exists() {
        var json, key, keyCount;
        keyCount = 0;
        json = this.toJSON();
        for (key in json) {
            keyCount += 1;
        }
        return keyCount !== 1 && json.id != null;
    },

    /**
     * Recognize and process JSON data.
     * @param {object} resp - JSON response.
     * @returns {object} resp - Modified JSON response.
     */
    parse: function parse(resp) {
        resp = this._adaptMongoId(resp);
        resp = this._removeArrayWrapper(resp);
        resp = this._removeSpaces(resp, 'template_name');
        resp = this._processStaticHtml(resp, 'body_text');
        return resp;
    },

    /** 
     * Filters a project by two filterable collections that it belongs to.
     * @param {object} projectSections
     * @param {object} projectTemplates
     * @returns {boolean} filter - Whether both project sections and templates are in filter variable.
     */
    compositeFilter: function compositeFilter(projectSections, projectTemplates) {
        var filter, sectionsFilter, templatesFilter;
        sectionsFilter = this.filter(projectSections, 'project_section');
        templatesFilter = this.filter(projectTemplates, 'project_template');
        filter = sectionsFilter && templatesFilter;
        return filter;
    },

    /*
     * Custom query method to find related projects based on tags.
     * @param {string} project - Project Id.
     * @returns {boolean} - Related status.
     */
    isRelatedTo: function isRelatedTo(project) {
        var self = this,
            prj,
            tags0,
            tags1,
            i,
            max;
        if (this === project) {
            return false;
        }
        tags0 = this.get('tags');
        tags1 = project.get('tags');
        if (tags0 === '' || tags1 === '') {
            return false;
        }
        tags0 = tags0.split(',');
        tags1 = tags1.split(',');
        for (i = 0, max = tags0.length; i < max; i += 1) {
            if (tags1.indexOf(tags0[i]) > -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * Filter collection by its foreign key.
     * @param {object} collection
     * @param {string} foreignKey
     * @returns {boolean}
     */
    filter: function filter(collection, foreignKey) {
        if (collection != null && collection.test != null) {
            return collection.test(this, foreignKey);
        }
        return true;
    },

    /** Get imgage attribution html. */
    getImageAttributionHtml: function getImageAttributionHtml() {
        return this.getMarkdownHtml('image_credit');
    },

    /** If there is a data field, convert to appropriate collections. */
    buildData: function buildData() {
        var data;
        data = this.get('data');
        if (data != null) {
            data.infobox_variables = new infoBoxSection.Collection(data.infobox_variables, {
                parse: true
            });
            data.variables = new variable.Collection(data.variables, {
                parse: true
            });
            data.items = new item.Collection(data.items, {
                parse: true
            });
            this.buildFilterTree();
        }
    },

    buildFilterTree: function buildFilterTree(items, variables, filters) {

        var self = this,
            filterTree,
            filterVariables,
            data = this.get('data'),
            items = data.items,
            variables = data.variables,
            filters = data.filters;

        if (filters == null) {
            filters = [];
        }

        var fv = variables.getFilterVariables();

        filterVariables = fv.map(function (variable, index) {

            var formatter, nd, o, variable;

            if (variable.get('format') != null) {
                formatter = formatters[variable.get('format')];
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
                display_title: variable.get('display_title'),
                short_description: variable.get('short_description'),
                long_description: variable.getMarkdownHtml('long_description'),
                type: variable.get('filter_type'),
                _isActive: index === 0 ? true : false
            };

            nd = variable.get('numerical_filter_dividers');

            if (nd != null) {
                o.values = variable.getNumericalFilter(formatter);
            } else {
                o.values = _.map(items.getValueList(variable.get('id')), function (item) {
                    if (formatter != null) {
                        item = formatter(item);
                    }
                    return {
                        value: item
                    };
                });
            }

            _.map(o.values, function (val) {
                val._isActive = true;
                return val;
            });

            return o;
        });

        filterTree = {
            variables: filterVariables
        };

        data.filter = new filter.FilterTree(filterTree);
        data.filter.state = {};
    },

    /**
     * Set data request handlers on a Marionette app instance.
     * @param {object} App - Marionette application instance. 
     */
    setMarionetteDataRequestHandlers: function setMarionetteDataRequestHandlers(App) {
        var data = this.get('data');
        if (data != null) {
            App.reqres.setHandler('item:entities', function (query) {
                return data.items;
            });
        }
    },

    /**
     * Prepares model on the client.
     * @param {object} App - Marionette application instance. 
     */
    prepOnClient: function prepOnClient(App) {
        this.buildData();
        this.setHtmlToc('body_text');
        this.setMarionetteDataRequestHandlers(App);
    }

});

exports.Collection = base.Collection.extend({

    /**
     * Initializes collection
     */
    // initialize: function() {
    //     return this.on('reset', this.filter);
    // },

    model: exports.Model,

    /**
     * Creates new URL using base API path and query.
     * @returns {string} base - Modified root URL.
     */
    url: function url() {
        var base;
        base = '/api/v1/projects';
        if (this.queryString != null) {
            return base + "?" + this.queryString;
        }
        return base;
    },

    /**
     * Used to compare two models when sorting.
     * @param {object} model1
     * @param {object} model2
     * @returns {number} comparator - A comparator whose sign determines the sorting order.
     */
    comparator: function comparator(model1, model2) {
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

    /** 
     * Filter all children by project sections and templates.
     * @param {collection} projectSections
     * @param {collection} projectTemplates
     * @returns {object} this
     */
    filter: function filter(projectSections, projectTemplates) {
        var i, len, model, ref;
        if (projectSections.models == null || projectSections.models.length === 0) {
            return;
        }
        if (projectTemplates.models == null || projectTemplates.models.length === 0) {
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

    /**
     * Recognize and process server response.
     * @param {object} resp - Server response.
     * @returns {object} resp - Modified response.
     */
    parse: function parse(resp) {
        var i, max, item;
        if (exports.Model.prototype.parse == null) {
            return resp;
        }
        for (i = 0, max = resp.length; i < max; i += 1) {
            item = resp[i];
            resp[i] = exports.Model.prototype.parse(item);
        }
        return resp;
    }

});

},{"./../utilities/formatters.js":15,"./base.js":2,"./filter.js":5,"./info_box_section.js":7,"./item.js":8,"./variable.js":14}],10:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    baseFilter = require('./base_filter'),
    seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_sections',
	hasSingleActiveChild: false,
	initializeActiveStatesOnReset: true,
	initialize: function initialize() {
		this.reset(seed);
	}
});

},{"./../../db/seeds/project_sections.json":16,"./base_filter":4}],11:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    baseFilter = require('./base_filter.js'),
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
	initialize: function initialize() {
		this.reset(seed);
	}
});

},{"./../../db/seeds/project_templates.json":17,"./base_filter.js":4}],12:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js');

exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});

},{"./base.js":2}],13:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone;

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({

	initialize: function initialize() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},

	model: exports.Model,

	onReady: function onReady(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}

});

},{}],14:[function(require,module,exports){
'use strict';

var _ = window._,
    Backbone = window.Backbone,
    base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    $ = window.$;

exports.Model = base.Model.extend({

    /*
        * Set a numerical filter, splitting up |10|20|30| type numerical divider strings into
        *   presentable and testable objects. See specs for example.
        * @param {function} formatter - Optional formatter function for values.
        */
    getNumericalFilter: function getNumericalFilter(formatter) {

        var i,
            len,
            numericalFilter,
            values,
            numericalDividers = this.get('numerical_filter_dividers');

        if (formatter == null) {
            formatter = formatters['number'];
        }

        values = _.map(numericalDividers.split('|'), function (member, index) {
            if (member === "") {
                if (index === 0) {
                    return -1000000000;
                }
                return +1000000000;
            }
            return parseInt(member, 10);
        });

        numericalFilter = [];

        for (i = 0, len = values.length; i < len - 1; i += 1) {
            numericalFilter.push(this.getNumericalFilterValue(values[i], values[i + 1], formatter));
        }

        return numericalFilter;
    },

    /*
     * Returns single numerical filter value.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @param {function} formatter - Formatter function.
     * @returns {object}
     */
    getNumericalFilterValue: function getNumericalFilterValue(min, max, formatter) {
        var filterValue, maxDisplay, minDisplay;
        filterValue = {
            min: min,
            max: max
        };
        minDisplay = min;
        maxDisplay = max;
        minDisplay = formatter(minDisplay);
        maxDisplay = formatter(maxDisplay);
        if (min === -1000000000) {
            filterValue.value = "Less than " + maxDisplay;
        } else if (max === +1000000000) {
            filterValue.value = "Greater than " + minDisplay;
        } else {
            filterValue.value = "Between " + minDisplay + " and " + maxDisplay;
        }
        return filterValue;
    }

});

exports.Collection = base.Collection.extend({

    model: exports.Model,

    getFilterVariables: function getFilterVariables() {
        var models;
        models = this.filter(function (item) {
            return item.get('filter_menu_order') != null;
        });
        models.sort(function (a, b) {
            return a.get('filter_menu_order') - b.get('filter_menu_order');
        });
        return models;
    }

});

},{"./../utilities/formatters.js":15,"./base.js":2}],15:[function(require,module,exports){
'use strict';

var numeral = require('numeral'),
    marked = require('marked'),
    $ = window.$;

var formatters = {

	currency: function currency(v) {
		var formatter;
		if (typeof numeral === "undefined" || numeral === null) {
			return v;
		}
		formatter = v > 999 ? '($0a)' : '($0)';
		return numeral(v).format(formatter);
	},

	number: function number(v) {
		var formatter;
		if (typeof numeral === "undefined" || numeral === null) {
			return v;
		}
		formatter = v > 99999 ? '(0a)' : '(0)';
		return numeral(v).format(formatter);
	},

	percent: function percent(v) {
		return v + '%';
	},

	html: function html(_html) {
		var $html, newHtml;
		$html = $(_html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		return newHtml;
	},

	atlasArray: function atlasArray(_atlasArray) {
		var arr;
		arr = _atlasArray.split("|");
		arr = _.map(arr, function (item) {
			return item.trim();
		});
		return arr;
	},

	removeLineBreaks: function removeLineBreaks(string) {
		string = String(string);
		return string.replace(/(\r\n|\n|\r)/gm, '');
	},

	removeSpaces: function removeSpaces(string) {
		string = String(string);
		return string.replace(/\s+/g, '');
	},

	hyphenate: function hyphenate(string) {
		string = String(string);
		return string.replace('ommunication', 'ommuni-cation');
	},

	mdToHtml: function mdToHtml(string) {
		var html;
		if (string != null) {
			html = marked(string);
		}
		if (html != null) {
			return this.htmlToHtml(html);
		}
	}

};

module.exports = formatters;

},{"marked":19,"numeral":20}],16:[function(require,module,exports){
module.exports=[
	{ "id": "0", "name": "Early Education" },
	{ "id": "1", "name": "PreK-12 Education" },
	{ "id": "2", "name": "Higher Education" },
	{ "id": "3", "name": "Learning Technologies" },
	{ "id": "4", "name": "Dual Language Learners" },
	{ "id": "5", "name": "Workforce Development" },
	{ "id": "6", "name": "Federal Education Budget" }
]
},{}],17:[function(require,module,exports){
module.exports=[
	{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" },
	{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" },
	{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" },
	{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
]
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;
            
        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);
        
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };
    
    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }
        
        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        
        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';
            
            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }

    
    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }        


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this, 
                  inputString ? inputString : defaultFormat, 
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') { 
                return inputString; 
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);            
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);

},{}]},{},[1]);

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
    App.headerRegion = new Marionette.Region({
      el: '#header'
    });
    App.contentRegion = new Marionette.Region({
      el: '#atl'
    });
    App.currentDisplayMode = 'filter';
    App.commands.setHandler('change:display:mode', function(mode) {
      App.currentDisplayMode = mode;
      return App.vent.trigger('display:mode:change');
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
  this.Atlas.module("Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module("Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    return Filter.Controller = {
      show: function() {
        var filter;
        filter = this._getFilter();
        filter.state = {};
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
        return Filter.filter.stopListening();
      },
      _getFilter: function() {
        var filter, model;
        model = App.currentProjectModel;
        filter = model.get('data').filter;
        filter.listenTo(App.vent, 'value:click', function(index) {
          if (this.getActiveChild().children[index] != null) {
            return this.getActiveChild().children[index].handleClick();
          }
        });
        filter.listenTo(App.vent, 'key:click', function(index) {
          return this.setActiveChildByIndex(index);
        });
        return filter;
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
  this.Atlas.module("Tilemap.Filter", function(Filter, App, Backbone, Marionette, $, _) {
    Filter.ValueView = Marionette.ItemView.extend({
      tagName: 'li',
      className: 'toggle-button',
      template: 'tilemap/submodules/filter/templates/filter_value',
      initialize: function() {
        this.updateActiveState();
        return this.listenTo(this.model, 'change:_isActive', this.updateActiveState);
      },
      templateHelpers: App.Util.formatters,
      onShow: function() {
        var cls;
        cls = this.getBackgroundColorClass();
        return this.$('.hexicon__hex').attr('class', "hexicon__hex " + cls);
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
      getBackgroundColorClass: function() {
        var colorIndex, i, k;
        k = this.model.parent.parent.getValueCountOnActiveKey();
        i = this._getModelIndex() + 1;
        colorIndex = App.CSS.ClassBuilder.interpolate(i, k);
        return "bg-c-" + colorIndex;
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
        var cls, filter, modelIndex;
        modelIndex = this._getModelIndex();
        Filter.valueHoverIndex = modelIndex;
        filter = this.model.parent.parent;
        filter.state.valueHoverIndex = modelIndex;
        App.vent.trigger('value:mouseover', modelIndex);
        cls = this.getBackgroundColorClass();
        App.commands.execute('set:header:strip:color', {
          className: cls
        });
        return this;
      },
      triggerValueMouseOut: function() {
        var filter;
        Filter.valueHoverIndex = -1;
        filter = this.model.parent.parent;
        filter.state.valueHoverIndex = -1;
        App.vent.trigger('value:mouseout');
        App.commands.execute('set:header:strip:color', 'none');
        return this;
      },
      _getModelIndex: function() {
        if (this.model.collection == null) {
          return;
        }
        return this.model.collection.models.indexOf(this.model);
      }
    });
    Filter.ValuesView = Marionette.CompositeView.extend({
      tagName: 'div',
      className: 'atl__filter__values',
      template: 'tilemap/submodules/filter/templates/filter_values',
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
      template: 'tilemap/submodules/filter/templates/filter_key',
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
      template: 'tilemap/submodules/filter/templates/filter_keys',
      childView: Filter.KeyView,
      childViewContainer: 'ul'
    });
    return Filter.RootView = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl__filter',
      template: 'tilemap/submodules/filter/templates/root',
      regions: {
        keys: '#atl__filter__keys',
        values: '#atl__filter__values'
      }
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Headline', function(Headline, App, Backbone, Marionette, $, _) {
    return Headline.RootView = Marionette.ItemView.extend({
      template: 'tilemap/submodules/headline/templates/root',
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
  this.Atlas.module('Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Info', function(Info, App, Backbone, Marionette, $, _) {
    return Info.RootView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__info',
      template: 'tilemap/submodules/info/templates/root',
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
  this.Atlas.module('Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
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
      var infoBoxSections, project, sections, variables;
      project = App.currentProjectModel;
      infoBoxSections = project.get('data').infobox_variables;
      variables = project.get('data').variables;
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
  this.Atlas.module('Tilemap.InfoBox', function(InfoBox, App, Backbone, Marionette, $, _) {
    var TocView;
    InfoBox.SectionView = Marionette.CompositeView.extend({
      tagName: 'li',
      className: 'atl__info-box__item',
      template: 'tilemap/submodules/info_box/templates/section'
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
      template: 'tilemap/submodules/info_box/templates/root',
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
  this.Atlas.module('Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
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

  this.Atlas.module('Tilemap.Legend', function(Legend, App, Backbone, Marionette, $, _) {
    Legend.IconView = Marionette.ItemView.extend({
      tagName: 'li',
      className: 'atl__legend__icon',
      template: 'tilemap/submodules/legend/templates/icon',
      onRender: function() {
        var cls;
        cls = this.getBackgroundColorClass();
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
        filter = this.model.parent.parent;
        filter.state.valueHoverIndex = modelIndex;
        App.vent.trigger('value:mouseover', modelIndex);
        cls = this.getBackgroundColorClass();
        return App.commands.execute('set:header:strip:color', {
          className: cls
        });
      },
      onMouseOut: function() {
        var filter;
        App.commands.execute('set:header:strip:color', 'none');
        Legend.valueHoverIndex = -1;
        filter = this.model.parent.parent;
        filter.state.valueHoverIndex = -1;
        return App.vent.trigger('value:mouseout', -1);
      },
      getBackgroundColorClass: function() {
        var colorIndex, i, k;
        k = this.model.parent.parent.getValueCountOnActiveKey();
        i = this._getModelIndex() + 1;
        colorIndex = App.CSS.ClassBuilder.interpolate(i, k);
        return "bg-c-" + colorIndex;
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
      template: 'tilemap/submodules/legend/templates/root',
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
  this.Atlas.module('Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
      }
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Tilemap.Map', function(Map, App, Backbone, Marionette, $, _) {
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
        html = Marionette.Renderer.render('tilemap/templates/zoom_bar', {});
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
  this.Atlas.module('Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Search', function(Search, App, Backbone, Marionette, $, _) {
    return Search.RootView = Marionette.ItemView.extend({
      tagName: 'div',
      className: 'atl__search',
      template: 'tilemap/submodules/search/templates/root',
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
  this.Atlas.module('Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
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
  this.Atlas.module('Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    Popup.Model = Backbone.Model.extend({
      defaults: {
        name: 'something'
      }
    });
    return Popup.getModel = function(item) {
      var name;
      name = (item != null) && (item.get != null) ? item.get('name') : '';
      return new Popup.Model({
        name: name
      });
    };
  });

}).call(this);

(function() {
  this.Atlas.module('Tilemap.Popup', function(Popup, App, Backbone, Marionette, $, _) {
    return Popup.RootView = Marionette.ItemView.extend({
      tagName: 'a',
      className: 'atl__popup',
      template: 'tilemap/submodules/popup/templates/root',
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
        if ((this.model != null) && (this.model.get('_itemType') === 'state')) {
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
        html = Marionette.Renderer.render("tilemap/submodules/popup/templates/logo");
        return this.$('#atl__popup__content__logo').html(html);
      },
      preventDefault: function(e) {
        return e.preventDefault();
      }
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Atlas.module("Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
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

      OverlayBaseView.prototype.getFeatureDisplayState = function(feature) {
        var filter, model, searchTerm;
        filter = App.currentProjectModel.get('data').filter;
        searchTerm = App.reqres.request('search:term');
        model = feature._model;
        if (model != null) {
          return model.getDisplayState(filter, searchTerm, App.currentDisplayMode);
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

  this.Atlas.module("Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
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

      PathOverlayView.prototype.getFill = function(feature) {
        var filter, id, valueIndeces;
        filter = App.currentProjectModel.get('data').filter;
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
        if ((valueIndeces == null) || valueIndeces.length === 0) {
          return;
        }
        if (valueIndeces.length === 1) {
          return App.CSS.Colors.toRgb(valueIndeces[0] - 1);
        }
        id = App.reqres.request('get:pattern:id', valueIndeces);
        return "url(#stripe-pattern-" + id + ")";
      };

      PathOverlayView.prototype.update = function() {
        var geoJson, path;
        App.commands.execute('reset:patterns');
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

  this.Atlas.module("Tilemap.Map", function(Map, App, Backbone, Marionette, $, _) {
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

      PindropOverlayView.prototype.getFills = function(feature) {
        var filter, valueIndeces;
        filter = App.currentProjectModel.get('data').filter;
        valueIndeces = filter.getFriendlyIndeces(feature._model, 15);
        if ((valueIndeces == null) || valueIndeces.length === 0) {
          return;
        }
        return valueIndeces.map(function(valueIndex) {
          return App.CSS.Colors.toRgb(valueIndex - 1);
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

(function() {
  this.Atlas.module('Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    var setItemEventListeners;
    this.startWithParent = false;
    Tilemap.submoduleKeys = ['Filter', 'Search', 'Legend', 'Info', 'Headline', 'Map', 'InfoBox', 'Popup'];
    setItemEventListeners = (function(_this) {
      return function() {
        var items, setHeaderStripColor;
        items = App.reqres.request('item:entities');
        setHeaderStripColor = function() {
          var cls, filter, hoveredItem, indeces;
          filter = App.reqres.request('filter');
          hoveredItem = items.hovered;
          if (hoveredItem != null) {
            indeces = filter.getFriendlyIndeces(hoveredItem, 15);
            cls = "bg-c-" + indeces[0];
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
      return this.Controller.show();
    });
    return this.on('stop', function() {
      this.Controller.destroy();
      return this.stopListening();
    });
  });

}).call(this);

(function() {
  this.Atlas.module('Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    return Tilemap.Controller = {
      show: function() {
        this.showMainView();
        return this.startSubmodules();
      },
      destroy: function() {
        return this.destroyMainView();
      },
      showMainView: function() {
        this.setMainRegion();
        Tilemap.rootView = this.getView();
        return Tilemap.region.show(Tilemap.rootView);
      },
      setMainRegion: function() {
        return Tilemap.region = new Marionette.Region({
          el: '#atl__main__temp'
        });
      },
      destroyMainView: function() {
        if (Tilemap.rootView != null) {
          Tilemap.rootView.destroy();
          return delete Tilemap.rootView;
        }
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
  this.Atlas.module('Tilemap', function(Tilemap, App, Backbone, Marionette, $, _) {
    return Tilemap.View = Marionette.LayoutView.extend({
      tagName: 'div',
      className: 'atl__main fill-parent',
      template: 'tilemap/templates/root',
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
      },
      events: {
        'click #atl__set-filter-display': 'setFilterDisplay',
        'click #atl__set-search-display': 'setSearchDisplay'
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
