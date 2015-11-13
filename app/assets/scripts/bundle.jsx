// Entry point to client-side app.

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import $ from 'jquery'
import selectize from 'selectize'
import Chartist from 'chartist'

import chroma from 'chroma-js'
import numeral from 'numeral'

import './bundle_config.jsx'

import routes from './../../routes/client.jsx'

var clientRouter = (
	<Router history={createBrowserHistory()}>
		{ routes }
	</Router>
)

function start() {
	// Developer signature :).
	console.log('Hi, Mom!')
	ReactDOM.render(clientRouter, global.document.getElementById('site'))
}

global.$ = $
global.chroma = chroma
global.numeral = numeral

global.atlas = {
	start: start
}