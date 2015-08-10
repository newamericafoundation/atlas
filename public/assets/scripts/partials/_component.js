var Comp,
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

Comp = {};

Comp.Mixins = {};

Comp.Icons = {};

Comp.Mixins.BackboneEvents = {
  componentDidMount: function() {
    if ((typeof _ !== "undefined" && _ !== null) && (typeof Backbone !== "undefined" && Backbone !== null)) {
      return _.extend(this, Backbone.Events);
    }
  },
  componentWillUnmount: function() {
    if (this.stopListening != null) {
      return this.stopListening();
    }
  }
};

Comp.Loading = React.createClass({
  displayName: 'Loading',
  render: function() {
    return React.createElement("div", {
      "className": 'loading-icon'
    }, React.createElement("div", null, "\t\t\t\tLoading..."));
  }
});

Comp.Setup = React.createClass({
  displayName: 'Setup',
  render: function() {
    var App;
    App = this.props.App;
    return React.createElement("div", {
      "className": "atl__setup"
    }, React.createElement("svg", {
      "id": "patterns"
    }, React.createElement(Comp.Setup.Patterns, {
      "App": App
    })));
  }
});

Comp.Setup.Patterns = React.createClass({
  displayName: 'Setup.Patterns',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("defs", null, this._renderList());
  },
  _renderList: function() {
    var colorCodes, i, j, results;
    results = [];
    for (i = j = 0; j < 20; i = j += 1) {
      colorCodes = this.state.data[i];
      results.push(React.createElement(Comp.Setup.Pattern, {
        "App": this.props.App,
        "id": i,
        "key": i,
        "colorCodes": colorCodes
      }));
    }
    return results;
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      App.commands.setHandler('reset:patterns', this.resetPatterns.bind(this));
      return App.reqres.setHandler('get:pattern:id', this.ensureAndGetPattern.bind(this));
    }
  },
  componentWillUnmount: function() {
    return App.commands.clearHandler('reset:patterns');
  },
  resetPatterns: function() {
    return this.setState({
      data: []
    });
  },
  ensureAndGetPattern: function(colorCodes) {
    var existingColorCodes, i, j, len, ref;
    ref = this.state.data;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      existingColorCodes = ref[i];
      if (colorCodes.join('-') === existingColorCodes.join('-')) {
        return i;
      }
    }
    this.state.data.push(colorCodes);
    this.forceUpdate();
    return this.state.data.length - 1;
  },
  __testRenderTwoColorPattern: function() {
    return React.createElement("pattern", {
      "id": "diagonal-stripes",
      "x": "0",
      "y": "0",
      "width": "8",
      "height": "8",
      "patternUnits": "userSpaceOnUse",
      "patternTransform": "rotate(45)"
    }, React.createElement("rect", {
      "x": "0",
      "y": "0",
      "width": "2",
      "height": "8",
      "style": "stroke:none; fill:" + 'roed' + ";"
    }), React.createElement("rect", {
      "x": "2",
      "y": "0",
      "width": "2",
      "height": "8",
      "style": "stroke:none; fill:" + 'roed' + ";"
    }), React.createElement("rect", {
      "x": "4",
      "y": "0",
      "width": "2",
      "height": "8",
      "style": "stroke:none; fill:" + 'hvid' + ";"
    }), React.createElement("rect", {
      "x": "6",
      "y": "0",
      "width": "2",
      "height": "8",
      "style": "stroke:none; fill:" + 'hvid' + ";"
    }));
  },
  __testRenderThreeColorPattern: function() {
    return React.createElement("pattern", {
      "id": "diagonal-stripes",
      "x": "0",
      "y": "0",
      "width": "18",
      "height": "18",
      "patternUnits": "userSpaceOnUse",
      "patternTransform": "rotate(45)"
    }, React.createElement("rect", {
      "x": "0",
      "y": "0",
      "width": "6",
      "height": "18",
      "style": "stroke:none; fill:" + 'schwarz' + ";"
    }), React.createElement("rect", {
      "x": "6",
      "y": "0",
      "width": "6",
      "height": "18",
      "style": "stroke:none; fill:" + 'rot' + ";"
    }), React.createElement("rect", {
      "x": "12",
      "y": "0",
      "width": "6",
      "height": "18",
      "style": "stroke:none; fill:" + 'gold' + ";"
    }));
  }
});

Comp.Setup.Pattern = React.createClass({
  displayName: 'Setup.Pattern',
  render: function() {
    var className, colorCount, dim;
    if (this.props.colorCodes != null) {
      colorCount = this.props.colorCodes.length;
      dim = colorCount === 2 ? 12 : 18;
      className = 'striped-pattern-' + this.props.colorCodes.join('-');
    }
    return React.createElement("pattern", {
      "id": 'stripe-pattern-' + this.props.id,
      "className": className,
      "x": "0",
      "y": "0",
      "width": dim,
      "height": dim,
      "patternUnits": "userSpaceOnUse",
      "patternTransform": "rotate(45)"
    }, this._getPatternRects());
  },
  getColor: function(colorCode) {
    var App;
    App = this.props.App;
    if (App != null) {
      return App.CSS.Colors.toRgb(colorCode - 1);
    }
  },
  componentDidMount: function() {
    return this.setPatternTransform();
  },
  componentDidUpdate: function() {
    return this.setPatternTransform();
  },
  setPatternTransform: function() {
    return React.findDOMNode(this).setAttribute('patternTransform', 'rotate(45)');
  },
  _getPatternRects: function(n) {
    var j, results;
    if (this.props.colorCodes == null) {
      return;
    }
    n = this.props.colorCodes.length;
    return (function() {
      results = [];
      for (var j = 0; 0 <= n ? j < n : j > n; 0 <= n ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).map((function(_this) {
      return function(i) {
        var color, height, style;
        height = n === 2 ? 12 : 18;
        color = _this.getColor(_this.props.colorCodes[i]);
        style = {
          'stroke': 'none',
          'fill': color
        };
        return React.createElement("rect", {
          "key": i,
          "x": 6 * i,
          "y": "0",
          "width": "6",
          "height": height,
          "style": style
        });
      };
    })(this));
  }
});

Comp.Icons.Hex = React.createClass({
  render: function() {
    return React.createElement("svg", {
      "className": this.props.className,
      "viewBox": "0 0 100 100"
    }, React.createElement("g", {
      "className": "hexicon__hex " + this.props.colorClassName
    }, React.createElement("path", {
      "d": "M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2 L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"
    })), React.createElement("g", {
      "className": "hexicon__yes"
    }, React.createElement("polygon", {
      "points": "70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5 	"
    })), React.createElement("g", {
      "className": "hexicon__no"
    }, React.createElement("polygon", {
      "points": "72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2 57.8,50"
    })));
  }
});

Comp.Layout = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Layout',
  render: function() {
    return React.createElement("div", {
      "className": "wrapper"
    }, React.createElement(Comp.Setup, {
      "App": this.props.App
    }), React.createElement(Comp.Header, {
      "App": this.props.App,
      "headerTitle": this.props.headerTitle,
      "theme": this.props.theme
    }), this.getRoutable());
  },
  getRoutable: function() {
    var Component, compNameKey, compNameKeys, j, len;
    if (this.props.routableComponentName == null) {
      return;
    }
    compNameKeys = this.props.routableComponentName.split('.');
    Component = Comp;
    for (j = 0, len = compNameKeys.length; j < len; j++) {
      compNameKey = compNameKeys[j];
      Component = Component[compNameKey];
    }
    return React.createElement(Component, {
      "App": this.props.App
    });
  }
});

