// Entry point to client-side app.

import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler, Redirect } from 'react-router';

import classNames from 'classnames';

import routes from './../../routes/client.jsx';

function start() {
	var isFirstRoute = true;

	// Developer signature :).
	console.log('Hi, Mom!');

	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		if (isFirstRoute) {
			// fetch data for the first route to be rendered
		}
		isFirstRoute = false;
		React.render(<Root App={global.Atlas} state={state} />, $('#site')[0]);
	});
};

global.Comp = {
	start: start
};

export default start;