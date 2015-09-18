import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler, Redirect } from 'react-router';

import classNames from 'classnames';

import Layout from './../components/layout.jsx';

import Welcome from './../components/route_handlers/welcome/root.jsx';
import ProjectsIndex from './../components/route_handlers/projects/index/root.jsx';
import ProjectsShow from './../components/route_handlers/projects/show/root.jsx';
import ProjectsNew from './../components/route_handlers/projects/new/root.jsx';
import ProjectsEdit from './../components/route_handlers/projects/edit/root.jsx';
import ProjectsDelete from './../components/route_handlers/projects/delete/root.jsx';

import ImagesIndex from  './../components/route_handlers/images/index/root.jsx';
import ImagesNew from  './../components/route_handlers/images/new/root.jsx';
import ImagesEdit from './../components/route_handlers/images/edit/root.jsx';


// Main route definition.
var routes = (
	<Route handler={Layout}>

		<Route name='welcome' path='welcome' handler={Welcome} />
		<Redirect from='/' to='welcome' />

		<Route path='projects'>
			<Route name='projects_new' path='new' handler={ProjectsNew} />
			<Route name='projects_edit' path=':id/edit' handler={ProjectsEdit} />
			<Route name='projects_delete' path=':id/delete' handler={ProjectsDelete} />
		</Route>

		<Route path='images'>
			<Route name='images_index' path='all' handler={ImagesIndex} />
			<Route name='images_new' path='new' handler={ImagesNew} />
			<Route name='images_edit' path=':id/edit' handler={ImagesEdit} />
			{/* <Route name='images_delete' path=':id/delete' handler={ProjectsDelete} /> */}
		</Route>

		<Route name='projects_index' path='menu' handler={ProjectsIndex} />
		<Route name='projects_show' path=':atlas_url' handler={ProjectsShow} />

	</Route>
);

export default routes;