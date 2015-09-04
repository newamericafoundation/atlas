(function() {

var defaultButtons = [
	{ 
		title: 'Explore Atlas',
		contentType: 'inner-link',
		url: '/menu',
		method: 'projects', 
		reactIconName: 'Grid', 
		isToggleable: false 
	},
	{ 
		title: 'Collapse/Expand',
		contentType: 'button',
		method: 'collapse', 
		reactIconName: 'Contract', 
		activeReactIconName: 'Expand', 
		isToggleable: false 
	},
	{ 
		title: 'Help',
		contentType: 'button',
		method: 'help', 
		reactIconName: 'Help', 
		isToggleable: false 
	},
	{ 
		title: 'Print',
		contentType: 'button',
		method: 'print', 
		reactIconName: 'Print', 
		isToggleable: false 
	},
	{ 
		title: 'Download Data',
		contentType: 'form',
		hiddenInputKey: 'atlas_url',
		hiddenInputValue: '',
		url: '/api/v1/projects/print',
		method: 'download',
		reactIconName: 'Download',
		isToggleable: false
	}
];

Comp.Projects.Show = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ui: {
				currentSpecifier: '2012', // if time-dependent data is visualized, this field holds the active specifier, such as the year
				display: 'filter', // display type, e.g. filter or search
				itemsDisplayMode: 'map',
				isCollapsed: false, // depends on screen size
				isCollapsedMaster: false, // master toggle
				isInfoBoxActive: false, // stores whether the info box is active
				isInfoBoxNarrow: false // stores whether the info box is narrow
			}
		};
	}

	// This is a method passed down to all deep children so they can modify the state of the ui.
	setUiState(uiStateChanges) {
		var currentUiState = this.state.ui;
		for (let key in uiStateChanges) {
			currentUiState[key] = uiStateChanges[key];
		}
		this.forceUpdate();
	}

	render() {
		defaultButtons[4].hiddenInputValue = this.getAtlasUrl();
		return (
			<div className={ this.getClassName() }>
				<Comp.SideBar 
					App={ this.props.App } 
					project={ this.state.project } 
					uiState={ this.state.ui } 
					setUiState={ this.setUiState.bind(this) }
					buttons={ defaultButtons }
				/>
				{ this.renderProject() }
			</div>
		);
	}

	getClassName() {

		var cls, project, data;

		project = this.state.project;
		data = (project != null) ? project.get('data') : null;

		// boolean classnames
		cls = classNames({
			'atl': true,
			'atl--collapsed': (this.state.ui.isCollapsedMaster) || (!this.state.ui.isCollapsedMaster && this.state.ui.isCollapsed),
			'atl__info-box--active': this.state.ui.isInfoBoxActive,
			'atl__info-box--narrow': data && (data.infobox_variables.length < 2)
		});

		// custom classnames
		cls += ` atl--${this.state.ui.display}-display`;
		if (project != null) { cls += ' atl--' + project.get('project_template_name').toLowerCase(); }
		
		return cls;

	}

	// Pick and render template-specific project.
	renderProject() {
		var LoadingComp = Comp.Loading,
			ExplainerComp = Comp.Projects.Show.Explainer,
			TilemapComp = Comp.Projects.Show.Tilemap;
		if (this.state.project == null) { return <LoadingComp />; }
		if (this._isModelStatic()) {
			return <ExplainerComp 
				App={this.props.App} 
				uiState={ this.state.ui } 
				setUiState={ this.setUiState.bind(this) } 
				project={ this.state.project } 
				related={ this.state.related } 
			/>
		}
		if (this._isModelTilemap()) {
			return <TilemapComp 
				App={this.props.App} 
				uiState={ this.state.ui } 
				setUiState={ this.setUiState.bind(this) } 
				project={ this.state.project } 
			/>
		}
		return <LoadingComp />;
	}

	_isModelStatic() {
		var project = this.state.project;
		if (project == null) { return false; }
		return ([ "Explainer", "Polling", "Policy Brief", "PolicyBrief" ].indexOf(project.get('project_template_name')) > -1);
	}

	_isModelTilemap() {
		var project = this.state.project;
		if (project == null) { return false; }
		return (project.get('project_template_name') === 'Tilemap');
	}

	// Send separate network request fetching related projects.
	fetchRelatedProjects() {

		var project;

		project = this.state.project;

		new M.project.Collection()
			.getClientFetchPromise({ 
				related_to: project.get('id') 
			})
			.then((coll) => {
				this.setState({ related: coll });
			});

	}

	// Send network request to get project data.
	fetchProject() {

		var atlas_url = this.getAtlasUrl();

		new M.project.Collection()
			.getClientFetchPromise({ 
				atlas_url: atlas_url 
			})
			.then((coll) => {
				var project = coll.models[0];
				if (project.exists()) {
					project.prepOnClient();
					this.setState({ project: project });
					this.fetchRelatedProjects();
				} else {
					Backbone.history.navigate('welcome', { trigger: true });
				}
			});

	}

	getAtlasUrl() {
		return this.props.atlas_url || this.props.params.atlas_url;
	}

	componentDidMount() {
		// View is rendered before current project is synced.
		var App = this.props.App;
		if (App == null) { return; }
		this.fetchProject();
	}

	componentWillUnmount() {
		var App = this.props.App;
	}

}


}());