Comp.Header = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Header',
  render: function() {
    return React.createElement("div", {
      "className": 'header ' + this.getBackgroundColorClass()
    }, React.createElement("div", {
      "className": "header__corner"
    }, React.createElement("a", {
      "className": "bg-img-naf--off-white",
      "id": "header__welcome-link",
      "href": "/welcome",
      "onClick": this.navigate
    })), React.createElement("div", {
      "className": "header__main"
    }, React.createElement("h1", null, this.getHeaderTitle()), React.createElement("p", {
      "className": "header__main__title"
    })), React.createElement(Comp.Header.NavCircles, {
      "App": this.props.App
    }), React.createElement("div", {
      "className": "header__strip",
      "ref": "strip"
    }));
  },
  getBackgroundColorClass: function() {
    switch (this.props.theme) {
      case 'atlas':
        return 'bg-c-grey--base';
      case 'naf':
        return 'bg-c-naf-green';
      default:
        return '';
    }
  },
  getHeaderTitle: function() {
    if (this.props.headerTitle == null) {
      return;
    }
    if (this.props.headerTitle.toUpperCase == null) {
      return this.props.headerTitle;
    }
    return this.props.headerTitle.toUpperCase();
  },
  componentDidMount: function() {
    return this._setStripHandler();
  },
  navigate: function(e) {
    if (typeof Backbone !== "undefined" && Backbone !== null) {
      e.preventDefault();
      return Backbone.history.navigate('/welcome', {
        trigger: true
      });
    }
  },
  _setStripHandler: function() {
    var $strip, App, stripClassName;
    App = this.props.App;
    stripClassName = 'header__strip';
    if ((App != null) && (typeof $ !== "undefined" && $ !== null)) {
      $strip = $(React.findDOMNode(this.refs.strip));
      return App.commands.setHandler('set:header:strip:color', (function(_this) {
        return function(options) {
          if ((options == null) || (options === 'none')) {
            $strip.attr('class', stripClassName);
            return $strip.css('background-color', '');
          } else if (options.color != null) {
            $strip.attr('class', stripClassName);
            return $strip.css('background-color', options.color);
          } else if (options.className != null) {
            $strip.css('background-color', '');
            $strip.attr('class', stripClassName);
            return $strip.addClass(options.className);
          }
        };
      })(this));
    }
  }
});

Comp.Header.NavCircles = React.createClass({
  displayName: 'Header.NavCircles',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("div", {
      "className": "header__nav-circles"
    }, React.createElement("ul", {
      "className": "nav-circles"
    }, this.renderList()));
  },
  renderList: function() {
    return ['welcome', 'menu', 'show'].map((function(_this) {
      return function(item, i) {
        var cls;
        cls = i === _this.state['activeIndex'] ? 'nav-circle nav-circle--active' : 'nav-circle';
        return React.createElement("li", {
          "className": cls,
          "key": i
        }, React.createElement("a", {
          "href": '/' + item,
          "onClick": _this.navigate
        }));
      };
    })(this));
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if ((App != null) && (this.listenTo != null)) {
      return this.listenTo(App.vent, 'router:current:action:change', function(index) {
        return this.setState({
          activeIndex: index
        });
      });
    }
  },
  navigate: function(e) {
    var $target, App;
    e.preventDefault();
    $target = $(e.target);
    App = this.props.App;
    if (App != null) {
      return App.router.navigate($target.attr('href'));
    }
  },
  getInitialState: function() {
    return {
      activeIndex: 0
    };
  }
});

Comp.SideBar = React.createClass({
  displayName: 'SideBar',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    var cls;
    cls = this.state['isActive'] ? 'atl__side-bar atl__side-bar--active' : 'atl__side-bar';
    return React.createElement("div", {
      "className": cls,
      "onClick": this.toggle
    }, React.createElement("div", {
      "className": "atl__side-bar__title"
    }, this.state['hoveredButtonTitle']), this._renderButtons());
  },
  getDefaultProps: function() {
    var props;
    props = {
      buttons: [
        {
          title: 'Explore Atlas',
          method: 'projects',
          icon: 'grid',
          isToggleable: false
        }, {
          title: 'Collapse/Expand',
          method: 'collapse',
          icon: 'contract',
          isToggleable: false
        }, {
          title: 'Help',
          method: 'help',
          icon: 'help',
          isToggleable: false
        }, {
          title: 'Print',
          method: 'print',
          icon: 'print',
          isToggleable: false
        }, {
          title: 'Download Data',
          method: 'download',
          icon: 'download',
          isToggleable: false
        }
      ]
    };
    return props;
  },
  getInitialState: function() {
    return {
      isActive: false
    };
  },
  toggle: function() {
    return this.setState({
      isActive: !this.state['isActive']
    });
  },
  _renderButtons: function() {
    var list;
    list = this.props.buttons.map(this._renderButton);
    return React.createElement("ul", {
      "className": "atl__side-bar__icons"
    }, list);
  },
  _renderButton: function(options, i) {
    return React.createElement("li", {
      "className": "atl__side-bar__icon",
      "onMouseEnter": this.onButtonMouseEnter.bind(this, options),
      "onMouseLeave": this.onButtonMouseLeave.bind(this, options),
      "onClick": this['_' + options.method],
      "key": 'button-' + i
    }, this._renderButtonContent(options, i));
  },
  _renderButtonContent: function(options, i) {
    var atlas_url;
    if (options.method === 'download') {
      atlas_url = this._getAtlasUrl();
      return React.createElement("form", {
        "className": "form--compact bg-img-" + options.icon + "--off-white",
        "action": '/api/v1/projects/print',
        "method": 'post'
      }, React.createElement("input", {
        "type": "hidden",
        "name": "atlas_url",
        "value": atlas_url
      }), React.createElement("input", {
        "type": "submit",
        "value": ""
      }));
    } else if (options.method === 'comment') {
      return React.createElement("a", {
        "href": 'mailto:atlas@newamerica.org',
        "className": "bg-img-" + options.icon + "--off-white"
      });
    } else {
      return React.createElement("div", {
        "className": "bg-img-" + options.icon + "--off-white"
      });
    }
  },
  onButtonMouseEnter: function(options) {
    return this.setState({
      hoveredButtonTitle: options.title
    });
  },
  onButtonMouseLeave: function(options) {
    return this.setState({
      hoveredButtonTitle: ''
    });
  },
  _getAtlasUrl: function() {
    var atlas_url, project;
    project = this.props.project;
    if (project != null) {
      return atlas_url = project.get('atlas_url');
    }
  },
  _projects: function() {
    if (typeof Backbone !== "undefined" && Backbone !== null) {
      return Backbone.history.navigate('menu', {
        trigger: true
      });
    }
  },
  _edit: function() {
    var App, project, url;
    App = this.props.App;
    project = this.props.project;
    if ((App != null) && (project != null)) {
      Backbone.history.navigate('');
      url = project.buildUrl();
      return window.location.href = url;
    }
  },
  _collapse: function(e) {
    var $target, App, cannotExpand, isCollapsed;
    App = this.props.App;
    if ((App != null) && (typeof $ !== "undefined" && $ !== null)) {
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
    }
  },
  _help: function(e) {
    if (typeof $ !== "undefined" && $ !== null) {
      return $('.atl').toggleClass('atl--help');
    }
  },
  _print: function() {
    if (typeof window !== "undefined" && window !== null) {
      return window.print();
    }
  },
  _download: function() {
    return 'keep default action';
  }
});

