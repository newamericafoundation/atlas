// Initialize components namespace.
"use strict";

var Comp = {};

Comp.Mixins = {};

Comp.Icons = {};

// Add Backbone Events to component.
Comp.Mixins.BackboneEvents = {

	componentWillMount: function componentWillMount() {
		if (_ && Backbone) {
			_.extend(this, Backbone.Events);
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		if (this.stopListening) {
			this.stopListening();
		}
	}

};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Loading = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class() {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'loading-icon' },
				React.createElement(
					'div',
					null,
					'Loading...'
				)
			);
		}
	}]);

	return _class;
})(React.Component);
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
      "App": App,
      "size": 30.
    })));
  }
});

Comp.Setup.Patterns = React.createClass({
  displayName: 'Setup.Patterns',
  mixins: [Comp.Mixins.BackboneEvents],
  render: function() {
    return React.createElement("defs", null, this.renderList());
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  renderList: function() {
    var colorCodes, i, j, ref, results;
    results = [];
    for (i = j = 0, ref = this.props.size; j < ref; i = j += 1) {
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
  componentDidMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      App.commands.setHandler('reset:patterns', this.resetPatterns.bind(this));
      return App.reqres.setHandler('get:pattern:id', this.ensureAndGetPattern.bind(this));
    }
  },
  componentWillUnmount: function() {
    var App;
    App = this.props.App;
    return App.commands.clearHandler('reset:patterns');
  },
  resetPatterns: function() {
    return this.setState({
      data: []
    });
  },
  ensureAndGetPattern: function(colorCodes) {
    var data, existingColorCodes, i, j, len, ref;
    ref = this.state.data;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      existingColorCodes = ref[i];
      if (colorCodes.join('-') === existingColorCodes.join('-')) {
        return i;
      }
    }
    data = this.state.data;
    if (data.length > this.props.size - 2) {
      data = [];
    }
    data.push(colorCodes);
    this.setState({
      data: data
    });
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
    if (this.props.colorCodes == null) {
      return React.createElement("pattern", null);
    }
    colorCount = this.props.colorCodes.length;
    dim = colorCount === 2 ? 12 : 18;
    className = 'striped-pattern-' + this.props.colorCodes.join('-');
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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Icons.Adp = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class() {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M83.2,66.6v-0.9h0.7c0.5,0,0.6,0.1,0.6,0.4c0,0.3-0.1,0.5-0.7,0.5 M83.7,67.2c0.2,0,0.4,0,0.5,0.2 c0.2,0.2,0.2,0.5,0.2,0.8c0,0.2,0.1,0.5,0.1,0.7h0.7c-0.1-0.3-0.2-0.7-0.2-1.1C85,67.3,85,67.1,84.4,67v0c0.5-0.1,0.8-0.4,0.8-0.9 c0-0.8-0.7-1-1.4-1h-1.2v3.7h0.6v-1.6H83.7z M83.9,70.2c1.7,0,3.1-1.4,3.1-3.1c0-1.7-1.4-3.1-3.1-3.1c-1.7,0-3.1,1.4-3.1,3.1 C80.7,68.8,82.1,70.2,83.9,70.2z M83.9,69.6c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6 C86.4,68.4,85.3,69.6,83.9,69.6z" }),
					React.createElement("path", { d: "M78.6,38.5h-5v5h5c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2h-5v5h5c4,0,7.2-3.2,7.2-7.2 C85.8,41.7,82.5,38.5,78.6,38.5 M49.8,65.1c6,0,11.2-3.5,13.7-8.6h6.4v8.6h3.6v-8.6h5c6,0,10.8-4.8,10.8-10.8 c0-6-4.8-10.8-10.8-10.8h-8.6v13h-5.1c-1-7.3-7.3-13-15-13H32.1L14.5,65.1h4.2l5-8.6h18.1v8.6H49.8z M94.4,45.7 c0,8.7-7.1,15.8-15.8,15.8v8.6H64.9v-6.7c-3.7,4.1-9.1,6.7-15,6.7h-13v-8.6H26.6l-5,8.6h-16l23.5-40.3h20.7c6,0,11.3,2.6,15,6.7 v-6.7h13.7C87.3,29.8,94.4,36.9,94.4,45.7z M36.8,38.5v9.4h-8l-2.9,5h16V38.5H36.8z M61.4,50c0,6.4-5.2,11.5-11.5,11.5h-4.4v-5h4.4 c3.6,0,6.5-2.9,6.5-6.5c0-3.6-2.9-6.5-6.5-6.5h-4.4v-5h4.4C56.2,38.5,61.4,43.6,61.4,50z" })
				)
			);
		}
	}]);

	return _class;
})(React.Component);

Comp.Icons.AroundTheWorld = (function (_React$Component2) {
	_inherits(_class2, _React$Component2);

	function _class2() {
		_classCallCheck(this, _class2);

		_get(Object.getPrototypeOf(_class2.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class2, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M80.3,29.4c3.3,5.3,5.3,11.3,5.8,17.6h-13c0-0.2,0-0.4,0-0.6l0-0.2c0-0.7-0.1-1.4-0.2-2 c0-0.3-0.1-0.6-0.1-1c-0.1-0.7-0.2-1.4-0.3-2.1l0-0.3c0-0.1,0-0.3-0.1-0.4c-0.2-1-0.3-1.9-0.5-2.8c0-0.1,0-0.1-0.1-0.2l0-0.2 c-0.1-0.3-0.2-0.7-0.3-1c0,0-0.1,0-0.1,0.1c-1.9,1.6-3.6,3-5.1,4.3c0,0.3,0.1,0.5,0.1,0.8c0,0.2,0.1,0.5,0.1,0.7l0,0.1 c0.1,0.6,0.2,1.1,0.2,1.8c0,0.3,0.1,0.6,0.1,0.9c0.1,0.6,0.1,1.2,0.1,1.8l0,0.3c0,0,0,0.1,0,0.1h-8.2c-0.8,0.7-1.7,1.5-2.6,2.3 c-1.5,1.4-2.8,2.6-4,3.7h14.7c0,0.8-0.1,1.7-0.2,2.8c0,0.2,0,0.4-0.1,0.5l0,0.3c-0.2,1.2-0.3,2.2-0.5,3.2l0,0.1 c-0.2,0.9-0.4,1.9-0.7,3.1c-0.1,0.3-0.1,0.5-0.2,0.8c-0.3,0.9-0.5,1.8-0.8,2.5c-0.8-0.3-1.7-0.5-2.8-0.8c-0.3-0.1-0.5-0.1-0.8-0.2 c-1.3-0.3-2.3-0.5-3.3-0.7c0,0-0.1,0-0.2,0c-1-0.2-2-0.3-3.3-0.5c-0.3,0-0.6-0.1-0.9-0.1c-1.1-0.1-2.1-0.2-3-0.2V63l-6-0.6v1.3 c-1,0-2,0.1-3,0.2c-0.3,0-0.6,0.1-0.9,0.1c-1.3,0.1-2.3,0.3-3.3,0.5c-0.1,0-0.1,0-0.2,0c-1,0.2-2.1,0.4-3.3,0.7 c-0.3,0.1-0.6,0.1-0.8,0.2c-1.1,0.3-1.9,0.5-2.8,0.8c-0.3-0.7-0.5-1.6-0.8-2.5c-0.1-0.3-0.1-0.5-0.2-0.8c-0.3-1.2-0.5-2.2-0.7-3.1 l0-0.1c-0.2-0.9-0.3-1.9-0.5-3.2c0-0.3-0.1-0.5-0.1-0.8c-0.1-1-0.2-1.9-0.2-2.8h2.2l0.6-6h-2.8c0,0,0-0.1,0-0.1l0-0.3 c0-0.6,0.1-1.2,0.1-1.8c0-0.3,0.1-0.5,0.1-0.8l0-0.1c0.1-0.6,0.1-1.1,0.2-1.7c0-0.3,0.1-0.6,0.1-0.8c0.1-0.7,0.3-1.5,0.4-2.1 c0-0.1,0-0.1,0-0.2l0-0.1c0.2-0.8,0.4-1.6,0.6-2.4c0-0.1,0.1-0.3,0.1-0.4l0.1-0.3c0.2-0.6,0.3-1.1,0.5-1.7c0.1-0.3,0.2-0.5,0.3-0.8 c0.2-0.5,0.4-1.1,0.6-1.6l0.1-0.3c0-0.1,0.1-0.2,0.1-0.3c0.8,0.2,1.6,0.5,2.6,0.7c0.3,0.1,0.5,0.1,0.8,0.2c1.2,0.3,2.1,0.5,3.1,0.6 l0.1,0c0.9,0.2,1.9,0.3,3.2,0.4c0.3,0,0.5,0.1,0.8,0.1c1,0.1,1.9,0.2,2.7,0.2v3.8c0.6-0.4,1.1-0.8,1.8-1.2c4.2-2.7,7.7-5,11.2-7.1 c1.9-1.2,4-2.4,6.5-3.9c0.8-0.5,1.8-1,2.8-1.6c-0.1-0.2-0.2-0.3-0.3-0.5l-0.1-0.1c-0.3-0.5-0.6-1-0.9-1.4c-0.2-0.3-0.4-0.6-0.6-0.9 c-0.3-0.4-0.6-0.9-0.9-1.3L63.7,19c-0.1-0.2-0.3-0.4-0.4-0.6c-0.3-0.4-0.6-0.8-0.9-1.2l-0.2-0.2c-0.1-0.2-0.2-0.3-0.4-0.5 c-0.4-0.4-0.7-0.9-1.1-1.3L60.6,15c-0.1-0.1-0.2-0.2-0.3-0.3c-0.5-0.6-1-1.1-1.5-1.6l-0.3-0.3c0,0-0.1-0.1-0.1-0.1 c5.1,1.5,9.8,4.1,13.9,7.5c2.3-1.2,4.7-2.4,7.3-3.5C71.3,8.6,59.9,3.6,47.3,3.6C21.7,3.6,0.9,24.4,0.9,50 c0,25.6,20.8,46.4,46.4,46.4c25.6,0,46.4-20.8,46.4-46.4c0-9.1-2.6-17.6-7.2-24.7C84.4,26.5,82.2,28,80.3,29.4z M50.3,13.3 c0.1,0.1,0.3,0.2,0.4,0.3c0,0,0.1,0.1,0.1,0.1l0.1,0.1c0.4,0.3,0.7,0.6,1.1,1c0.1,0.1,0.2,0.2,0.3,0.3l0.2,0.1 c0.3,0.3,0.6,0.6,0.9,0.9c0.1,0.1,0.2,0.2,0.3,0.3l0.3,0.3c0.3,0.3,0.6,0.6,0.9,0.9c0.2,0.2,0.3,0.4,0.5,0.5l0.1,0.1 c0.3,0.3,0.6,0.7,0.9,1c0.2,0.2,0.4,0.5,0.6,0.7c0.3,0.4,0.6,0.7,0.9,1.1l0.1,0.2c0.2,0.2,0.3,0.4,0.5,0.6c0.3,0.4,0.6,0.8,0.9,1.3 l0.2,0.3c0.1,0.2,0.2,0.3,0.3,0.5c0.3,0.5,0.7,1.1,1,1.6c-0.6,0.2-1.2,0.3-1.8,0.5c-0.2,0.1-0.4,0.1-0.6,0.1 c-0.9,0.2-1.8,0.4-2.6,0.5c-0.1,0-0.1,0-0.2,0c-0.1,0-0.2,0-0.2,0c-0.7,0.1-1.5,0.2-2.3,0.3c-0.3,0-0.5,0.1-0.8,0.1 c-0.7,0.1-1.4,0.1-2.1,0.2V13.3z M31.2,80.5L31.2,80.5L31.2,80.5L31.2,80.5z M36.7,21.2L36.7,21.2c0.4-0.5,0.7-0.9,1-1.2 c0.2-0.2,0.4-0.5,0.6-0.7c0.3-0.4,0.6-0.7,0.9-1c0.2-0.2,0.4-0.4,0.6-0.6c0.3-0.3,0.6-0.6,0.9-0.9c0.2-0.2,0.4-0.4,0.5-0.5 c0.3-0.3,0.6-0.6,1-0.9l0.2-0.1c0.1-0.1,0.2-0.2,0.3-0.3c0.4-0.4,0.8-0.7,1.2-1.1l-0.3-0.5h0l0.4,0.4c0.1-0.1,0.3-0.2,0.4-0.3v14 c-0.7,0-1.4-0.1-2.1-0.2c-0.3,0-0.5-0.1-0.8-0.1c-0.8-0.1-1.5-0.2-2.2-0.3l-0.2,0c-0.1,0-0.2,0-0.2,0c-0.9-0.1-1.7-0.3-2.6-0.5 c-0.1,0-0.3-0.1-0.4-0.1l-0.2-0.1c-0.6-0.1-1.2-0.3-1.7-0.4c0.3-0.5,0.6-1.1,1-1.6c0.1-0.2,0.2-0.3,0.3-0.5l0.2-0.3 c0.3-0.5,0.6-0.9,0.9-1.3C36.4,21.7,36.5,21.5,36.7,21.2z M36.1,12.7c0,0-0.1,0.1-0.1,0.1l-0.1,0.1c-0.1,0.1-0.1,0.1-0.2,0.2 c-0.5,0.5-1,1-1.5,1.6c-0.1,0.1-0.2,0.2-0.3,0.3l-0.1,0.2c-0.4,0.4-0.7,0.8-1.1,1.3c-0.1,0.2-0.3,0.3-0.4,0.5l-0.2,0.2 c-0.3,0.4-0.6,0.8-0.9,1.2c-0.2,0.3-0.4,0.5-0.6,0.8c-0.3,0.4-0.6,0.9-0.9,1.3l-0.1,0.1c-0.2,0.2-0.3,0.5-0.5,0.7 c-0.3,0.5-0.6,0.9-0.9,1.4L28.3,23c-0.1,0.2-0.2,0.4-0.3,0.6c-0.1,0-0.2-0.1-0.4-0.2l-0.2-0.1c-0.2-0.1-0.3-0.1-0.5-0.2 c-1-0.4-1.8-0.9-2.6-1.3c-0.1,0-0.2-0.1-0.2-0.1L24,21.7c-0.7-0.4-1.3-0.8-2-1.2C26.1,16.9,30.9,14.3,36.1,12.7z M17.6,24.8 C17.7,24.9,17.7,24.9,17.6,24.8l0.2,0.1c0.2,0.1,0.4,0.3,0.6,0.4c1.1,0.7,2,1.2,2.9,1.7c0.1,0,0.1,0.1,0.2,0.1 c0.1,0,0.1,0.1,0.2,0.1c0.8,0.5,1.7,0.9,2.7,1.3c0.3,0.1,0.5,0.2,0.8,0.4c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0.1 c0,0.1-0.1,0.2-0.1,0.2c-0.3,0.8-0.5,1.4-0.8,2c-0.1,0.2-0.2,0.5-0.2,0.7l-0.1,0.2c-0.2,0.6-0.4,1.2-0.6,1.9l0,0.2 c-0.1,0.2-0.1,0.5-0.2,0.7c-0.2,0.7-0.4,1.5-0.6,2.3c0,0.1,0,0.1,0,0.2l0,0.2c-0.2,0.8-0.4,1.7-0.5,2.8c0,0.1,0,0.3-0.1,0.4 l-0.1,0.3c-0.1,0.8-0.2,1.5-0.3,2.1c0,0.3-0.1,0.6-0.1,1c-0.1,0.7-0.1,1.4-0.2,2l0,0.2c0,0.2,0,0.4,0,0.6h-13 C9.1,38.8,12.3,31.1,17.6,24.8z M17.4,72.3l-0.2,0.1c-0.4,0.3-0.7,0.5-1.1,0.8c-4.4-5.9-7-12.9-7.6-20.2h13c0,0,0,0,0,0l0,0.2 c0,0.7,0.1,1.4,0.1,2c0,0.3,0,0.5,0.1,0.8c0.1,0.6,0.1,1.2,0.2,1.8c0,0.2,0.1,0.5,0.1,0.7c0.1,0.9,0.3,1.7,0.4,2.4l0,0.2 c0.1,0.7,0.3,1.5,0.5,2.2c0,0.2,0.1,0.3,0.1,0.5l0.1,0.3c0.1,0.6,0.3,1.1,0.5,1.7c0.1,0.2,0.1,0.5,0.2,0.7c0.2,0.6,0.4,1.3,0.6,1.9 l0,0c-0.6,0.3-1.2,0.6-1.7,0.8l-0.6,0.3c-1.5,0.8-2.9,1.6-4.3,2.5C17.6,72.1,17.5,72.2,17.4,72.3z M20,77.8l0.2-0.2 c0.9-0.6,1.7-1.1,2.5-1.6c0.1,0,0.1-0.1,0.2-0.1c0.8-0.5,1.7-1,2.8-1.5c0.2-0.1,0.4-0.2,0.6-0.3l0.1,0c0.1,0,0.2-0.1,0.3-0.1 c0.3,0.7,0.7,1.4,1,2l0.2,0.3c0.4,0.8,0.9,1.5,1.3,2.2l0.1,0.2c0.5,0.7,0.9,1.4,1.4,2.1c0,0,0,0.1,0.1,0.1c0.5,0.7,0.9,1.3,1.5,2 l0,0.1c0.4,0.6,0.9,1.1,1.4,1.7l0.1,0.1c0,0,0.1,0.1,0.1,0.1c0.4,0.5,0.8,0.9,1.4,1.6l0.2,0.2c0.2,0.2,0.4,0.5,0.7,0.7 C30.1,85.5,24.6,82.2,20,77.8z M44.3,86.6c-0.1,0-0.1-0.1-0.2-0.1L44,86.4c-0.1-0.1-0.2-0.2-0.4-0.3c-0.4-0.3-0.8-0.7-1.2-1 l-0.1-0.1c-0.1-0.1-0.1-0.1-0.2-0.2c-0.5-0.5-1-1-1.6-1.5c-0.1-0.1-0.2-0.2-0.3-0.3l-0.2-0.2c-0.4-0.4-0.8-0.8-1.2-1.3 c-0.1-0.2-0.3-0.3-0.4-0.5l-0.2-0.2c-0.3-0.4-0.7-0.8-1.1-1.3c-0.2-0.3-0.4-0.5-0.6-0.8c-0.4-0.5-0.7-0.9-1-1.4l-0.1-0.1 c-0.2-0.2-0.3-0.5-0.5-0.7c-0.4-0.5-0.7-1.2-1.2-1.9l-0.2-0.2c-0.1-0.1-0.1-0.2-0.2-0.4c-0.4-0.7-0.8-1.5-1.2-2.2 c0.7-0.2,1.4-0.4,2.1-0.6c0.2-0.1,0.5-0.1,0.7-0.2c1-0.3,2-0.5,2.9-0.6l0.1,0c0.1,0,0.1,0,0.2,0c0.8-0.1,1.7-0.3,2.7-0.4 c0.3,0,0.5-0.1,0.8-0.1c0.9-0.1,1.7-0.2,2.5-0.2V86.6z M57.3,79.6c-0.4,0.4-0.7,0.9-1.1,1.3l-0.1,0.1c-0.2,0.2-0.4,0.4-0.5,0.6 c-0.4,0.4-0.8,0.9-1.2,1.3L54.3,83c-0.1,0.1-0.2,0.2-0.3,0.3c-0.5,0.5-1,1-1.6,1.5c-0.1,0.1-0.1,0.1-0.2,0.2L52.2,85 c-0.4,0.4-0.8,0.7-1.2,1c-0.1,0.1-0.2,0.2-0.4,0.3l-0.1,0.1c-0.1,0.1-0.1,0.1-0.2,0.2v-17c0.8,0,1.6,0.1,2.5,0.2 c0.3,0,0.5,0.1,0.8,0.1c1,0.1,1.9,0.2,2.7,0.4c0.1,0,0.1,0,0.2,0l0.1,0c0.9,0.2,1.8,0.4,2.9,0.6c0.3,0.1,0.5,0.1,0.8,0.2 c0.7,0.2,1.4,0.4,2.1,0.6c-0.4,0.8-0.8,1.5-1.2,2.2c-0.1,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.1,0.2-0.2,0.3c-0.4,0.7-0.8,1.3-1.2,1.9 c-0.2,0.2-0.3,0.5-0.5,0.7l-0.1,0.1c-0.4,0.5-0.7,1-1,1.4C57.7,79,57.5,79.3,57.3,79.6z M58.5,87.3c0.2-0.2,0.5-0.5,0.7-0.7 l0.2-0.2c0.4-0.5,0.9-1,1.3-1.5l0.2-0.2c0.5-0.6,0.9-1.1,1.4-1.8l0.1-0.1c0.5-0.6,1-1.3,1.4-1.9l0.1-0.1c0.4-0.6,0.9-1.3,1.4-2.1 l0.1-0.2c0.4-0.6,0.8-1.3,1.3-2.2l0.2-0.3c0.3-0.6,0.7-1.3,1-2c0.1,0,0.2,0.1,0.3,0.1l0.7,0.3c1,0.5,1.9,1,2.8,1.5l0.1,0 c0.1,0,0.1,0.1,0.2,0.1c0.8,0.5,1.6,1,2.5,1.6l0.1,0c0.1,0,0.1,0.1,0.2,0.1C70,82.2,64.5,85.5,58.5,87.3z M78.5,73.2 c-0.4-0.3-0.7-0.5-1.1-0.8L76.8,72c-0.8-0.5-1.4-0.9-2-1.3c0,0-0.1,0-0.1-0.1c-0.6-0.4-1.3-0.8-2.1-1.2c-0.2-0.1-0.3-0.2-0.5-0.3 l-0.2-0.1c-0.6-0.3-1.1-0.5-1.7-0.8l0,0c0.2-0.6,0.4-1.2,0.6-1.9c0.1-0.2,0.1-0.5,0.2-0.7c0.2-0.6,0.3-1.1,0.5-1.7l0.1-0.3 c0-0.1,0.1-0.3,0.1-0.4c0.2-0.8,0.3-1.5,0.5-2.2l0-0.1c0.1-0.7,0.3-1.5,0.4-2.4c0-0.2,0-0.3,0.1-0.5l0-0.2c0.1-0.6,0.2-1.2,0.2-1.8 c0-0.3,0.1-0.5,0.1-0.8c0.1-0.7,0.1-1.3,0.1-2l0-0.2c0,0,0,0,0,0h13C85.5,60.3,82.9,67.3,78.5,73.2z" }),
					React.createElement("path", { d: "M99,20.2c-0.1-0.6-0.3-1.1-0.6-1.7c-0.3-0.6-0.8-1.1-1.4-1.5c-0.6-0.4-1.2-0.6-1.9-0.7 c-0.6-0.1-1.2-0.2-1.8-0.2c0,0-0.1,0-0.1,0c-2.5,0-4.9,0.7-7.3,1.5c-4.7,1.6-9.4,3.9-14,6.3c-2.3,1.2-4.5,2.5-6.7,3.8 c-2.2,1.3-4.3,2.6-6.4,3.8c-4.1,2.5-7.9,5-11.1,7.1c-3.2,2.1-5.9,3.9-7.7,5.2c-0.5,0.4-1,0.7-1.4,1L34,39.1l-2,19l19,2l-4.6-5.6 c0.3-0.3,0.7-0.7,1.2-1.1c1.6-1.5,3.9-3.7,6.7-6.2c2.8-2.5,6.1-5.5,9.6-8.5c1.8-1.5,3.6-3.1,5.5-4.7c1.9-1.6,3.9-3.1,5.8-4.6 c4-3,8-5.9,12.1-8c2-1,4-1.9,5.9-2.2c0.4-0.1,0.9-0.1,1.3-0.1c0,0,0,0,0,0c0.4,0,0.8,0.1,1.1,0.2c0.3,0.1,0.6,0.3,0.8,0.5 c0.2,0.3,0.4,0.6,0.5,0.9c0.5,1.5,0.3,3.3,0.1,4.7c-0.2,1.5-0.6,2.8-0.9,3.8c-0.6,2.1-1.1,3.3-1.1,3.3s0.7-1.1,1.7-3.1 c0.5-1,1-2.3,1.5-3.8c0.2-0.8,0.5-1.6,0.6-2.5C99.1,22.3,99.2,21.3,99,20.2z" })
				)
			);
		}
	}]);

	return _class2;
})(React.Component);

