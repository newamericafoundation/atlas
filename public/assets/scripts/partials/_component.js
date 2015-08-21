// Initialize components namespace.
"use strict";

var Comp = {};

Comp.Mixins = {};

Comp.Icons = {};

// Add Backbone Events to component.
Comp.Mixins.BackboneEvents = {

	componentDidMount: function componentDidMount() {
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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Comp.Icons.Calendar = (function (_React$Component) {
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
					React.createElement("path", { d: "M62.7,57l6.2-6.2v31.5c0,1,0.8,1.9,1.9,1.9c1,0,1.9-0.8,1.9-1.9v-36c0-0.8-0.5-1.5-1.2-1.8 c-0.7-0.3-1.5-0.1-2.1,0.4L60,54.3c-0.7,0.7-0.7,1.9,0,2.7C60.8,57.8,62,57.8,62.7,57z" }),
					React.createElement("path", { d: "M35.2,84.1c8.3,0,14.8-5.4,14.8-12.4c0-5-2.8-8.9-7.4-10.9c2.2-1.7,3.6-4.2,3.6-6.9 c0-6.1-4-9.6-11.1-9.6c-4.8,0-9.8,2.8-11.1,6.3c-0.4,1,0.1,2.1,1.1,2.5c1,0.4,2.1-0.1,2.5-1.1c0.7-1.8,4.1-3.8,7.6-3.8 c4.9,0,7.3,1.9,7.3,5.8c0,3.4-3.6,5.5-7.2,5.5c-1,0-1.9,0.8-1.9,1.9c0,1,0.8,1.9,1.9,1.9c5.5,0,11,2.6,11,8.6c0,4.8-4.8,8.6-11,8.6 c-4.4,0-8.4-2-10.1-5c-0.5-0.9-1.7-1.2-2.6-0.7c-0.9,0.5-1.2,1.7-0.7,2.6C24.2,81.4,29.4,84.1,35.2,84.1z" }),
					React.createElement("path", { d: "M89.8,12.1H74.7V6.4c0-1-0.8-1.9-1.9-1.9c-1,0-1.9,0.8-1.9,1.9v5.7H29.1V6.4 c0-1-0.8-1.9-1.9-1.9c-1,0-1.9,0.8-1.9,1.9v5.7H10.2c-4.2,0-7.6,3.4-7.6,7.6v68.3c0,4.2,3.4,7.6,7.6,7.6h79.7 c4.2,0,7.6-3.4,7.6-7.6V19.7C97.4,15.5,94,12.1,89.8,12.1z M93.6,87.9c0,2.1-1.7,3.8-3.8,3.8H10.2c-2.1,0-3.8-1.7-3.8-3.8V36.7 h87.3V87.9z M93.6,32.9H6.4V19.7c0-2.1,1.7-3.8,3.8-3.8h15.2v6.2c-1.1,0.7-1.9,1.9-1.9,3.3c0,2.1,1.7,3.8,3.8,3.8 c2.1,0,3.8-1.7,3.8-3.8c0-1.4-0.8-2.6-1.9-3.3v-6.2h41.7v6.2c-1.1,0.7-1.9,1.9-1.9,3.3c0,2.1,1.7,3.8,3.8,3.8 c2.1,0,3.8-1.7,3.8-3.8c0-1.4-0.8-2.6-1.9-3.3v-6.2h15.2c2.1,0,3.8,1.7,3.8,3.8V32.9z" })
				)
			);
		}
	}]);

	return _class;
})(React.Component);

