import { match, RoutingContext } from 'react-router'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import createHistory from 'history/lib/createMemoryHistory'

import clientRoutes from './../client_routes.jsx'

var { renderToString } = ReactDOMServer

// Create memory history.
var history = createHistory()
var { createLocation } = history

/*
 *
 *
 */
export default function matchReactComponent(req, res, next) {

	var { url } = req

	// If the url has a dot in it, the request was made for a file, in which case no rendering is required.
	if (url.indexOf('.') > -1) { return next() }

	var location = createLocation(url)

	// Remove later.
	var atlas_url = location.pathname.slice(1)

	console.log(atlas_url)

	match({ routes: clientRoutes, location: location }, (err, redirectLocation, renderProps) => {

		if (err != null || redirectLocation != null) {
			return next()
		}

		var { routes, params } = renderProps

		var lastRoute = routes[routes.length - 1]
		var firstRoute = routes[0]

		console.log(lastRoute)
		var { component } = lastRoute

		var reactOutput

		try {
			reactOutput = renderToString( React.createElement(component, params))
		} catch(e) {
			console.log('Could not render on the server.')
			reactOutput = ''
		}

		req.reactOutput = reactOutput
		next()
		
	})
}