Comp.Icons.Badge = (function (_React$Component3) {
	_inherits(_class3, _React$Component3);

	function _class3() {
		_classCallCheck(this, _class3);

		_get(Object.getPrototypeOf(_class3.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class3, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M45.1,16.8L29.7,6.5l-4.4,6.6l16.6,11.1c0-0.3,0-0.5,0-0.8C41.8,20.7,43.1,18.3,45.1,16.8 z" }),
					React.createElement("path", { d: "M58.2,23.4c0,0.3,0,0.5,0,0.8l16.6-11.1l-4.4-6.6L54.9,16.8 C56.9,18.3,58.2,20.7,58.2,23.4z" }),
					React.createElement("path", { d: "M72.1,30.1H57.4v4.1h2.3c1,0,1.8,0.8,1.8,1.8c0,1-0.8,1.8-1.8,1.8H40.3c-1,0-1.8-0.8-1.8-1.8 c0-1,0.8-1.8,1.8-1.8h2.3v-4.1H27.9c-2.3,0-4.3,1.9-4.3,4.2v54.9c0,2.3,1.9,4.2,4.3,4.2h44.2c2.3,0,4.2-1.9,4.2-4.2V34.4 C76.4,32,74.5,30.1,72.1,30.1z M69.9,85c0,1.3-1.1,2.4-2.4,2.4h-35c-1.3,0-2.4-1.1-2.4-2.4V44.4c0-1.3,1.1-2.4,2.4-2.4h35 c1.3,0,2.4,1.1,2.4,2.4V85z" }),
					React.createElement("path", { d: "M55.4,29.4c-1.4,1.3-3.4,2.1-5.4,2.1c-2.1,0-4-0.8-5.4-2.1v6.1h10.9V29.4z" }),
					React.createElement("path", { d: "M50,29.1c3.1,0,5.7-2.6,5.7-5.7c0-3.1-2.6-5.7-5.7-5.7c-3.1,0-5.7,2.6-5.7,5.7 C44.3,26.5,46.9,29.1,50,29.1z" }),
					React.createElement("path", { d: "M52.7,63.7c3.7-1.2,6.4-4.6,6.4-8.8c0-5.1-4.1-9.2-9.2-9.2c-5.1,0-9.2,4.1-9.2,9.2c0,4.1,2.7,7.6,6.4,8.8 c-8,1.8-10.4,8.1-10.4,20h26.3C63.1,71.7,60.7,65.4,52.7,63.7z M48.3,68.8c0-0.3,0.2-0.5,0.5-0.5h2.4c0.3,0,0.5,0.2,0.5,0.5v1.1 c0,0.3,0,0.5-0.1,0.5c0,0-0.2,0.1-0.5,0.3l-0.8,0.5c-0.2,0.1-0.6,0.1-0.8,0l-0.8-0.5c-0.2-0.1-0.4-0.3-0.5-0.3c0,0-0.1-0.2-0.1-0.5 V68.8z M52.2,78.8l-1.9,1.6c-0.2,0.2-0.5,0.2-0.7,0l-1.9-1.6c-0.2-0.2-0.3-0.5-0.3-0.8l0.9-6.2c0-0.3,0.2-0.4,0.5-0.2l0.8,0.5 c0.2,0.1,0.6,0.1,0.8,0l0.8-0.5c0.2-0.1,0.4,0,0.5,0.2l0.9,6.2C52.6,78.3,52.4,78.7,52.2,78.8z" })
				)
			);
		}
	}]);

	return _class3;
})(React.Component);

Comp.Icons.Briefcase = (function (_React$Component4) {
	_inherits(_class4, _React$Component4);

	function _class4() {
		_classCallCheck(this, _class4);

		_get(Object.getPrototypeOf(_class4.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class4, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M45.8,65.8V52.9h8.9v12.9H45.8z M95.5,52.9L87.4,61H57v7H43.6v-7H9.8l-5.4-5.4v30.8 l2.1,2.1h86.8l2.1-2.1V52.9z M2.5,50.4V26.7L5.2,24h27.9c0.1-0.1,0.1-0.3,0.1-0.5v-9c0-1.7,1.4-3.1,3.1-3.1h27.4 c1.7,0,3.1,1.4,3.1,3.1v9c0,0.2,0,0.3,0.1,0.5h27.9l2.7,2.7v20.8l-11.1,9.9H57.1v-6.7H43.5v6.7H10.7L2.5,50.4z M38.5,23.5 c0,0.2,0,0.3,0.1,0.5h22.8c0.1-0.1,0.1-0.3,0.1-0.5v-5.1c0-0.6-0.5-1.1-1.1-1.1H39.5c-0.6,0-1.1,0.5-1.1,1.1V23.5z" })
			);
		}
	}]);

	return _class4;
})(React.Component);

Comp.Icons.Build = (function (_React$Component5) {
	_inherits(_class5, _React$Component5);

	function _class5() {
		_classCallCheck(this, _class5);

		_get(Object.getPrototypeOf(_class5.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class5, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M84.3,29.6c2.5,0,4.8-1,6.6-2.7l6.4-6.4c0.7-0.7,1.1-1.7,1.1-2.7c0-1-0.4-2-1.1-2.7l-7.7-7.7 c-1.4-1.4-4-1.4-5.4,0l-6.4,6.4c-2.7,2.6-3.4,6.5-2.1,9.8L58.5,40.6l-6.9-6.9c1.3-7.9-1.3-16.1-7-21.8c-4.7-4.7-11.1-7.4-17.8-7.4 c-3,0-6,0.5-8.8,1.6c-1.2,0.5-2.1,1.5-2.4,2.8c-0.3,1.3,0.1,2.6,1,3.5l10.3,10.3l-1.5,5.6l-5.6,1.5L9.5,19.5c-0.9-0.9-2.2-1.3-3.5-1 c-1.3,0.3-2.3,1.2-2.8,2.4C-0.2,30.1,2.1,40.6,9,47.5c5.7,5.7,13.8,8.3,21.8,7l1.1,1.1L15.7,71.9C9.9,77.7,9,86,13.8,90.8 c2,2,4.7,3.1,7.7,3.1c4,0,8-1.8,11.2-5l16.2-16.2l18.5,18.5c2.8,2.8,6.5,4.3,10.4,4.3c3.9,0,7.6-1.5,10.4-4.3 c2.8-2.8,4.3-6.5,4.3-10.4c0-3.9-1.5-7.6-4.3-10.4L63.9,46L81,29C82,29.3,83.1,29.6,84.3,29.6z M27.3,83.4c-1.7,1.7-3.9,2.7-5.8,2.7 c-0.7,0-1.6-0.1-2.3-0.8c-1.5-1.5-1-5.1,1.9-8.1l16.1-16.1l6.2,6.2L27.3,83.4z M84.9,80.7c0,1.9-0.7,3.7-2.1,5 c-2.7,2.7-7.3,2.7-10,0l-38-38c-0.7-0.7-1.7-1.1-2.7-1.1c-0.3,0-0.6,0-0.9,0.1c-6,1.5-12.4-0.2-16.7-4.6c-3.2-3.2-5-7.6-5.1-12 l6.7,6.7c1,1,2.4,1.3,3.7,1l9.8-2.6c1.3-0.4,2.4-1.4,2.7-2.7l2.6-9.9c0.4-1.3,0-2.7-1-3.7l-6.7-6.7c4.5,0.1,8.8,1.9,12,5.1 c4.4,4.4,6.1,10.6,4.6,16.7c-0.3,1.3,0.1,2.7,1,3.6l38,38C84.1,77.1,84.9,78.8,84.9,80.7z M83.1,19.1l3.7-3.7l2.3,2.3l-3.7,3.7 c-0.8,0.8-1.5,0.8-2.3,0c0,0,0,0,0,0c0,0,0,0,0,0C82.5,20.8,82.5,19.8,83.1,19.1z" }),
				React.createElement("circle", { cx: "77.2", cy: "79.9", r: "3.2" })
			);
		}
	}]);

	return _class5;
})(React.Component);

Comp.Icons.Building = (function (_React$Component6) {
	_inherits(_class6, _React$Component6);

	function _class6() {
		_classCallCheck(this, _class6);

		_get(Object.getPrototypeOf(_class6.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class6, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M87.6,86.5V41.1c0-2.9-2.3-5.2-5.2-5.2h-27V14.4c0-2.9-2.3-5.2-5.2-5.2H17.6 c-2.9,0-5.2,2.3-5.2,5.2v72.1H3.9v4.3h92.2v-4.3H87.6z M27.2,76.9h-6v-6h6V76.9z M27.2,63.8h-6v-6h6V63.8z M27.2,50.7h-6v-6h6V50.7z M27.2,37.6h-6v-6h6V37.6z M27.2,24.6h-6v-6h6V24.6z M37.3,76.9h-6v-6h6V76.9z M37.3,63.8h-6v-6h6V63.8z M37.3,50.7h-6v-6h6V50.7z M37.3,37.6h-6v-6h6V37.6z M37.3,24.6h-6v-6h6V24.6z M47.4,76.9h-6v-6h6V76.9z M47.4,63.8h-6v-6h6V63.8z M47.4,50.7h-6v-6h6V50.7z M47.4,37.6h-6v-6h6V37.6z M47.4,24.6h-6v-6h6V24.6z M63.6,78.6h-4.8v-4.8h4.8V78.6z M63.6,69.1h-4.8v-4.8h4.8V69.1z M63.6,59.5 h-4.8v-4.8h4.8V59.5z M63.6,49.9h-4.8V45h4.8V49.9z M71.7,78.6h-4.8v-4.8h4.8V78.6z M71.7,69.1h-4.8v-4.8h4.8V69.1z M71.7,59.5h-4.8 v-4.8h4.8V59.5z M71.7,49.9h-4.8V45h4.8V49.9z M79.8,78.6H75v-4.8h4.8V78.6z M79.8,69.1H75v-4.8h4.8V69.1z M79.8,59.5H75v-4.8h4.8 V59.5z M79.8,49.9H75V45h4.8V49.9z" })
			);
		}
	}]);

	return _class6;
})(React.Component);

Comp.Icons.Calendar = (function (_React$Component7) {
	_inherits(_class7, _React$Component7);

	function _class7() {
		_classCallCheck(this, _class7);

		_get(Object.getPrototypeOf(_class7.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class7, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M89.2,72.8H73.4c-5.8,0-6.9,3.8-6.9,8.3v14.1H15.2c-2.4,0-4.4-2-4.4-4.4v-62h78.3V72.8z M22.3,13.1h8.5v8c0,2.3-1.9,4.2-4.3,4.2c-2.3,0-4.2-1.9-4.2-4.2V13.1z M70,13.1h8.5v8c0,2.3-1.9,4.2-4.2,4.2 c-2.3,0-4.2-1.9-4.2-4.2V13.1z M84.8,12.8h-6.2V4.9c0-2.3-1.9-4.2-4.2-4.2C72,0.7,70,2.6,70,4.9v7.9H30.8V4.9 c0-2.3-1.9-4.2-4.3-4.2c-2.3,0-4.2,1.9-4.2,4.2v7.9h-7.1c-4.7,0-8.5,3.8-8.5,8.5v69.6c0,4.7,3.8,8.5,8.5,8.5h51.4h0.2l4.1-4.1 l18.3-18.3l4.1-4.1V21.3C93.3,16.6,89.5,12.8,84.8,12.8" }),
					React.createElement("rect", { x: "17.2", y: "37.6", width: "14", height: "14" }),
					React.createElement("rect", { x: "34.5", y: "37.6", width: "14", height: "14" }),
					React.createElement("rect", { x: "51.7", y: "37.6", width: "14", height: "14" }),
					React.createElement("rect", { x: "68.9", y: "37.6", width: "14", height: "14" }),
					React.createElement("rect", { x: "17.2", y: "54.8", width: "14", height: "14" }),
					React.createElement("rect", { x: "34.5", y: "54.8", width: "14", height: "14" }),
					React.createElement("rect", { x: "51.7", y: "54.8", width: "14", height: "14" }),
					React.createElement("rect", { x: "68.9", y: "54.8", width: "14", height: "14" }),
					React.createElement("rect", { x: "17.2", y: "72.1", width: "14", height: "14" }),
					React.createElement("rect", { x: "34.5", y: "72.1", width: "14", height: "14" })
				)
			);
		}
	}]);

	return _class7;
})(React.Component);

Comp.Icons.Clipboard = (function (_React$Component8) {
	_inherits(_class8, _React$Component8);

	function _class8() {
		_classCallCheck(this, _class8);

		_get(Object.getPrototypeOf(_class8.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class8, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M80.8,11.5h-6.1c0.1,0.2,0.2,0.4,0.3,0.6l2.5,7c0.6,1.7,0.4,3.4-0.5,4.8c-1,1.4-2.5,2.1-4.3,2.1H27.4 c-1.8,0-3.4-0.8-4.3-2.1c-1-1.4-1.1-3.1-0.5-4.8l2.5-7c0.1-0.2,0.2-0.4,0.3-0.6h-6.1c-1.9,0-3.4,1.5-3.4,3.4v80.8 c0,1.9,1.5,3.4,3.4,3.4h61.6c1.9,0,3.4-1.5,3.4-3.4V14.9C84.2,13,82.7,11.5,80.8,11.5z M25.7,43.7h38.2v4.4H25.7V43.7z M25.7,63.1 h38.2v4.4H25.7V63.1z M63.9,86.8H25.7v-4.4h38.2V86.8z M74.3,77.1H25.7v-4.4h48.6V77.1z M74.3,57.8H25.7v-4.4h48.6V57.8z M74.3,38.4 H25.7v-4.4h48.6V38.4z M75.1,20l-2.5-7C72,11.1,69.9,9.7,68,9.7h-7.6c-1.5,0-3-0.8-3.1-1.8c-0.1-0.7-1.3-7-7.2-7s-7.1,6.3-7.2,7 c-0.1,1-1.6,1.8-3.1,1.8H32c-1.9,0-4,1.5-4.7,3.3l-2.5,7c-0.3,0.9-0.3,1.8,0.2,2.5c0.5,0.7,1.3,1.1,2.3,1.1h45.3 c1,0,1.8-0.4,2.3-1.1C75.4,21.8,75.5,20.9,75.1,20z M50,8.1c-1.2,0-2.2-1-2.2-2.2c0-1.2,1-2.2,2.2-2.2c1.2,0,2.2,1,2.2,2.2 C52.2,7.1,51.2,8.1,50,8.1z" })
			);
		}
	}]);

	return _class8;
})(React.Component);

Comp.Icons.Comment = (function (_React$Component9) {
	_inherits(_class9, _React$Component9);

	function _class9() {
		_classCallCheck(this, _class9);

		_get(Object.getPrototypeOf(_class9.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class9, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M50,8.2C24.6,8.2,3.9,24.9,3.9,45.4c0,13.1,8.6,25.2,22.4,31.9c-2.2,2.9-5.1,5.2-8.6,6.9 c-1.6,0.8-2.5,2.6-2.1,4.3c0.3,1.8,1.8,3.1,3.6,3.2c1.1,0.1,2.3,0.1,3.4,0.1c10.1,0,19.2-3.3,25.7-9.3c0.6,0,1.2,0,1.8,0 c25.4,0,46.1-16.7,46.1-37.2C96.1,24.9,75.4,8.2,50,8.2z M50,74.7c-1,0-2.1-0.1-3.1-0.1c-1.2,0-2.3,0.4-3.1,1.2 c-3.1,3.2-7.1,5.5-11.7,6.8c0.9-1.1,1.7-2.2,2.4-3.4c0.3-0.5,0.5-1,0.8-1.5l0.2-0.5c0.5-1,0.6-2.2,0.1-3.2c-0.4-1-1.2-1.9-2.3-2.3 c-13.1-4.9-21.6-15.2-21.6-26.3c0-16.1,17.1-29.3,38.2-29.3c21.1,0,38.2,13.1,38.2,29.3S71.1,74.7,50,74.7z" }),
					React.createElement("path", { d: "M32.3,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C38,43.6,35.4,41,32.3,41z" }),
					React.createElement("path", { d: "M50,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C55.8,43.6,53.2,41,50,41z" }),
					React.createElement("path", { d: "M67.7,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C73.5,43.6,70.9,41,67.7,41z" })
				)
			);
		}
	}]);

	return _class9;
})(React.Component);

Comp.Icons.Clock = (function (_React$Component10) {
	_inherits(_class10, _React$Component10);

	function _class10() {
		_classCallCheck(this, _class10);

		_get(Object.getPrototypeOf(_class10.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class10, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M50,16c-2.3,0-4,1.9-4,4.1v28.2L34.6,59.6c-1.6,1.6-1.7,4.2,0,5.9c0.8,0.8,1.9,1.2,2.9,1.2 c1.1,0,2.1-0.4,2.9-1.2l12-12c0.1-0.1,0.1-0.2,0.1-0.3c0.9-0.8,1.4-1.9,1.4-3.2V20.1C54,17.8,52.3,16,50,16z" }),
					React.createElement("path", { d: "M98,50C98,50,98,50,98,50C98,23.3,76.7,1.7,50,1.7C23.4,1.7,2,23.3,2,50c0,0,0,0,0,0v0c0,0,0,0,0,0 c0,26.7,21.4,48.3,48,48.3C76.7,98.3,98,76.7,98,50C98,50,98,50,98,50L98,50z M71.8,83.6l-1.1-2c-0.6-1-1.9-1.3-2.8-0.7 c-1,0.6-1.3,1.8-0.8,2.8l1.1,2c-4.4,2.3-9.3,3.7-14.4,4.2c-0.6-1.5-2.1-2.5-3.8-2.5c-1.7,0-3.2,1-3.8,2.5c-5.1-0.5-10-2-14.4-4.2 l1.1-2c0.6-1,0.2-2.3-0.8-2.8c-1-0.6-2.3-0.2-2.8,0.8l-1.1,2c-4.7-3.1-8.7-7.1-11.8-11.8l2-1.1c1-0.6,1.3-1.8,0.8-2.8 c-0.6-1-1.8-1.3-2.8-0.8l-2,1.1c-2.3-4.4-3.7-9.3-4.2-14.4c1.5-0.6,2.5-2.1,2.5-3.8c0-1.7-1-3.2-2.5-3.8c0.5-5.1,2-10,4.2-14.4 l2,1.1c0.3,0.2,0.7,0.3,1,0.3c0.7,0,1.4-0.4,1.8-1c0.6-1,0.2-2.3-0.8-2.8l-2-1.1c3.1-4.7,7.1-8.7,11.8-11.8l1.1,2 c0.4,0.7,1.1,1,1.8,1c0.4,0,0.7-0.1,1-0.3c1-0.6,1.3-1.8,0.8-2.8l-1.1-2c4.4-2.3,9.2-3.7,14.4-4.2c0.6,1.5,2.1,2.5,3.8,2.5 c1.7,0,3.2-1,3.8-2.5c5.1,0.5,10,2,14.4,4.2l-1.1,2c-0.6,1-0.2,2.3,0.8,2.8c0.3,0.2,0.7,0.3,1,0.3c0.7,0,1.4-0.4,1.8-1l1.1-2 c4.7,3.1,8.7,7.1,11.8,11.8l-2,1.1c-1,0.6-1.3,1.8-0.8,2.8c0.4,0.7,1.1,1,1.8,1c0.4,0,0.7-0.1,1-0.3l2-1.1 c2.2,4.4,3.7,9.2,4.2,14.4c-1.5,0.6-2.5,2.1-2.5,3.8c0,1.7,1,3.2,2.5,3.8c-0.5,5.1-2,10-4.2,14.4l-2-1.1c-1-0.6-2.3-0.2-2.8,0.8 c-0.6,1-0.2,2.3,0.8,2.8l2,1.1C80.5,76.5,76.5,80.5,71.8,83.6z" })
				)
			);
		}
	}]);

	return _class10;
})(React.Component);

Comp.Icons.Contacts = (function (_React$Component11) {
	_inherits(_class11, _React$Component11);

	function _class11() {
		_classCallCheck(this, _class11);

		_get(Object.getPrototypeOf(_class11.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class11, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M25.5,55H10.5c-3.3,0-5.9-2-5.9-4.5v-1.2c0-2.5,2.7-4.5,5.9-4.5h15.1c3.3,0,5.9,2,5.9,4.5 v1.2C31.5,53.1,28.8,55,25.5,55z" }),
					React.createElement("path", { d: "M25.5,78.6H10.5c-3.3,0-5.9-2-5.9-4.5V73c0-2.5,2.7-4.5,5.9-4.5h15.1c3.3,0,5.9,2,5.9,4.5 v1.2C31.5,76.6,28.8,78.6,25.5,78.6z" }),
					React.createElement("path", { d: "M25.5,31.5H10.5c-3.3,0-5.9-2-5.9-4.5v-1.2c0-2.5,2.7-4.5,5.9-4.5h15.1 c3.3,0,5.9,2,5.9,4.5V27C31.5,29.5,28.8,31.5,25.5,31.5z" }),
					React.createElement("path", { d: "M95.4,27.2v-1.6c0-3.3-2.7-5.9-5.9-5.9h-0.8v-3.3c0-6.6-5.3-11.9-11.9-11.9H26.5 c-6.6,0-11.9,5.3-11.9,11.9V18h10.9c5.2,0,9.3,3.4,9.3,7.8V27c0,4.4-4.1,7.8-9.3,7.8H14.7v6.7h10.9c5.2,0,9.3,3.4,9.3,7.8v1.2 c0,4.4-4.1,7.8-9.3,7.8H14.7v6.7h10.9c5.2,0,9.3,3.4,9.3,7.8v1.2c0,4.4-4.1,7.8-9.3,7.8H14.7v1.6c0,6.6,5.3,11.9,11.9,11.9h50.3 c6.6,0,11.9-5.3,11.9-11.9V60.1h0.8c3.3,0,5.9-2.7,5.9-5.9v-1.6c0-3.3-2.7-5.9-5.9-5.9c3.3,0,5.9-2.7,5.9-5.9v-1.6 c0-3.3-2.7-5.9-5.9-5.9C92.8,33.2,95.4,30.5,95.4,27.2z M50.3,36.6c0.2-0.1,0.4,0,0.6,0.1c0,0,0,0,0-0.1c0-5.3,3.4-8.5,7.6-8.5 c4.2,0,7.6,3.2,7.6,8.5c0,0,0,0,0,0.1c0.2-0.1,0.4-0.1,0.6-0.1c0.6,0.2,1,1,0.5,2.5c-0.4,1.5-1.1,2.1-1.8,1.9c0,0-0.1,0-0.1-0.1 c-1.2,3.5-3.8,6.3-6.8,6.3c-3,0-5.6-2.8-6.8-6.3c0,0-0.1,0-0.1,0.1c-0.6,0.2-1.3-0.4-1.8-1.9C49.3,37.6,49.6,36.8,50.3,36.6z M58.4,71.9C48,71.9,40,69.4,40,66.4c0-2.5,0-12.7,10.2-14.1c2.3-0.3,0.9-2.9,5.4-3.6c0.6-0.1,5-0.1,5.7,0c4.5,0.7,3.1,3.2,5.4,3.6 c10.2,1.4,10.2,11.7,10.2,14.1C76.9,69.4,68.8,71.9,58.4,71.9z" })
				)
			);
		}
	}]);

	return _class11;
})(React.Component);