Comp.Icons.Page = (function (_React$Component2) {
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
					React.createElement("path", { d: "M82.4,92.6c0,0.8-0.4,1.1-0.5,1.2H18.1c-0.1,0-0.5-0.4-0.5-1.2V7.4c0-0.8,0.4-1.1,0.5-1.2h36.6 c3.5,0,6.4,2.8,6.5,6.3l0.5,14.4l18.6,3.2c1,0.1,2.1,1.4,2.1,2.4V92.6z M69.4,8.9c-4-4.5-9.8-7.1-15.9-7.1H18.1c-2.7,0-5,2.5-5,5.6 v85.3c0,3.1,2.2,5.6,5,5.6h63.8c2.7,0,5-2.5,5-5.6V31.2c0-1.6-0.6-3.1-1.6-4.3L69.4,8.9z" }),
					React.createElement("rect", { x: "25.1", y: "36.8", width: "50.9", height: "6.1" }),
					React.createElement("rect", { x: "25.1", y: "22.9", width: "22.2", height: "6.1" }),
					React.createElement("rect", { x: "24", y: "64.9", width: "51.9", height: "6.1" }),
					React.createElement("rect", { x: "24", y: "51", width: "51.9", height: "6.1" }),
					React.createElement("rect", { x: "24", y: "79.2", width: "26", height: "6.1" })
				)
			);
		}
	}]);

	return _class2;
})(React.Component);

Comp.Icons.Trophy = (function (_React$Component3) {
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
				React.createElement("path", { d: "M87,32.4c-1.3,1.9-3.3,3.8-6.6,5.3c-2.1,1-3.9,1.8-5.5,2.7c0.3-0.6,0.5-1.2,0.8-1.8c1.9-4.6,3.2-12.2,4-18.7 c0.6-0.2,2-0.5,3.3-0.5c0.9,0,1.8,0.1,2.5,0.5c0.7,0.3,1.3,0.7,1.9,1.6c0.9,1.3,1.4,3.1,1.4,5.1C88.8,28.4,88.3,30.4,87,32.4 M61.4,29.4l-4.1,4l1,5.6c0,0.1,0,0.3,0,0.4c0,0.7-0.3,1.4-0.9,1.8c-0.4,0.3-0.9,0.4-1.3,0.4c-0.4,0-0.7-0.1-1-0.3l-5-2.6l-5,2.6 c-0.3,0.2-0.7,0.3-1.1,0.3c-0.5,0-0.9-0.1-1.3-0.4c-0.6-0.4-0.9-1.1-0.9-1.8c0-0.1,0-0.3,0-0.4l1-5.6l-4.1-4c-0.4-0.4-0.7-1-0.7-1.6 c0-0.2,0-0.5,0.1-0.7c0.3-0.8,1-1.4,1.8-1.5l5.6-0.8l2.5-5.1c0.4-0.8,1.2-1.3,2-1.3c0.9,0,1.6,0.5,2,1.3l2.5,5.1l5.6,0.8 c0.9,0.1,1.6,0.7,1.8,1.5c0.1,0.2,0.1,0.5,0.1,0.7C62.1,28.4,61.8,29,61.4,29.4 M24.8,40.3c-1.5-0.8-3.3-1.7-5.2-2.6 c-3.3-1.5-5.3-3.4-6.6-5.3c-1.3-1.9-1.8-3.9-1.8-5.8c0-1.9,0.6-3.8,1.4-5.1l0,0c0.6-0.9,1.1-1.3,1.9-1.6c0.7-0.3,1.6-0.5,2.5-0.5 c1,0,2,0.2,2.7,0.3c0.3,0.1,0.5,0.1,0.6,0.2c0.8,6.5,2.1,14.1,4,18.7c0.3,0.6,0.5,1.2,0.8,1.8C25,40.4,24.9,40.3,24.8,40.3 M93.4,17.5c-1.3-2.1-3.2-3.5-5-4.2c-1.9-0.8-3.7-1-5.3-1c-0.9,0-1.8,0.1-2.6,0.2c0.2-2,0.3-3.5,0.3-4.5h0.6c2,0,3.6-1.6,3.6-3.6 c0-2-1.6-3.6-3.6-3.6H18.6c-2,0-3.6,1.6-3.6,3.6c0,2,1.6,3.6,3.6,3.6h0.6c0.1,0.9,0.2,2.5,0.3,4.5c-0.8-0.1-1.6-0.2-2.6-0.2 c-1.6,0-3.5,0.2-5.3,1c-1.9,0.8-3.7,2.2-5,4.2c-1.7,2.6-2.6,5.7-2.6,9c0,3.2,0.9,6.7,3,9.8c2.1,3.1,5.3,5.9,9.6,7.9 c2.9,1.3,5.2,2.5,6.4,3.3c0.4,0.3,0.7,0.5,0.9,0.7c-1,1.7-0.3,3.9,1.4,4.9c1.7,1,3.9,0.3,4.9-1.4c0.1-0.2,0.2-0.4,0.3-0.6 c1.8,3.1,3.9,5.8,6.4,8.3c-1.6,0.3-2.9,1.8-2.9,3.5c0,1.9,1.4,3.4,3.3,3.6l-4.2,18.3h-1.1c-2.9,0-5.2,2.3-5.2,5.2V94 c0,2.9,2.3,5.2,5.2,5.2h36.3c2.9,0,5.2-2.3,5.2-5.2v-3.9c0-2.9-2.3-5.2-5.2-5.2h-1.1l-4.2-18.3c1.8-0.2,3.3-1.7,3.3-3.6 c0-1.7-1.2-3.2-2.9-3.5c2.5-2.5,4.6-5.3,6.4-8.3c0.1,0.2,0.2,0.4,0.3,0.6c1,1.7,3.2,2.3,4.9,1.4c1.7-1,2.3-3.1,1.4-4.9 c0.1-0.1,0.1-0.2,0.3-0.3c0.5-0.4,1.4-1,2.6-1.6c1.2-0.6,2.7-1.3,4.4-2.1c4.3-2,7.5-4.8,9.6-7.9c2.1-3.1,3-6.6,3-9.8 C96,23.2,95.1,20.1,93.4,17.5" })
			);
		}
	}]);

	return _class3;
})(React.Component);