Comp.Dashboard = React.createClass({
  displayName: 'Dashboard',
  render: function() {
    return React.createElement("div", {
      "className": 'wrapper'
    }, React.createElement("div", {
      "className": 'header bg-c-naf-green'
    }, React.createElement("div", {
      "className": "header__corner"
    }, React.createElement("a", {
      "className": "bg-img-naf--off-white",
      "id": "header__welcome-link",
      "href": "/welcome",
      "onClick": this.navigate
    })), React.createElement("div", {
      "className": "header__main"
    }, React.createElement("h1", null, "NEW AMERICA")), React.createElement(Comp.SideBar, null)), React.createElement("div", {
      "className": 'dashboard bg-c--off-white'
    }, React.createElement(Comp.Floor, {
      "plan": this.getFloorPlan()
    }), React.createElement("div", {
      "className": 'dashboard__welcome'
    }, React.createElement("h1", null, new Date().toISOString().slice(11, 16)), React.createElement("p", null, "Good afternoon, Anne-Marie!"))));
  },
  getFloorPlan: function() {
    var obj;
    return obj = {
      name: '9th Floor',
      coordinates: [[5, 5], [150, 5], [150, 40], [300, 40], [300, 5], [400, 5], [400, 300], [5, 300]],
      rooms: [
        {
          name: 'A',
          coordinates: [[10, 10], [50, 10], [50, 40], [10, 40]]
        }, {
          name: 'B',
          coordinates: [[10, 250], [50, 250], [50, 295], [10, 295]]
        }, {
          name: 'C',
          coordinates: [[180, 45], [240, 45], [240, 80], [180, 80]]
        }
      ]
    };
  }
});

Comp.Floor = React.createClass({
  render: function() {
    return React.createElement("svg", {
      "className": 'floor',
      "id": this.getId()
    }, React.createElement("polygon", {
      "className": 'floor__plan',
      "points": this.getPoints()
    }), React.createElement("g", {
      "className": 'floor__rooms'
    }, this.renderRooms()));
  },
  renderRooms: function() {
    return this.props.plan.rooms.map(function(room) {
      return React.createElement(Comp.Floor.Room, {
        "plan": room
      });
    });
  },
  getId: function() {
    return 'floor-' + this.props.plan.name.replace(/\s+/g, '');
  },
  getPoints: function() {
    var coord, points;
    coord = this.props.plan.coordinates;
    points = coord.map(function(pointArray) {
      return pointArray.join(',');
    });
    return points.join(',');
  }
});

Comp.Floor.Room = React.createClass({
  render: function() {
    return React.createElement("polygon", {
      "className": 'floor__room',
      "points": this.getPoints(),
      "onClick": this.activate,
      "onMouseEnter": this.log
    });
  },
  getModifierClass: function() {
    if (this.state.isActive) {
      return 'floor__room--active';
    } else {
      return '';
    }
  },
  getInitialState: function() {
    return {
      isActive: false
    };
  },
  getPoints: function() {
    var coord, points;
    coord = this.props.plan.coordinates;
    points = coord.map(function(pointArray) {
      return pointArray.join(',');
    });
    return points.join(',');
  },
  log: function() {
    return console.log('welcome to room ' + this.props.plan.name);
  }
});

Comp.About = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "about"
    }, React.createElement("h1", {
      "class": "title"
    }, "About Atlas"));
  }
});

Comp.Welcome = React.createClass({
  displayName: 'Welcome',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("div", {
      "className": "welcome"
    }, React.createElement("div", {
      "id": "welcome__terrain",
      "className": "-id-welcome__terrain"
    }), React.createElement("div", {
      "className": "welcome__title"
    }, React.createElement("h1", {
      "className": "welcome__title__name"
    }, "ATLAS"), React.createElement("h1", {
      "className": "welcome__title__alias c-2-0"
    }, "=ANALYSIS")), React.createElement("div", {
      "className": "welcome__strip bg-c-2-0"
    }), React.createElement("div", {
      "className": "welcome__subtitle"
    }, "\t\t\t\tA policy analysis tool from New America\'s Education Program"), React.createElement(Comp.Welcome.Nav, {
      "App": this.props.App
    }));
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this.listenTo(App.vent, 'mouse:move', this._setColor);
    }
  },
  _setColor: function(mouse) {
    var App, color;
    App = this.props.App;
    if ((App != null) && (typeof $ !== "undefined" && $ !== null)) {
      color = App.CSS.Colors.interpolate(mouse.x);
      $('.welcome__strip').css('background-color', color);
      return $('.welcome__title__alias').css('color', color);
    }
  },
  _unsetColor: function() {
    var App;
    App = this.props.App;
    if ((App != null) && (typeof $ !== "undefined" && $ !== null)) {
      $('.welcome__strip').css('background-color', '');
      return $('.welcome__title__alias').css('color', '');
    }
  }
});

