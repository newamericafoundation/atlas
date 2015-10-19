import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler, Redirect } from 'react-router';

import Setup from './general/setup.jsx';
import Header from './general/header.jsx';

import classNames from 'classnames';

import Backbone from 'backbone';

/*
 * Create radio object with the same fields as a Marionette Application object.
 * This is a temporary setup to support the Marionette transition.
 */
function createRadio() {
	var radio = {};
	radio.vent = new Backbone.Wreqr.EventAggregator();
	radio.reqres = new Backbone.Wreqr.RequestResponse();
	radio.commands = new Backbone.Wreqr.Commands();
	return radio;
}

var radio = createRadio();

class Layout extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className={this.getClassName()}>
				<Setup radio={radio} />
				<Header radio={radio} title={this.getHeaderTitle()} isTransparent={this.isHeaderTransparent()} />
				{ React.cloneElement(this.props.children, { radio: radio }) }
			</div>
		);
	}


	getPath() {
		// var pth = this.props.state.path;
		var pth = this.props.location.pathname;
		return pth;
	}

	/*
	 * Add a route-specific class modifiers on the wrapper.
	 * TODO: get route name to clean up this method.
	 */
	getClassName() {
		var pth = this.getPath();
		return classNames({
			'wrapper': true,
			'atl-route--welcome_index': (['/', '/welcome'].indexOf(pth) > -1),
			'atl-route--projects_index': (['/menu'].indexOf(pth) > -1),
			'atl-route--projects_show': (['/', '/welcome', '/menu'].indexOf(pth) === -1)
		});
	}


	/*
	 * 
	 *
	 */
	isHeaderTransparent() {
		var pth = this.getPath();
		if (['/', '/welcome'].indexOf(pth) > -1) { return true; }
		return false;
	}


	/*
	 * 
	 *
	 */
	getHeaderTitle() {
		var pth = this.getPath();
		if (['/', '/welcome'].indexOf(pth) > -1) { return 'New America'; }
		return 'Atlas';
	}

}

export default Layout;