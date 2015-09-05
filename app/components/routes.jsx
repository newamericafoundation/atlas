import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler } from 'react-router';

import Setup from './general/setup.jsx';
import Header from './general/header.jsx';
import Welcome from './route_handlers/welcome/root.jsx';

import Index from './route_handlers/projects/index/root.jsx';
import Show from './route_handlers/projects/show/root.jsx';
import New from './route_handlers/projects/new/root.jsx';

class Layout extends React.Component {

	render() {
		return (
			<div className='wrapper'>
				<Setup {...this.props} />
				<Header {...this.props} />
				<RouteHandler {...this.props} />
			</div>
		);
	}

}

var routes = (
	<Route handler={Layout}>
		<Route path='' handler={Welcome} />
		<Route path='projects'>
			<Route path='new' handler={New} />
		</Route>
		<Route path='welcome' handler={Welcome} />
		<Route path='menu' handler={Index} />
		<Route path=':atlas_url' handler={Show} />
	</Route>
);

function start() {
	console.log('Hi, Mom!');
	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		React.render(<Root App={global.Atlas} />, $('#site')[0]);
	});
};

global.Comp = {
	start: start
};

export default start;