Comp.Icons.Contract = (function (_React$Component12) {
	_inherits(_class12, _React$Component12);

	function _class12() {
		_classCallCheck(this, _class12);

		_get(Object.getPrototypeOf(_class12.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class12, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M10.7,39C8.6,39,7,37.5,7,35.5S8.6,32,10.7,32h15.4L2.1,7.7C1.4,7,1,6,1,4.9c0-1.1,0.4-2.1,1.1-2.8 C2.8,1.4,3.7,1,4.6,1c1,0,1.9,0.4,2.7,1.1L31,26V10.7C31,8.5,32.5,7,34.5,7S38,8.5,38,10.7v24.2c0,0.2,0.3,2.2-0.5,3 c-0.8,0.8-2.2,1-2.2,1L35.1,39H10.7z" }),
				React.createElement("path", { d: "M5.1,99c-1.1,0-2.2-0.4-2.9-1.2c-1.5-1.5-1.5-4,0-5.5L26.1,68H10.7C8.5,68,7,66.5,7,64.5S8.5,61,10.7,61H35 v0.2c1,0.1,2.2,0.4,2.8,1.1c0.8,0.8,1.2,2.8,1.2,2.9v24.4c0,2.2-1.5,3.7-3.5,3.7S32,91.7,32,89.5V74.1L7.7,97.9 C7.1,98.6,6.1,99,5.1,99z" }),
				React.createElement("path", { d: "M65.1,39c-0.3,0-2.3-0.4-3-1.2c-0.8-0.8-1-2.9-1-2.9V10.5c0-2.2,1.5-3.7,3.5-3.7c2,0,3.5,1.6,3.5,3.7v15.4 L92.3,2.1c0.7-0.7,1.6-1,2.7-1c1.1,0,2.2,0.4,2.9,1.2c1.5,1.5,1.5,4,0,5.5L73.9,32h15.4c2.2,0,3.7,1.5,3.7,3.5S91.5,39,89.3,39H65.1 z" }),
				React.createElement("path", { d: "M95.1,99c-1.1,0-2-0.4-2.7-1.1L68,73.9v15.4c0,2.2-1.5,3.7-3.5,3.7c-2,0-3.5-1.6-3.5-3.7V65.1 c0-0.3,0.4-2.3,1.2-3c0.8-0.8,2.9-1,3-1h24.4c2.2,0,3.7,1.5,3.7,3.5S91.7,68,89.5,68H74.1l23.8,24.3c0.7,0.7,1.1,1.7,1,2.8 c0,1.1-0.5,2.1-1.2,2.8C97.1,98.6,96.1,99,95.1,99z" })
			);
		}
	}]);

	return _class12;
})(React.Component);

Comp.Icons.CreditCard = (function (_React$Component13) {
	_inherits(_class13, _React$Component13);

	function _class13() {
		_classCallCheck(this, _class13);

		_get(Object.getPrototypeOf(_class13.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class13, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M53.4,8.3c0.8-0.9,2.1-0.9,3-0.1l19.8,18.2l8.9,8.2l2.3,2.1c0.9,0.8,0.9,2.1,0.1,3L38.9,92.7 c-0.8,0.9-2.1,0.9-3,0.1l-2.3-2.1l-8.9-8.2L4.9,64.4c-0.8-0.8-0.9-2.1-0.1-3L53.4,8.3L53.4,8.3z M51,6.1L2.4,59.2 c-2,2.2-1.8,5.5,0.3,7.5l19.8,18.2l8.9,8.2l2.3,2.1c2.2,2,5.5,1.8,7.5-0.3l48.6-53.1c2-2.2,1.8-5.5-0.3-7.5l-2.3-2.1L78.3,24 L58.5,5.8C56.4,3.8,53,4,51,6.1L51,6.1z" }),
				React.createElement(
					"g",
					null,
					React.createElement("rect", { x: "24.5", y: "71.4", transform: "matrix(0.6752 -0.7376 0.7376 0.6752 -44.6653 43.2619)", width: "4.6", height: "1.9" }),
					React.createElement("path", { d: "M32.3,67.7l-1.4-1.3l-0.8-0.7l-1.4-1.3l-0.8-0.7h0l0.7-0.8l0,0l3.1-3.4l-0.3-0.3c-0.9-0.8-2.2-0.7-3,0.1 l-4.9,5.4l1.9,1.7l0.8,0.7l1.4,1.3l0.8,0.7l1.4,1.3l0.8,0.7l1.9,1.7l2.6-2.8l-1.9-1.7L32.3,67.7z" }),
					React.createElement("path", { d: "M26.7,75.4l0.3,0.3c0.9,0.8,2.2,0.7,3-0.1l1.6-1.8L29.8,72L26.7,75.4z" }),
					React.createElement("path", { d: "M22.8,65.6l-1.6,1.8c-0.8,0.9-0.7,2.2,0.1,3l0.3,0.3l3.1-3.4L22.8,65.6z" }),
					React.createElement("rect", { x: "22.3", y: "69.4", transform: "matrix(0.6755 -0.7374 0.7374 0.6755 -43.8803 40.9519)", width: "4.6", height: "1.9" }),
					React.createElement("rect", { x: "31.6", y: "63.6", transform: "matrix(-0.6753 0.7375 -0.7375 -0.6753 104.4225 83.2171)", width: "4.6", height: "1.9" }),
					React.createElement("rect", { x: "30.7", y: "60.3", transform: "matrix(-0.7379 -0.6749 0.6749 -0.7379 12.8374 130.1273)", width: "1.9", height: "4.6" }),
					React.createElement("path", { d: "M35.7,69.3l1.6-1.8c0.8-0.9,0.7-2.2-0.1-3l-0.3-0.3l-3.1,3.4L35.7,69.3z" })
				),
				React.createElement("path", { d: "M91.9,40.1h-1.1c0.8-2,0.3-4.4-1.3-5.9l-2.3-2.1L78.3,24L58.5,5.8C56.4,3.8,53,4,51,6.1L19.9,40.1h0 c-2.9,0-5.3,2.4-5.3,5.3v0.5L2.4,59.2c-2,2.2-1.8,5.5,0.3,7.5l11.9,10.9l0,6.7l0,3.1c0,2.9,2.4,5.3,5.3,5.3l11.2,0l0.3,0.3l2.3,2.1 c2.2,2,5.5,1.8,7.5-0.3l1.9-2.1l48.8,0c2.9,0,5.3-2.4,5.3-5.3l0-3.1l0-12.1l0-26.9C97.2,42.5,94.8,40.1,91.9,40.1z M91.9,43.3 c1.2,0,2.1,0.9,2.1,2.1l0,26.9l0,1.1l-33.2,0l27.6-30.1L91.9,43.3z M19.9,89.6c-1.2,0-2.1-0.9-2.1-2.1l0-3.1l0-0.9l3.2,0l1.6,1.5 l5.1,4.7L19.9,89.6z M35.9,92.8L35.9,92.8l-2.3-2.1l-1.2-1.1l-6.7-6.1l-1-0.9l-6.9-6.3l-2.1-1.9l-1.1-1l-9.7-8.9 c-0.8-0.8-0.9-2.1-0.1-3l9.9-10.8l3.2-3.5l3.5-3.9l2.9-3.2L53.4,8.3c0.8-0.9,2.1-0.9,3-0.1l19.8,18.2l8.9,8.2l2.3,2.1 c0.9,0.8,0.9,2.1,0.1,3L87,40.1l-2.9,3.2L56.5,73.4l-9.2,10l-5.6,6.1l-2.8,3.1c0,0-0.1,0.1-0.1,0.1C38,93.5,36.7,93.5,35.9,92.8z M94,84.4l0,3.1c0,1.2-0.9,2.1-2.1,2.1l-45.9,0l5.6-6.1l42.4,0V84.4z" })
			);
		}
	}]);

	return _class13;
})(React.Component);

Comp.Icons.Dictionary = (function (_React$Component14) {
	_inherits(_class14, _React$Component14);

	function _class14() {
		_classCallCheck(this, _class14);

		_get(Object.getPrototypeOf(_class14.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class14, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M88.9,0H61.1C56.6,0,52.7,2.5,50,5.7C47.4,2.5,43.6,0,38.9,0H11.1C5,0,0,5,0,11.1v68.5 c0,6.1,5,11.1,11.1,11.1H37c5.3,0,9.2,4.2,9.3,5.6v0c0,2,1.7,3.7,3.7,3.7c2,0,3.7-1.6,3.7-3.6c0,0,0-0.1,0-0.1 c0-1.3,4.1-5.6,9.3-5.6h25.9c6.1,0,11.1-5,11.1-11.1V11.1C100,5,95,0,88.9,0z M37,83.3H11.1c-2,0-3.7-1.7-3.7-3.7V11.1 c0-2,1.7-3.7,3.7-3.7h27.8c4.5,0,9.2,5.5,9.2,7.6c0,1.4,0.1,1.8,0.1,2.9v69.2C45.2,84.9,41.3,83.3,37,83.3z M92.6,79.6 c0,2-1.7,3.7-3.7,3.7H63c-4.2,0-8.1,1.6-11.1,3.9V18c0-0.9,0-1.8,0-3.2c0-2.1,5.1-7.4,9.2-7.4h27.8c2,0,3.7,1.7,3.7,3.7V79.6z" })
			);
		}
	}]);

	return _class14;
})(React.Component);

Comp.Icons.Down = (function (_React$Component15) {
	_inherits(_class15, _React$Component15);

	function _class15() {
		_classCallCheck(this, _class15);

		_get(Object.getPrototypeOf(_class15.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class15, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M54.2,95L87,62.3c2.6-2.6,2.8-6.5,0.2-9.1c-2.6-2.6-6.5-2.4-9.1,0.2L56.3,75.2l0-66.1c0-3.6-2.9-6.6-6.5-6.6 c-3.6,0-6.5,2.9-6.5,6.5l0,66.1L21.4,53.4c-2.6-2.6-6.5-2.8-9.1-0.2c-2.6,2.6-2.4,6.5,0.2,9.1l33,33c0,0,2.2,2.3,4.2,2.3 C51.7,97.5,54.2,95,54.2,95L54.2,95z" })
			);
		}
	}]);

	return _class15;
})(React.Component);

Comp.Icons.Download = (function (_React$Component16) {
	_inherits(_class16, _React$Component16);

	function _class16() {
		_classCallCheck(this, _class16);

		_get(Object.getPrototypeOf(_class16.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class16, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M11.8,97c-2.7,0-4.9-2.3-4.9-5s2.2-5,4.9-5h76.5c2.7,0,4.9,2.3,4.9,5s-2.2,5-4.9,5H11.8z" }),
				React.createElement("path", { d: "M53.4,78.5l25.2-25.2c2-2,2.1-5,0.2-7c-2-2-5-1.8-7,0.2L55,63.3l0-50.9c0-2.8-2.3-5-5-5c-2.8,0-5,2.2-5,5 l0,50.9L28.2,46.5c-2-2-5-2.1-7-0.2c-2,2-1.8,5,0.2,7l25.4,25.4c0,0,1.7,1.8,3.3,1.8C51.5,80.5,53.4,78.5,53.4,78.5L53.4,78.5z" })
			);
		}
	}]);

	return _class16;
})(React.Component);

Comp.Icons.Drive = (function (_React$Component17) {
	_inherits(_class17, _React$Component17);

	function _class17() {
		_classCallCheck(this, _class17);

		_get(Object.getPrototypeOf(_class17.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class17, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("polygon", { points: "1.6,65.7 15.3,90.8 48.4,33.7 34.4,9.1 \t" }),
					React.createElement("polygon", { points: "83.6,92.4 98.4,67 32.7,67.2 29.9,71.9 18,92.5 \t" }),
					React.createElement("polygon", { points: "32.2,66.5 32.2,66.5 32.2,66.5 \t" }),
					React.createElement("polygon", { points: "86.2,63.9 91,63.9 91,63.9 98.4,63.8 65.4,7.6 37.2,7.5 51.9,33.4 51.9,33.4 69.3,63.9 \t" }),
					React.createElement("polygon", { points: "51.2,33.7 51.2,33.7 51.2,33.7 \t" }),
					React.createElement("rect", { x: "68.8", y: "64.7", width: "0", height: "0" }),
					React.createElement("polygon", { points: "91,64.6 91,64.6 91,64.6 \t" })
				)
			);
		}
	}]);

	return _class17;
})(React.Component);

Comp.Icons.DropdownDown = (function (_React$Component18) {
	_inherits(_class18, _React$Component18);

	function _class18() {
		_classCallCheck(this, _class18);

		_get(Object.getPrototypeOf(_class18.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class18, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M25.1,39.9c0-1.2,0.5-2.3,1.3-3.2c1.7-1.7,4.6-1.8,6.3,0L50,54.1l17.3-17.3c1.8-1.7,4.6-1.7,6.3,0 c0.8,0.8,1.3,2,1.3,3.2c0,1.2-0.5,2.3-1.3,3.2L53.2,63.6c-0.8,0.8-2,1.3-3.2,1.3c-1.2,0-2.3-0.5-3.2-1.3L26.4,43.1 C25.5,42.3,25.1,41.1,25.1,39.9z" })
			);
		}
	}]);

	return _class18;
})(React.Component);

Comp.Icons.DropdownUp = (function (_React$Component19) {
	_inherits(_class19, _React$Component19);

	function _class19() {
		_classCallCheck(this, _class19);

		_get(Object.getPrototypeOf(_class19.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class19, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M74.9,60.4c0,1.2-0.5,2.3-1.3,3.2c-1.7,1.7-4.6,1.8-6.3,0L50,46.3L32.7,63.6c-1.8,1.7-4.6,1.7-6.3,0 c-0.8-0.8-1.3-2-1.3-3.2c0-1.2,0.5-2.3,1.3-3.2l20.5-20.4c0.8-0.8,2-1.3,3.2-1.3c1.2,0,2.3,0.5,3.2,1.3l20.5,20.4 C74.5,58.1,74.9,59.2,74.9,60.4z" })
			);
		}
	}]);

	return _class19;
})(React.Component);

Comp.Icons.Edit = (function (_React$Component20) {
	_inherits(_class20, _React$Component20);

	function _class20() {
		_classCallCheck(this, _class20);

		_get(Object.getPrototypeOf(_class20.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class20, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M47,13.5l18.5,10.7l-3,5.1L44,18.7L47,13.5z M16.4,91.5h67.3v7.3H16.4V91.5z M16.4,87.9l6.4-3.9l-6.2-3.6L16.4,87.9z M25.2,82.5l0.8-0.5l9.6-5.9l-9.3-5.3L17,65.4l-0.3,11.2 l0,0.9L25.2,82.5z M63,2.3l4.2,2.4c3.9,2.3,5.3,7.3,3,11.3l-3.5,6.1L48.2,11.4l3.5-6.1C54,1.4,59.1,0,63,2.3L63,2.3z M61.3,31.5 L36.7,74L18.3,63.3l24.5-42.5L61.3,31.5z" })
			);
		}
	}]);

	return _class20;
})(React.Component);

Comp.Icons.Embed = (function (_React$Component21) {
	_inherits(_class21, _React$Component21);

	function _class21() {
		_classCallCheck(this, _class21);

		_get(Object.getPrototypeOf(_class21.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class21, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M29.3,69.8c-0.9,0-1.8-0.4-2.5-1L10.7,52.7c-1.4-1.4-1.4-3.6,0-5l16.1-16.1c0.7-0.7,1.5-1,2.5-1 c0.9,0,1.8,0.4,2.5,1c0.7,0.7,1,1.5,1,2.5c0,0.9-0.4,1.8-1,2.5L18.2,50.2l13.6,13.6c0.7,0.7,1,1.6,1,2.5c0,0.9-0.4,1.8-1,2.5 C31.1,69.4,30.2,69.8,29.3,69.8z" }),
				React.createElement("path", { d: "M70.7,69.8c-0.9,0-1.8-0.4-2.5-1c-1.4-1.4-1.4-3.6,0-5l13.6-13.6L68.2,36.6c-1.4-1.4-1.4-3.6,0-5 c0.7-0.7,1.6-1,2.5-1c0.9,0,1.8,0.4,2.5,1l16.1,16.1c0.7,0.7,1,1.6,1,2.5c0,0.9-0.4,1.8-1,2.5L73.2,68.7 C72.6,69.4,71.7,69.8,70.7,69.8z" }),
				React.createElement("path", { d: "M40.9,85.7C40.9,85.7,40.9,85.7,40.9,85.7c-0.3,0-0.6,0-0.9-0.1c-1.9-0.5-3-2.4-2.5-4.3l17.3-64 c0.4-1.5,1.8-2.6,3.4-2.6c0.3,0,0.6,0,0.9,0.1c1.9,0.5,3,2.4,2.5,4.3l-17.3,64C43.9,84.6,42.5,85.7,40.9,85.7z" })
			);
		}
	}]);

	return _class21;
})(React.Component);

Comp.Icons.Envelope = (function (_React$Component22) {
	_inherits(_class22, _React$Component22);

	function _class22() {
		_classCallCheck(this, _class22);

		_get(Object.getPrototypeOf(_class22.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class22, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M42.8,69.4l-4.7-3.4h23.8l-4.7,3.4H42.8z M97.4,42.2L65.3,67.1l32.9,24.5v-50C97.9,41.9,97.6,42.1,97.4,42.2 z M3.1,40.1l0.3,0.2L18,51.1l0,0l2.7,2V20.8c0-1.4,1.1-2.5,2.5-2.5h53.4c1.4,0,2.5,1.1,2.5,2.5v32.4l1.4-1v0l15.7-11.6 c0.2-0.1,0.4-0.3,0.6-0.5c0.1-0.1,0.3-0.1,0.4-0.2c0,0,0,0,0,0c0,0,0,0,0,0c-0.1-0.1-0.2-0.2-0.4-0.2c-0.2-0.2-0.4-0.3-0.6-0.5 L82,28.5v-7.7c0-2.9-2.4-5.2-5.2-5.2H64.3L51.8,6.3C51.4,6,50.7,5.8,50,5.8c-0.7,0-1.4,0.2-1.8,0.6l-12.5,9.2H23.3 c-2.9,0-5.2,2.4-5.2,5.2v7.7L3.3,39.4l-0.3,0.2c-0.1,0.1-0.3,0.1-0.4,0.2l0,0l0,0C2.8,39.9,2.9,40,3.1,40.1z M71.5,46.6H28.5V50 h42.9V46.6z M71.5,58.9v-2.6H28.5v2.6l1.1,0.8h40.7L71.5,58.9z M52.1,77.4C51.5,77.8,50.8,78,50,78c-0.8,0-1.5-0.2-2.1-0.7 l-11.4-8.8L2.7,93.8c0.4,0.3,0.8,0.4,1.3,0.4H96c0.5,0,0.9-0.2,1.3-0.4L63.4,68.6L52.1,77.4z M2.6,42.3c-0.2-0.2-0.5-0.4-0.8-0.6v50 l32.9-24.5L2.6,42.3z M71.5,36.7H28.5v3.4h42.9V36.7z M71.5,26.9H28.5v3.4h42.9V26.9z" })
			);
		}
	}]);

	return _class22;
})(React.Component);

Comp.Icons.Expand = (function (_React$Component23) {
	_inherits(_class23, _React$Component23);

	function _class23() {
		_classCallCheck(this, _class23);

		_get(Object.getPrototypeOf(_class23.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class23, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M34.6,38.8c-1,0-2.1-0.4-2.8-1.1L8,14v15.2c0,2.1-1,3.7-3,3.7s-3-1.6-3-3.7v-24c0-0.2-0.3-1.8,0.4-2.6 C3.3,1.8,4.6,2,4.7,2h24.2c2.1,0,3.7,1,3.7,3S31,8,28.8,8H13.6l23.7,24.1c0.7,0.7,1.1,1.8,1.1,2.8c0,1.1-0.4,2.1-1.1,2.8 C36.5,38.4,35.6,38.8,34.6,38.8z" }),
				React.createElement("path", { d: "M5,98c-0.1,0-1.7,0.1-2.5-0.7C1.7,96.5,2,94.9,2,94.8V70.7C2,68.6,3,67,5,67s3,1.6,3,3.7v15.2l24-23.6 c0.7-0.7,1.7-1,2.7-1c1,0,2.1,0.4,2.8,1.1c1.5,1.5,1.5,4.1,0,5.5L13.8,92H29c2.1,0,3.7,1,3.7,3s-1.6,3-3.7,3H5z" }),
				React.createElement("path", { d: "M64.7,38.5c-1.1,0-2.2-0.4-2.9-1.1c-0.7-0.7-1.1-1.6-1.1-2.7c0-1,0.4-2.1,1.1-2.8L85.5,8H70.3 c-2.1,0-3.7-1-3.7-3s1.6-3,3.7-3h24c0.2,0,2.3-0.2,3.1,0.6c0.8,0.8,1.1,2.4,1.1,2.4l0,24.1c0,2.1-1.3,3.7-3.2,3.7 c-2,0-3.2-1.6-3.2-3.7V13.8L67.7,37.5C67,38.1,65.8,38.5,64.7,38.5z" }),
				React.createElement("path", { d: "M70.5,98c-2.1,0-3.7-1-3.7-3s1.6-3,3.7-3h15.2L62.2,67.6c-0.7-0.7-1.1-1.8-1-3c0-1.1,0.4-2.2,1.1-2.9 c0.7-0.7,1.7-1.1,2.7-1.1c1,0,2.2,0.4,2.9,1.1L92,85.4V70.2c0-2.1,1-3.7,3-3.7s3,1.6,3,3.7v24c0,0.3,0,2.4-0.8,3.1 c-0.8,0.8-2.5,0.9-2.6,0.9l0.1-0.2H70.5z" })
			);
		}
	}]);

	return _class23;
})(React.Component);

Comp.Icons.Filter = (function (_React$Component24) {
	_inherits(_class24, _React$Component24);

	function _class24() {
		_classCallCheck(this, _class24);

		_get(Object.getPrototypeOf(_class24.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class24, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,21.2c-0.8,0-1.6,0-2.4,0c-12-0.3-22.4-2.4-29-4.1c-4.2-1.1-4.2-3.5-0.1-4.7c6.8-1.8,17.8-4,31.5-4 c14,0,24.8,2.2,31.5,4c4.2,1.1,4.1,3.6-0.1,4.7c-6.6,1.7-17,3.9-29,4.1C51.6,21.2,50.8,21.2,50,21.2 M6,14C6,14.2,6,14.5,6,14.8 c0,0.6,0.1,1.1,0.2,1.6c0.2,0.7,0.5,1.4,1,2.1l29.1,40.3c1.6,2.2,3.3,6.1,3.3,8.8v27.6c0,3.4,2.1,4.3,4.6,2.1l14-11.9 c1.3-1.1,2.3-3.3,2.3-5V67.6c0-2.7,1.6-6.7,3.2-8.8l29-40.3c0.5-0.7,0.8-1.4,1-2.2c0.1-0.5,0.2-1,0.2-1.5c0-0.3,0-0.6-0.1-0.9 C92.2,1.8,54.4,1.5,50,1.5C45.6,1.5,7.6,1.8,6,14" })
			);
		}
	}]);

	return _class24;
})(React.Component);

