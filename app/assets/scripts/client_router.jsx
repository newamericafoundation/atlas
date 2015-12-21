import React from 'react'
import classNames from 'classnames'
import { Router, Route, IndexRoute, match, RouterContext } from 'react-router'

import { Provider } from 'react-redux'

import { createStore, combineReducers } from 'redux'

import { createHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

const reducer = combineReducers({ routing: routeReducer })
const store = createStore(reducer)

const history = createHistory()

syncReduxAndRouter(history, store)

import clientRoutes from './../../routes/client_routes.jsx'

// Main router definition.
var clientRouter = (
	<Provider store={store}>
		<Router history={history}>
			{ clientRoutes }
		</Router>
	</Provider>
)

export default clientRouter