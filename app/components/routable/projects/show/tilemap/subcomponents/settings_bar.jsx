Comp.Projects.Show.Tilemap.SettingsBar = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dummy: 'dummy'
		};
		this.heights = {
			window: 0,
			headline: 0,
			filter: 0,
			header: 80
		};
		this.shouldCheckCollapse = true;
	}

	render() {
		return (
			<div className='atl__settings-bar' ref='root'>
				<Comp.Projects.Show.Tilemap.Headline {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'headline') } />
				<Comp.Projects.Show.Tilemap.DisplayToggle {...this.props} />
				<Comp.Projects.Show.Tilemap.Search {...this.props} />
				<Comp.Projects.Show.Tilemap.Filter {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'filter') } filter={ this.getFilter() } />
			</div>
		);
		
	}

	componentWillMount() {
		this.checkOverflow();
		$(window).on('resize', () => {
			this.checkOverflow();
		});
	}

	componentWillUpdate() {
		this.checkOverflow();
	}

	checkOverflow() {
		var totalHeight, isCollapsed,
			App = this.props.App;
		if (App == null) { return; }
		this.heights.window = $(window).height();
		totalHeight = this.heights.headline + this.heights.filter + this.heights.header;
		isCollapsed = totalHeight > this.heights.window;
		// if (App.uiState.isCollapsed !== isCollapsed) {
		// 	App.uiState.isCollapsed = isCollapsed;
		// }
		if (this.props.uiState.isCollapsed !== isCollapsed) {
			this.props.setUiState({ isCollapsed: isCollapsed });
		}
	}

	cacheHeight(elementName, height) {
		this.heights[elementName] = height;
	}

	getFilter() {
		return this.props.project.get('data').filter;
	}

}