Comp.Icons.Food = (function (_React$Component25) {
	_inherits(_class25, _React$Component25);

	function _class25() {
		_classCallCheck(this, _class25);

		_get(Object.getPrototypeOf(_class25.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class25, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M96.1,96.2c-0.7,0.8-1.6,1.4-2.5,1.7c-0.5,0.1-1,0.2-1.5,0.2c-1.5,0-3.1-0.6-4.3-1.9L38.9,46.4 c-0.2,0.1-0.4,0.1-0.6,0.2c-1.5,0.4-3.2,0.7-4.9,0.7c-6.9,0-14.8-3.4-19.7-8.4C6,31,1.2,14.1,7.9,6.3c1.5-1.8,3.5-2.9,5.7-3.6 C15.1,2.2,16.7,2,18.4,2c6.9,0,14.8,3.5,19.7,8.4c6.2,6.3,10.5,18.3,8.6,26.9L95.5,87C98,89.6,98.3,93.7,96.1,96.2z M60.9,45.4 c4.8,2.2,10.9,1.1,15-3.2l18-19l0,0L94,23c1.1-1.2,1.2-3.2,0.1-4.5c-1.1-1.2-2.9-1.3-4.1-0.1l-0.1,0.1l0,0L72.2,37.3 c-1.1,1.1-2.6,1.3-3.6,0.2c-1-1.2-0.8-2.8,0.3-3.9c0,0,0,0,0,0l17.8-18.8c1.1-1.2,1.2-3.2,0.1-4.5C85.7,9,83.8,9,82.7,10.2l-0.1,0.1 l0,0L64.8,29c-1.1,1.1-2.6,1.4-3.6,0.2c-1-1.2-0.8-2.8,0.3-4L79.2,6.6h0l0.1-0.1c1.1-1.2,1.2-3.2,0.1-4.5c-1.1-1.3-2.9-1.3-4.1-0.1 L57.2,21c-4.3,4.3-6.5,10.1-5,15C53.5,40.2,56,43.2,60.9,45.4z M38.6,52.4l-34,35.9c-2.4,2.6-3,6.3-0.6,8.9c2.3,2.7,5.8,2.2,8.2-0.4 l34.5-36.4L38.6,52.4z" })
			);
		}
	}]);

	return _class25;
})(React.Component);

Comp.Icons.Globe = (function (_React$Component26) {
	_inherits(_class26, _React$Component26);

	function _class26() {
		_classCallCheck(this, _class26);

		_get(Object.getPrototypeOf(_class26.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class26, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,2.6C23.9,2.6,2.6,23.9,2.6,50S23.9,97.4,50,97.4c26.1,0,47.4-21.3,47.4-47.4S76.1,2.6,50,2.6z M15,29 v0.3c0-0.1,0-0.1-0.1-0.2C15,29,15,29,15,29z M43.1,90.2c-2.1-2.3,1.1-8.1,0.5-10.6c-0.4-1.5-2.6-3.1-3.7-4.4 c-1.1-1.4-2.7-3-3.5-4.6c-1-2.1-0.5-2.9,0.4-4.5c0.7-1.2,0.6-2.3,1.1-3.5c0.2-0.4,1.8-2,1.6-2.4c0-0.1,0-0.1,0-0.2 c-1.2-0.1-2.3,0.1-3.2-0.6c-0.8-0.6-1-2.4-1.7-3.1c-1.8-1.6-4.7-0.7-6.7-2.1c-1.8-1.3-3.8-2.5-5-4.3c-1.1-1.7-1.5-6-3.6-6.4 c0,2.1-0.3,2.7,0.6,4.8c0.6,1.2,1.7,4.1-1,3.4c-0.1-2.1-0.1-3.8-0.6-5.7c-0.5-1.9-2-3.8-2.4-5.8c-0.4-1.9-0.2-3.9-0.2-5.8 c0-2-0.7-3.7-0.8-5.5c1.3-2.1,2.7-4.1,4.4-5.9c1.2-1.3,2.4-2.5,4-3.2c1.6-0.6,3.4-1.5,5.1-1.9c1.8-0.4,3.9-0.4,5.8-0.5 C34,16.2,32.6,15,35,15.2c1.4,0.1,1.8,1.5,3.4,0.8c-0.7-0.7-2.9-2.1-0.7-2.4c0-0.8,0-1.6,0.1-2.3c0.5-0.3,1-0.5,1.5-0.7 c2.5-0.7,5-1.1,7.6-1.3c0.4,0.1,0.7,0.2,1,0.3c0.2-0.1,0.4-0.3,0.6-0.4c0.5,0,0.9,0,1.4,0c5.7,0,11.1,1.2,16,3.3 c0.3,0.4,0.5,0.7,0.9,1c0.7,0.5,2.2,0.9,0.7,1.1c-0.5,0.1-0.9-0.2-1.2,0.2c-0.4,0.5,0.2,0.9-0.7,1.3c-0.8,0.4-1.9-0.4-2.3,0.6 c-0.4,0.9,0.4,2.1,0.1,3c-0.3,1.1-1.7,0.9-2.7,0.8c-2-0.1-4.2-1.5-5.4-3.1c-0.4-0.5-1.3-2-0.9-2.7c0.3-0.6,0.9-0.2,1.2-0.6 c0.3-0.4-0.2-1.1-0.6-1.3c-0.1,0.8-0.6,1-1.2,0.7c-0.9-0.5-0.4-1.5-0.9-2.2c-0.7-1.1-2.4-0.7-3.5-1.1c-0.6-0.2-1-0.4-1.5-0.6 c-0.4,0.2-0.7,0.5-1.1,0.6c-0.9,0.3-1.9,0.3-2.7,0.9c-2.3,1.8,0.4,1.8,1.7,2.1c1.7,0.4,2.6,2.1,4,2.6c1.9,0.8,2.7-0.3,2.4,2.6 c-1.1,0.3-2.1-0.2-2.7-1.1c0.5,0.8,0.8,1.8,0.7,2.9c-1.8,0.6-2.6-0.2-4.1-0.8c-1.2-0.5-2.7-0.3-3.8-1c-0.1-0.3-0.1-0.6,0-0.9 c1.3,0,2.7-0.1,2.1-1.8c-2.4-0.2-2.9,0.9-4.4,2.3c3.6,1.2,0.4,2.4-1.6,2.3c-1.7-0.1-4.3-0.4-5.3,1.7c-0.9,2,2.1,2.5,3.7,3 c1,0.3,1.4,0.1,2.1,0.9c0.7,0.8,0.3,1.8,1.4,2.4c0.5-0.9-0.4-1.9-0.2-2.4c0.5-1.2,1.2-0.5,2.4-1c-0.6-1.3-2.4-1.8-2-3.2 c0.4-1.5,2.5-1.5,3.8-1.4c2,0.1,2,1.1,3.4,1.6c2.2,0.7,2.2-0.8,3.7,1.6c1.6,2.5,3.2,3.7,5.3,5.6c3.8,3.5-3,3.4-3.8,0.8 c0.3-0.1,0.8-0.5,1-0.6c-1.4-0.6-4.5-0.6-6.2-0.2c-0.1,0.4-0.1,0.6,0,1c1.5,0.1,1.9,0.1,2.7,0.7c0.3,0.2-0.1,1,0.4,1.3 c0.3,0.2,1.6-0.1,2-0.1c0.4,2.3-4.9,1.4-6.1,2.2c0,0.5-0.3,0.9-0.3,1.4c-3-0.4-2.8,2.5-3.8,4.2c-0.7,1.3-2.3,2.2-3.2,3.4 c-0.4,0.6-1.2,1.1-1.1,1.9c0.1,1.4,1.7,0.7,1.7,1.9c0,2.5-3.3-0.1-3.8-1.4c-3-0.6-6.9-1-8,2.4c-0.5,1.4,0.1,3.4,1.8,3.6 c1.5,0.1,0.9-0.9,2-1.3c0.6-0.2,1.7,0,2.3,0c0.5,1.4,0.3,2.1,1,3.2c0.9,1.2,0.9,1,1.4,2.5c0.4,1.1,0.7,2.2,2,2.7 c1.3,0.4,2.9-0.5,3,1.4c2.4,0.1,4.4,0,6.3,1.5c1.4,1.1,2.1,2.4,3.8,2.9c2.7,0.9,3.5,0.6,4.2,3.4c0.3,1.3-0.7,1.7,1.2,2.1 c1.1,0.2,2.5-0.5,3.6-0.4c1.9,0.1,3.8,1.2,3.8,3.4c0,1.2-0.5,1.5-1,2.4c-0.6,1.1-0.7,2.6-1.4,3.7c-1.3,2.1-3.7,1.2-5.2,3.1 c-0.5,0.7-0.3,1.7-1.1,2.5c-0.6,0.5-2.3,0.6-2.8,1c-1,0.8-0.5,1.4-1.5,2.4c-0.6,0.6-2.2,0.3-2.9,0.6c-1.2,0.6-1.9,1.8-2.8,2.4 C45.3,90.6,44.2,90.4,43.1,90.2z M84,66.7c0.2-1.5,0.4-3,0.8-4.4c0.4-1.5,0.6-2.9,0.5-4.5c0-0.7,0-1.9-0.5-2.4 c-0.2-0.2-1.7-0.9-2-0.9c-0.9,0-1.8,1.4-2.7,1.6c-1.1,0.3-2-0.4-2.7-1.1c-0.9-1-1.9-1.6-2.8-2.6c-1.1-1.1-1.3-2.6-1.3-4.1 c0-1.5,0.2-2.6,0.6-4c0.2-0.6,0.4-1.2,0.5-1.9c0.3-1.3,0.4-0.6,1-1.3c0.6-0.7,0.9-1.9,1.4-2.8c0.5-0.9,1-1.6,1.7-2.2 c-1.7-0.7-1.7-3.6-1.1-5.2c0.8-0.1,3.3,0.3,2-1.5c-0.4-0.6-1.7-0.4-1-1.5c0.4-0.6,1.2-0.6,1.8-0.6c0.1-0.7,0.4-1,1-1.2l-0.2-0.1 c-0.6-0.5-1.4-1.2-1.9-1.8c-0.6-0.6-1-2.4-0.1-2.7c2.5,2.6,4.7,5.5,6.5,8.6c0.1,0.2,0.1,0.4,0.2,0.6c0.3,0.8,0.8,1.6,1.1,2.4 c0.2,0.4,0.4,0.7,0.6,1c0.6,1.5,1.2,2.9,1.6,4.5c0,0.1,0,0.3-0.1,0.4c-1.1-0.4-1.7-2.3-2.4-3.3c0,0.4,0,0.8-0.1,1.1 c-0.2,0-0.5-0.1-0.6-0.2c-0.3-0.6-0.7-1.2-1.1-1.8c0.1,0.2,0.1,0.4,0,0.6c-1.2,0-0.9-1.4-1.2-2.1c-0.3-0.9-1.2-1.4-2.1-0.7 c-0.6,0.5-0.6,1.6-1.1,2.2c-0.3,0.3-0.6,0.4-0.8,0.6c-0.3,0.3-0.6,0.3-0.4,0.9c1-0.3,1.8-0.4,3-0.3c0.8,0.1,2.2-0.1,2.7,0.3 c0.3,0.3,0.3,0.8,0.4,1.2c0.2,0.4,0.4,0.6,0.7,1c0.4,0.6,1,2.2,1.8,2.1c0-0.2,0.1-0.5,0-0.7c1.4,0.5,1.9,3,2.1,4.4 c0.3,2.6,0.5,5.5,0.5,8.3c-0.4,7-2.6,13.5-6.1,19.1C84.2,70.3,83.9,67.7,84,66.7z" })
			);
		}
	}]);

	return _class26;
})(React.Component);

Comp.Icons.Graph = (function (_React$Component27) {
	_inherits(_class27, _React$Component27);

	function _class27() {
		_classCallCheck(this, _class27);

		_get(Object.getPrototypeOf(_class27.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class27, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M93.5,90H10V6.5c0-2.2-1.3-4-3.5-4C4.3,2.5,3,4.3,3,6.5v87C3,95.7,4.3,97,6.5,97h87c2.2,0,4-1.3,4-3.5 C97.5,91.3,95.7,90,93.5,90z" }),
				React.createElement("path", { d: "M37,60.1c0-1.9-1.5-3.1-3.3-3.1H20.2c-1.9,0-3.2,1.2-3.2,3.1v18.8c0,1.9,1.3,3.1,3.2,3.1h13.5 c1.9,0,3.3-1.3,3.3-3.1V60.1z M23,63h8v13h-8V63z" }),
				React.createElement("path", { d: "M90,11.6C90,9.7,88.5,8,86.6,8H73.1C71.3,8,70,9.7,70,11.6v67.3c0,1.9,1.3,3.1,3.1,3.1h13.5 c1.9,0,3.4-1.3,3.4-3.1V11.6z M77,15h7v61h-7V15z" }),
				React.createElement("path", { d: "M63,36.3c0-1.9-1-3.3-2.9-3.3H46.7c-1.9,0-3.7,1.4-3.7,3.3v42.6c0,1.9,1.8,3.1,3.7,3.1h13.5 c1.9,0,2.9-1.3,2.9-3.1V36.3z M50,40h8v36h-8V40z" })
			);
		}
	}]);

	return _class27;
})(React.Component);

Comp.Icons.Grid = (function (_React$Component28) {
	_inherits(_class28, _React$Component28);

	function _class28() {
		_classCallCheck(this, _class28);

		_get(Object.getPrototypeOf(_class28.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class28, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("rect", { x: "6.5", y: "6.5", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "37.6", y: "6.5", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "68.7", y: "6.5", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "6.5", y: "37.6", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "37.6", y: "37.6", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "68.7", y: "37.6", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "6.5", y: "68.7", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "37.6", y: "68.7", width: "24.8", height: "24.8" }),
					React.createElement("rect", { x: "68.7", y: "68.7", width: "24.8", height: "24.8" })
				)
			);
		}
	}]);

	return _class28;
})(React.Component);

Comp.Icons.Help = (function (_React$Component29) {
	_inherits(_class29, _React$Component29);

	function _class29() {
		_classCallCheck(this, _class29);

		_get(Object.getPrototypeOf(_class29.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class29, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,0.7C22.8,0.7,0.7,22.8,0.7,50S22.8,99.3,50,99.3S99.3,77.2,99.3,50S77.2,0.7,50,0.7z M50,78 c-2.4,0-4.3-2-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C54.3,76.1,52.4,78,50,78z M60,51.9c-3,2.5-5.6,4.6-5.6,7.9 c0,2.4-1.9,4.3-4.3,4.3c-2.4,0-4.3-1.9-4.3-4.3c0-5.8,4.2-8.8,8.4-11.8c3.8-2.7,7.4-5.3,7.4-9.9c0-5.9-4.3-9.5-11.4-9.5 c-10.3,0-11.4,7.3-11.4,10.5c0,1.8-1.5,3.4-3.4,3.4c-1.9,0-3.4-1.5-3.4-3.4C31.8,30.9,37.5,22,50,22c11.9,0,18.2,8.1,18.2,16.2 C68.2,45.2,63.8,48.8,60,51.9z" })
			);
		}
	}]);

	return _class29;
})(React.Component);

Comp.Icons.Home = (function (_React$Component30) {
	_inherits(_class30, _React$Component30);

	function _class30() {
		_classCallCheck(this, _class30);

		_get(Object.getPrototypeOf(_class30.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class30, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M91.7,57.4c-1.4,0-2.8-0.5-3.9-1.6L49.8,18L12.3,55.8c-2.2,2.2-5.7,2.2-7.9,0 c-2.2-2.2-2.2-5.7,0-7.9L45.9,6.2c1-1,2.5-1.6,3.9-1.6c0,0,0,0,0,0c1.5,0,2.9,0.6,3.9,1.6l41.9,41.8c2.2,2.2,2.2,5.7,0,7.9 C94.6,56.9,93.1,57.4,91.7,57.4z" }),
					React.createElement("path", { d: "M78.4,28.1c0.1-0.2,0.1-0.5,0.1-0.7V12.1c0-1.2-0.9-2.1-2.1-2.1h-9.8 c-1.2,0-2.1,0.9-2.1,2.1v2.3L78.4,28.1z" }),
					React.createElement("path", { d: "M78.4,28.2L78.4,28.2L64.5,14.4v-2.3c0-1.2,1-2.2,2.2-2.2h9.8c1.2,0,2.2,1,2.2,2.2v15.3 c0,0.2,0,0.5-0.1,0.7L78.4,28.2z M64.7,14.3L78.4,28c0.1-0.2,0.1-0.4,0.1-0.6V12.1c0-1.1-0.9-2-2-2h-9.8c-1.1,0-2,0.9-2,2V14.3z" }),
					React.createElement("path", { d: "M50,20.8L16.4,54.4v41.1h23.4v-32c0-1.2,0.9-2.1,2.1-2.1H58c1.2,0,2.1,0.9,2.1,2.1v32h23.4 V54.4L50,20.8z" })
				)
			);
		}
	}]);

	return _class30;
})(React.Component);

Comp.Icons.Info = (function (_React$Component31) {
	_inherits(_class31, _React$Component31);

	function _class31() {
		_classCallCheck(this, _class31);

		_get(Object.getPrototypeOf(_class31.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class31, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,1C22.9,1,1,22.9,1,50c0,27.1,21.9,49,49,49c27.1,0,49-21.9,49-49C99,22.9,77.1,1,50,1z M49.5,75.8 c-2.3,0-4.5-1.6-4.5-4.1v-8.5v-6.4v-8.4c0-2.4,2.2-4.1,4.5-4.1c2.4,0,4.5,1.7,4.5,4.1v8.4v6.4v8.5C54,74.1,51.9,75.8,49.5,75.8z M54.5,33.8c0,2.7-2.2,5-5,5c-2.7,0-5-2.2-5-5c0-2.7,2.2-5,5-5C52.3,28.9,54.5,31.1,54.5,33.8z" })
			);
		}
	}]);

	return _class31;
})(React.Component);

Comp.Icons.Jazz = (function (_React$Component32) {
	_inherits(_class32, _React$Component32);

	function _class32() {
		_classCallCheck(this, _class32);

		_get(Object.getPrototypeOf(_class32.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class32, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M25.1,32.2c0,4.2,0,8.3,0,12.5c0,0,0.1,0,0.1,0c0.1-0.2,0.2-0.4,0.3-0.7 c2.3-5.5,8.2-8.4,13.8-6.9c1.8,0.5,3.2,1.5,4.4,3.2c0.2-1.1,0.3-2.1,0.4-3.2c2.3,0,4.7,0,7,0c0,8.3,0,16.6,0,24.9c-2.3,0-4.6,0-7,0 c-0.1-0.9-0.2-1.8-0.3-2.9c-0.1,0.1-0.2,0.2-0.3,0.3c-1.5,2.1-3.6,3-6.1,3.2c-5.5,0.4-10.1-2.6-12.1-7.7c-0.1-0.1-0.1-0.3-0.2-0.4 c-0.3,1.3-0.6,2.6-1.1,3.9c-1.9,4.9-5.6,7.7-10.7,8.8c-1.5,0.3-3.1,0.4-4.7,0.4c-1.7,0.1-3.4,0-5.1,0c0-2.9,0-5.7,0-8.6 c1.9,0,3.8,0,5.7,0c1.5,0,2.7-0.5,3.8-1.6c1.7-1.6,2.3-3.7,2.3-5.9c0-5.3,0-10.6,0-15.9c0-1.2,0-2.4,0-3.6 C18.7,32.2,21.9,32.2,25.1,32.2z M37.4,55.1c2.9,0,5.4-2.4,5.4-5.3c0-2.9-2.5-5.3-5.4-5.3c-2.9,0-5.3,2.4-5.3,5.3 C32.1,52.6,34.5,55.1,37.4,55.1z" }),
					React.createElement("path", { d: "M52.2,44.5c0-2.5,0-4.9,0-7.3c7.1,0,14.3,0,21.5,0c0,0.2,0,0.5,0,0.7c0,2,0,3.9,0,5.9 c0,0.5-0.1,0.8-0.5,1.1c-3.5,3.2-6.9,6.3-10.3,9.5c-0.2,0.1-0.3,0.3-0.5,0.5c3.8,0,7.5,0,11.3,0c0,2.4,0,4.8,0,7.1 c-7.2,0-14.3,0-21.5,0c0-0.3,0-0.5,0-0.7c0-1.9,0-3.8,0-5.7c0-0.5,0.1-0.8,0.5-1.2c3.1-3.1,6.3-6.3,9.4-9.5 c0.1-0.1,0.3-0.3,0.5-0.6C59.1,44.5,55.7,44.5,52.2,44.5z" }),
					React.createElement("path", { d: "M74.7,44.6c0-2.5,0-4.9,0-7.3c7.1,0,14.2,0,21.4,0c0,1,0,2.1,0,3.1c0,1.2,0,2.3,0,3.5 c0,0.5-0.1,0.8-0.5,1.2c-3.4,3.1-6.7,6.3-10.1,9.4c-0.2,0.2-0.4,0.3-0.5,0.6c3.7,0,7.5,0,11.3,0c0,2.4,0,4.7,0,7.1 c-7.2,0-14.3,0-21.5,0c0-0.1-0.1-0.1-0.1-0.2c0-2.2,0-4.3,0-6.5c0-0.3,0.2-0.6,0.4-0.8c3-3.1,6-6.1,9-9.1c0.3-0.3,0.6-0.5,0.9-0.8 c0-0.1-0.1-0.1-0.1-0.2C81.6,44.6,78.2,44.6,74.7,44.6z" })
				)
			);
		}
	}]);

	return _class32;
})(React.Component);

Comp.Icons.Laptop = (function (_React$Component33) {
	_inherits(_class33, _React$Component33);

	function _class33() {
		_classCallCheck(this, _class33);

		_get(Object.getPrototypeOf(_class33.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class33, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M1.2,74.2c0,4.4,2.4,8.2,5.4,8.7h86.8c3-0.5,5.4-4.2,5.4-8.7H1.2z" }),
					React.createElement("path", { d: "M85.8,17.1H14.2c-2.1,0-3.9,1.7-3.9,3.9v47.6c0,2.1,1.7,3.9,3.9,3.9h71.7 c2.1,0,3.9-1.7,3.9-3.9V21C89.7,18.9,88,17.1,85.8,17.1z M80.6,61.3c0,1.7-1.4,3-3.2,3H22.6c-1.8,0-3.2-1.4-3.2-3V27.7 c0-1.7,1.4-3,3.2-3h54.7c1.8,0,3.2,1.4,3.2,3V61.3z" }),
					React.createElement("rect", { x: "73.7", y: "77.1", width: "6.4", height: "2.3" }),
					React.createElement("rect", { x: "82.2", y: "77.1", width: "6.4", height: "2.3" }),
					React.createElement("polygon", { points: "71.5,49.5 57.3,44.1 62.7,58.3 66.2,54.8 70.4,58.9 72.1,57.2 67.9,53.1 \t" })
				)
			);
		}
	}]);

	return _class33;
})(React.Component);

