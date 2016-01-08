import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import colors from './../../../../../../utilities/colors.js'
import * as Icons from './../../../../../../general/icons.jsx'
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
	render() {
		var IconComp = Icons.Hex
		var className = classNames({
			'toggle-button': true,
			'toggle-button--inactive': !this.props.filterValue.isActive()
		})
		return (
			<li 
				className={ className }
				onClick={ this.toggle.bind(this) } 
				onMouseEnter={ this.setHovered.bind(this) } 
				onMouseLeave={ this.clearHovered.bind(this) } 
			>
				<HexIcon className="toggle-button__icon" fillColor={this.getColor()} />
				<div className="toggle-button__text">
				   	<p>{ this.props.filterValue.get('value') }</p>
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
		console.log('updating')
		radio.commands.execute('update:tilemap')
	}

}

export default FilterValue