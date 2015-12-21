import React from 'react'
import Link from 'react-router'

/*
 * Pure function component for a related item.
 *
 */
function RelatedItem(props) {

	var { relatedItem } = props
	return (
		<Link className="link" to={`/${item.get('atlas_url')}`}>
			{ item.get('title') }
		</Link>
	)

}


export default RelatedItem