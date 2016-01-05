// Entry point to client-side app.

import './../styles/app.scss'

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

import clientRouter from './client_router.jsx'

// Import global libraries
import $ from 'jquery'
import Chartist from 'chartist'
import chroma from 'chroma-js'
import numeral from 'numeral'
import ChartistHtml from 'chartist-html'
import selectize from 'selectize'

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