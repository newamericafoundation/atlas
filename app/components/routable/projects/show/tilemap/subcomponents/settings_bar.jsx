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

	componentDidMount() {
		this.checkOverflow();
		$(window).on('resize', () => {
			this.forceUpdate();
		});
	}

	componentDidUpdate() {
		this.checkOverflow();
	}

	checkOverflow() {
		var totalHeight, isCollapsed;
		this.heights.window = $(window).height();
		totalHeight = this.heights.headline + this.heights.filter + this.heights.header;
		isCollapsed = totalHeight > this.heights.window;
		if (this.props.uiState.isCollapsed !== isCollapsed) {
			// TODO: solve infinite update loop
			// this.props.setUiState({ isCollapsed: isCollapsed });
		}
	}

	cacheHeight(elementName, height) {
		this.heights[elementName] = height;
	}

	getFilter() {
		return this.props.project.get('data').filter;
	}

}