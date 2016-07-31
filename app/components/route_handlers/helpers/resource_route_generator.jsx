import React from 'react'

import { Route } from 'react-router'

import NewBase from './../../crud/new_base.js'
import EditBase from './../../crud/edit_base.js'
import DeleteBase from './../../crud/delete_base.js'

/*
 * Generates react-router routes for CRUD operations on a single resource.
 *
 */
export default function(Model) {

	/*
	 *
	 *
	 */
	class New extends NewBase {
		getResourceConstructor() { return Model }
	}


	/*
	 *
	 *
	 */
	class Edit extends EditBase {
		getResourceConstructor() { return Model }
	}


	/*
	 *
	 *
	 */
	class Delete extends DeleteBase {
		getResourceConstructor() { return Model }
	}


	/*
	 *
	 *
	 */
	class Wrapper extends React.Component {
		render() { return (<div className='fill-parent'>{ this.props.children }</div>); }
	}


	var rootRouteName = `admin/${Model.prototype.resourceName}s`

	return (
		<Route path={rootRouteName} component={Wrapper}>
			<Route path='new' component={New} />
			<Route path=':id/edit' component={Edit} />
			<Route path=':id/delete' component={Delete} />
		</Route>
	)

}