Comp.Welcome.Nav = React.createClass({
  navigate: function(e) {
    var App;
    App = this.props.App;
    if (App != null) {
      e.preventDefault();
      App = this.props.App;
      return App.router.navigate('menu');
    }
  },
  render: function() {
    return React.createElement("div", {
      "className": "welcome__main-nav"
    }, React.createElement("a", {
      "href": "/menu",
      "onClick": this.navigate,
      "className": "bg-img-grid--off-white",
      "id": "welcome__main-nav__button"
    }), React.createElement("p", {
      "className": "center"
    }, "View All Projects"));
  }
});

Comp.Projects = React.createClass({
  render: function() {
    return React.createElement("div", null);
  }
});

Comp.Projects.Index = React.createClass({
  displayName: 'Projects.Index',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("div", {
      "className": "atl fill-parent"
    }, React.createElement(Comp.SideBar, {
      "buttons": [
        {
          title: 'Submit Comment',
          method: 'comment',
          icon: 'comment',
          isToggleable: false
        }
      ]
    }), React.createElement("div", {
      "id": "atl__main",
      "className": "-id-atl__main fill-parent"
    }, React.createElement("div", {
      "className": "atl__main"
    }, React.createElement("div", {
      "className": "atl__nav bg-c-off-white"
    }, React.createElement("h1", {
      "className": "title title--compact"
    }, "Explore Atlas"), React.createElement(Comp.Projects.Index.ProjectTemplates, {
      "App": this.props.App,
      "projectTemplates": this.props.App.dataCache.projectTemplates
    }), React.createElement(Comp.Projects.Index.ProjectSections, {
      "App": this.props.App,
      "projectSections": this.props.App.dataCache.projectSections
    })), React.createElement(Comp.Projects.Index.Projects, {
      "App": this.props.App,
      "projects": this.props.App.dataCache.projects,
      "projectTemplates": this.props.App.dataCache.projectTemplates,
      "projectSections": this.props.App.dataCache.projectSections
    }))));
  },
  componentDidMount: function() {
    this._fetchProjects();
    this._fetchProjectSections();
    this._fetchProjectTemplates();
    return this._updateOnFilterChange();
  },
  _updateOnFilterChange: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this.listenTo(App.vent, 'project:filter:change', this.forceUpdate);
    }
  },
  _fetchProjects: function() {
    var App, projects;
    App = this.props.App;
    if (App != null) {
      projects = App.reqres.request("project:entities", {
        cache: true
      });
      if ((projects.length != null) && projects.length > 0) {
        App.dataCache.projects = projects;
        this.forceUpdate();
      }
      return projects.on('reset', (function(_this) {
        return function() {
          App.dataCache.projects = projects;
          return _this.forceUpdate();
        };
      })(this));
    }
  },
  _fetchProjectSections: function() {
    var App, projectSections;
    App = this.props.App;
    if (App != null) {
      projectSections = App.reqres.request("project:section:entities", {
        cache: true
      });
      App.dataCache.projectSections = projectSections;
      return this.forceUpdate();
    }
  },
  _fetchProjectTemplates: function() {
    var App, projectTemplates;
    App = this.props.App;
    if (App != null) {
      projectTemplates = App.reqres.request("project:template:entities", {
        cache: true
      });
      App.dataCache.projectTemplates = projectTemplates;
      return this.forceUpdate();
    }
  }
});

Comp.Projects.Index.ProjectSections = React.createClass({
  displayName: 'Projects.Index.ProjectSections',
  render: function() {
    return React.createElement("ul", {
      "className": "atl__project-section-filter"
    }, this._renderList());
  },
  _renderList: function() {
    if (this.props.projectSections == null) {
      return;
    }
    return this.props.projectSections.map((function(_this) {
      return function(item, i) {
        return React.createElement(Comp.Projects.Index.ProjectSections.Item, {
          "App": _this.props.App,
          "projectSection": item,
          "key": i
        });
      };
    })(this));
  }
});

Comp.Projects.Index.ProjectSections.Item = React.createClass({
  displayName: 'Projects.Index.ProjectSections.Item',
  render: function() {
    var projectSection;
    projectSection = this.props.projectSection;
    return React.createElement("li", {
      "className": "toggle-button toggle-button--black " + this.getModifierClass(),
      "onClick": this.toggleActiveState
    }, React.createElement(Comp.Icons.Hex, {
      "className": 'toggle-button__icon'
    }), React.createElement("div", {
      "className": "toggle-button__text"
    }, React.createElement("p", null, projectSection.get('name'))));
  },
  getModifierClass: function() {
    if (this.props.projectSection.get('_isActive') === false) {
      return 'toggle-button--inactive';
    }
    return '';
  },
  toggleActiveState: function() {
    var App;
    this.props.projectSection.toggleActiveState();
    App = this.props.App;
    if (App != null) {
      return App.vent.trigger('project:filter:change');
    }
  }
});

Comp.Projects.Index.ProjectTemplates = React.createClass({
  displayName: 'Projects.Index.ProjectTemplates',
  render: function() {
    return React.createElement("ul", {
      "className": "atl__project-template-filter"
    }, this._renderList());
  },
  _renderList: function() {
    if (this.props.projectTemplates == null) {
      return;
    }
    return this.props.projectTemplates.map((function(_this) {
      return function(item, i) {
        return React.createElement(Comp.Projects.Index.ProjectTemplates.Item, {
          "App": _this.props.App,
          "projectTemplate": item,
          "key": i
        });
      };
    })(this));
  }
});

Comp.Projects.Index.ProjectTemplates.Item = React.createClass({
  displayName: 'Projects.Index.ProjectTemplates.Item',
  render: function() {
    var projectTemplate;
    projectTemplate = this.props.projectTemplate;
    return React.createElement("li", {
      "className": "icon-button " + this._getModifierClasses(),
      "onClick": this.toggleActiveState
    }, React.createElement("div", {
      "className": "icon-button__icon bg-img-" + (this._getIcon()) + "--black"
    }), React.createElement("p", {
      "className": "icon-button__text"
    }, projectTemplate.get('display_name')));
  },
  _getModifierClasses: function() {
    var classes, projectTemplate;
    classes = [];
    projectTemplate = this.props.projectTemplate;
    if (projectTemplate.get('id') === '2') {
      classes.push('hidden');
    }
    if (projectTemplate.get('_isActive')) {
      classes.push('icon-button--active');
    }
    if (classes.length === 0) {
      return '';
    }
    return classes.join(' ');
  },
  _getIcon: function() {
    var templateName;
    templateName = this.props.projectTemplate.get('name');
    switch (templateName) {
      case 'Tilemap':
        return 'map';
      case 'Explainer':
        return 'dictionary';
      case 'Polling':
        return 'graph';
    }
  },
  toggleActiveState: function() {
    var App;
    this.props.projectTemplate.toggleActiveState();
    App = this.props.App;
    if (App != null) {
      return App.vent.trigger('project:filter:change');
    }
  }
});

