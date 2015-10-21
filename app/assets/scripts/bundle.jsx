// Entry point to client-side app.

import React from 'react';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import { Router } from 'react-router';

import routes from './../../routes/client.jsx';

var clientRouter = (
	<Router history={createBrowserHistory()}>
		{ routes }
	</Router>
);

function start() {

	// Developer signature :).
	console.log('Hi, Mom!');

	ReactDOM.render(clientRouter, global.document.getElementById('site'));

};

global.atlas = {
	start: start
};