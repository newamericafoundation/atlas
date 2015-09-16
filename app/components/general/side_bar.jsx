import React from 'react';
import { Link } from 'react-router';
import Icons from './icons.jsx';
import classNames from 'classnames';

/*
 * The SideBar component renders a list of buttons with the same appearance but different markup - buttons, links, forms - and functionality - navigate to an inner route, to an outer route, trigger a download through a form, or simple send a custom message to SideBar's parent.
 * It does so by taking an object for each button using the following syntax:
 * obj = {
 *   title: 'Explore Atlas',
 *   contentType: 'inner-link', // options: inner-link (react-router's Link component), outer-link or form
 *   url: '/menu', // if content type is a link, this is the url it will point to
 *   reactIconName: 'Grid',
 *   clickMessage: 'delete-project', // message sent to SideBar's parent which can then handle the click event accordingly.
 *   isToggleable: false 
 * };
 */

import { DropdownUp, DropdownDown } from './icons.jsx';

class SideBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isActive: false
		};
		this.props.buttons = this.props.buttons || defaultButtons;
	}

	render() {
		return (
			<div className={ this.getClass() }>
				<div className="atl__side-bar__toggler" onClick={ this.toggle.bind(this) }>
					{ this.renderDropdownIcon() }
				</div>
				<div className="atl__side-bar__title">{ this.state['hoveredButtonTitle'] }</div>
				{ this.renderButtons() }
			</div>
		);
	}

	renderDropdownIcon() {
		return this.state.isActive ? <DropdownUp /> : <DropdownDown />;
	}

	getClass() {
		return classNames({
			'atl__side-bar': true,
			'atl__side-bar--active': this.state['isActive']
		});
	}

	setHoveredButtonTitle(title) {
		this.setState({ hoveredButtonTitle: title });
	}

	toggle() {
		this.setState({ isActive: !this.state['isActive'] });
	}

	renderButtons() {
		if (this.props.buttons == null) { return; }
		var list = this.props.buttons.map((options, i) => {
			return (
				<SideBarButton 
					{...this.props}
					options={options}
					setHoveredButtonTitle={this.setHoveredButtonTitle.bind(this)}
					key={i}
				/>
			)
		});
		return (
			<ul className="atl__side-bar__icons">
				{list}
			</ul>
		);
	}

}

class SideBarButton extends React.Component {

	render() {
		return (
			<li className="atl__side-bar__icon" 
				onMouseEnter={ this.onButtonMouseEnter.bind(this) } 
				onMouseLeave={ this.onButtonMouseLeave.bind(this) } 
				onClick={ this.handleClick.bind(this) } 
			>
				{ this.renderContent() }
			</li>
		);
	}

	onButtonMouseEnter() {
		this.props.setHoveredButtonTitle(this.props.options.title);
	}

	onButtonMouseLeave() {
		this.props.setHoveredButtonTitle('');
	}

	// Render different types of content.
	renderContent() {
		var contentType = this.props.options.contentType;
		if (contentType === 'form') { return this.renderFormContent(); }
		if (contentType === 'inner-link') { return this.renderInnerLinkContent(); }
		if (contentType === 'outer-link') { return this.renderOuterLinkContent(); }
		return this.renderDefaultContent();
	}

	renderDefaultContent() {
		var IconComp = this.getIconComp();
		return (
			<div>
				<IconComp />
			</div>
		);
	}

	renderInnerLinkContent() {
		var IconComp = this.getIconComp();
		return (
			<Link to={ this.props.options.url }>
				<IconComp />
			</Link>
		);
	}

	renderOuterLinkContent() {
		var IconComp = this.getIconComp();
		return (
			<a href={ this.props.options.url }>
				<IconComp />
			</a>
		);
	}

	renderFormContent() {
		var IconComp = this.getIconComp();
		return ( 
			<form action={ this.props.options.url } method='post'> 
				<IconComp />
				<input type="hidden" name={ this.props.options.hiddenInputKey } value={ this.props.options.hiddenInputValue } />
				<input type="submit" value="" />
			</form>
		);
	}

	getIconComp() {
		return Icons[this.props.options.reactIconName];
	}

	handleClick() {

		// If the parent of the SideBar component passed down its own method to handle a message from the button and if the button has a click message set, call this method.
		if (this.props.options.clickMessage && this.props.sendMessageToParent) {
			this.props.sendMessageToParent(this.props.options.clickMessage);
		}

	}

}

export default SideBar;