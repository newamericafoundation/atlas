import React from 'react'
import classNames from 'classnames'

import RealtedItem from './related_item.jsx'

class RelatedList extends React.Component {

	render() {
		if (this.isListEmpty()) { return (<div className="atl__related" />); }
		return (
			<div className="atl__related">
				<p>Related Pages</p>
				<ul>
					{ this.renderList() }
				</ul>
			</div>
		);
	}

	renderList() {
		var relatedItems = this.props.related;
		if (relatedItems == null) { return; }
		return relatedItems.map((item, i) => {
			return (
				<li key={'related-' + i}>
					<RelatedItem relatedItem={item} />
				</li>
			);
		});
	}

	isListEmpty() {
		var relatedItems = this.props.related;
		if (relatedItems == null) { return true; }
		return (relatedItems.length === 0);
	}

}

export default RelatedList