Comp.Icons.Expand = (function (_React$Component4) {
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
				React.createElement("path", { d: "M34.6,38.8c-1,0-2.1-0.4-2.8-1.1L8,14v15.2c0,2.1-1,3.7-3,3.7c-2,0-3-1.6-3-3.7v-24c0-0.2-0.3-1.8,0.4-2.6 C3.3,1.8,4.6,2,4.7,2h24.2c2.1,0,3.7,1,3.7,3S31,8,28.8,8H13.6l23.7,24.1c0.7,0.7,1.1,1.8,1.1,2.8c0,1.1-0.4,2.1-1.1,2.8 C36.5,38.4,35.6,38.8,34.6,38.8z" }),
				React.createElement("path", { d: "M5,98c-0.1,0-1.7,0.1-2.5-0.7C1.7,96.5,2,94.9,2,94.8V70.7C2,68.6,3,67,5,67c2,0,3,1.6,3,3.7v15.2l24-23.6 c0.7-0.7,1.7-1,2.7-1c1,0,2.1,0.4,2.8,1.1c1.5,1.5,1.5,4.1,0,5.5L13.8,92H29c2.1,0,3.7,1,3.7,3s-1.6,3-3.7,3H5z" }),
				React.createElement("path", { d: "M64.7,38.5c-1.1,0-2.2-0.4-2.9-1.1c-0.7-0.7-1.1-1.6-1.1-2.7c0-1,0.4-2.1,1.1-2.8L85.5,8H70.3 c-2.1,0-3.7-1-3.7-3s1.6-3,3.7-3h24c0.2,0,2.3-0.2,3.1,0.6c0.8,0.8,1.1,2.4,1.1,2.4l0,24.1c0,2.1-1.3,3.7-3.2,3.7 c-2,0-3.2-1.6-3.2-3.7V13.8L67.7,37.5C67,38.1,65.8,38.5,64.7,38.5z" }),
				React.createElement("path", { d: "M70.5,98c-2.1,0-3.7-1-3.7-3s1.6-3,3.7-3h15.2L62.2,67.6c-0.7-0.7-1.1-1.8-1-3c0-1.1,0.4-2.2,1.1-2.9 c0.7-0.7,1.7-1.1,2.7-1.1c1,0,2.2,0.4,2.9,1.1L92,85.4V70.2c0-2.1,1-3.7,3-3.7c2,0,3,1.6,3,3.7v24c0,0.3,0,2.4-0.8,3.1 c-0.8,0.8-2.5,0.9-2.6,0.9l0.1-0.2H70.5z" })
			);
		}
	}]);

	return _class4;
})(React.Component);

