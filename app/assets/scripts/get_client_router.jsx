import React from 'react'
import classNames from 'classnames'
import { Router, Route, IndexRoute, match, RouterContext } from 'react-router'

import { Provider } from 'react-redux'

import { createStore, combineReducers } from 'redux'

import { createHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import clientRoutes from './../../routes/client_routes.jsx'
import appReducer from './../../reducers/index.js'

const reducer = combineReducers({ 
	routing: routeReducer,
	app: appReducer
})


// Main router definition.
export default function getClientRouter() {

	var store = createStore(reducer, window.STATE_FROM_SERVER || {})
	var history = createHistory()
	syncReduxAndRouter(history, store)

	return (
		<Provider store={store}>
			<Router history={history}>
				{ clientRoutes }
			</Router>
		</Provider>
	)
}