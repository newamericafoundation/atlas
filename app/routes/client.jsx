import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import { Provider } from 'react-redux'

import { createStore, combineReducers } from 'redux'

import classNames from 'classnames'

import { createHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import Layout from './../components/layout.jsx'

import Welcome from './../components/route_handlers/welcome/root.jsx'

import ProjectsIndex from './../components/route_handlers/projects/index/root.jsx'
import ProjectsShow from './../components/route_handlers/projects/show/root.jsx'

import ImagesIndex from  './../components/route_handlers/images/index/root.jsx'

import resourceRouteGenerator from './../components/route_handlers/helpers/resource_route_generator.jsx'

import models from './../models/index.js'

const reducer = combineReducers({ routing: routeReducer })
const store = createStore(reducer)

// Main route definition.
var clientRouter = (
	<Provider store={store}>
		<Router history={createHistory()}>
			<Route path='/' component={Layout}>
				<IndexRoute component={Welcome} />
				<Route path='admin/images/all' component={ImagesIndex} />
				{ resourceRouteGenerator(models.project.Model) }
				{ resourceRouteGenerator(models.image.Model) }
				<Route path='menu' component={ProjectsIndex} />
				<Route path=':atlas_url' component={ProjectsShow} />
			</Route>
		</Router>
	</Provider>
)

export default clientRouter