Comp.Icons.Collapse = (function (_React$Component5) {
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
				React.createElement("path", { d: "M10.7,39C8.6,39,7,37.5,7,35.5S8.6,32,10.7,32h15.4L2.1,7.7C1.4,7,1,6,1,4.9c0-1.1,0.4-2.1,1.1-2.8 C2.8,1.4,3.7,1,4.6,1c1,0,1.9,0.4,2.7,1.1L31,26V10.7C31,8.5,32.5,7,34.5,7S38,8.5,38,10.7v24.2c0,0.2,0.3,2.2-0.5,3 c-0.8,0.8-2.2,1-2.2,1L35.1,39H10.7z" }),
				React.createElement("path", { d: "M5.1,99c-1.1,0-2.2-0.4-2.9-1.2c-1.5-1.5-1.5-4,0-5.5L26.1,68H10.7C8.5,68,7,66.5,7,64.5S8.5,61,10.7,61H35 v0.2c1,0.1,2.2,0.4,2.8,1.1c0.8,0.8,1.2,2.8,1.2,2.9v24.4c0,2.2-1.5,3.7-3.5,3.7S32,91.7,32,89.5V74.1L7.7,97.9 C7.1,98.6,6.1,99,5.1,99z" }),
				React.createElement("path", { d: "M65.1,39c-0.3,0-2.3-0.4-3-1.2c-0.8-0.8-1-2.9-1-2.9V10.5c0-2.2,1.5-3.7,3.5-3.7S68,8.3,68,10.5v15.4 L92.3,2.1c0.7-0.7,1.6-1,2.7-1c1.1,0,2.2,0.4,2.9,1.2c1.5,1.5,1.5,4,0,5.5L73.9,32h15.4c2.2,0,3.7,1.5,3.7,3.5S91.5,39,89.3,39H65.1 z" }),
				React.createElement("path", { d: "M95.1,99c-1.1,0-2-0.4-2.7-1.1L68,73.9v15.4c0,2.2-1.5,3.7-3.5,3.7S61,91.5,61,89.3V65.1 c0-0.3,0.4-2.3,1.2-3c0.8-0.8,2.9-1,3-1h24.4c2.2,0,3.7,1.5,3.7,3.5S91.7,68,89.5,68H74.1l23.8,24.3c0.7,0.7,1.1,1.7,1,2.8 c0,1.1-0.5,2.1-1.2,2.8C97.1,98.6,96.1,99,95.1,99z" })
			);
		}
	}]);

	return _class5;
})(React.Component);

Comp.Icons.Grid = (function (_React$Component6) {
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

	return _class6;
})(React.Component);

Comp.Icons.Help = (function (_React$Component7) {
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
				React.createElement("path", { d: "M50,0.7C22.8,0.7,0.7,22.8,0.7,50S22.8,99.3,50,99.3c27.2,0,49.3-22.1,49.3-49.3S77.2,0.7,50,0.7z M50,78 c-2.4,0-4.3-2-4.3-4.3c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3C54.3,76.1,52.4,78,50,78z M60,51.9c-3,2.5-5.6,4.6-5.6,7.9 c0,2.4-1.9,4.3-4.3,4.3c-2.4,0-4.3-1.9-4.3-4.3c0-5.8,4.2-8.8,8.4-11.8c3.8-2.7,7.4-5.3,7.4-9.9c0-5.9-4.3-9.5-11.4-9.5 c-10.3,0-11.4,7.3-11.4,10.5c0,1.8-1.5,3.4-3.4,3.4c-1.9,0-3.4-1.5-3.4-3.4C31.8,30.9,37.5,22,50,22c11.9,0,18.2,8.1,18.2,16.2 C68.2,45.2,63.8,48.8,60,51.9z" })
			);
		}
	}]);

	return _class7;
})(React.Component);

