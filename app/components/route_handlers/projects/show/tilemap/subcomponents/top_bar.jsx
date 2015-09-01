(function() {

}());

Comp.Projects.Show.Tilemap.TopBar = class extends React.Component {

	render() {
		var IconsComp = Comp.Projects.Show.Tilemap.TopBarIcons;
		return (
			<div className="atl__top-bar">
				<div className="atl__top-bar__content">
					<IconsComp {...this.props} />
					{ this.renderTimeline() }
					<div className="atl__top-bar__summary">
						<div>{ this.getName() }</div>
					</div>
				</div>
			</div>
		);
	}

	renderTimeline() {
		return;
		var SliderComp = Comp.Slider;
		return (
			<div className="atl__top-bar__timeline">
				<SliderComp {...this.props} values={[ '2003', '2004', '2005', '2006' ]} />
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


Comp.Projects.Show.Tilemap.TopBarIcons = class extends React.Component {

	render() {
		return (
			<div className="atl__top-bar__icons">
				<ul className='icons'>
					{ this.renderIcons() }
				</ul>
			</div>
		);
	}

	getIconData() {
		return [
			{
				id: 'map',
				reactIconName: 'List'
			},
			{
				id: 'list',
				reactIconName: 'List'
			},
			{
				id: 'graph',
				reactIconName: 'Graph'
			},
			{
				id: 'info',
				reactIconName: 'Dictionary'
			}
		];
	}

	renderIcons() {
		var IconComp = Comp.Projects.Show.Tilemap.TopBarIcon;
		return this.getIconData().map((icon) => {
			return (
				<IconComp {...this.props} icon={icon} />
			);
		});
	}

}

Comp.Projects.Show.Tilemap.TopBarIcon = class extends React.Component {

	render() {
		var Icon = Comp.Icons[this.props.icon.reactIconName];
		return (
			<li className={ 'icons__icon ' + this.getModifierClass() } onClick={this.changeGlobalItemsDisplayMode.bind(this)} >
				<Icon />
			</li>
		);
	}

	changeGlobalItemsDisplayMode() {
		this.props.setUiState({
			itemsDisplayMode: this.props.icon.id
		});
	}

	getModifierClass() {
		if (this.isActive()) { return 'icons__icon--active'; }
		return '';
	}

	isActive() {
		return (this.props.uiState.itemsDisplayMode === this.props.icon.id);
	}

}