Comp.Projects.Index.Projects = React.createClass({
  displayName: 'Projects.Index.Projects',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("div", {
      "className": "atl__projects"
    }, this._renderList());
  },
  _renderList: function() {
    if (this.props.projects == null) {
      return;
    }
    return this.props.projects.map((function(_this) {
      return function(project, i) {
        return React.createElement(Comp.Projects.Index.Projects.Project, {
          "key": i,
          "App": _this.props.App,
          "project": project,
          "projects": _this.props.projects,
          "projectSections": _this.props.projectSections,
          "projectTemplates": _this.props.projectTemplates
        });
      };
    })(this));
  },
  componentDidUpdate: function() {
    var projects;
    projects = this.props.projects;
    if (projects != null) {
      return this._injectProjectImages();
    }
  },
  _injectProjectImages: function() {
    var projects;
    projects = this.props.projects;
    if (projects.imagesAlreadyInjected) {
      return;
    }
    return $.ajax({
      url: 'api/v1/projects/image',
      type: 'get',
      success: (function(_this) {
        return function(data) {
          var dataWithImage, datum, j, len, project;
          dataWithImage = [];
          for (j = 0, len = data.length; j < len; j++) {
            datum = data[j];
            if (datum.encoded_image != null) {
              project = projects.findWhere({
                atlas_url: datum.atlas_url
              });
              project.set('encoded_image', datum.encoded_image);
              project.set('image_credit', datum.image_credit);
            }
          }
          projects.imagesAlreadyInjected = true;
          return _this.forceUpdate();
        };
      })(this)
    });
  }
});

Comp.Projects.Index.Projects.Project = React.createClass({
  displayName: 'Projects.Index.Projects.Item',
  render: function() {
    var project;
    project = this.props.project;
    return React.createElement("a", {
      "className": "atl__project " + this.getModifierClasses(),
      "onMouseEnter": this.applyBackgroundColor,
      "onMouseLeave": this.removeBackgroundColor,
      "onClick": this.launch,
      "href": project.get('atlas_url')
    }, React.createElement("div", {
      "className": "atl__project__background atl__project__background--unselected",
      "style": this.getBackgroundStyle()
    }, React.createElement("div", {
      "className": "center--content"
    }, React.createElement("p", {
      "className": "atl__project__background__initials"
    }, this.getInitials()))), React.createElement("div", {
      "className": "atl__project__text",
      "ref": "project-text"
    }, React.createElement("div", {
      "className": "center--content"
    }, React.createElement("h1", null, project.get('title')))), this.renderAttribution());
  },
  renderAttribution: function() {
    var project;
    project = this.props.project;
    if (!((project.get('image_credit') != null) && project.get('image_credit') !== '')) {
      return;
    }
    return React.createElement("div", {
      "className": "atl__attribution bg-img-info--black"
    }, React.createElement("div", {
      "className": "atl__attribution__link"
    }, React.createElement("p", null, 'Image Credit'), React.createElement("div", null, 'Shutterstock')));
  },
  getBackgroundStyle: function() {
    var project, url;
    project = this.props.project;
    if (!((project != null) && (project.get('encoded_image') != null))) {
      return;
    }
    url = "url('data:image/png;base64," + (project.get('encoded_image').replace(/(\r\n|\n|\r)/gm, '')) + "')";
    return {
      'backgroundImage': url
    };
  },
  getInitials: function() {
    var initials, project, title;
    project = this.props.project;
    if (project.get('encoded_image') != null) {
      return '';
    }
    title = project.get('title');
    if (title != null) {
      initials = title.substring(0, 1) + title.substring(1, 2).toLowerCase();
    }
    return initials;
  },
  getModifierClasses: function() {
    var classes, project;
    classes = [];
    project = this.props.project;
    if (project.get('project_template_id') === "1") {
      classes.push('atl__project--explainer');
    }
    if (project.get('is_section_overview') === 'Yes') {
      classes.push('atl__project--overview');
    }
    if (!this.test()) {
      classes.push('atl__project--hidden');
    }
    if (classes.length === 0) {
      return '';
    }
    return classes.join(' ');
  },
  test: function() {
    var project, projectSections, projectTemplates;
    project = this.props.project;
    projectSections = this.props.projectSections;
    projectTemplates = this.props.projectTemplates;
    if (!((projectSections != null) && (projectTemplates != null))) {
      return false;
    }
    return projectSections.test(project, 'project_section') && projectTemplates.test(project, 'project_template');
  },
  launch: function(e) {
    var App, href;
    e.preventDefault();
    href = this.props.project.get('atlas_url');
    App = this.props.App;
    if (App != null) {
      App.currentThemeColor = this.getColor().replace('0.8', '1.0');
    }
    if (typeof Backbone !== "undefined" && Backbone !== null) {
      return Backbone.history.navigate(href, {
        trigger: true
      });
    }
  },
  applyBackgroundColor: function() {
    var $el, App, color;
    color = this.getColor();
    $el = $(React.findDOMNode(this.refs['project-text']));
    $el.css('background-color', color);
    App = this.props.App;
    if (App != null) {
      return App.commands.execute('set:header:strip:color', {
        color: color
      });
    }
  },
  removeBackgroundColor: function() {
    var $el, App;
    $el = $(React.findDOMNode(this.refs['project-text']));
    $el.css('background-color', '');
    App = this.props.App;
    if (App != null) {
      return App.commands.execute('set:header:strip:color', 'none');
    }
  },
  getColor: function() {
    var App, color, index, project, projects;
    App = this.props.App;
    project = this.props.project;
    projects = this.props.projects;
    if ((App != null) && (project != null) && (projects != null)) {
      index = projects.indexOf(project);
      color = App.CSS.Colors.toRgba(modulo(index, 15), 0.8);
      return color;
    }
  }
});

