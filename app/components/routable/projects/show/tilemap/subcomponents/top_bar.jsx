Comp.Projects.Show.Tilemap.TopBar = class extends React.Component {

	render() {
		return (
			<div className="atl__top-bar">
				<div className="atl__top-bar__content">
					<div className="atl__top-bar__icons"></div>
					<div className="atl__top-bar__timeline"></div>
					<div className="atl__top-bar__summary">
						<div>{ this.getName() }</div>
					</div>
				</div>
			</div>
		);
	}

	getName() {
		var hoveredItem = this.getHoveredItem();
		if (hoveredItem == null) { return; }
		return hoveredItem.get('name');
	}

	getHoveredItem() {
		return this.props.project.get('data').items.hovered;
	}

	getBackgroundColorClass() {
		var App, filter, hoveredItem, indeces, cls;
		App = this.props.App;
		filter = this.props.project.get('data').filter;
		hoveredItem = this.getHoveredItem();
		indeces = filter.getFriendlyIndeces(hoveredItem, 15);
		cls = `bg-c-${indeces[0]}`;
		return cls;
	}

}