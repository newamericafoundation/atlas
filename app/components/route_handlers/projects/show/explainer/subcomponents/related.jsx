import React from 'react';
import classNames from 'classnames';

class Related extends React.Component {

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

class RelatedItem extends React.Component {

	render() {
		var item = this.props.relatedItem;
		return (
			<a className="link" href={"/" + item.get('atlas_url')} onClick={ this.navigate.bind(this) }>
				{ item.get('title') }
			</a>
		);
	}

	navigate(e) {
		e.preventDefault()
		var item = this.props.relatedItem;
		Backbone.history.navigate((`/${item.get('atlas_url')}`), { trigger: true });
	}

}

export default Related;