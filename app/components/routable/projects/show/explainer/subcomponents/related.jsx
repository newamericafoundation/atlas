Comp.Projects.Show.Explainer.Related = class extends React.Component {

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
			var Cmp = Comp.Projects.Show.Explainer.RelatedItem;
			return (
				<li key={'related-' + i}>
					<Cmp relatedItem={item} />
				</li>
			);
		});
	}

	isListEmpty() {
		var relatedItems = this.props.related;
		console.log(relatedItems);
		if (relatedItems == null) { return true; }
		return (relatedItems.length === 0);
	}

}

Comp.Projects.Show.Explainer.RelatedItem = class extends React.Component {

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