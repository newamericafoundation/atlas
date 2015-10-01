import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler, Redirect } from 'react-router';

import Setup from './general/setup.jsx';
import Header from './general/header.jsx';

import classNames from 'classnames';

class Layout extends React.Component {


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className={this.getClassName()}>
				<Setup {...this.props} />
				<Header {...this.props} title={this.getHeaderTitle()} isTransparent={this.isHeaderTransparent()} />
				<RouteHandler {...this.props} />
			</div>
		);
	}

	/*
	 * Add a route-specific class modifiers on the wrapper.
	 * TODO: get route name to clean up this method.
	 */
	getClassName() {
		var pth = this.props.state.path;
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
		var pth = this.props.state.path;
		if (['/', '/welcome'].indexOf(pth) > -1) { return true; }
		return false;
	}


	/*
	 * 
	 *
	 */
	getHeaderTitle() {
		var pth = this.props.state.path;
		if (['/', '/welcome'].indexOf(pth) > -1) { return 'New America'; }
		return 'Atlas';
	}

}

export default Layout;