Comp.Icons.Left = (function (_React$Component34) {
	_inherits(_class34, _React$Component34);

	function _class34() {
		_classCallCheck(this, _class34);

		_get(Object.getPrototypeOf(_class34.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class34, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M5,54l32.8,32.8c2.6,2.6,6.5,2.8,9.1,0.2c2.6-2.6,2.4-6.5-0.2-9.1L24.8,56.2l66.1,0c3.6,0,6.6-2.9,6.6-6.5 c0-3.6-2.9-6.5-6.5-6.5l-66.1,0l21.8-21.8c2.6-2.6,2.8-6.5,0.2-9.1c-2.6-2.6-6.5-2.4-9.1,0.2l-33,33c0,0-2.3,2.2-2.3,4.2 C2.5,51.5,5,54,5,54L5,54z" })
			);
		}
	}]);

	return _class34;
})(React.Component);

Comp.Icons.Like = (function (_React$Component35) {
	_inherits(_class35, _React$Component35);

	function _class35() {
		_classCallCheck(this, _class35);

		_get(Object.getPrototypeOf(_class35.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class35, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M21.4,97.5c-1.7,0-3.3-1.2-3.8-2.8L3.8,47.6c-0.3-1-0.2-2.1,0.3-3c0.5-0.9,1.3-1.6,2.3-1.9l23.6-7 c0.4-0.1,0.7-0.2,1.1-0.2c0.7,0,1.3,0.2,1.9,0.5c0.7,0.4,1.3,1,1.6,1.7l0,0c4.2-4.1,9.8-10.5,12.2-14.6l0,0c1.5-5.4,1-11.6,0.9-12.8 c-0.2-1.7,0.3-3.4,1.5-4.7c2.7-3,7.9-3.1,8.5-3.1c2,0,4,1,5.6,2.7c3.3,3.6,4.8,10,4.2,17.6c-0.1,0.9-0.2,1.8-0.3,2.8l0,0.3 c-0.1,0.6-0.2,1.2-0.3,1.9c-0.1,0.8-0.1,1.5-0.1,2.3v0c1.9,0.7,7,1.6,15.1,1.6l1.6,0c7.2,0,13.1,5.8,13.1,13c0,2.8-0.9,5.4-2.5,7.7 c0.2,0.9,0.2,1.8,0.2,2.7c-0.2,2.9-1.5,5.7-3.7,7.7l0,0.2c-0.2,3.7-2.3,7.2-5.6,9.2l0,0c-0.1,0.3-0.2,0.6-0.3,0.8 c-1.4,3.8-5.4,5.9-11.2,5.9c-1,0-2-0.1-3.2-0.2c-2.3-0.3-5.9-0.6-10-0.9l-6.2-0.5c-1.9-0.2-3.8-0.3-5.5-0.3c-0.8,0-1.5,0-2.2,0.1 l2.5,8.6c0.3,1,0.2,2.1-0.3,3c-0.5,0.9-1.3,1.6-2.3,1.9l-23.6,7C22.1,97.4,21.8,97.5,21.4,97.5z M12.4,49.3l11.6,39.4L40.1,84 l-2.4-8c-0.3-0.4-0.5-0.8-0.6-1.2l-8.5-28.7c-0.1-0.4-0.2-0.9-0.1-1.3l-0.1-0.4l-16.1,4.7L12.4,49.3z M48.4,69 c1.8,0,3.9,0.1,6.2,0.3l6.3,0.5c4.2,0.4,7.8,0.7,10.2,1c0.8,0.1,1.5,0.1,2.2,0.1c2.7,0,3.7-0.7,3.8-0.8l0,0c0.1-0.4,0.2-0.8,0.3-1.2 c0.2-1.5,1.2-2.8,2.6-3.3c1.5-0.5,2.5-1.8,2.6-3.3c0-0.3,0-0.5-0.1-0.9c-0.3-1.6,0.5-3.3,1.9-4.1c1.1-0.6,1.8-1.7,1.8-2.9 c0-0.6-0.1-1.1-0.3-1.7c-0.7-1.5-0.3-3.3,1-4.5c1.1-1,1.7-2.3,1.7-3.8c0-2.8-2.3-5.1-5.1-5.1c-0.2,0-0.8,0-1.7,0 c-11.6,0-18.6-1.4-21.3-4.2c-1.1-1.1-1.7-2.6-1.7-4.1c0-1.3,0.1-2.7,0.2-4.2c0.1-0.8,0.2-1.4,0.3-2l0.1-0.4c0.1-0.8,0.2-1.6,0.3-2.3 c0.6-7.1-1.3-11-2.3-11.8c-0.5,0-1.2,0.2-1.8,0.3v0c0.2,2.6,0.4,9.3-1.4,15.2c-0.1,0.2-0.2,0.5-0.3,0.7c-3,5.5-11,14.5-16.7,19.6 L44,69.2C45.4,69.1,46.9,69,48.4,69z" })
			);
		}
	}]);

	return _class35;
})(React.Component);

Comp.Icons.Link = (function (_React$Component36) {
	_inherits(_class36, _React$Component36);

	function _class36() {
		_classCallCheck(this, _class36);

		_get(Object.getPrototypeOf(_class36.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class36, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M29.3,70.7c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2-0.4,2.8-1.2L69.6,36c1.6-1.6,1.6-4.1,0-5.6 c-1.6-1.6-4.1-1.6-5.6,0L29.3,65.1C27.8,66.6,27.8,69.1,29.3,70.7z" }),
					React.createElement("path", { d: "M91.2,10L90,8.9c-8.3-8.3-21.8-8.3-30.1,0l-9.9,9.9c-4.4,4.4-6.7,10.6-6.1,16.9c0.2,2.2,2.1,3.8,4.3,3.6 c2.2-0.2,3.8-2.1,3.6-4.3c-0.3-3.9,1-7.8,3.8-10.6l9.9-9.9c5.2-5.2,13.7-5.2,18.9,0l1.1,1.1c5.2,5.2,5.2,13.7,0,18.9l-9.9,9.9 c-2.8,2.8-6.6,4.2-10.6,3.8C63,48,61,49.5,60.8,51.7c-0.2,2.2,1.4,4.1,3.6,4.3c0.7,0.1,1.3,0.1,1.9,0.1c5.6,0,11-2.2,14.9-6.2 l9.9-9.9C99.4,31.8,99.5,18.3,91.2,10z" }),
					React.createElement("path", { d: "M51.7,60.8c-2.2,0.2-3.8,2.1-3.6,4.3c0.4,3.9-1,7.8-3.8,10.5l-9.9,9.9c-5.2,5.2-13.7,5.2-18.9,0l-1.1-1.1 c-2.5-2.5-3.9-5.9-3.9-9.4c0-3.6,1.4-6.9,3.9-9.4l9.9-9.9c2.8-2.8,6.6-4.1,10.6-3.8c2.2,0.2,4.1-1.4,4.3-3.6 c0.2-2.2-1.4-4.1-3.6-4.3c-6.3-0.5-12.5,1.7-16.9,6.1l-9.9,9.9c-4,4-6.2,9.4-6.2,15.1c0,5.7,2.2,11,6.2,15l1.1,1.1 c4.2,4.1,9.6,6.2,15.1,6.2s10.9-2.1,15-6.2l9.9-9.9c4.4-4.4,6.6-10.6,6.1-16.9C55.8,62.2,53.9,60.6,51.7,60.8z" })
				)
			);
		}
	}]);

	return _class36;
})(React.Component);

Comp.Icons.List = (function (_React$Component37) {
	_inherits(_class37, _React$Component37);

	function _class37() {
		_classCallCheck(this, _class37);

		_get(Object.getPrototypeOf(_class37.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class37, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M87.2,30.1H30.6c-3.5,0-6.3-2.8-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3h56.6c3.5,0,6.3,2.8,6.3,6.3 C93.5,27.3,90.7,30.1,87.2,30.1L87.2,30.1z" })
					),
					React.createElement("circle", { cx: "12.8", cy: "23.8", r: "6.3" }),
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M87.2,56.8H30.6c-3.5,0-6.3-2.8-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3h56.6c3.5,0,6.3,2.8,6.3,6.3 C93.5,54,90.7,56.8,87.2,56.8L87.2,56.8z" })
					),
					React.createElement("circle", { cx: "12.8", cy: "50.5", r: "6.3" }),
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M87.2,83.6H30.6c-3.5,0-6.3-2.8-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3h56.6c3.5,0,6.3,2.8,6.3,6.3 C93.5,80.8,90.7,83.6,87.2,83.6L87.2,83.6z" })
					),
					React.createElement("circle", { cx: "12.8", cy: "77.3", r: "6.3" })
				)
			);
		}
	}]);

	return _class37;
})(React.Component);

Comp.Icons.Map = (function (_React$Component38) {
	_inherits(_class38, _React$Component38);

	function _class38() {
		_classCallCheck(this, _class38);

		_get(Object.getPrototypeOf(_class38.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class38, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M29,12.4l-20.6-3l0,0c-0.2,0-0.3,0-0.5,0c-1,0-2,0.5-2.7,1.2 c-0.8,0.8-1.3,1.8-1.4,2.9c0,0.2,0,0.5,0,0.7v68.4c0,0.3,0,0.6,0.1,0.9c0.2,1.1,0.7,2.1,1.5,2.8c0.7,0.7,1.6,1.2,2.6,1.2 c0.2,0,0.4,0,0.6,0L29,83.8c0.3-0.1,0.6-0.1,0.9-0.2c0.3-0.1,0.6-0.2,0.8-0.3l0.2-0.1l0.2,0.1c0.3,0.1,0.5,0.2,0.8,0.3 c0.3,0.1,0.6,0.1,0.9,0.2l20.6,3.7c0.3,0,0.5,0.1,0.8,0c0.3,0,0.5-0.1,0.8-0.1l0.2,0l0.2,0c0.2,0.1,0.5,0.1,0.8,0.1 c0.3,0,0.5,0,0.8,0l4.4-0.8l-0.2-0.2c-3-3.3-6.1-6.8-8.9-10.1V78v0v0l0,0.1v0c0,0.3-0.2,0.7-0.4,0.9c-0.3,0.3-0.6,0.4-1,0.4h0h-0.1 l0,0l-15.4-1.6c-0.4,0-0.7-0.2-1-0.4c-0.3-0.2-0.4-0.6-0.4-1l0,0V54.7l7.9-13.9c0.3,0.1,0.6,0.1,0.9,0.1c0.5,0,0.9-0.1,1.3-0.3 c0.8-1.8,1.7-3.5,2.8-5.1l-0.4-0.1c-0.4-2.1-1.9-3.6-3.7-3.6c-2.1,0-3.8,2.1-3.8,4.6c0,0.6,0.1,1.1,0.2,1.6l-5.3,9.3V19.8l0,0 c0-0.4,0.2-0.7,0.4-1c0.2-0.2,0.6-0.4,1-0.4L50.8,17h0h0h0c0.4,0,0.7,0.1,1,0.4l0,0c0.2,0.2,0.4,0.6,0.4,0.9v0l0,0v0v0v11.2 c1.8-1.5,3.8-2.8,6-3.9v-7.2v0l0,0l0,0v0c0-0.4,0.2-0.7,0.4-0.9c0.3-0.3,0.6-0.4,1-0.4h0h0h0l15.4,1.4c0.4,0,0.7,0.2,1,0.4l0,0 c0.3,0.3,0.4,0.6,0.4,1v3.2c2.1,0.4,4.1,0.9,6,1.7v-7.5c0-1.3-0.5-2.3-1.3-3.1l0,0c-0.9-0.9-2.2-1.5-3.6-1.7L57,9.4 c-0.3,0-0.5,0-0.8,0l0,0c-0.3,0-0.5,0.1-0.8,0.2l-0.2,0.1l-0.2-0.1c-0.2-0.1-0.5-0.1-0.8-0.2h0c-0.3,0-0.5,0-0.8,0l-20.6,3 c-0.3,0-0.6,0.1-0.9,0.2c-0.3,0.1-0.6,0.2-0.8,0.3L30.9,13l-0.2-0.1c-0.3-0.1-0.5-0.2-0.8-0.3C29.6,12.5,29.3,12.5,29,12.4L29,12.4z M71.4,90.6C65.2,83.4,56.3,74.3,51,66.8c-3-4.2-4.5-9.2-4.5-14.3c0-13.8,11.2-24.9,24.9-24.9c13.8,0,24.9,11.2,24.9,24.9 c0,5.2-1.6,10.1-4.5,14.3C86.5,74.3,77.6,83.4,71.4,90.6L71.4,90.6z M71.4,34.1c10.1,0,18.4,8.2,18.4,18.4 c0,10.1-8.2,18.4-18.4,18.4c-10.1,0-18.4-8.2-18.4-18.4C53.1,42.3,61.3,34.1,71.4,34.1L71.4,34.1z M18.8,59.5 c-2.1,0-3.8,2.1-3.8,4.6c0,2.5,1.7,4.6,3.8,4.6c2.1,0,3.8-2.1,3.8-4.6c0-0.1,0-0.2,0-0.3l5.4-3.6v16.2v0v0c0,0.4-0.2,0.7-0.4,1 c-0.3,0.2-0.6,0.4-1,0.4l-15.4,1.6l0,0H11h0c-0.4,0-0.7-0.2-0.9-0.4l0,0c-0.2-0.2-0.4-0.6-0.4-0.9l0,0V78l0,0V18.5l0,0v-0.1v0 c0-0.4,0.2-0.7,0.4-0.9c0.2-0.3,0.6-0.4,1-0.4l0,0h0.1h0l15.4,1.4c0.4,0,0.7,0.2,1,0.4c0.3,0.2,0.4,0.6,0.4,1v0v0v35.8l-7,4.7 C20.4,59.8,19.6,59.5,18.8,59.5z" })
			);
		}
	}]);

	return _class38;
})(React.Component);

Comp.Icons.Minus = (function (_React$Component39) {
	_inherits(_class39, _React$Component39);

	function _class39() {
		_classCallCheck(this, _class39);

		_get(Object.getPrototypeOf(_class39.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class39, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,1C22.9,1,1,22.9,1,50c0,27.1,21.9,49,49,49c27.1,0,49-21.9,49-49C99,22.9,77.1,1,50,1z M74,50.7 c0,2.4-1.5,4.3-3.9,4.3H55.4H44.4H29.9c-2.4,0-4.9-1.8-4.9-4.3v-1.4c0-2.4,2.5-4.3,4.9-4.3h14.5h11.1h14.7c2.4,0,3.9,1.9,3.9,4.3 V50.7z" })
			);
		}
	}]);

	return _class39;
})(React.Component);

Comp.Icons.Naf = (function (_React$Component40) {
	_inherits(_class40, _React$Component40);

	function _class40() {
		_classCallCheck(this, _class40);

		_get(Object.getPrototypeOf(_class40.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class40, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("rect", { x: "0.1", y: "72", width: "99.9", height: "14" }),
					React.createElement("rect", { x: "0.1", y: "43.4", width: "99.9", height: "14.3" }),
					React.createElement("rect", { x: "24.7", y: "14.8", width: "75.3", height: "14.3" }),
					React.createElement("path", { d: "M0,22c0-4.4,3.6-8,8-8c4.4,0,8,3.6,8,8c0,4.4-3.6,8-8,8C3.6,30,0,26.4,0,22" })
				)
			);
		}
	}]);

	return _class40;
})(React.Component);

Comp.Icons.No = (function (_React$Component41) {
	_inherits(_class41, _React$Component41);

	function _class41() {
		_classCallCheck(this, _class41);

		_get(Object.getPrototypeOf(_class41.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class41, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M80.8,86.8c-1.6,0-3.1-0.6-4.2-1.8L50,58.5L23.4,85c-1.1,1.1-2.6,1.8-4.2,1.8c-1.6,0-3.1-0.6-4.2-1.8 c-1.1-1.1-1.8-2.6-1.8-4.2c0-1.6,0.6-3.1,1.8-4.2L41.5,50L15,23.4c-1.1-1.1-1.8-2.6-1.8-4.2c0-1.6,0.6-3.1,1.8-4.2 c1.1-1.1,2.6-1.8,4.2-1.8c1.6,0,3.1,0.6,4.2,1.8L50,41.5L76.6,15c1.1-1.1,2.6-1.8,4.2-1.8l0,0c1.6,0,3.1,0.6,4.2,1.8 c2.3,2.3,2.3,6.1,0,8.5L58.5,50L85,76.6c2.3,2.3,2.3,6.1,0,8.5C83.9,86.2,82.4,86.8,80.8,86.8z" })
			);
		}
	}]);

	return _class41;
})(React.Component);

Comp.Icons.Page = (function (_React$Component42) {
	_inherits(_class42, _React$Component42);

	function _class42() {
		_classCallCheck(this, _class42);

		_get(Object.getPrototypeOf(_class42.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class42, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M82.4,92.6c0,0.8-0.4,1.1-0.5,1.2H18.1c-0.1,0-0.5-0.4-0.5-1.2V7.4c0-0.8,0.4-1.1,0.5-1.2 h36.6c3.5,0,6.4,2.8,6.5,6.3l0.5,14.4l18.6,3.2c1,0.1,2.1,1.4,2.1,2.4V92.6z M69.3,8.9c-4-4.5-9.8-7.1-15.8-7.1H18.1 c-2.7,0-5,2.5-5,5.6v85.2c0,3.1,2.2,5.6,5,5.6h63.8c2.7,0,5-2.5,5-5.6V31.2c0-1.6-0.6-3.1-1.6-4.3L69.3,8.9z" }),
					React.createElement("rect", { x: "25.1", y: "36.8", width: "50.8", height: "6" }),
					React.createElement("rect", { x: "25.1", y: "22.9", width: "22.2", height: "6" }),
					React.createElement("rect", { x: "24.1", y: "64.9", width: "51.9", height: "6" }),
					React.createElement("rect", { x: "24.1", y: "51", width: "51.9", height: "6" }),
					React.createElement("rect", { x: "24.1", y: "79.1", width: "25.9", height: "6" })
				)
			);
		}
	}]);

	return _class42;
})(React.Component);

Comp.Icons.Pages = (function (_React$Component43) {
	_inherits(_class43, _React$Component43);

	function _class43() {
		_classCallCheck(this, _class43);

		_get(Object.getPrototypeOf(_class43.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class43, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M80.2,9.6H19.7c-1.9,0-3.4,1.5-3.4,3.4v79.3c0,1.9,1.5,3.4,3.4,3.4h60.5c1.9,0,3.4-1.5,3.4-3.4V13 C83.6,11.1,82.1,9.6,80.2,9.6z M26.3,60.3h47.1v4.3H26.3V60.3z M57.7,50h15.7v4.3H57.7V50z M57.7,39.7h15.7v4.3H57.7V39.7z M57.7,29.4h15.7v4.3H57.7V29.4z M63.6,83.6H26.1v-4.3h37.5V83.6z M73.9,74H26.1v-4.3h47.7V74z M38.9,56.4 c-6.7,0-12.2-5.6-12.2-12.5V7c0-2.2,1.8-4,4-4h12.6c1.6,0,2.9,1.3,2.9,2.9v32.2c0,4.2-3.3,7.6-7.4,7.6s-7.4-3.4-7.4-7.6v-23h3.3v23 c0,2.4,1.9,4.3,4.1,4.3s4.1-1.9,4.1-4.3V6.2H30.7c-0.4,0-0.8,0.4-0.8,0.8v36.9c0,5.1,4,9.2,8.9,9.2s8.9-4.1,8.9-9.2V15.5H51v28.5 C51,50.8,45.6,56.4,38.9,56.4z" })
			);
		}
	}]);

	return _class43;
})(React.Component);

Comp.Icons.People = (function (_React$Component44) {
	_inherits(_class44, _React$Component44);

	function _class44() {
		_classCallCheck(this, _class44);

		_get(Object.getPrototypeOf(_class44.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class44, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M59.6,13.7c0-3.2,2.6-5.8,5.8-5.8c3.2,0,5.8,2.6,5.8,5.8c0,3.2-2.6,5.8-5.8,5.8 C62.2,19.5,59.6,16.9,59.6,13.7z M61.2,28.7l0.1,0.1c2.1-3,5.3-5.2,9.1-5.8c-0.2-0.8-0.4-1.6-0.4-2.5c-0.6-0.1-1.2-0.2-1.9-0.3 c-0.8,0.4-1.8,0.7-2.8,0.7c-1,0-2-0.2-2.8-0.7c-0.8,0.1-1.5,0.2-2.2,0.3c-0.1,2.7-1.2,5.1-3,6.9C58.8,27.8,60.1,28.2,61.2,28.7z M29.6,23c0.2-0.8,0.4-1.6,0.4-2.4c0.6-0.1,1.3-0.3,2.1-0.3c0.8,0.4,1.8,0.7,2.8,0.7c1,0,2-0.2,2.8-0.7c0.7,0.1,1.3,0.2,1.8,0.3 c0.1,2.7,1.2,5.2,3,7c-1.4,0.3-2.6,0.7-3.7,1.2l-0.2,0.1C36.6,25.8,33.3,23.6,29.6,23z M34.9,19.5c3.2,0,5.8-2.6,5.8-5.8 c0-3.2-2.6-5.8-5.8-5.8c-3.2,0-5.8,2.6-5.8,5.8C29.1,16.9,31.7,19.5,34.9,19.5z M71.5,79.4v7.4c-1.9,1.3-4.3,2.4-7.1,3.2v-8.8 L63,90.4c-3.8,1-8.2,1.6-12.9,1.6c-4.7,0-9.2-0.6-13-1.6l-1.5-9.3V90c-3-0.9-5.6-2.2-7.6-3.6v-7c0-7.4,2.5-14.2,16.4-15.6 c1.7,0.9,3.6,1.4,5.6,1.4c2,0,3.9-0.5,5.6-1.4C69.7,65.2,71.5,72,71.5,79.4z M50,39.2c-6.4,0-11.6,5.2-11.6,11.6 c0,6.4,5.2,11.6,11.6,11.6c6.4,0,11.6-5.2,11.6-11.6C61.6,44.4,56.4,39.2,50,39.2z M15.6,36.7c0-6.4,5.2-11.6,11.6-11.6 c6.4,0,11.6,5.2,11.6,11.6c0,6.4-5.2,11.6-11.6,11.6C20.8,48.3,15.6,43.1,15.6,36.7z M39.8,61.4c-2.8-2.7-4.5-6.4-4.5-10.6 c0-0.3,0-0.5,0-0.8c-0.8-0.1-1.6-0.2-2.5-0.3c-1.7,0.9-3.6,1.4-5.6,1.4c-2,0-3.9-0.5-5.6-1.4C7.7,51.1,5.2,57.9,5.2,65.3v7 c1.9,1.4,4.5,2.6,7.6,3.6v-8.8l1.5,9.3c3.2,0.8,6.8,1.4,10.6,1.5C25.4,68.8,30.3,63.4,39.8,61.4z M41.8,20.1c0-4.5,3.6-8.1,8.1-8.1 c4.5,0,8.1,3.6,8.1,8.1c0,4.5-3.6,8.1-8.1,8.1C45.5,28.2,41.8,24.6,41.8,20.1z M60.2,30.8c-1.6-0.8-3.6-1.3-6.3-1.6 c-1.2,0.6-2.5,1-3.9,1c-1.4,0-2.8-0.3-3.9-0.9c-2.6,0.3-4.6,0.8-6.2,1.5c0.8,1.8,1.3,3.8,1.3,5.9c0,1.4-0.2,2.7-0.6,4 c2.5-2.3,5.8-3.7,9.5-3.7c3.7,0,7,1.4,9.5,3.7c-0.4-1.3-0.6-2.6-0.6-3.9C58.9,34.6,59.4,32.6,60.2,30.8z M84.5,29.3 c9.7,1,11,5.8,11,10.9v5.2c-1.3,0.9-3,1.6-4.9,2.2v-6.2l-1.1,6.5c-1.3,0.3-2.7,0.6-4.2,0.8c-1.2-0.4-2.6-0.7-4.1-1 c3.3-2.5,5.5-6.6,5.5-11.1C86.7,34,85.9,31.4,84.5,29.3z M83.4,27.7c3-1.2,5.2-4.1,5.2-7.5c0-4.5-3.6-8.1-8.1-8.1 c-4.5,0-8.1,3.6-8.1,8.1c0,0.9,0.2,1.8,0.4,2.6C77,22.8,80.8,24.7,83.4,27.7z M13.3,36.7c0,4.5,2.2,8.5,5.5,11.1 c-1.5,0.2-2.9,0.6-4.1,1c-1.5-0.2-2.9-0.5-4.2-0.8l-1.1-6.5v6.2c-1.9-0.6-3.6-1.4-4.9-2.2v-5.2c0-5.2,1.2-9.9,11-10.9 C14.1,31.4,13.3,34,13.3,36.7z M27.2,22.8c0.3-0.8,0.4-1.7,0.4-2.6c0-4.5-3.6-8.1-8.1-8.1c-4.5,0-8.1,3.6-8.1,8.1 c0,3.4,2.1,6.4,5.2,7.5C19.2,24.7,23,22.8,27.2,22.8z M94.8,65.3v7c-1.9,1.4-4.5,2.6-7.6,3.6v-8.8l-1.5,9.3 c-3.3,0.9-7.1,1.4-11.1,1.6c-0.3-6.7-2.6-14-14.4-16.5c2.8-2.7,4.5-6.4,4.5-10.6c0-0.3,0-0.5,0-0.8c0.8-0.1,1.6-0.2,2.5-0.3 c1.7,0.9,3.6,1.4,5.6,1.4c2,0,3.9-0.5,5.6-1.4C92.3,51.1,94.8,57.9,94.8,65.3z M72.8,48.3c6.4,0,11.6-5.2,11.6-11.6 c0-6.4-5.2-11.6-11.6-11.6c-6.4,0-11.6,5.2-11.6,11.6C61.2,43.1,66.4,48.3,72.8,48.3z" })
			);
		}
	}]);

	return _class44;
})(React.Component);

