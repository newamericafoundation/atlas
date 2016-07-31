import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import colors from './../../../../../../../utilities/colors.js'
import { Hex } from './../../../../../../general/icons.jsx'
import HexIcon from './../../../../../../general/hex_icon.jsx'


/*
 *
 *
 */
class FilterValue extends React.Component {

	/*
	 * 
	 *
	 */
	constructor(props) {
		super(props)
		this.toggle = this.toggle.bind(this)
		this.setHovered = this.setHovered.bind(this)
		this.clearHovered = this.clearHovered.bind(this)
	}


	/*
	 *
	 *
	 */
	render() {
		var { filterValue } = this.props
		var className = classNames({
			'toggle-button': true,
			'toggle-button--inactive': !filterValue.isActive()
		})
		return (
			<li 
				className={ className }
				onClick={ this.toggle } 
				onMouseEnter={ this.setHovered } 
				onMouseLeave={ this.clearHovered } 
			>
				<HexIcon className="toggle-button__icon" fillColor={ this.getColor() } />
				<div className="toggle-button__text">
				   	<p>{ filterValue.get('value') }</p>
				</div>
			</li>
		);
	}


	/*
	 *
	 *
	 */
	getColor() {
		var { filterValue } = this.props
		if (!filterValue.isActive()) { return }
		var i = filterValue.getFriendlySiblingIndex(15)
		return colors.toRgba(i - 1)
	}


	/*
	 *
	 *
	 */
	setHovered() {
		var { radio } = this.props
		var modelIndex, color
		modelIndex = this.getFilterValueIndex()
		this.props.filterValue.parent.parent.state.valueHoverIndex = modelIndex
		radio.commands.execute('update:tilemap')
		color = this.getColor()
		radio.commands.execute('set:header:strip:color', { color: color })
	}


	/*
	 *
	 *
	 */
	clearHovered() {
		var { radio } = this.props
		this.props.filterValue.parent.parent.state.valueHoverIndex = -1
		radio.commands.execute('update:tilemap')
		radio.commands.execute('set:header:strip:color', 'none')
	}


	/*
	 *
	 *
	 */
	getFilterValueIndex() {
		return this.props.filterValue.parent.children.indexOf(this.props.filterValue)
	}


	/*
	 *
	 *
	 */
	toggle() {
		var { radio, filterValue } = this.props
		filterValue.toggle()
		radio.commands.execute('update:tilemap')
	}

}

export default FilterValue