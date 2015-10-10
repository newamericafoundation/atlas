// Entry point to client-side app.

import React from 'react';
import Router from 'react-router';

import Backbone from 'backbone';

import { Route, RouteHandler, Redirect } from 'react-router';

import classNames from 'classnames';

import routes from './../../routes/client.jsx';

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

function start() {
	var isFirstRoute = true;

	var radio = createRadio();

	// Developer signature :).
	console.log('Hi, Mom!');

	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		React.render(<Root radio={radio} state={state} />, $('#site')[0]);
	});
};

global.Comp = {
	start: start
};

export default start;