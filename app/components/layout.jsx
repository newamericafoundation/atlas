import React from 'react'
import { RoutingContext } from 'react-router'
import classNames from 'classnames'

import { connect } from 'react-redux'

import Setup from './general/setup.jsx'
import Header from './general/header.jsx'

import Backbone from 'backbone'
import 'backbone.wreqr'

/*
 * Create radio object with the same fields as a Marionette Application object.
 * This is a temporary setup to support the Marionette transition.
 */
function createRadio() {
	var radio = {}
	radio.vent = new Backbone.Wreqr.EventAggregator()
	radio.reqres = new Backbone.Wreqr.RequestResponse()
	radio.commands = new Backbone.Wreqr.Commands()
	return radio
}


/*
 *
 *
 */
class Layout extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		// Create a new radio instance.
		this.state = { radio: createRadio() }
	}


	/*
	 *
	 *
	 */
	render() {
		var { radio } = this.state
		return (
			<div className={this.getClassName()}>
				<Setup radio={radio} />
				<Header radio={radio} title={this.getHeaderTitle()} isTransparent={this.isHeaderTransparent()} />
				{ React.cloneElement(this.props.children, { radio: radio }) }
			</div>
		);
	}


	/*
	 * Add a route-specific class modifiers on the wrapper.
	 * TODO: get route name to clean up this method.
	 */
	getClassName() {
		var { pathname } = this.props.location
		return classNames({
			'wrapper': true,
			'atl-route--welcome_index': (['/', '/welcome'].indexOf(pathname) > -1),
			'atl-route--projects_index': (['/menu'].indexOf(pathname) > -1),
			'atl-route--projects_show': (['/', '/welcome', '/menu'].indexOf(pathname) === -1)
		});
	}


	/*
	 * 
	 *
	 */
	isHeaderTransparent() {
		var { pathname } = this.props.location
		if (['/', '/welcome'].indexOf(pathname) > -1) { return true; }
		return false;
	}


	/*
	 * 
	 *
	 */
	getHeaderTitle() {
		var { pathname } = this.props.location
		if (['/', '/welcome'].indexOf(pathname) > -1) { return 'New America'; }
		return 'Atlas';
	}

}

export default connect(state => ({ routing: state.routing }))(Layout)