Comp.Projects.Show = React.createClass({
  displayName: 'Projects.Show',
  mixins: [Comp.Mixins.BackboneEvents],
  getInitialState: function() {
    return {};
  },
  render: function() {
    return React.createElement("div", {
      "className": this._getClass()
    }, React.createElement(Comp.SideBar, {
      "App": this.props.App,
      "project": this.state.project
    }), React.createElement("div", {
      "id": "atl__main",
      "className": "-id-atl__main fill-parent"
    }, this._renderProject()));
  },
  getDefaultProps: function() {
    return {
      related: []
    };
  },
  _getClass: function() {
    var cls, data, project;
    project = this.state.project;
    if (project == null) {
      return "";
    }
    cls = "atl atl--filter-display";
    cls += ' atl--' + project.get('project_template_name').toLowerCase();
    data = project.get('data');
    if ((data != null) && (data.infobox_variables.length < 2)) {
      cls += ' atl__info-box--narrow';
    }
    return cls;
  },
  _renderProject: function() {
    if (this.state.project == null) {
      return React.createElement(Comp.Loading, null);
    }
    if (this._isModelStatic()) {
      return React.createElement(Comp.Projects.Show.Explainer, {
        "App": this.props.App,
        "project": this.state.project,
        "related": this.state.related
      });
    }
    if (this._isModelTilemap()) {
      return React.createElement(Comp.Projects.Show.Tilemap, {
        "App": this.props.App,
        "project": this.state.project
      });
    }
    return React.createElement(Comp.Loading, null);
  },
  _isModelStatic: function() {
    var project, ref;
    project = this.state.project;
    if (!((project != null) && (project.get != null))) {
      return false;
    }
    return ((ref = project.get('project_template_name')) === "Explainer" || ref === "Polling" || ref === "Policy Brief" || ref === "PolicyBrief");
  },
  _isModelTilemap: function() {
    var project;
    project = this.state.project;
    if (!((project != null) && (project.get != null))) {
      return false;
    }
    return project.get('project_template_name') === 'Tilemap';
  },
  _fetchRelatedProjects: function() {
    var App, id, project, related;
    App = this.props.App;
    project = this.state.project;
    if ((App != null) && (project != null)) {
      id = project.get('id');
      related = App.reqres.request('project:entities', {
        queryString: "related_to=" + id,
        cache: false
      });
      return related.on('reset', (function(_this) {
        return function() {
          return _this.setState({
            related: related
          });
        };
      })(this));
    }
  },
  _fetchProject: function() {
    var App, project;
    App = this.props.App;
    if (App != null) {
      project = App.reqres.request('project:entity', {
        atlas_url: App.currentAtlasUrl
      });
      return project.on('sync', (function(_this) {
        return function() {
          if (project.exists()) {
            project.prepOnClient(App);
            App.vent.trigger('current:project:change', project);
            _this.setState({
              project: project
            });
            return _this._fetchRelatedProjects();
          } else {
            return Backbone.history.navigate('welcome', {
              trigger: true
            });
          }
        };
      })(this));
    }
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this._fetchProject();
    }
  },
  componentWillUnmount: function() {
    var App;
    return App = this.props.App;
  }
});

Comp.Projects.Show.Tilemap = React.createClass({
  displayName: 'Comp.Projects.Show.Tilemap',
  render: function() {
    return React.createElement("div", {
      "id": "atl__main__temp",
      "className": "fill-parent"
    });
    return React.createElement("div", {
      "className": 'atl__main fill-parent'
    }, React.createElement(Comp.Projects.Show.Tilemap.Map, {
      "App": this.props.App,
      "project": this.props.project
    }), React.createElement("div", {
      "className": "atl__base-layer"
    }), React.createElement("div", {
      "className": "atl__settings-bar"
    }, React.createElement(Comp.Projects.Show.Tilemap.Headline, {
      "App": this.props.App,
      "project": this.props.project
    }), React.createElement(Comp.Projects.Show.Tilemap.Search, {
      "App": this.props.App,
      "project": this.props.project
    }), React.createElement(Comp.Projects.Show.Tilemap.Filter, {
      "App": this.props.App,
      "filter": this.getFilter()
    })), React.createElement(Comp.Projects.Show.Tilemap.Legend, {
      "App": this.props.App,
      "filter": this.getFilter()
    }), React.createElement(Comp.Projects.Show.Tilemap.Info, {
      "App": this.props.App,
      "project": this.props.project
    }), React.createElement(Comp.Projects.Show.Tilemap.Popup, {
      "App": this.props.App,
      "project": this.props.project
    }), React.createElement(Comp.Projects.Show.Tilemap.InfoBox, {
      "App": this.props.App,
      "project": this.props.project
    }));
  },
  getFilter: function() {
    return this.props.project.get('data').filter;
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App == null) {
      return;
    }
    return App.Tilemap.start();
  },
  componentWillUnmount: function() {
    var App;
    App = this.props.App;
    if (App == null) {
      return;
    }
    return App.Tilemap.stop();
  }
});

Comp.Projects.Show.Tilemap.Filter = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Comp.Projects.Show.Tilemap.Filter',
  render: function() {
    return React.createElement("div", {
      "className": 'atl__filter'
    }, React.createElement("div", {
      "id": "atl__filter__keys",
      "className": "-id-atl__filter__keys"
    }, React.createElement("div", {
      "className": "atl__filter__keys"
    }, React.createElement("ul", null, this.renderKeys()))), React.createElement("div", {
      "id": "atl__filter__values",
      "className": "-id-atl__filter__values"
    }, React.createElement("div", {
      "className": "atl__filter__values"
    }, React.createElement("ul", null, this.renderValues()))));
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this.listenTo(App.vent, 'key:click value:click', this.forceUpdate);
    }
  },
  renderKeys: function() {
    var keys;
    keys = this.props.filter.children;
    return keys.map((function(_this) {
      return function(key, i) {
        return React.createElement(Comp.Projects.Show.Tilemap.Filter.Key, {
          "App": _this.props.App,
          "filterKey": key
        });
      };
    })(this));
  },
  renderValues: function() {
    var values;
    values = this.props.filter.getActiveChild().children;
    return values.map((function(_this) {
      return function(value, i) {
        return React.createElement(Comp.Projects.Show.Tilemap.Filter.Value, {
          "App": _this.props.App,
          "filterValue": value
        });
      };
    })(this));
  }
});

