import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler, Redirect } from 'react-router';

import Setup from './general/setup.jsx';
import Header from './general/header.jsx';

import classNames from 'classnames';

class Layout extends React.Component {

	render() {
		return (
			<div className={this.getClassName()}>
				<Setup {...this.props} />
				<Header {...this.props} theme={this.getHeaderTheme()} />
				<RouteHandler {...this.props} />
			</div>
		);
	}

	/*
	 * Apply a route-specific class name on the wrapper.
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

	getHeaderTheme() {
		var pth = this.props.state.path;
		if (['/', '/welcome'].indexOf(pth) > -1) { return undefined; }
		return 'atlas';
	}

}

export default Layout;