Comp.Icons.Phone = (function (_React$Component45) {
	_inherits(_class45, _React$Component45);

	function _class45() {
		_classCallCheck(this, _class45);

		_get(Object.getPrototypeOf(_class45.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class45, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M34.6,70L7.5,85.5c-0.2-0.4-0.5-0.7-0.7-1.1l-1.5-2.6c-0.3-0.5-0.4-1-0.3-1.5c0-0.9,0.5-1.7,1.3-2.2 l22.6-12.9c0.8-0.5,1.8-0.5,2.5,0c0.4,0.2,0.8,0.6,1.1,1l1.5,2.6C34.2,69.3,34.4,69.6,34.6,70z M66.2,36l2.4,1.8 c0.3,0.2,0.7,0.5,1,0.7l18.5-25.2c-0.3-0.3-0.7-0.5-1-0.8l-2.4-1.8c-0.4-0.3-0.9-0.5-1.4-0.5c-0.9,0-1.8,0.3-2.3,1.1l-15.3,21 C65.1,33,65,34,65.3,34.8C65.5,35.2,65.8,35.7,66.2,36z M95.4,31.9c-2.5,9.3-13.4,24.2-29,38.2C52.2,82.9,37.6,91.5,27.9,94.1 c-1.9,0.7-4,1-6.1,0.8c-0.5,0-1-0.1-1.4-0.2c-2-0.4-4.1-1.2-6-2.3C12.1,91,9.9,89,8.2,86.5l26.9-15.4c0.3,0.7,0.6,1.4,0.8,2.2 c3.3,3.4,14-1.1,24.2-10.2c10.2-9.1,15.8-19.4,12.7-23l0,0c-0.7-0.3-1.4-0.7-2.1-1.1l18.4-25c2.2,2,4,4.4,5.1,6.9 c0.9,1.9,1.4,3.9,1.6,5.8C96.1,28.2,95.9,29.9,95.4,31.9C95.4,31.9,95.4,31.9,95.4,31.9z M75.2,49.1c1.6-2.8,2.4-5.3,2.6-7.4 c-1-0.2-2-0.4-3-0.8c1.1,2.2,0.4,5.6-1.9,9.7c-2.5,4.5-6.6,9.4-11.6,13.9c-7.1,6.3-14.7,10.7-20,11.5c-0.6,0.1-1.1,0.1-1.6,0.1 c-1.3,0-2.4-0.3-3.3-0.8l0,0c0.2,1,0.4,2,0.4,3c0.1,0,0.2,0,0.3,0c0.6,0,1.1,0,1.8-0.1C45,77.3,53.8,72.3,61.9,65 C67.6,59.9,72.3,54.2,75.2,49.1z M34.1,51.1c-0.9,0-1.6-0.3-2.1-0.9c-1-1.1-1.2-2.9-1.1-3.8c0.3-5.3,3.2-10,7.8-12.6 c2.4-1.4,5.2-2.2,8-2.2c0.3,0,0.6,0,0.9,0c0.9,0,2.6,0.6,3.5,1.6c0.5,0.6,0.8,1.3,0.7,2.1c-0.1,0.4-0.3,0.8-0.6,1.1 c-0.8,0.6-2.1,0.7-2.4,0.7c-0.2,0-0.4,0-0.6,0c-0.5-0.1-0.9-0.1-1.4-0.1c-1.9,0-3.6,0.5-5.3,1.4c-3.5,2-5.5,6-5.2,10 c0,0.6-0.4,1.5-0.9,2.1C34.9,50.9,34.5,51.1,34.1,51.1L34.1,51.1z M20.7,51c-0.1,0-0.1,0-0.2,0l-0.1,0c-0.8-0.1-1.5-0.4-2.1-1.1 c-0.5-0.5-0.8-1.2-0.8-1.9l0,0l0-0.2c0-0.2,0-0.8,0.1-1.8c0.8-9.8,6.3-18.6,14.8-23.5c4.6-2.7,9.8-4.1,15.1-4.1c0.5,0,1,0,1.5,0 l1.7,0.1l0,0c0.4,0.1,1,0.4,1.4,0.9c0.6,0.6,0.9,1.5,0.9,2.3l0,0.2c0,0.7-0.3,1.3-0.8,1.7c-0.3,0.2-0.6,0.3-1,0.3 c-0.1,0-0.2,0-0.4,0l-1.8-0.1c-0.5,0-1.1-0.1-1.6-0.1c-4.4,0-8.7,1.2-12.5,3.4c-7.2,4.2-11.8,11.8-12.2,20.2l-0.1,1.6 c0.1,0.7-0.1,1.2-0.5,1.6C21.9,50.8,21.3,51,20.7,51z M7.1,50.8c-0.1,0-0.1,0-0.2,0c-0.8-0.1-1.5-0.4-2-1c-0.5-0.5-0.8-1.2-0.8-1.9 v0l0-0.1c0-0.1,0-0.6,0.1-1.8C5.4,31.5,13.5,18.4,26,11.1c6.8-4,14.5-6.1,22.3-6.1c0.7,0,1.4,0,2.1,0.1l1.6,0.1 c0.5,0.1,1,0.4,1.4,0.8c0.5,0.6,0.8,1.4,0.8,2.2c0,0.9-0.3,1.6-0.8,2c-0.3,0.2-0.6,0.3-0.9,0.3c-0.1,0-0.1,0-0.2,0l-1.5-0.1 c-0.8-0.1-1.7-0.1-2.5-0.1c-6.9,0-13.7,1.8-19.6,5.3c-11.1,6.5-18.3,18.1-19.2,31l-0.1,1.7c0,0.7-0.2,1.3-0.7,1.8 C8.3,50.6,7.7,50.8,7.1,50.8z" })
			);
		}
	}]);

	return _class45;
})(React.Component);

Comp.Icons.Plus = (function (_React$Component46) {
	_inherits(_class46, _React$Component46);

	function _class46() {
		_classCallCheck(this, _class46);

		_get(Object.getPrototypeOf(_class46.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class46, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M50,1C22.9,1,1,22.9,1,50c0,27.1,21.9,49,49,49c27.1,0,49-21.9,49-49C99,22.9,77.1,1,50,1z M74,50.7 c0,2.4-1.5,4.3-3.9,4.3H55v15.1c0,2.4-1.6,4.9-4,4.9h-2.2c-2.4,0-3.8-2.5-3.8-4.9V55H29.9c-2.4,0-4.9-1.8-4.9-4.3v-1.4 c0-2.4,2.5-4.3,4.9-4.3H45V29.9c0-2.4,1.3-3.9,3.8-3.9H51c2.4,0,4,1.5,4,3.9V45h15.1c2.4,0,3.9,1.9,3.9,4.3V50.7z" })
			);
		}
	}]);

	return _class46;
})(React.Component);

Comp.Icons.Print = (function (_React$Component47) {
	_inherits(_class47, _React$Component47);

	function _class47() {
		_classCallCheck(this, _class47);

		_get(Object.getPrototypeOf(_class47.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class47, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M19.1,52.7v7.9h61.8v-7.8c0-0.6,0.3-1.2,0.8-1.6 c0.5-0.4,1.1-0.6,1.7-0.4c6.1,1.2,14,6.5,14,16.2c0,2.8,0,11.6,0,16.6c0,3.7-3,6.6-6.6,6.6H9.3c-3.6,0-6.6-3-6.6-6.6 c0-5,0-13.8,0-16.6c0-8.8,6.7-15.1,14-16.2c0.6-0.1,1.2,0.1,1.7,0.5C18.8,51.5,19.1,52.1,19.1,52.7L19.1,52.7z M76.9,56.6V31.8v-3.3 L58.2,9.8h-3.3H28.5c-2.9,0-5.3,2.4-5.3,5.3v41.5h7.1V17.7c0-0.4,0.4-0.8,0.8-0.8h23.9v5.2v2c0,4.2,3.5,7.7,7.7,7.7h7.2v24.8H76.9 L76.9,56.6z M63.3,17.8l-0.9-0.9h0L63.3,17.8L63.3,17.8z M19.1,84.3h61.8v-3.9H19.1V84.3z" })
			);
		}
	}]);

	return _class47;
})(React.Component);

Comp.Icons.ReportProblem = (function (_React$Component48) {
	_inherits(_class48, _React$Component48);

	function _class48() {
		_classCallCheck(this, _class48);

		_get(Object.getPrototypeOf(_class48.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class48, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M97.5,87.9L74.8,48.6L52.2,9.4c-0.2-0.5-0.6-0.9-1.1-1.2c-1.4-0.8-3.1-0.3-3.9,1L24.4,48.6l0,0l0,0L1.8,87.7 c-0.3,0.5-0.5,0.9-0.5,1.6c0,1.6,1.3,2.8,2.9,2.8h45.4H95v0.2c1,0,1-0.1,1.4-0.4C97.8,91,98.3,89.3,97.5,87.9z M53,79h-6v-8h6V79z M52.8,65h-6.5l-0.4-26h7.4L52.8,65z" })
			);
		}
	}]);

	return _class48;
})(React.Component);

Comp.Icons.Right = (function (_React$Component49) {
	_inherits(_class49, _React$Component49);

	function _class49() {
		_classCallCheck(this, _class49);

		_get(Object.getPrototypeOf(_class49.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class49, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M95.2,45.2L62.4,12.4c-2.6-2.6-6.5-2.8-9.1-0.2c-2.6,2.6-2.4,6.5,0.2,9.1l21.8,21.8l-66.1,0 c-3.6,0-6.6,2.9-6.6,6.5c0,3.6,2.9,6.5,6.5,6.5l66.1,0L53.5,78c-2.6,2.6-2.8,6.5-0.2,9.1c2.6,2.6,6.5,2.4,9.1-0.2l33-33 c0,0,2.3-2.2,2.3-4.2C97.7,47.7,95.2,45.2,95.2,45.2L95.2,45.2z" })
			);
		}
	}]);

	return _class49;
})(React.Component);

Comp.Icons.Salesforce = (function (_React$Component50) {
	_inherits(_class50, _React$Component50);

	function _class50() {
		_classCallCheck(this, _class50);

		_get(Object.getPrototypeOf(_class50.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class50, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M40,45c-0.7,0-1.2,0.3-1.6,0.8c-0.2,0.3-0.4,0.8-0.4,1.3l3.9,0c0-0.5-0.1-1-0.4-1.3 C41.2,45.3,40.8,45,40,45z" }),
					React.createElement("path", { d: "M84,45c-0.7,0-1.2,0.3-1.6,0.8c-0.2,0.3-0.4,0.8-0.4,1.3l3.9,0c0-0.5-0.1-1-0.4-1.3 C85.2,45.3,84.7,45,84,45z" }),
					React.createElement("path", { d: "M62.1,45c-0.7,0-1.2,0.2-1.6,0.8C60.2,46.3,60,47,60,48c0,0.9,0.2,1.7,0.5,2.2 c0.3,0.5,0.9,0.8,1.6,0.8c0.7,0,1.2-0.3,1.6-0.8c0.3-0.5,0.5-1.3,0.5-2.2c0-0.9-0.2-1.7-0.5-2.2C63.4,45.3,62.8,45,62.1,45z" }),
					React.createElement("path", { d: "M26.2,48.6c-0.3,0.2-0.5,0.6-0.5,1.1c0,0.3,0.1,0.5,0.2,0.7c0.1,0.1,0.1,0.2,0.3,0.3 c0,0,0.5,0.4,1.6,0.3c0.8,0,1.5-0.2,1.5-0.2v-2.5c0,0-0.7-0.1-1.5-0.1C26.7,48.2,26.2,48.6,26.2,48.6z" }),
					React.createElement("path", { d: "M76.9,25.8c-2.9,0-5.7,0.6-8.3,1.8c-2.9-5.2-8.4-8.7-14.6-8.7c-4.7,0-9,2-12,5.2c-3.4-4.4-8.7-7.2-14.6-7.2 c-10.2,0-18.4,8.2-18.4,18.4c0,2.6,0.5,5.1,1.5,7.3c-4.7,2.8-7.9,7.9-7.9,13.8c0,8.8,7.1,16,15.8,16c1.1,0,2.2-0.1,3.2-0.3 c2.4,6.5,8.6,11.1,16,11.1c7,0,13.1-4.3,15.7-10.4c2,1,4.2,1.5,6.5,1.5c5.6,0,10.5-3.1,13-7.6c1.3,0.3,2.6,0.4,4,0.4 c11.3,0,20.4-9.2,20.4-20.6C97.3,35.1,88.2,25.8,76.9,25.8z M22.9,49.7c0,1.7-1.2,2.7-3.1,2.7c-1,0-1.9-0.1-2.8-0.7 c-0.2-0.1-0.4-0.2-0.5-0.3c0,0-0.1-0.1,0-0.2l0.4-1.1C16.8,50,17,50,17,50.1c0.1,0.1,0.2,0.1,0.3,0.2c1.1,0.7,2.2,0.7,2.5,0.7 c0.8,0,1.4-0.4,1.4-1v0c0-0.7-0.8-0.9-1.7-1.2l-0.2-0.1c-1.3-0.4-2.7-0.9-2.7-2.5v0c0-1.5,1.2-2.6,3-2.6l0.2,0c1,0,2.1,0.3,2.8,0.7 c0.1,0,0.1,0.1,0.1,0.2c0,0.1-0.4,1-0.4,1.1c-0.1,0.2-0.3,0.1-0.3,0.1c-0.6-0.4-1.6-0.6-2.5-0.6c-0.8,0-1.2,0.4-1.2,0.9v0 c0,0.6,0.8,0.9,1.8,1.2l0.2,0.1C21.6,47.6,22.9,48.2,22.9,49.7L22.9,49.7z M30.9,51.9c0,0-0.2,0.1-0.4,0.1c-0.2,0-0.8,0.2-1.4,0.3 c-0.5,0.1-1.1,0.1-1.7,0.1c-0.5,0-1-0.1-1.5-0.1c-0.4-0.1-0.8-0.3-1.1-0.5c-0.3-0.2-0.5-0.5-0.7-0.9c-0.2-0.3-0.3-0.8-0.3-1.3 c0-0.5,0.1-0.9,0.3-1.3c0.2-0.4,0.5-0.7,0.8-0.9c0.3-0.2,0.7-0.4,1.1-0.5c0.4-0.1,0.9-0.2,1.4-0.2c0.3,0,0.6,0,0.9,0 c0,0,0.4,0,0.9,0.1v-0.2c0-0.7-0.2-1.1-0.5-1.3C28.5,45.1,28,45,27.5,45c0,0-1.3,0-2.4,0.6c0,0-0.1,0-0.1,0s-0.1,0-0.2-0.1l-0.4-1 c-0.1-0.2,0.1-0.2,0.1-0.2c0.5-0.4,1.7-0.6,1.7-0.6c0.4-0.1,1.1-0.1,1.5-0.1c1.1,0,1.9,0.3,2.5,0.8c0.6,0.5,0.9,1.3,0.9,2.4l0,5 C31,51.7,31,51.9,30.9,51.9z M34.6,52.1c0,0.1-0.1,0.2-0.2,0.2H33c-0.1,0-0.2-0.1-0.2-0.2V40.3c0-0.1,0.1-0.2,0.2-0.2h1.5 c0.1,0,0.2,0.1,0.2,0.2V52.1z M43.7,48.3c0,0.1-0.2,0.1-0.2,0.1l-5.5,0c0,0.8,0.2,1.4,0.6,1.8c0.4,0.4,1,0.6,1.9,0.6 c1.3,0,1.9-0.3,2.3-0.4c0,0,0.2-0.1,0.2,0.1l0.4,1c0.1,0.2,0,0.2,0,0.3c-0.3,0.2-1.2,0.5-2.8,0.5c-0.8,0-1.4-0.1-2-0.3 c-0.6-0.2-1-0.5-1.4-0.9c-0.4-0.4-0.6-0.9-0.8-1.4c-0.2-0.5-0.2-1.1-0.2-1.8c0-0.6,0.1-1.2,0.2-1.8c0.2-0.5,0.4-1,0.7-1.4 c0.3-0.4,0.8-0.7,1.3-1c0.5-0.2,1.1-0.4,1.8-0.4c0.6,0,1.1,0.1,1.6,0.3c0.3,0.1,0.7,0.4,1,0.8c0.2,0.2,0.6,0.8,0.7,1.3 C43.8,47.2,43.7,48.2,43.7,48.3z M48.2,52.4c-1,0-1.9-0.1-2.8-0.7c-0.2-0.1-0.4-0.2-0.5-0.3c0,0-0.1-0.1,0-0.2l0.4-1.1 c0.1-0.2,0.2-0.1,0.3-0.1c0.1,0.1,0.2,0.1,0.3,0.2c1.1,0.7,2.2,0.7,2.5,0.7c0.8,0,1.4-0.4,1.4-1v0c0-0.7-0.8-0.9-1.7-1.2l-0.2-0.1 c-1.3-0.4-2.7-0.9-2.7-2.5v0c0-1.5,1.2-2.6,3-2.6l0.2,0c1,0,2.1,0.3,2.8,0.7c0.1,0,0.1,0.1,0.1,0.2c0,0.1-0.4,1-0.4,1.1 c-0.1,0.2-0.3,0.1-0.3,0.1C49.8,45.2,48.8,45,48,45c-0.8,0-1.2,0.4-1.2,0.9v0c0,0.6,0.8,0.9,1.8,1.2l0.2,0.1c1.3,0.4,2.6,1,2.6,2.5 v0C51.4,51.4,50.2,52.4,48.2,52.4z M57.8,45c0,0.2-0.2,0.2-0.2,0.2h-1.8l-1.2,7c-0.1,0.7-0.3,1.3-0.5,1.8c-0.2,0.5-0.4,0.9-0.7,1.2 c-0.3,0.3-0.6,0.6-1,0.7c-0.4,0.1-0.8,0.2-1.3,0.2c-0.2,0-0.5,0-0.8-0.1C50,56,49.9,56,49.7,55.9c-0.1,0-0.1-0.1-0.1-0.2 c0-0.1,0.4-1,0.4-1.1c0.1-0.1,0.2-0.1,0.2-0.1c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.3,0,0.4,0c0.2,0,0.5,0,0.6-0.1 c0.2-0.1,0.4-0.2,0.5-0.4c0.1-0.2,0.3-0.4,0.4-0.8c0.1-0.3,0.2-0.8,0.3-1.4l1.2-6.9h-1.2c-0.1,0-0.2-0.1-0.2-0.2l0.2-1.1 c0-0.2,0.2-0.2,0.2-0.2h1.2l0.1-0.4c0.2-1.1,0.6-1.9,1.1-2.5c0.5-0.6,1.3-0.8,2.3-0.8c0.3,0,0.5,0,0.7,0.1c0.2,0,0.4,0.1,0.5,0.1 c0,0,0.1,0.1,0.1,0.2l-0.4,1.2c0,0.1-0.1,0.1-0.2,0.1c0,0-0.1,0-0.3-0.1c-0.1,0-0.3,0-0.5,0c-0.2,0-0.4,0-0.6,0.1 c-0.2,0.1-0.3,0.2-0.5,0.3c-0.1,0.1-0.3,0.3-0.4,0.6c-0.2,0.6-0.3,1.2-0.3,1.2h1.8c0.1,0,0.2,0.1,0.2,0.2L57.8,45z M65.8,49.7 c-0.2,0.5-0.4,1-0.7,1.4c-0.3,0.4-0.8,0.7-1.2,0.9c-0.5,0.2-1.1,0.3-1.7,0.3c-0.7,0-1.2-0.1-1.7-0.3c-0.5-0.2-0.9-0.5-1.2-0.9 c-0.3-0.4-0.6-0.9-0.7-1.4c-0.2-0.5-0.2-1.1-0.2-1.7c0-0.6,0.1-1.2,0.2-1.7c0.2-0.5,0.4-1,0.7-1.4c0.3-0.4,0.7-0.7,1.2-0.9 c0.5-0.2,1.1-0.3,1.7-0.3c0.7,0,1.2,0.1,1.7,0.3c0.5,0.2,0.9,0.5,1.2,0.9c0.3,0.4,0.6,0.9,0.7,1.4c0.2,0.5,0.2,1.1,0.2,1.7 C66.1,48.6,66,49.2,65.8,49.7z M72.6,44c-0.1,0.1-0.3,0.9-0.4,1.2c0,0.1-0.1,0.2-0.2,0.1c0,0-0.3-0.1-0.6-0.1c-0.2,0-0.5,0-0.7,0.1 c-0.3,0.1-0.5,0.2-0.7,0.4c-0.2,0.2-0.4,0.5-0.5,0.8c-0.1,0.3-0.2,0.9-0.2,1.4v4.1c0,0.1-0.1,0.2-0.2,0.2h-1.4 c-0.1,0-0.2-0.1-0.2-0.2v-8.2c0-0.1,0.1-0.2,0.2-0.2h1.4c0.1,0,0.2,0.1,0.2,0.2l0,0.7c0.2-0.3,0.6-0.5,0.9-0.7 c0.3-0.2,0.7-0.3,1.4-0.2c0.4,0,0.8,0.1,0.9,0.2C72.6,43.8,72.7,43.9,72.6,44z M79.5,52c-0.6,0.2-1.5,0.4-2.3,0.4 c-1.4,0-2.5-0.4-3.2-1.2c-0.7-0.8-1.1-1.9-1.1-3.2c0-0.6,0.1-1.2,0.3-1.7c0.2-0.5,0.4-1,0.8-1.4c0.3-0.4,0.8-0.7,1.3-0.9 c0.5-0.2,1.1-0.3,1.8-0.3c0.5,0,0.9,0,1.2,0.1c0.4,0.1,0.9,0.2,1.1,0.3c0,0,0.1,0.1,0.1,0.2c-0.2,0.4-0.3,0.7-0.4,1.1 c-0.1,0.2-0.2,0.1-0.2,0.1c-0.5-0.2-1-0.2-1.7-0.2c-0.8,0-1.4,0.3-1.8,0.8C75,46.4,74.7,47,74.7,48c0,1,0.2,1.8,0.7,2.2 c0.4,0.5,1.1,0.7,1.9,0.7c0.3,0,0.6,0,0.9-0.1c0.3,0,0.5-0.1,0.8-0.2c0,0,0.2-0.1,0.2,0.1l0.4,1.1C79.6,51.9,79.5,52,79.5,52z M87.6,48.3c0,0.1-0.2,0.1-0.2,0.1l-5.5,0c0,0.8,0.2,1.4,0.6,1.8c0.4,0.4,1,0.6,1.9,0.6c1.3,0,1.9-0.3,2.3-0.4c0,0,0.2-0.1,0.2,0.1 l0.4,1c0.1,0.2,0,0.2,0,0.3c-0.3,0.2-1.2,0.5-2.8,0.5c-0.8,0-1.4-0.1-2-0.3c-0.6-0.2-1-0.5-1.4-0.9c-0.4-0.4-0.6-0.9-0.8-1.4 c-0.2-0.5-0.2-1.1-0.2-1.8c0-0.6,0.1-1.2,0.2-1.8c0.2-0.5,0.4-1,0.7-1.4c0.3-0.4,0.8-0.7,1.3-1c0.5-0.2,1.1-0.4,1.8-0.4 c0.6,0,1.1,0.1,1.6,0.3c0.3,0.1,0.7,0.4,1,0.8c0.2,0.2,0.6,0.8,0.7,1.3C87.8,47.2,87.6,48.2,87.6,48.3z" })
				)
			);
		}
	}]);

	return _class50;
})(React.Component);