Comp.Projects.Show.Tilemap.Filter.Key = React.createClass({
  displayName: 'Comp.Projects.Show.Tilemap.Filter.Key',
  render: function() {
    return React.createElement("li", {
      "className": 'button ' + this.getModifierClass(),
      "onClick": this.toggle.bind(this)
    }, React.createElement("p", null, this.props.filterKey.get('display_title')));
  },
  getModifierClass: function() {
    if (this.props.filterKey.isActive()) {
      return 'button--active';
    }
  },
  toggle: function() {
    var App;
    this.props.filterKey.clickToggle();
    App = this.props.App;
    if (App != null) {
      return App.vent.trigger('key:click');
    }
  }
});

Comp.Projects.Show.Tilemap.Filter.Value = React.createClass({
  displayName: 'Comp.Projects.Show.Tilemap.Filter.Value',
  render: function() {
    return React.createElement("li", {
      "className": 'toggle-button ' + this.getModifierClass(),
      "onClick": this.toggle.bind(this)
    }, React.createElement(Comp.Icons.Hex, {
      "className": "toggle-button__icon",
      "colorClassName": this.getColorClass()
    }), React.createElement("div", {
      "className": "toggle-button__text"
    }, React.createElement("p", null, this.props.filterValue.get('value'))));
  },
  getModifierClass: function() {
    var siblingsIncludingSelf;
    siblingsIncludingSelf = this.props.filterValue.parent.children;
    console.log;
    if (!this.props.filterValue.isActive()) {
      return 'toggle-button--inactive';
    }
    return '';
  },
  getColorClass: function() {
    return "bg-c-" + (this.props.filterValue.getFriendlySiblingIndex(15));
  },
  toggle: function() {
    var App;
    this.props.filterValue.toggle();
    App = this.props.App;
    if (App != null) {
      return App.vent.trigger('value:click');
    }
  }
});

Comp.Projects.Show.Tilemap.Headline = React.createClass({
  render: function() {
    var project;
    project = this.props.project;
    return React.createElement("div", {
      "className": 'atl__headline'
    }, React.createElement("p", {
      "className": 'atl__headline__sections',
      "dangerouslySetInnerHTML": {
        __html: this.getSectionText()
      }
    }), React.createElement("h1", {
      "className": 'atl__headline__title'
    }, project.get('title')), React.createElement("h2", {
      "className": 'atl__headline__description'
    }, project.get('short_description'), React.createElement("a", {
      "href": '#',
      "className": 'link'
    }, "More...")));
  },
  getSectionText: function() {
    var project, projectSectionNames;
    project = this.props.project;
    projectSectionNames = project.get('project_section_names');
    if (projectSectionNames == null) {
      return '';
    }
    return projectSectionNames.join(',<br>').toUpperCase();
  }
});

Comp.Projects.Show.Tilemap.Info = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "atl__info"
    }, React.createElement("div", {
      "className": "atl__info__key"
    }, React.createElement("p", null, 'Key')), React.createElement("div", {
      "className": "atl__info__value"
    }, React.createElement("p", null, 'Value')), React.createElement("div", {
      "className": "atl__info__items"
    }, React.createElement("p", null, 'Items')));
  }
});

Comp.Projects.Show.Tilemap.InfoBox = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": "atl__info-box"
    }, React.createElement("a", {
      "href": "#",
      "className": "bg-img-no--black atl__info-box__close"
    }), React.createElement("div", {
      "className": "atl__title-bar atl__title-bar--image bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl__title-bar__background"
    }), React.createElement("div", {
      "className": "atl__title-bar__content"
    }, React.createElement("h1", {
      "className": 'title'
    }, 'Name or Title'), React.createElement("ul", null, this.renderWebsite()))), React.createElement("div", {
      "className": "atl__content-bar bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl-grid"
    }, React.createElement("div", {
      "className": "atl-grid__1-3"
    }, React.createElement("div", {
      "className": "atl__page-nav"
    }, React.createElement("div", {
      "className": "atl__toc"
    }, React.createElement("p", null, "Page Contents"), React.createElement("div", {
      "id": "atl__toc__list"
    })), React.createElement("div", {
      "id": "atl__related"
    }))), React.createElement("div", {
      "className": "atl-grid__2-3"
    }, React.createElement("div", {
      "className": "static-content"
    }, 'Body Text')), React.createElement("div", {
      "className": "atl-grid__3-3"
    }))));
  },
  renderWebsite: function() {
    return React.createElement("li", null, React.createElement("a", {
      "className": "icon-button",
      "href": "<%= website %>",
      "target": "_blank"
    }, React.createElement("div", {
      "className": "icon-button__icon bg-img-link--black"
    }), React.createElement("div", {
      "className": "icon-button__text"
    }, "Website")));
  }
});

Comp.Projects.Show.Tilemap.Legend = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Comp.Projects.Show.Tilemap.Legend',
  render: function() {
    return React.createElement("div", {
      "className": "atl__legend"
    }, React.createElement("ul", {
      "className": "legend-icons"
    }, this.renderList()));
  },
  renderList: function() {
    return this.props.filter.getActiveChild().children.map((function(_this) {
      return function(filterValue) {
        return React.createElement(Comp.Projects.Show.Tilemap.Legend.Icon, {
          "filterValue": filterValue,
          "App": _this.props.App
        });
      };
    })(this));
  }
});

Comp.Projects.Show.Tilemap.Legend.Icon = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Comp.Projects.Show.Tilemap.Legend.Icon',
  render: function() {
    return React.createElement("li", {
      "className": this.getClass(),
      "onClick": this.toggle.bind(this)
    }, React.createElement(Comp.Icons.Hex, {
      "className": '',
      "colorClassName": this.getColorClass()
    }));
  },
  getClass: function() {
    var base, cls;
    base = 'atl__legend__icon';
    cls = base;
    cls += this.props.filterValue.isActive() ? '' : ' ' + base + '--inactive';
    return cls;
  },
  getColorClass: function() {
    return "bg-c-" + (this.props.filterValue.getFriendlySiblingIndex(15));
  },
  toggle: function() {
    var App;
    this.props.filterValue.toggle();
    App = this.props.App;
    if (App != null) {
      return App.vent.trigger('value:click');
    }
  }
});

Comp.Projects.Show.Tilemap.Map = React.createClass({
  displayName: 'Comp.Projects.Show.Tilemap.Map',
  render: function() {
    return React.createElement("div", {
      "className": "fill-parent",
      "id": "atl__map"
    });
  },
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App == null) {
      return;
    }
    return App.Tilemap.Map.Controller.show();
  },
  componentWillUnmount: function() {
    var App;
    App = this.props.App;
    if (App == null) {
      return;
    }
    return App.Tilemap.Map.Controller.destroy();
  }
});

