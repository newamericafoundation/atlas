// Entry point to client-side app.

import './../styles/app.scss'

import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'

import createBrowserHistory from 'history/lib/createBrowserHistory'

import clientRouter from './../../routes/client.jsx'

// Import global libraries
import $ from 'jquery'
import selectize from 'selectize'
import Chartist from 'chartist'
import chroma from 'chroma-js'
import numeral from 'numeral'
import ChartistHtml from 'chartist-html'

// Configure libraries
import './library_config.js'

global.$ = $
global.chroma = chroma
global.numeral = numeral
global.Chartist = Chartist
global.ChartistHtml = ChartistHtml
global.selectize = selectize

// App entry point.
global.startAtlas = () => {
	// Developer signature :).
	console.log('Hi, Mom!')
	var container = global.document.getElementById('site')
	render(clientRouter, container)
}