Comp.Icons.Search = (function (_React$Component51) {
	_inherits(_class51, _React$Component51);

	function _class51() {
		_classCallCheck(this, _class51);

		_get(Object.getPrototypeOf(_class51.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class51, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M19.6,50.7c-0.8,0-1.6-0.4-2-1.2c-2.1-3.6-3.2-7.8-3.2-12c0-10.9,7.2-20.4,17.6-23.2 c0.2-0.1,0.4-0.1,0.6-0.1c1,0,1.9,0.7,2.2,1.7c0.3,1.2-0.4,2.5-1.6,2.8c-8.4,2.2-14.2,10-14.2,18.8c0,3.4,0.9,6.8,2.6,9.7 c0.3,0.5,0.4,1.1,0.2,1.7c-0.2,0.6-0.5,1.1-1.1,1.4C20.4,50.6,20,50.7,19.6,50.7z" }),
				React.createElement("path", { d: "M32.2,14.9C22.1,17.6,15,26.9,15,37.6c0,4.1,1.1,8.2,3.1,11.7c0.3,0.6,0.9,0.9,1.5,0.9 c0.3,0,0.6-0.1,0.9-0.2c0.9-0.5,1.2-1.6,0.7-2.4c-1.7-3-2.6-6.5-2.6-10c0-9,6-17,14.6-19.3c0.9-0.3,1.5-1.2,1.3-2.2 C34.2,15.2,33.2,14.6,32.2,14.9z" }),
				React.createElement("path", { d: "M93,98.4c-1.2,0-2.4-0.5-3.3-1.4L68.8,76.1l-9.5-9.5c-6.3,4.7-13.7,7.2-21.6,7.2 c-19.9,0-36.1-16.2-36.1-36.1c0-19.9,16.2-36.1,36.1-36.1c19.9,0,36.1,16.2,36.1,36.1c0,8.2-2.8,16.1-7.9,22.5l9.6,9.5l20.7,20.7 c0.9,0.9,1.4,2,1.4,3.3c0,1.2-0.5,2.4-1.4,3.3C95.3,97.9,94.2,98.4,93,98.4z M37.7,9.7c-15.4,0-28,12.6-28,28s12.6,28,28,28 c15.4,0,28-12.6,28-28S53.1,9.7,37.7,9.7z" })
			);
		}
	}]);

	return _class51;
})(React.Component);

Comp.Icons.Settings = (function (_React$Component52) {
	_inherits(_class52, _React$Component52);

	function _class52() {
		_classCallCheck(this, _class52);

		_get(Object.getPrototypeOf(_class52.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class52, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M90.7,38.1l-6.9-0.2l-1.5-3.1l4.6-4.7c1.3-1.3,2-3,2-4.8c0-1.8-0.7-3.5-2-4.8l-7.3-7.3c-1.3-1.3-3-2-4.8-2 c-1.8,0-3.5,0.7-4.8,2l-5.3,4.6L61,16.5V9.9C61,6.2,58.9,2,55.1,2H44.9c-3.7,0-6.8,3.6-6.8,7.3l-0.2,6.9l-3.1,1.5l-4.7-4.6 c-2.6-2.6-7.1-2.5-9.6,0l-7.2,7.3c-1.3,1.3-2,3-2,4.8c0,1.8,0.7,3.5,2,4.8l4.6,5.3L16.5,39H9.9C6.2,39,2,41.1,2,44.9v10.3 c0,3.7,3.6,6.8,7.3,6.8l6.9,0.2l1.5,3.1l-4.6,4.7c-1.3,1.3-2,3-2,4.8c0,1.8,0.7,3.5,2,4.8l7.3,7.3c2.6,2.6,7,2.6,9.6,0l4.8-4.6 l3.1,1.2v6.6c0,3.7,3.1,7.9,6.9,7.9h10.3c3.7,0,6.8-3.6,6.8-7.3l0.2-6.9l3.1-1.5l4.7,4.6c2.6,2.5,7,2.5,9.6,0l7.2-7.3 c1.3-1.3,2-3,2-4.8c0-1.8-0.7-3.5-2-4.8l-4.6-4.8l1.2-3.1h6.6c3.7,0,7.9-3.1,7.9-6.9V44.9C98,41.1,94.4,38.1,90.7,38.1z M90,54 h-6.5c-3.2,0-6.5,2.3-7.4,5.1L75,61.8c-1.4,2.9-0.8,6.8,1.5,9.1l3.8,3.8l-5.6,5.6l-3.8-3.8c-1.4-1.4-3.5-2.3-5.7-2.3 c-1.2,0-2.4,0.3-3.2,0.7L59.3,76c-3.1,1-5.3,4.2-5.3,7.5V90h-8v-6.5c0-3.3-2.2-6.4-5.1-7.4L38.2,75c-2.9-1.4-6.9-0.8-9.1,1.5 l-3.8,3.8l-5.6-5.6l3.9-3.8c2.3-2.3,2.9-6.2,1.6-8.8L24,59.3c-1-3.1-4.2-5.3-7.5-5.3H10v-8h6.5c3.2,0,6.4-2.3,7.4-5.1l1.1-2.7 c1.4-2.9,0.8-6.8-1.5-9.1l-3.8-3.8l5.6-5.6l3.8,3.8c1.4,1.4,3.5,2.3,5.7,2.3c1.2,0,2.4-0.3,3.2-0.7l2.7-1.1c3.1-1,5.4-4.2,5.4-7.5 V10h8v6.5c0,3.2,2.3,6.4,5.1,7.4l2.7,1.1c2.9,1.4,6.8,0.8,9.1-1.5l3.8-3.8l5.6,5.6l-3.9,3.9c-2.3,2.3-2.9,6.2-1.6,8.8l1.1,2.7 c1,3.1,4.2,5.4,7.5,5.4H90V54z" }),
					React.createElement("path", { d: "M50,32.5c-9.6,0-17.5,7.9-17.5,17.5S40.4,67.5,50,67.5c9.7,0,17.5-7.9,17.5-17.5S59.7,32.5,50,32.5z M50,59.5c-5.3,0-9.5-4.3-9.5-9.5s4.3-9.5,9.5-9.5c5.3,0,9.5,4.3,9.5,9.5S55.3,59.5,50,59.5z" })
				)
			);
		}
	}]);

	return _class52;
})(React.Component);

Comp.Icons.Share = (function (_React$Component53) {
	_inherits(_class53, _React$Component53);

	function _class53() {
		_classCallCheck(this, _class53);

		_get(Object.getPrototypeOf(_class53.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class53, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M18,65.6c-8.6,0-15.6-7-15.6-15.6s7-15.6,15.6-15.6c8.6,0,15.6,7,15.6,15.6S26.6,65.6,18,65.6L18,65.6z M18,42.4c-4.2,0-7.6,3.4-7.6,7.6s3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6S22.1,42.4,18,42.4L18,42.4z" })
					),
					React.createElement(
						"g",
						null,
						React.createElement(
							"g",
							null,
							React.createElement("path", { d: "M82,31.2c-8.6,0-15.6-7-15.6-15.6C66.4,7,73.4,0,82,0c8.6,0,15.6,7,15.6,15.6 C97.7,24.2,90.7,31.2,82,31.2L82,31.2z M82,8.1c-4.2,0-7.6,3.4-7.6,7.6c0,4.2,3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6 C89.6,11.4,86.2,8.1,82,8.1L82,8.1z" })
						),
						React.createElement(
							"g",
							null,
							React.createElement("path", { d: "M82,100c-8.6,0-15.6-7-15.6-15.6c0-8.6,7-15.6,15.6-15.6c8.6,0,15.6,7,15.6,15.6C97.7,93,90.7,100,82,100 L82,100z M82,76.8c-4.2,0-7.6,3.4-7.6,7.6c0,4.2,3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6C89.6,80.2,86.2,76.8,82,76.8L82,76.8z" })
						)
					),
					React.createElement(
						"g",
						null,
						React.createElement(
							"g",
							null,
							React.createElement("path", { d: "M70.1,82.3c-0.7,0-1.4-0.2-2-0.5L27,58c-1.9-1.1-2.6-3.6-1.5-5.5c1.1-1.9,3.6-2.6,5.5-1.5l41.1,23.7 c1.9,1.1,2.6,3.6,1.5,5.5C72.9,81.6,71.5,82.3,70.1,82.3L70.1,82.3z" })
						),
						React.createElement(
							"g",
							null,
							React.createElement("path", { d: "M29,49.5c-1.4,0-2.7-0.7-3.5-2c-1.1-1.9-0.5-4.4,1.5-5.5l41.1-23.7c1.9-1.1,4.4-0.5,5.5,1.5 c1.1,1.9,0.4,4.4-1.5,5.5L31,48.9C30.4,49.3,29.7,49.5,29,49.5L29,49.5z" })
						)
					)
				)
			);
		}
	}]);

	return _class53;
})(React.Component);

Comp.Icons.Shipping = (function (_React$Component54) {
	_inherits(_class54, _React$Component54);

	function _class54() {
		_classCallCheck(this, _class54);

		_get(Object.getPrototypeOf(_class54.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class54, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M82.8,36.4L82.8,36.4l15.8-9.2L65.9,8.2L50,17.4L34.2,8.2L1.3,27.2l15.9,9.2l0,0l0,0L1.3,45.6l18.6,10.7 v17.5l30.1,18l29.8-18V56.5l18.9-10.9L82.8,36.4L82.8,36.4z M65.9,12.3l25.8,14.9l-12.3,7.2L53.5,19.5L65.9,12.3z M8.4,27.2 l25.8-14.9l12.3,7.2L20.7,34.3L8.4,27.2z M8.4,45.6l12.3-7.2l25.8,14.9l-12.3,7.2L8.4,45.6z M48.2,86.6L23.4,71.8V58.3l10.7,6.2 l14.1-8.2V86.6z M50,51.2L24.2,36.4L50,21.5l25.8,14.9L50,51.2z M76.3,71.8L51.8,86.6V56.3l14.1,8.2l10.4-6V71.8z M91.6,45.6 L65.9,60.4l-12.3-7.2l25.8-14.9L91.6,45.6z" })
				)
			);
		}
	}]);

	return _class54;
})(React.Component);

Comp.Icons.Trophy = (function (_React$Component55) {
	_inherits(_class55, _React$Component55);

	function _class55() {
		_classCallCheck(this, _class55);

		_get(Object.getPrototypeOf(_class55.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class55, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M87,32.4c-1.3,1.9-3.3,3.8-6.6,5.3c-2.1,1-3.9,1.8-5.5,2.7c0.3-0.6,0.5-1.2,0.8-1.8 c1.9-4.6,3.2-12.2,4-18.7c0.6-0.2,2-0.5,3.3-0.5c0.9,0,1.8,0.1,2.5,0.5c0.7,0.3,1.3,0.7,1.9,1.6c0.9,1.3,1.4,3.1,1.4,5.1 C88.8,28.5,88.3,30.5,87,32.4 M61.4,29.4l-4.1,3.9l1,5.6c0,0.1,0,0.3,0,0.4c0,0.7-0.3,1.4-0.9,1.8c-0.4,0.3-0.9,0.4-1.3,0.4 c-0.4,0-0.7-0.1-1-0.3l-5-2.6l-5,2.6c-0.3,0.2-0.7,0.3-1,0.3c-0.5,0-0.9-0.1-1.3-0.4c-0.6-0.4-0.9-1.1-0.9-1.8c0-0.1,0-0.3,0-0.4 l1-5.6l-4-3.9c-0.4-0.4-0.7-1-0.7-1.6c0-0.2,0-0.5,0.1-0.7c0.3-0.8,1-1.4,1.8-1.5l5.6-0.8l2.5-5.1c0.4-0.8,1.2-1.3,2-1.3 c0.9,0,1.6,0.5,2,1.3v0l2.5,5.1l5.6,0.8c0.9,0.1,1.6,0.7,1.8,1.5c0.1,0.2,0.1,0.5,0.1,0.7C62,28.4,61.8,29,61.4,29.4 M24.8,40.3 c-1.5-0.8-3.3-1.7-5.2-2.6c-3.3-1.5-5.3-3.4-6.6-5.3c-1.3-1.9-1.8-3.9-1.8-5.8c0-1.9,0.6-3.8,1.4-5.1l0,0c0.6-0.9,1.1-1.3,1.9-1.6 c0.7-0.3,1.6-0.5,2.5-0.5c1,0,2,0.2,2.7,0.3c0.3,0.1,0.5,0.1,0.6,0.2c0.8,6.5,2.1,14.1,4,18.7c0.3,0.6,0.5,1.2,0.8,1.8 C25,40.4,24.9,40.3,24.8,40.3 M93.3,17.6c-1.3-2-3.2-3.5-5-4.2c-1.9-0.8-3.7-1-5.3-1c-0.9,0-1.8,0.1-2.6,0.2c0.2-2,0.3-3.5,0.3-4.5 h0.6c2,0,3.6-1.6,3.6-3.6c0-2-1.6-3.6-3.6-3.6H18.6c-2,0-3.6,1.6-3.6,3.6c0,2,1.6,3.6,3.6,3.6h0.6c0.1,0.9,0.2,2.5,0.3,4.5 c-0.8-0.1-1.6-0.2-2.6-0.2c-1.6,0-3.5,0.2-5.3,1c-1.9,0.8-3.7,2.2-5,4.2C5,20.1,4,23.2,4,26.6c0,3.2,0.9,6.7,3,9.8 c2.1,3.1,5.3,5.9,9.6,7.9c2.9,1.3,5.2,2.5,6.4,3.3c0.4,0.3,0.7,0.5,0.9,0.7c-1,1.7-0.3,3.9,1.4,4.9c1.7,1,3.9,0.3,4.9-1.4 c0.1-0.2,0.2-0.4,0.3-0.6c1.8,3.1,3.9,5.8,6.4,8.3c-1.6,0.3-2.9,1.8-2.9,3.5c0,1.9,1.4,3.4,3.3,3.6L33,84.8h-1.1 c-2.9,0-5.2,2.3-5.2,5.2v3.9c0,2.9,2.3,5.2,5.2,5.2h36.2c2.9,0,5.2-2.3,5.2-5.2V90c0-2.9-2.3-5.2-5.2-5.2H67l-4.2-18.3 c1.8-0.2,3.3-1.7,3.3-3.6c0-1.7-1.2-3.2-2.9-3.5c2.5-2.5,4.6-5.3,6.4-8.3c0.1,0.2,0.2,0.4,0.3,0.6c1,1.7,3.1,2.3,4.9,1.4 c1.7-1,2.3-3.1,1.4-4.9c0.1-0.1,0.1-0.2,0.3-0.3c0.5-0.4,1.4-1,2.6-1.6c1.2-0.6,2.7-1.3,4.4-2.1c4.3-2,7.5-4.7,9.6-7.9 c2.1-3.1,3-6.6,3-9.8C96,23.2,95,20.1,93.3,17.6" })
			);
		}
	}]);

	return _class55;
})(React.Component);

Comp.Icons.Up = (function (_React$Component56) {
	_inherits(_class56, _React$Component56);

	function _class56() {
		_classCallCheck(this, _class56);

		_get(Object.getPrototypeOf(_class56.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class56, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M45.4,5L12.6,37.7c-2.6,2.6-2.8,6.5-0.2,9.1c2.6,2.6,6.5,2.4,9.1-0.2l21.8-21.8l0,66.1 c0,3.6,2.9,6.6,6.5,6.6c3.6,0,6.5-2.9,6.5-6.5l0-66.1l21.8,21.8c2.6,2.6,6.5,2.8,9.1,0.2c2.6-2.6,2.4-6.5-0.2-9.1l-33-33 c0,0-2.2-2.3-4.2-2.3C47.9,2.5,45.4,5,45.4,5L45.4,5z" })
			);
		}
	}]);

	return _class56;
})(React.Component);

Comp.Icons.Weather = (function (_React$Component57) {
	_inherits(_class57, _React$Component57);

	function _class57() {
		_classCallCheck(this, _class57);

		_get(Object.getPrototypeOf(_class57.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class57, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M74.5,79H18c-1.5,0-2.9-0.4-4.2-1.1c-7-2.5-11.7-9.2-11.7-16.7c0-8.9,6.4-16.2,15-17.5 c1.7-9.1,9.7-15.9,19.1-15.9c7,0,13.3,3.7,16.8,9.6c1.1-0.2,2.3-0.3,3.4-0.3c8.5,0,15.7,6,17.3,14.1c8-0.4,14.5,6,14.5,13.8 C88.4,72.8,82.1,79,74.5,79z M36.3,33c-7.5,0-13.8,5.8-14.3,13.3l-0.2,2.3l-2.3,0.1c-6.9,0.2-12.3,5.7-12.3,12.6 c0,5.4,3.4,10.1,8.5,11.9l0.4,0.2c0.6,0.3,1.2,0.5,1.9,0.5h56.5c4.8,0,8.7-3.9,8.7-8.7c0-5.5-5.1-10-10.9-8.4l-3.1,0.8l-0.1-3.2 c-0.3-6.8-5.8-12-12.6-12c-1.3,0-2.7,0.2-4,0.6l-2.2,0.7l-0.9-2.1C47.1,36.4,42,33,36.3,33z" })
					),
					React.createElement(
						"g",
						null,
						React.createElement("path", { d: "M87.2,38c-1.5-5.9-6.8-10.2-13.1-10.2c-0.7,0-1.4,0.1-2.1,0.2c-2.7-4.3-7.4-6.9-12.5-6.9 c-4.5,0-8.6,2.1-11.3,5.3c1.6,0.7,3,1.8,4.1,3.1c1.8-2,4.4-3.3,7.2-3.3c3.8,0,7.3,2.3,8.9,5.8l0.9,2.1l2.2-0.7 c0.9-0.3,1.8-0.4,2.7-0.4c4.5,0,8.2,3.5,8.4,8.1l0.1,3.2l3.1-0.8c3.8-1,7.1,1.9,7.1,5.4c0,2.5-1.7,4.7-4,5.4 c1.2,1.3,2,2.8,2.5,4.5c3.9-1.6,6.6-5.4,6.6-9.9C97.9,42.8,93.1,38,87.2,38z" })
					)
				)
			);
		}
	}]);

	return _class57;
})(React.Component);

Comp.Icons.Web = (function (_React$Component58) {
	_inherits(_class58, _React$Component58);

	function _class58() {
		_classCallCheck(this, _class58);

		_get(Object.getPrototypeOf(_class58.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class58, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("polygon", { points: "74.9,60.9 57.4,44.9 57.4,91.7 69.5,79.7 74.9,90.2 78.2,96.5 84.6,93.2 76.2,77  92.4,77 \t" }),
					React.createElement("path", { d: "M93.7,43.2c-0.1-0.7-0.2-1.4-0.3-2.1c-0.1-0.5-0.1-1-0.2-1.5c0,0,0,0,0,0 c-2.1-11.7-8.8-21.8-18.3-28.3c-5-3.5-10.8-5.9-17.1-7.1c0,0,0,0,0,0c-0.6-0.1-1.2-0.2-1.7-0.2c-0.6-0.1-1.3-0.2-1.9-0.3 c-1.4-0.1-2.8-0.2-4.2-0.2h0c-1.4,0-2.8,0.1-4.2,0.2c-0.6,0.1-1.3,0.2-1.9,0.3c-0.6,0.1-1.2,0.1-1.7,0.2c0,0,0,0,0,0 C36,5.3,30.3,7.7,25.3,11.1C15.8,17.6,8.9,27.8,6.8,39.6c0,0,0,0,0,0c-0.1,0.5-0.1,1.1-0.2,1.6c-0.1,0.7-0.2,1.3-0.3,2 c-0.1,1.4-0.2,2.8-0.2,4.2c0,1.4,0.1,2.8,0.2,4.1c0.1,0.7,0.2,1.4,0.3,2.1c0.1,0.5,0.1,1,0.2,1.5c0,0,0,0,0,0 C8.9,67,15.8,77.2,25.3,83.7c5,3.4,10.7,5.8,16.9,6.9c0,0,0,0,0,0c0.5,0.1,1.1,0.1,1.6,0.2c0.7,0.1,1.3,0.2,2,0.3 c1.4,0.1,2.7,0.2,4.1,0.2h0c0,0,0.1,0,0.1,0v-0.4v-9.8c0,0-0.1,0-0.1,0h0c-2,0-3.9-0.2-5.7-0.5c-1.4-4.4-2.8-10.2-3.6-17.4 c3,0.2,6.1,0.3,9.3,0.3h0c0,0,0.1,0,0.1,0v-5.8c0,0-0.1,0-0.1,0h0c-3.5,0-6.8-0.1-9.9-0.3c-0.2-3.1-0.3-6.4-0.3-9.9 c0-3.5,0.1-6.8,0.3-9.9c3.1-0.2,6.4-0.3,9.9-0.3h0c3.5,0,6.8,0.1,9.9,0.3c0,0.2,0,0.3,0,0.5c0.9,0.3,1.7,0.8,2.5,1.5l3.6,3.3 c0-1.6-0.1-3.2-0.2-4.8c3.4,0.4,6.4,0.9,9.2,1.4c3.1,0.6,5.9,1.4,8.2,2.1c0.3,1.9,0.5,3.8,0.5,5.7c0,2-0.2,3.9-0.5,5.7 c-1.4,0.5-2.9,0.9-4.5,1.3l3.4,3.2l8.1,7.4c1.4-3.1,2.3-6.4,3-9.8c0,0,0,0,0,0c0.1-0.6,0.2-1.1,0.2-1.7c0.1-0.6,0.2-1.2,0.3-1.8 c0.1-1.4,0.2-2.8,0.2-4.3C93.9,46,93.8,44.6,93.7,43.2z M16.8,53.2c-0.3-1.9-0.5-3.8-0.5-5.8c0-2,0.2-3.9,0.5-5.7 c2.4-0.8,5.2-1.5,8.4-2.2c2.7-0.5,5.7-1,9-1.4c-0.2,3-0.3,6.1-0.3,9.3c0,3.2,0.1,6.3,0.3,9.3c-3.3-0.4-6.3-0.9-9-1.4 C22.1,54.7,19.2,53.9,16.8,53.2z M25.3,70.2c-2.8-3-5-6.5-6.6-10.4c2.1,0.5,4.2,1,6.6,1.5c3,0.6,6.1,1,9.5,1.4 c0.6,5.9,1.6,11.3,2.8,16C32.9,76.8,28.7,73.9,25.3,70.2z M34.7,32.1c-3.3,0.3-6.5,0.8-9.5,1.4c-2.3,0.4-4.5,0.9-6.6,1.5 c1.5-3.9,3.8-7.4,6.6-10.4c3.4-3.7,7.6-6.6,12.3-8.5C36.3,20.8,35.4,26.2,34.7,32.1z M50,31.3L50,31.3c-3.2,0-6.3,0.1-9.3,0.3 c0.8-7.2,2.1-13,3.6-17.4c1.9-0.3,3.8-0.5,5.7-0.5h0c2,0,3.9,0.2,5.7,0.5c1.4,4.4,2.8,10.2,3.6,17.4C56.3,31.4,53.2,31.3,50,31.3z M74.9,33.5c-3-0.6-6.3-1.1-9.7-1.4c-0.6-5.9-1.6-11.3-2.8-16c4.8,1.9,9.1,4.9,12.5,8.7c2.7,3,4.9,6.4,6.4,10.2 C79.3,34.4,77.2,34,74.9,33.5z" })
				)
			);
		}
	}]);

	return _class58;
})(React.Component);

