// Entry point to client-side app.

import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'react-router';

import routes from './../../routes/client.jsx';


function start() {

	// Developer signature :).
	console.log('Hi, Mom!');

	ReactDOM.render(routes, global.document.getElementById('site'));

};

global.atlas = {
	start: start
};