import React from 'react'
import { findDOMNode } from 'react-dom'

import colors from './../../../../utilities/colors.js'


/*
 * Single pattern element.
 *
 */
class Pattern extends React.Component {
	
	/*
	 * These are the readily assembled pattern templates are assembled programatically by the child component.
	 *
	 */
	render() {
		var { colorCodes } = this.props
		if (colorCodes == null) { return <pattern /> }
		var colorCount = colorCodes.length
		var dim = (colorCount === 2) ? 12 : 18;
		var className = 'striped-pattern-' + colorCodes.join('-')
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
				{this.renderPatternRects()}
			</pattern>
		)
	}


	/*
	 * this.param {number} n - Number of rectangles defining the pattern.
	 *
	 */
	renderPatternRects(n) {
		var { colorCodes } = this.props
		if (colorCodes == null) { return }
		var n = colorCodes.length
		var arr = (n === 3) ? [ 0, 1, 2 ] : [ 0, 1 ]
		return arr.map((i) => {
			var height = (n === 2) ? 12 : 18
			var color = this.getColor(colorCodes[i])
			var style = { 'stroke': 'none', 'fill': color }
			return (
				<rect 
					key={i} 
					x={6 * i} 
					y="0" 
					width="6" 
					height={height} 
					style={style} 
				/>
			)
		})
	}


	/*
	 * Custom color function that translates a color code into an rgb value.
	 * TODO: this function needs to be provided as props to the parent component.
	 *   this will make the component more general.
	 */
	getColor(colorCode) {
		return colors.toRgb(colorCode - 1)
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		this.setPatternTransform()
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		this.setPatternTransform()
	}


	/*
	 * React does not support patternTransform as an attribute.
	 * Need to set with vanilla JavaScript instead (jQuery lowercases it by default).
	 */
	setPatternTransform() {
		findDOMNode(this).setAttribute('patternTransform', 'rotate(45)')
	}

}

export default Pattern