Comp.Projects.Show.Tilemap.Popup = React.createClass({
  render: function() {
    return React.createElement("div", null);
  }
});

Comp.Projects.Show.Tilemap.Search = React.createClass({
  render: function() {
    return React.createElement("div", null);
  }
});

Comp.Projects.Show.Explainer = React.createClass({
  displayName: 'Projects.Show.Explainer',
  render: function() {
    return React.createElement("div", {
      "className": "fill-parent"
    }, React.createElement("div", {
      "className": "atl__title-bar atl__title-bar--solid bg-c-off-white",
      "ref": 'title-bar'
    }, React.createElement("div", {
      "className": "atl__title-bar__background",
      "ref": 'title-bar__background'
    }), React.createElement("div", {
      "className": "atl__title-bar__content"
    }, React.createElement("h1", {
      "className": 'title'
    }, this._getTitle()), React.createElement("ul", null, React.createElement("li", null, "Updated: ", this._getUpdateMoment())))), React.createElement("div", {
      "className": "atl__content-bar bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl-grid"
    }, React.createElement("div", {
      "className": "atl-grid__1-3"
    }, React.createElement("div", {
      "className": "atl__page-nav",
      "ref": "page-nav"
    }, this._renderToc())), React.createElement("div", {
      "className": "atl-grid__2-3"
    }, React.createElement("div", {
      "className": "static-content",
      "dangerouslySetInnerHTML": {
        __html: this._getBodyText()
      }
    }), React.createElement(Comp.Projects.Show.Explainer.Related, {
      "related": this.props.related
    })), React.createElement("div", {
      "className": "atl-grid__3-3"
    }))));
  },
  componentDidMount: function() {
    this._buildAtlasCharts();
    this._setStickyNavLayout();
    this._onScroll();
    return this._setThemeColor();
  },
  componentWillUnmount: function() {
    this._destroyAtlasCharts();
    return this._offScroll();
  },
  _getTitle: function() {
    var title;
    title = this.props.project != null ? this.props.project.get('title') : '';
    return title;
  },
  _getBodyText: function() {
    var bodyText;
    bodyText = this.props.project != null ? this.props.project.get('body_text') : '';
    return bodyText;
  },
  _renderToc: function() {
    var renderedList, tocItems;
    tocItems = this.props.project.get('body_text_toc');
    if (!((tocItems != null) && (tocItems.map != null) && tocItems.length > 0)) {
      return;
    }
    renderedList = tocItems.map((function(_this) {
      return function(item, i) {
        return React.createElement("li", {
          "className": 'toc-' + item.tagName,
          "key": 'toc-' + i
        }, React.createElement("a", {
          "href": "#toc-" + item.id
        }, item.content));
      };
    })(this));
    return React.createElement("div", {
      "className": "atl__toc"
    }, React.createElement("p", null, "Page Contents"), React.createElement("div", {
      "id": "atl__toc__list"
    }, React.createElement("ul", null, renderedList)));
  },
  _renderRelated: function() {
    var relatedItems, renderedList;
    relatedItems = this.props.related;
    if (!((relatedItems != null) && (relatedItems.map != null) && relatedItems.length > 0)) {
      return;
    }
    renderedList = relatedItems.map(function(item, i) {
      return React.createElement("li", {
        "key": 'related-' + i
      }, React.createElement("a", {
        "className": "link",
        "href": "/" + item.get('atlas_url')
      }, item.get('title')));
    });
    return React.createElement("div", {
      "className": "atl__related"
    }, React.createElement("p", null, "Related Pages"), React.createElement("ul", null, renderedList));
  },
  _getUpdateMoment: function() {
    if (typeof moment !== "undefined" && moment !== null) {
      return moment(this.props.project.get('updated_at')).format("MMMM Do YYYY");
    }
  },
  _buildAtlasCharts: function() {
    if ((typeof ChartistHtml !== "undefined" && ChartistHtml !== null) && (typeof $ !== "undefined" && $ !== null)) {
      this.chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'));
      return this.chartManager.render();
    }
  },
  _destroyAtlasCharts: function() {
    if (this.chartManager != null) {
      return this.chartManager.destroy();
    }
  },
  _setStickyNavLayout: function(subClasses) {
    var $elem, className, scrollTop;
    if (typeof $ !== "undefined" && $ !== null) {
      scrollTop = $('#atl__main').scrollTop();
      className = "atl__page-nav";
      $elem = $(React.findDOMNode(this.refs['page-nav']));
      if (scrollTop > this._getTitleBarHeight()) {
        return $elem.addClass(className + "--fixed");
      } else {
        return $elem.removeClass(className + "--fixed");
      }
    }
  },
  _getTitleBarHeight: function() {
    var $el;
    if (!((this._titleBarHeightCache != null) && (this._titleBarHeightCache > 0))) {
      $el = $(React.findDOMNode(this.refs['title-bar']));
      this._titleBarHeightCache = $el.height();
    }
    return this._titleBarHeightCache;
  },
  _onScroll: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return App.vent.on('scroll', this._setStickyNavLayout);
    }
  },
  _offScroll: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return App.vent.off('scroll', this._setStickyNavLayout);
    }
  },
  _setThemeColor: function() {
    var $bg, App, color;
    App = this.props.App;
    if ((typeof $ !== "undefined" && $ !== null) && (App != null)) {
      $bg = $(React.findDOMNode(this.refs['title-bar__background']));
      color = App.currentThemeColor;
      if (color != null) {
        return $bg.css('background-color', color);
      }
    }
  }
});

Comp.Projects.Show.Explainer.Related = React.createClass({
  displayName: 'Projects.Show.Explainer.Related',
  render: function() {
    return React.createElement("div", {
      "className": "atl__related"
    }, React.createElement("p", null, "Related Pages"), React.createElement("ul", null, this.renderList()));
  },
  renderList: function() {
    var relatedItems;
    relatedItems = this.props.related;
    if (relatedItems == null) {
      return;
    }
    return relatedItems.map(function(item, i) {
      return React.createElement("li", {
        "key": 'related-' + i
      }, React.createElement(Comp.Projects.Show.Explainer.Related.Item, {
        "relatedItem": item
      }));
    });
  }
});

Comp.Projects.Show.Explainer.Related.Item = React.createClass({
  displayName: 'Projects.Show.Explainer.Related.Item',
  render: function() {
    var item;
    item = this.props.relatedItem;
    return React.createElement("a", {
      "className": "link",
      "href": "/" + item.get('atlas_url'),
      "onClick": this.navigate
    }, item.get('title'));
  },
  navigate: function(e) {}
});
