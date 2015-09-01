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
		var key,
			currentUiState = this.state.ui;
		for (key in uiStateChanges) {
			currentUiState[key] = uiStateChanges[key];
		}
		this.forceUpdate();
	}

	render() {
		return (
			<div className={ this.getClassName() }>
				<Comp.SideBar App={ this.props.App } project={ this.state.project } uiState={ this.state.ui } setUiState={ this.setUiState.bind(this) } />
				{ this.renderProject() }
			</div>
		);
	}

	getClassName() {

		var cls, project, data;

		cls = "atl";
		project = this.state.project;
		if (project == null) { return cls; }
		
		cls += ` atl--${this.state.ui.display}-display`;

		var isCollapsedByDimension = (this.state.ui.isCollapsed);
		if ((this.state.ui.isCollapsedMaster) || (!this.state.ui.isCollapsedMaster && isCollapsedByDimension)) {
			cls += ' atl--collapsed';
		}
		
		cls += ' atl--' + project.get('project_template_name').toLowerCase();

		if (this.state.ui.isInfoBoxActive) { 
			cls += ' atl__info-box--active' 
		}

		data = project.get('data');
		if ((data != null) && (data.infobox_variables.length < 2)) {
			cls += ' atl__info-box--narrow' ;
		}
		
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

		var	project = this.state.project;

		var coll = new M.project.Collection();
		var promise = coll.getClientFetchPromise({ related_to: project.get('id') });
		promise.then((coll) => {
			this.setState({ related: coll });
		});

	}

	// Send network request to get project data.
	fetchProject() {

		var atlas_url = this.props.atlas_url || this.props.params.atlas_url;

		var coll = new M.project.Collection();
		var promise = coll.getClientFetchPromise({ atlas_url: atlas_url });
		promise.then((coll) => {
			console.log(coll);
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