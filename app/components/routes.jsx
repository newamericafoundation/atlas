import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler } from 'react-router';

import classNames from 'classnames';

import Setup from './general/setup.jsx';
import Header from './general/header.jsx';
import Welcome from './route_handlers/welcome/root.jsx';

import ProjectsIndex from './route_handlers/projects/index/root.jsx';
import ProjectsShow from './route_handlers/projects/show/root.jsx';
import ProjectsNew from './route_handlers/projects/new/root.jsx';
import ProjectsEdit from './route_handlers/projects/edit/root.jsx';

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

var routes = (
	<Route handler={Layout}>
		<Route path='' handler={Welcome} />
		<Route path='projects'>
			<Route path='new' handler={ProjectsNew} />
			<Route path=':id/edit' handler={ProjectsEdit} />
		</Route>
		<Route path='welcome' handler={Welcome} />
		<Route path='menu' handler={ProjectsIndex} />
		<Route path=':atlas_url' handler={ProjectsShow} />
	</Route>
);

function start() {
	console.log('Hi, Mom!');
	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		React.render(<Root App={global.Atlas} state={state} />, $('#site')[0]);
	});
};

global.Comp = {
	start: start
};

export default start;