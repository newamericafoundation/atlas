// Entry point to client-side app.

import React from 'react';
import Router from 'react-router';

import Backbone from 'backbone';
import 'marionette';

import { Route, RouteHandler, Redirect } from 'react-router';

import classNames from 'classnames';

import shapeFile from './../../models/shape_file.js';

import routes from './../../routes/client.jsx';

function start() {
	var isFirstRoute = true;

	var radio = new Backbone.Marionette.Application();

	// Developer signature :).
	console.log('Hi, Mom!');

	Router.run(routes, Router.HistoryLocation, (Root, state) => {
		React.render(<Root radio={radio} state={state} />, $('#site')[0]);
	});
};

global.Comp = {
	start: start
};

global.M = {
	shapeFile: shapeFile
}

// new shapeFile.Collection().models[0].getClientFetchPromise().then((data) => { console.log(data); })

export default start;