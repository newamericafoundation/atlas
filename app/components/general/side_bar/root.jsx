import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import { DropdownUp, DropdownDown } from './../icons.jsx'

import SideBarButton from './button.jsx'

class SideBar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			isActive: false
		}
	}

	render() {
		var className = classNames({
			'atl__side-bar': true,
			'atl__side-bar--active': this.state['isActive']
		})
		return (
			<div className={ className }>
				<div className="atl__side-bar__toggler" onClick={ this.toggle.bind(this) }>
					{ this.renderDropdownIcon() }
				</div>
				<div className="atl__side-bar__title">{ this.state['hoveredButtonTitle'] }</div>
				{ this.renderButtons() }
			</div>
		)
	}

	renderDropdownIcon() {
		return this.state.isActive ? <DropdownUp /> : <DropdownDown />
	}

	setHoveredButtonTitle(title) {
		this.setState({ hoveredButtonTitle: title })
	}

	toggle() {
		this.setState({ isActive: !this.state['isActive'] })
	}

	renderButtons() {
		if (this.props.buttons == null) { return }
		var list = this.props.buttons.map((options, i) => {
			if (options.isHidden) { return; }
			return (
				<SideBarButton
					{...this.props}
					options={options}
					setHoveredButtonTitle={this.setHoveredButtonTitle.bind(this)}
					key={i}
				/>
			)
		})
		return (
			<ul className="atl__side-bar__icons">
				{list}
			</ul>
		)
	}

}

export default SideBar
