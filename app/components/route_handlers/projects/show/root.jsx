import React from 'react';
import classNames from 'classnames';

import Tilemap from './tilemap/root.jsx';
import Explainer from './explainer/root.jsx';

import Loading from './../../../general/loading.jsx';
import SideBar from './../../../general/side_bar.jsx';

import project from './../../../../models/project.js';
import buttonsDataGenerator from './buttons_data_generator.js';

class Show extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ui: {
				specifier: '2012', // if time-dependent data is visualized, this field holds the active specifier, such as the year
				searchTerm: '',
				isSearchBarActive: false,
				itemsDisplayMode: 'map',
				isCollapsedDueToOverflow: false, // depends on screen size
				isCollapsedMaster: false, // master toggle
				isInfoBoxActive: false, // stores whether the info box is active
				isInfoBoxNarrow: false, // stores whether the info box is narrow
				isMapDragging: false,
				isOptionsTabActive: false
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
		return (
			<div className={ this.getClassName() }>
				<SideBar 
					App={ this.props.App } 
					project={ this.state.project } 
					sendMessageToParent={ this.handleMessageFromButtons.bind(this) }
					uiState={ this.state.ui }
					setUiState={ this.setUiState.bind(this) }
					buttons={ this.getButtons() }
				/>
				{ this.renderProject() }
			</div>
		);
	}

	handleMessageFromButtons(message) {
		if (message === 'toggle-search-bar') {
			this.setUiState({ isSearchBarActive: !this.state.ui.isSearchBarActive });
		} else if (message === 'toggle-collapsed-state') {
			this.state.ui.isCollapsedMaster = !this.state.ui.isCollapsedMaster;
			this.forceUpdate();
		} else if (message === 'toggle-help') {
			if ($ == null) { return; }
			$('.atl').toggleClass('atl--help');
		} else if (message === 'print') {
			window.print();
		}
	}

	getButtons() {
		return buttonsDataGenerator(this.state.project, window.isResearcherAuthenticated, this.state.ui.isCollapsedDueToOverflow);
	}

	getClassName() {

		var cls, project, data;

		project = this.state.project;
		data = (project != null) ? project.get('data') : null;

		// boolean classnames
		cls = classNames({
			'atl': true,
			'atl--collapsed': (this.state.ui.isCollapsedMaster) || (!this.state.ui.isCollapsedMaster && this.state.ui.isCollapsedDueToOverflow),
			'atl__info-box--active': this.state.ui.isInfoBoxActive,
			'atl__info-box--narrow': data && (data.variables.getInfoBoxVariableCount() < 2)
		});

		return cls;

	}

	// Pick and render template-specific project.
	renderProject() {
		if (this.state.project == null) { return <Loading />; }
		var Comp = (this._isModelTilemap()) ? Tilemap : Explainer;
		return (
			<Comp
				App={this.props.App} 
				uiState={ this.state.ui } 
				setUiState={ this.setUiState.bind(this) } 
				project={ this.state.project } 
				related={ this.state.related } 
			/>
		);
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

		var prj = this.state.project;

		new project.Collection()
			.getClientFetchPromise({ 
				related_to: prj.get('id') 
			})
			.then((coll) => {
				this.setState({ related: coll });
			});

	}

	// Send network request to get project data.
	fetchProject() {

		var atlas_url = this.getAtlasUrl();

		new project.Collection()
			.getClientFetchPromise({ 
				atlas_url: atlas_url 
			})
			.then((coll) => {
				var project = coll.models[0];
				if (project && project.exists()) {
					project.prepOnClient();
					this.setState({ project: project });
					this.fetchRelatedProjects();
				}
			});

	}

	getAtlasUrl() {
		return this.props.atlas_url || this.props.params.atlas_url;
	}

	getEditUrl() {
		var project = this.state.project;
		if (project) { return project.getViewUrl(); }
	}

	componentDidMount() {
		// View is rendered before current project is synced.
		var App = this.props.App;
		if (App == null) { return; }
		this.fetchProject();
	}

}

Show.contextTypes = {
	router: React.PropTypes.func
};

export default Show;