Comp.Icons.Print = (function (_React$Component8) {
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
				React.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M19.1,52.7v7.9h61.8v-7.8c0-0.6,0.3-1.2,0.8-1.6 c0.5-0.4,1.1-0.6,1.7-0.4c6.1,1.2,14,6.5,14,16.2c0,2.8,0,11.6,0,16.6c0,3.7-3,6.6-6.6,6.6H9.3c-3.6,0-6.6-3-6.6-6.6 c0-5,0-13.8,0-16.6c0-8.8,6.7-15.1,14-16.2c0.6-0.1,1.2,0.1,1.7,0.5C18.8,51.5,19.1,52.1,19.1,52.7L19.1,52.7z M76.9,56.6V31.8v-3.3 L58.2,9.8h-3.3H28.5c-2.9,0-5.3,2.4-5.3,5.3v41.5h7.1V17.7c0-0.4,0.4-0.8,0.8-0.8h23.9v5.2v2c0,4.2,3.5,7.7,7.7,7.7h7.2v24.8H76.9 L76.9,56.6z M63.3,17.8l-0.9-0.9h0L63.3,17.8L63.3,17.8z M19.1,84.3h61.8v-3.9H19.1V84.3z" })
			);
		}
	}]);

	return _class8;
})(React.Component);

Comp.Icons.Download = (function (_React$Component9) {
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
				React.createElement("path", { d: "M11.8,97c-2.7,0-4.9-2.3-4.9-5s2.2-5,4.9-5h76.5c2.7,0,4.9,2.3,4.9,5s-2.2,5-4.9,5H11.8z" }),
				React.createElement("path", { d: "M53.4,78.5l25.2-25.2c2-2,2.1-5,0.2-7c-2-2-5-1.8-7,0.2L55,63.3l0-50.9c0-2.8-2.3-5-5-5c-2.8,0-5,2.2-5,5 l0,50.9L28.2,46.5c-2-2-5-2.1-7-0.2c-2,2-1.8,5,0.2,7l25.4,25.4c0,0,1.7,1.8,3.3,1.8C51.5,80.5,53.4,78.5,53.4,78.5L53.4,78.5z" })
			);
		}
	}]);

	return _class9;
})(React.Component);

Comp.Icons.Comment = (function (_React$Component10) {
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
					React.createElement("path", { d: "M50,8.2C24.6,8.2,3.9,24.9,3.9,45.4c0,13.1,8.6,25.2,22.4,31.9c-2.2,2.9-5.1,5.2-8.6,6.9 c-1.6,0.8-2.5,2.6-2.1,4.3c0.3,1.8,1.8,3.1,3.6,3.2c1.1,0.1,2.3,0.1,3.4,0.1c10.1,0,19.2-3.3,25.7-9.3c0.6,0,1.2,0,1.8,0 c25.4,0,46.1-16.7,46.1-37.2C96.1,24.9,75.4,8.2,50,8.2z M50,74.7c-1,0-2.1-0.1-3.1-0.1c-1.2,0-2.3,0.4-3.1,1.2 c-3.1,3.2-7.1,5.5-11.7,6.8c0.9-1.1,1.7-2.2,2.4-3.4c0.3-0.5,0.5-1,0.8-1.5l0.2-0.5c0.5-1,0.6-2.2,0.1-3.2c-0.4-1-1.2-1.9-2.3-2.3 c-13.1-4.9-21.6-15.2-21.6-26.3c0-16.1,17.1-29.3,38.2-29.3c21.1,0,38.2,13.1,38.2,29.3S71.1,74.7,50,74.7z" }),
					React.createElement("path", { d: "M32.3,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C38,43.6,35.4,41,32.3,41z" }),
					React.createElement("path", { d: "M50,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C55.8,43.6,53.2,41,50,41z" }),
					React.createElement("path", { d: "M67.7,41c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8C73.5,43.6,70.9,41,67.7,41z" })
				)
			);
		}
	}]);

	return _class10;
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
          reactIcon: 'Collapse',
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
