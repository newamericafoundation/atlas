import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import * as Icons from './../icons.jsx'


/*
 *
 *
 */
class SideBarButton extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = {
			isActive: false
		}
	}


	/*
	 *
	 *
	 */
	render() {
		var cls = classNames({
			'atl__side-bar__icon': true,
			'atl__side-bar__icon--active': this.props.options.hasActiveState && this.props.options.isActive
		})
		return (
			<li className={ cls }
				onMouseEnter={ this.onButtonMouseEnter.bind(this) } 
				onMouseLeave={ this.onButtonMouseLeave.bind(this) } 
				onClick={ this.handleClick.bind(this) } 
			>
				{ this.renderContent() }
			</li>
		)
	}


	/*
	 * Render different types of content.
	 *
	 */
	renderContent() {
		var contentType = this.props.options.contentType;
		if (contentType === 'form') { return this.renderFormContent() }
		if (contentType === 'inner-link') { return this.renderInnerLinkContent() }
		if (contentType === 'outer-link') { return this.renderOuterLinkContent() }
		return this.renderDefaultContent()
	}


	/*
	 * Render default content.
	 *
	 */
	renderDefaultContent() {
		var IconComp = this.getIconComp()
		return (
			<div>
				<IconComp />
			</div>
		)
	}


	/*
	 * Render inner link content (React Router link).
	 *
	 */
	renderInnerLinkContent() {
		var IconComp = this.getIconComp()
		return (
			<Link to={ this.props.options.url }>
				<IconComp />
			</Link>
		)
	}


	/*
	 * Render inner outer content (simple HTML5 link).
	 *
	 */
	renderOuterLinkContent() {
		var IconComp = this.getIconComp()
		return (
			<a href={ this.props.options.url }>
				<IconComp />
			</a>
		)
	}


	/*
	 * Render form content with a single submit button and hidden input fields.
	 * Use case: force download of a file server-generated on the fly.
	 */
	renderFormContent() {
		var IconComp = this.getIconComp()
		return ( 
			<form action={ this.props.options.url } method='post'> 
				<IconComp />
				<input 
					type="hidden" 
					name={ this.props.options.hiddenInputKey } 
					value={ this.props.options.hiddenInputValue } 
				/>
				<input type="submit" value="" />
			</form>
		)
	}


	/*
	 *
	 *
	 */
	getIconComp() {
		var { hasActiveState, isActive, reactIconNames } = this.props.options
		var iconNameIndex = (hasActiveState && isActive) ? 1 : 0
		var iconName = reactIconNames[iconNameIndex] || 'Build'
		return Icons[iconName]
	}


	/*
	 *
	 *
	 */
	handleClick() {
		var { hasActiveState, isActive, clickMessage, sendMessageToParent } = this.props.options
		if (hasActiveState) {
			this.props.options.isActive = !isActive
		}
		// If the parent of the SideBar component passed down its own method to handle a message from the button and if the button has a click message set, call this method.
		if (clickMessage && this.props.sendMessageToParent) {
			this.props.sendMessageToParent(clickMessage)
		}
	}


	/*
	 *
	 *
	 */
	onButtonMouseEnter() {
		this.props.setHoveredButtonTitle(this.props.options.title)
	}


	/*
	 * 
	 *
	 */
	onButtonMouseLeave() {
		this.props.setHoveredButtonTitle('')
	}

}

export default SideBarButton