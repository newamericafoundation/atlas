// Entry point to client-side app.

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import routes from './../../routes/client.jsx'

// Import and configure global libraries
import $ from 'jquery'
import selectize from 'selectize'
import Chartist from 'chartist'
import chroma from 'chroma-js'
import numeral from 'numeral'
import ChartistHtml from 'chartist-html'

import './library_config.js'

global.$ = $
global.chroma = chroma
global.numeral = numeral
global.Chartist = Chartist
global.ChartistHtml = ChartistHtml
global.selectize = selectize

// Set up client router.
var clientRouter = (
	<Router history={createBrowserHistory()}>
		{ routes }
	</Router>
)

// App entry point.
global.startAtlas = () => {
	// Developer signature :).
	console.log('Hi, Mom!')
	var container = global.document.getElementById('site')
	ReactDOM.render(clientRouter, container)
}