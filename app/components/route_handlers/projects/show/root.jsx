import React from 'react'
import classNames from 'classnames'

import Tilemap from './tilemap/root.jsx'
import Explainer from './explainer/root.jsx'

import Loader from './../../../general/loader.jsx'
import SideBar from './../../../general/side_bar.jsx'

import * as project from './../../../../models/project.js'
import buttonsDataGenerator from './buttons_data_generator.js'

/*
 *
 *
 */
class Show extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
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
				isHelpActive: false,
				isMapDragging: false,
				isOptionsTabActive: false
			},
			buttons: []
		}
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className={ this.getClassName() }>
				<SideBar 
					radio={ this.props.radio } 
					project={ this.state.project } 
					sendMessageToParent={ this.handleMessageFromButtons.bind(this) }
					uiState={ this.state.ui }
					setUiState={ this.setUiState.bind(this) }
					buttons={ this.state.buttons }
				/>
				{ this.renderProject() }
			</div>
		);
	}


	/*
	 * Pick and render template-specific project.
	 *
	 */
	renderProject() {
		var { project } = this.state
		if (!project) { return <Loader /> }
		var Comp = (this._isModelTilemap()) ? Tilemap : Explainer
		return (
			<Comp
				radio={this.props.radio} 
				uiState={ this.state.ui } 
				setUiState={ this.setUiState.bind(this) } 
				project={ this.state.project } 
				related={ this.state.related } 
			/>
		);
	}


	/*
	 *
	 *
	 */
	componentWillMount() {
		this.fetchProject()
	}


	/*
	 * If the project just loaded, update the side bar links with appropriate project data.
	 *
	 */
	componentWillUpdate(nextProps, nextState) {
		if (this.state.project) { return }
		if (nextState.project) {
			this.setState({ buttons: buttonsDataGenerator(nextState.project, global.window.isResearcherAuthenticated, this.state.ui.isCollapsedDueToOverflow) })
		}
	}


	/*
	 * This is a method passed down to all deep children so they can modify the state of the ui.
	 * TODO: re-write without object mutation.
	 */
	setUiState(uiStateChanges) {
		var currentUiState = this.state.ui
		for (let key in uiStateChanges) {
			currentUiState[key] = uiStateChanges[key]
		}
		this.forceUpdate()
	}


	/*
	 * This method is bound to the component and passed to the side bar buttons subcomponent that call it with a message. Each type of message is handled appropriately.
	 *
	 */
	handleMessageFromButtons(message) {

		if (message === 'toggle-search-bar') {
			return this.setUiState({ isSearchBarActive: !this.state.ui.isSearchBarActive });
		} 

		if (message === 'toggle-collapsed-state') {
			this.state.ui.isCollapsedMaster = !this.state.ui.isCollapsedMaster;
			return this.forceUpdate();
		} 

		if (message === 'toggle-help') {
			this.state.ui.isHelpActive = !this.state.ui.isHelpActive;
			return this.forceUpdate();
		}

		if (message === 'print' && global.window) {
			global.window.print()
		}

	}


	/*
	 * Get side bar buttons.
	 *
	 */
	getButtons() {
		if (!global.window) { return }
		return buttonsDataGenerator(this.state.project, global.window.isResearcherAuthenticated, this.state.ui.isCollapsedDueToOverflow)
	}


	/*
	 *
	 *
	 */
	getClassName() {

		var cls, data, { project } = this.state

		data = (project != null) ? project.get('data') : null;

		// boolean classnames
		cls = classNames({
			'atl': true,
			'atl--help': this.state.ui.isHelpActive,
			'atl--collapsed': (this.state.ui.isCollapsedMaster) || (!this.state.ui.isCollapsedMaster && this.state.ui.isCollapsedDueToOverflow),
			'atl__info-box--active': this.state.ui.isInfoBoxActive,
			'atl__info-box--narrow': data && (data.variables.getInfoBoxVariableCount() < 2)
		});

		return cls;

	}


	/*
	 *
	 *
	 */
	_isModelTilemap() {
		var { project } = this.state
		if (!project) { return false }
		return (project.get('project_template_name') === 'Tilemap')
	}


	/*
	 * Send separate network request fetching related projects.
	 *
	 */
	fetchRelatedProjects() {

		var prj = this.state.project

		new project.Collection()
			.getClientFetchPromise({ 
				related_to: prj.get('id'),
				special_query_params: 'related_to'
			}, {
				data: 0,
				body_text: 0,
				encoded_image: 0
			})
			.then((coll) => {
				this.setState({ related: coll });
			}).catch((err) => { console.log(err); });

	}


	/*
	 * Send network request to get project data.
	 *
	 */
	fetchProject() {

		var atlas_url = this.getAtlasUrl();

		new project.Collection()
			.getClientFetchPromise({ atlas_url: atlas_url })
			.then((coll) => {
				var project = coll.models[0];
				if (project && project.exists()) {
					project.prepOnClient();
					this.setState({ project: project });
					this.fetchRelatedProjects();
				} else {
					// Redirect to listings page.
					this.props.history.pushState(null, '/menu')
				}
			}).catch((err) => { 
				console.error('Project error: ', err.stack)
			});

	}


	/*
	 * Get project's atlas URL either from props or from props passed from router.
	 *
	 */
	getAtlasUrl() {
		return this.props.atlas_url || this.props.params.atlas_url
	}


}

export default Show