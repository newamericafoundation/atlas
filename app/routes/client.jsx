import React from 'react';

import { Router, Route, IndexRoute } from 'react-router';

import classNames from 'classnames';

import Layout from './../components/layout.jsx';

import Welcome from './../components/route_handlers/welcome/root.jsx';

import ProjectsIndex from './../components/route_handlers/projects/index/root.jsx';
import ProjectsShow from './../components/route_handlers/projects/show/root.jsx';

import ImagesIndex from  './../components/route_handlers/images/index/root.jsx';

import resourceRouteGenerator from './../components/route_handlers/helpers/resource_route_generator.jsx';

import * as models from './../models/index.js';

var isomorphicConfig = {
	'menu': {
		fetchData: [
			{	
				key: 'projects',
				apiUrl: '/api/v1/projects'
			}
		]
	},
	':atlas_url': {
		fetchData: [
			{
				key: 'project',
				apiUrl: (req) => {
					return `/api/v1/projects?atlas_url=${req.params.atlas_url}`;
				}
			}
		]
	}
};

// Main route definition.
var routes = (
	<Route path='/' component={Layout}>

		<IndexRoute component={Welcome} />

		<Route path='admin/images/all' component={ImagesIndex} />

		{ resourceRouteGenerator(models.project.Model) }

		{ resourceRouteGenerator(models.image.Model) }

		<Route path='menu' component={ProjectsIndex} />
		<Route path=':atlas_url' component={ProjectsShow} />

	</Route>
);

export default routes;