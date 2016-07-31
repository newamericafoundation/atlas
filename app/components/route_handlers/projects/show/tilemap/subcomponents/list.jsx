import React from 'react'
import classNames from 'classnames'

import Base from './base.jsx'


/*
 * List view component. 
 * NOT YET USED IN PRODUCTION
 * @extends {class} Base - Base class storing shared functionality in tilemap components.
 */
class List extends Base {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__list fill-parent bg-c-off-white'>
				{ this.renderItems() }
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderItems() {
		var { project } = this.props
		if (!project) { return }
		return project.get('data').items.map((item, i) => {
			return (
				<p key={i}>{ item.get('name') }</p>
			)
		})
	}

}

export default List