Comp.Icons.Wifi = (function (_React$Component59) {
	_inherits(_class59, _React$Component59);

	function _class59() {
		_classCallCheck(this, _class59);

		_get(Object.getPrototypeOf(_class59.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class59, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement(
					"g",
					null,
					React.createElement("path", { d: "M50,73.9c-4.4,0-8,3.6-8,8c0,1,0.2,1.9,0.5,2.8c0.5,1.4,1.5,2.7,2.7,3.6c1.3,1,3,1.6,4.8,1.6 c1.8,0,3.4-0.6,4.8-1.6c1.3-0.9,2.2-2.2,2.8-3.8c0.3-0.8,0.5-1.7,0.5-2.7C58,77.5,54.4,73.9,50,73.9z" }),
					React.createElement("path", { d: "M50,53.3c-9.2,0-17.3,4.3-22.6,11l6.2,8.4C36.9,67,43,63.2,50,63.2c7,0,13.1,3.9,16.4,9.6l6.2-8.4 C67.3,57.6,59.2,53.3,50,53.3z" }),
					React.createElement("path", { d: "M14.1,46.4l5.9,8c7.4-8.1,18.1-13.1,29.9-13.1c11.8,0,22.5,5.1,29.9,13.1l5.9-8C76.7,37.1,64,31.4,50,31.4 C36,31.4,23.3,37.1,14.1,46.4z" }),
					React.createElement("path", { d: "M50,10c-18.8,0-35.8,7.2-48.7,19l5.9,8C18.4,26.4,33.5,19.9,50,19.9c16.5,0,31.6,6.5,42.7,17.1l5.9-8 C85.8,17.2,68.8,10,50,10z" })
				)
			);
		}
	}]);

	return _class59;
})(React.Component);

Comp.Icons.Yes = (function (_React$Component60) {
	_inherits(_class60, _React$Component60);

	function _class60() {
		_classCallCheck(this, _class60);

		_get(Object.getPrototypeOf(_class60.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(_class60, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"svg",
				{ viewBox: "0 0 100 100" },
				React.createElement("path", { d: "M91.6,13.6c-1.1-0.9-2.4-1.4-3.8-1.4c-1.8,0-3.5,0.8-4.7,2.2L35.4,72.6L16.6,52.8c-1.1-1.2-2.7-1.9-4.4-1.9 c-1.6,0-3,0.6-4.2,1.7c-1.2,1.1-1.8,2.6-1.9,4.2c0,1.6,0.6,3.1,1.7,4.3l23.6,24.7c1.1,1.2,2.7,1.9,4.4,1.9c0.1,0,0.2,0,0.2,0 c1.7-0.1,3.3-0.9,4.4-2.2l52-63.4C94.5,19.6,94.2,15.7,91.6,13.6z" })
			);
		}
	}]);

	return _class60;
})(React.Component);
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
    var Component, compNameKey, compNameKeys, i, len;
    if (this.props.routableComponentName == null) {
      return;
    }
    compNameKeys = this.props.routableComponentName.split('.');
    Component = Comp;
    for (i = 0, len = compNameKeys.length; i < len; i++) {
      compNameKey = compNameKeys[i];
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
    }, React.createElement("h1", {
      "className": "header__main__cursive-prefix"
    }), React.createElement("h1", {
      "className": "header__main__site-name"
    }, this.getHeaderTitle()), React.createElement("p", {
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
          reactIcon: 'Grid',
          isToggleable: false
        }, {
          title: 'Collapse/Expand',
          method: 'collapse',
          icon: 'contract',
          reactIcon: 'Contract',
          activeReactIcon: 'Expand',
          isToggleable: false
        }, {
          title: 'Help',
          method: 'help',
          icon: 'help',
          reactIcon: 'Help',
          isToggleable: false
        }, {
          title: 'Print',
          method: 'print',
          icon: 'print',
          reactIcon: 'Print',
          isToggleable: false
        }, {
          title: 'Download Data',
          method: 'download',
          icon: 'download',
          reactIcon: 'Download',
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
    var IconComp, atlas_url;
    IconComp = Comp.Icons[options.reactIcon];
    if (options.method === 'download') {
      atlas_url = this._getAtlasUrl();
      return React.createElement("form", {
        "action": '/api/v1/projects/print',
        "method": 'post'
      }, React.createElement(IconComp, null), React.createElement("input", {
        "type": "hidden",
        "name": "atlas_url",
        "value": atlas_url
      }), React.createElement("input", {
        "type": "submit",
        "value": ""
      }));
    } else if (options.method === 'comment') {
      return React.createElement("a", {
        "href": 'mailto:atlas@newamerica.org'
      }, React.createElement(IconComp, null));
    } else {
      return React.createElement("div", null, React.createElement(IconComp, null));
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
    var App, cannotExpand, isCollapsed;
    App = this.props.App;
    if ((App != null) && (typeof $ !== "undefined" && $ !== null)) {
      isCollapsed = App.uiState.isCollapsed || $('.atl').hasClass('atl--collapsed');
      cannotExpand = App.reqres.request('is:settings:bar:overflowing');
      if (!(isCollapsed && cannotExpand)) {
        App.uiState.isCollapsed = !App.uiState.isCollapsed;
        return $('.atl').toggleClass('atl--collapsed');
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

Comp.SideBar.Button = React.createClass({
  render: function() {
    return React.createElement("li", {
      "className": "atl__side-bar__icon",
      "onMouseEnter": this.onButtonMouseEnter.bind(this, options),
      "onMouseLeave": this.onButtonMouseLeave.bind(this, options),
      "onClick": this['_' + options.method],
      "key": 'button-' + i
    }, this.renderContent());
  },
  renderContent: function() {
    return React.createElement("div", null);
  },
  renderRegularContent: function() {
    return React.createElement("div", null);
  },
  renderMiniFormContent: function() {
    return React.createElement("form", null);
  },
  renderLinkContent: function() {
    return React.createElement("a", null);
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
  }
});

Comp.Welcome.Nav = React.createClass({
  navigate: function(e) {
    var App;
    App = this.props.App;
    if (App != null) {
      e.preventDefault();
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
          reactIcon: 'Comment',
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

var modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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
  getInitialState: function() {
    return {
      ui: {
        display: 'filter',
        isInfoBoxActive: false,
        isInfoBoxNarrow: false
      }
    };
  },
  setUiState: function(uiStateChanges) {
    var currentUiState, key, value;
    currentUiState = this.state.ui;
    for (key in uiStateChanges) {
      value = uiStateChanges[key];
      currentUiState[key] = value;
    }
    return this.forceUpdate();
  },
  render: function() {
    return React.createElement("div", {
      "className": this._getClass()
    }, React.createElement(Comp.SideBar, {
      "App": this.props.App,
      "project": this.state.project,
      "uiState": this.state.ui,
      "setUiState": this.setUiState.bind(this)
    }), React.createElement("div", {
      "id": "atl__main",
      "className": "-id-atl__main fill-parent"
    }, this._renderProject()));
  },
  _getClass: function() {
    var cls, data, project;
    project = this.state.project;
    if (project == null) {
      return "";
    }
    data = project.get('data');
    cls = "atl";
    cls += " atl--" + this.state.ui.display + "-display";
    cls += ' atl--' + project.get('project_template_name').toLowerCase();
    if (this.state.ui.isInfoBoxActive) {
      cls += ' atl__info-box--active';
    }
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
        "uiState": this.state.ui,
        "setUiState": this.setUiState.bind(this),
        "project": this.state.project,
        "related": this.state.related
      });
    }
    if (this._isModelTilemap()) {
      return React.createElement(Comp.Projects.Show.Tilemap, {
        "App": this.props.App,
        "uiState": this.state.ui,
        "setUiState": this.setUiState.bind(this),
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
            project.prepOnClient();
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
  mixins: [Comp.Mixins.BackboneEvents],
  displayName: 'Comp.Projects.Show.Tilemap',
  render: function() {
    return React.createElement("div", {
      "className": 'atl__main fill-parent'
    }, React.createElement(Comp.Projects.Show.Tilemap.Map, React.__spread({}, this.props)), React.createElement("div", {
      "className": "atl__base-layer"
    }), React.createElement("div", {
      "className": "atl__settings-bar"
    }, React.createElement(Comp.Projects.Show.Tilemap.Headline, React.__spread({}, this.props)), React.createElement(Comp.Projects.Show.Tilemap.DisplayToggle, React.__spread({}, this.props)), React.createElement(Comp.Projects.Show.Tilemap.Search, React.__spread({}, this.props)), React.createElement(Comp.Projects.Show.Tilemap.Filter, React.__spread({}, this.props, {
      "filter": this.getFilter()
    }))), React.createElement(Comp.Projects.Show.Tilemap.Popup, React.__spread({}, this.props)), React.createElement(Comp.Projects.Show.Tilemap.InfoBox, React.__spread({}, this.props, {
      "activeItem": this.getActiveItem()
    })));
  },
  getFilter: function() {
    return this.props.project.get('data').filter;
  },
  getActiveItem: function() {
    return this.props.project.get('data').items.active;
  },
  componentWillMount: function() {
    return this.setItemEventListeners();
  },
  setItemEventListeners: function() {
    var App, filter, items, project, setHeaderStripColor;
    project = this.props.project;
    App = this.props.App;
    items = project.get('data').items;
    filter = project.get('data').filter;
    setHeaderStripColor = function() {
      var cls, hoveredItem, indeces;
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
  }
});

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Projects.Show.Tilemap.DisplayToggle = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class() {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'atl__display-toggle atl__binary-toggle' },
				this.renderHalves()
			);
		}
	}, {
		key: 'renderHalves',
		value: function renderHalves() {
			var _this = this;

			return [{ name: 'filter', iconName: 'Filter' }, { name: 'search', iconName: 'Search' }].map(function (half) {
				var IconComp = Comp.Icons[half.iconName],
				    modifierClass = _this.props.uiState.display === half.name ? ' atl__binary-toggle__link--active' : '';
				return React.createElement(
					'div',
					{ className: 'atl__binary-toggle__half' },
					React.createElement(
						'a',
						{ href: '#', onClick: _this.setUiDisplay.bind(_this, half.name), className: "atl__binary-toggle__link" + modifierClass },
						React.createElement(IconComp, null)
					)
				);
			});
		}

		//
	}, {
		key: 'setUiDisplay',
		value: function setUiDisplay(name) {
			var App;
			if (this.props.uiState.display === name) {
				return;
			}
			App = this.props.App;
			if (App != null) {
				App.vent.trigger('display:mode:change');
			}
			this.props.setUiState({ display: name });
		}
	}]);

	return _class;
})(React.Component);
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
      "onClick": this.toggle.bind(this),
      "onMouseEnter": this.setHovered.bind(this),
      "onMouseLeave": this.clearHovered.bind(this)
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
  setHovered: function() {
    var App, cls, modelIndex;
    App = this.props.App;
    modelIndex = this.getFilterValueIndex();
    this.props.filterValue.parent.parent.state.valueHoverIndex = modelIndex;
    App.vent.trigger('value:mouseover', modelIndex);
    cls = this.getColorClass();
    return App.commands.execute('set:header:strip:color', {
      className: cls
    });
  },
  clearHovered: function() {
    var App;
    App = this.props.App;
    this.props.filterValue.parent.parent.state.valueHoverIndex = -1;
    App.vent.trigger('value:mouseover');
    return App.commands.execute('set:header:strip:color', 'none');
  },
  getFilterValueIndex: function() {
    return this.props.filterValue.parent.children.indexOf(this.props.filterValue);
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

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Projects.Show.Tilemap.Headline = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class() {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			project = this.props.project;
			return React.createElement(
				'div',
				{ className: 'atl__headline' },
				React.createElement('p', { className: 'atl__headline__sections', dangerouslySetInnerHTML: { __html: this.getSectionText() } }),
				React.createElement(
					'h1',
					{ className: 'atl__headline__title' },
					project.get('title')
				),
				React.createElement(
					'h2',
					{ className: 'atl__headline__description' },
					project.get('short_description'),
					React.createElement(
						'a',
						{ href: '#', className: 'link', onClick: this.openInfoBox.bind(this) },
						'More...'
					)
				)
			);
		}
	}, {
		key: 'openInfoBox',
		value: function openInfoBox(e) {
			e.preventDefault();
			this.props.setUiState({ isInfoBoxActive: true });
		}
	}, {
		key: 'getSectionText',
		value: function getSectionText() {
			project = this.props.project;
			projectSectionNames = project.get('project_section_names');
			if (projectSectionNames == null) {
				return '';
			}
			return projectSectionNames.join(',<br>').toUpperCase();
		}
	}]);

	return _class;
})(React.Component);
Comp.Projects.Show.Tilemap.InfoBox = React.createClass({
  mixins: [Comp.Mixins.BackboneEvents],
  getInitialState: function() {
    return {
      transitionEventNamespace: 0
    };
  },
  render: function() {
    return React.createElement("div", {
      "className": "atl__info-box",
      "ref": 'main'
    }, React.createElement("a", {
      "href": "#",
      "className": "bg-img-no--black atl__info-box__close",
      "onClick": this.close
    }), React.createElement("div", {
      "className": "atl__title-bar atl__title-bar--image bg-c-off-white"
    }, React.createElement("div", {
      "className": "atl__title-bar__background"
    }), React.createElement("div", {
      "className": "atl__title-bar__content"
    }, React.createElement("h1", {
      "className": 'title'
    }, this.getTitle()), React.createElement("ul", null, this.renderWebsite()))), React.createElement("div", {
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
    }, React.createElement(Comp.Projects.Show.Tilemap.InfoBox.Content, React.__spread({}, this.props))), React.createElement("div", {
      "className": "atl-grid__3-3"
    }))));
  },
  componentWillMount: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this.listenTo(App.vent, 'item:activate', (function(_this) {
        return function() {
          return _this.props.setUiState({
            isInfoBoxActive: true
          });
        };
      })(this));
    }
  },
  componentDidUpdate: function() {
    var App;
    App = this.props.App;
    if (App != null) {
      return this.setImage();
    }
  },
  getTitle: function() {
    var activeItem, project;
    project = this.props.project;
    activeItem = project.get('data').items.active;
    if (activeItem != null) {
      return activeItem.get('name');
    }
    return project.get('title');
  },
  getBodyHtml: function() {
    var activeItem, project;
    project = this.props.project;
    activeItem = project.get('data').items.active;
    if (activeItem != null) {
      return '<p>Active Data Html</p>';
    }
    return project.get('body_text');
  },
  close: function(e) {
    var $el, App, transitionEventName;
    e.preventDefault();
    transitionEventName = this.getTransitionEventName();
    $el = $(React.findDOMNode(this.refs.main));
    $el.on(transitionEventName, (function(_this) {
      return function(e) {
        App.vent.trigger('item:deactivate');
        return $(_this).off(transitionEventName);
      };
    })(this));
    this.props.setUiState({
      isInfoBoxActive: false
    });
    return App = this.props.App;
  },
  getTransitionEventName: function() {
    var eventName, events;
    events = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'];
    this.setState({
      transitionEventNamespace: this.state.transitionEventNamespace + 1
    });
    eventName = events.map((function(_this) {
      return function(event) {
        return "event." + _this.state.transitionEventNamespace;
      };
    })(this)).join(' ');
    return eventName;
  },
  setImage: function() {
    var $el, App, activeItem, imageName, img, project;
    project = this.props.project;
    App = this.props.App;
    activeItem = project.get('data').items.active;
    if (activeItem == null) {
      return;
    }
    $el = $('.atl__title-bar__background');
    $el.css('background-color', 'rgba(50, 50, 50, 0.1)');
    imageName = activeItem.getImageName();
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
            return $el.css('background-image', backgroundImageCss);
          }
        };
      })(this));
    }
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

Comp.Projects.Show.Tilemap.InfoBox.Content = React.createClass({
  render: function() {
    var activeItem, html, project;
    project = this.props.project;
    activeItem = this.props.activeItem;
    html = activeItem != null ? this.getContentHtml() : project.get('body_text');
    return React.createElement("div", {
      "className": 'static-content',
      "dangerouslySetInnerHTML": {
        __html: html
      }
    });
  },
  getContentHtml: function() {
    var App, activeItem, getSectionHtml, html, infoBoxSections, project, variables;
    project = this.props.project;
    App = this.props.App;
    getSectionHtml = function(raw) {
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
    activeItem = this.props.activeItem;
    infoBoxSections = project.get('data').infobox_variables;
    variables = project.get('data').variables;
    html = "";
    infoBoxSections.getItemSections(activeItem, variables).forEach((function(_this) {
      return function(section) {
        return html += "<h1>" + (section.variable.get('display_title')) + "</h1>" + (getSectionHtml(section.field));
      };
    })(this));
    return html;
  },
  componentDidMount: function() {
    return $('#atl__toc__list').toc({
      selectors: 'h1,h2',
      container: '.static-content',
      templates: {
        h2: _.template('<%= title %>'),
        h3: _.template('<%= title %>')
      }
    });
  }
});

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Projects.Show.Tilemap.Map = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class(props) {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), "constructor", this).call(this, props);
	}

	_createClass(_class, [{
		key: "render",
		value: function render() {
			return React.createElement("div", { className: "fill-parent", id: "atl__map" });
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			App = this.props.App;
			if (App == null) {
				return;
			}
			App.Map.props = {
				project: this.props.project,
				uiState: this.props.uiState
			};
			App.Map.start();
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			App = this.props.App;
			if (App == null) {
				return;
			}
			App.Map.props = { project: undefined };
			App.Map.stop();
		}
	}, {
		key: "displayName",
		get: function get() {
			return 'Comp.Projects.Show.Tilemap.Map';
		}
	}]);

	return _class;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Projects.Show.Tilemap.Popup = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class(props) {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
		this.state = {
			x: 0,
			y: 0,
			display: 'block',
			type: 'state'
		};
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			var style = { left: this.state.x, top: this.state.y, display: this.state.display };
			return React.createElement(
				'div',
				{ className: 'atl__popup ' + this.getModifierClass(), style: style },
				React.createElement(
					'div',
					{ className: 'atl__popup__wrapper' },
					React.createElement(
						'div',
						{ className: 'atl__popup__content' },
						React.createElement(
							'div',
							{ id: 'atl__popup__content__logo', className: 'atl__popup__content__logo' },
							this.renderLogo()
						),
						React.createElement(
							'div',
							{ className: 'atl__popup__content__text' },
							React.createElement(
								'p',
								null,
								this.getName()
							)
						)
					)
				)
			);
		}
	}, {
		key: 'getModifierClass',
		value: function getModifierClass() {
			if (this.state.type === 'state') {
				return 'atl__popup--center';
			}
			return '';
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_.extend(this, Backbone.Events);
			var App = this.props.App;
			this.listenTo(App.vent, 'item:mouseover item:mouseout', this.setPosition.bind(this));
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.stopListening();
		}
	}, {
		key: 'getHoveredItem',
		value: function getHoveredItem() {
			return this.props.project.get('data').items.hovered;
		}
	}, {
		key: 'getName',
		value: function getName() {
			var hoveredItem = this.getHoveredItem();
			if (hoveredItem == null) {
				return '';
			}
			return hoveredItem.get('name');
		}
	}, {
		key: 'renderLogo',
		value: function renderLogo() {
			return React.createElement(
				'svg',
				{ className: 'hex-button', viewBox: '0 0 100 100' },
				React.createElement(
					'g',
					{ className: 'hex-button__border' },
					React.createElement('path', { d: 'M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3' })
				),
				React.createElement(
					'g',
					{ className: 'hex-button__down' },
					React.createElement('path', { d: 'M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z' })
				)
			);
		}
	}, {
		key: 'setPosition',
		value: function setPosition() {
			var hoveredItem, App, position;
			App = this.props.App;
			if (App == null) {
				return;
			}
			hoveredItem = this.getHoveredItem();
			if (hoveredItem == null) {
				return this.setState({ display: 'none' });
			}
			position = App.reqres.request('item:map:position', hoveredItem);
			this.setState({
				x: position.x,
				y: position.y,
				display: 'block',
				type: hoveredItem.get('_itemType')
			});
		}
	}]);

	return _class;
})(React.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Projects.Show.Tilemap.Search = (function (_React$Component) {
	_inherits(_class, _React$Component);

	function _class(props) {
		_classCallCheck(this, _class);

		_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
		this.state = {
			searchTerm: ''
		};
	}

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'atl__search' },
				React.createElement('input', { type: 'text', placeholder: 'Search Project', onChange: this.setSearchTerm.bind(this) })
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this = this;

			var App = this.props.App;
			if (App == null) {
				return;
			}
			App.reqres.setHandler('search:term', function () {
				return _this.state.searchTerm;
			});
		}
	}, {
		key: 'setSearchTerm',
		value: function setSearchTerm(e) {
			console.log(e.target.value.length);
			var App = this.props.App;
			if (App == null) {
				return;
			}
			this.setState({
				searchTerm: e.target.value
			});
			App.vent.trigger('search:term:change');
		}
	}]);

	return _class;
})(React.Component);
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
