import React from 'react';
import * as colors from './../utilities/colors.js';
import classNames from 'classnames';

class Setup extends React.Component {
	
	render() {
		return (
			<div className="atl__setup">
				<svg id="patterns">
					<PatternsSetup {...this.props} size={30} />
				</svg>
			</div>
		);
	}

}

// Component that defines the color combination patterns needed for 
//   multi-colored striped fill on SVG elements.
class PatternsSetup extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	render() {
		return (
			<defs>
				{this.renderList()}
			</defs>
		);
	}

	renderList() {
		// Need to start with a set number of empty patterns and modify as new patterns are requested.
		//   it does not work when they are generated from scratch on the fly.
		// this.state.data.map (colorCodes, id) =>
		var arr = [];
		for (let i = 0; i < this.props.size; i += 1) { arr.push(i); }
		return arr.map((i) => {
			var colorCodes = this.state.data[i];
			return (
				<Pattern
					radio={this.props.radio} 
					id={i} 
					key={i} 
					colorCodes={colorCodes} 
				/>
			)
		});
	}

	componentDidMount() {
		var { radio } = this.props;
		radio.commands.setHandler('reset:patterns', this.resetPatterns.bind(this));
		radio.reqres.setHandler('get:pattern:id', this.ensureAndGetPattern.bind(this));
	}

	componentWillUnmount() {
		var { radio } = this.props;
		radio.commands.clearHandler('reset:patterns');
	}

	resetPatterns() {
		this.setState({ data: [] });
	}

	// Ensures a pattern is defined and returns its id.
	// this.param {array} colorCodes
	// this.returns {number} id
	ensureAndGetPattern(colorCodes) {
		var data;
		// Loop through existing patterns to see if the combination has been defined before.
		for (let i = 0; i < this.state.data.length; i += 1) {
			let existingColorCodes = this.state.data[i];
			if (colorCodes.join('-') === existingColorCodes.join('-')) {
				return i;
			}
		}
		// If the pattern is not found, define it on the fly.
		data = this.state.data;
		// If the size is exceeded, erase all patterns (suboptimal).
		if (data.length > this.props.size - 2) {
			data = [];
		}
		data.push(colorCodes);
		this.setState({ data: data });
		// Return the index of the newly defined color code.
		return this.state.data.length-1;
	}

	// These are the readily assembled pattern templates are assembled programatically by the child component.
	__testRenderTwoColorPattern() {
		return (
			<pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
			    <rect x="0" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'roed' };"} />
			    <rect x="2" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'roed' };"} />
			    <rect x="4" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'hvid' };"} />
			    <rect x="6" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'hvid' };"} />
			</pattern>
		);
	}

	__testRenderThreeColorPattern() {
		return (
			<pattern id="diagonal-stripes" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
			  	<rect  x="0" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'schwarz' };"} />
			    <rect  x="6" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'rot' };"} />
			    <rect x="12" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'gold' };"} />
			</pattern>
		);

	}

}

// Single pattern element.
class Pattern extends React.Component {
	
	render() {
		var colorCount, dim, className;
		if (this.props.colorCodes == null) { return (<pattern />); }
		colorCount = this.props.colorCodes.length
		dim = (colorCount === 2) ? 12 : 18;
		className = 'striped-pattern-' + this.props.colorCodes.join('-');
		return (
			<pattern 
				id={'stripe-pattern-' + this.props.id} 
				className={className} 
				x="0" 
				y ="0" 
				width={dim} 
				height={dim} 
				patternUnits="userSpaceOnUse" 
				patternTransform="rotate(45)"
			>
				{this._getPatternRects()}
			</pattern>
		);
	}

	// Custom color function that translates a color code into an rgb value.
	// TODO: this function needs to be provided as props to the parent component.
	//   this will make the component more general.
	getColor(colorCode) {
		return colors.toRgb(colorCode - 1);
	}

	componentDidMount() {
		this.setPatternTransform();
	}

	componentDidUpdate() {
		this.setPatternTransform();
	}

	// React does not support patternTransform as an attribute.
	//   Need to set with vanilla JavaScript instead (jQuery lowercases it by default).
	setPatternTransform() {
		React.findDOMNode(this).setAttribute('patternTransform', 'rotate(45)');
	}

	// this.param {number} n - Number of rectangles defining the pattern.
	_getPatternRects(n) {
		var n, arr;
		if (this.props.colorCodes == null) { return; }
		n = this.props.colorCodes.length;
		arr = (n === 3) ? [ 0, 1, 2 ] : [ 0, 1 ];
		return arr.map((i) => {
			var height = (n === 2) ? 12 : 18;
			var color = this.getColor(this.props.colorCodes[i]);
			var style = { 'stroke': 'none', 'fill': color }
			return (
				<rect key={i} x={6 * i} y="0" width="6" height={height} style={style} />
			);
		});
	}

}

export default Setup;