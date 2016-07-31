import React from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'

import Tilemap from './tilemap/root.jsx'
import Explainer from './explainer/root.jsx'

import Loader from './../../../general/loader.jsx'
import SideBar from './../../../general/side_bar/root.jsx'

import models from './../../../../models/index.js'
import buttonsDataGenerator from './buttons_data_generator.js'


export default class Show extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			ui: {
				dataSpecifier: '2012', // if time-dependent data is visualized, this field holds the active specifier, such as the year
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
			}
		}
	}

	render() {
		return (
			<div className={ this.getClassName() }>
				<SideBar
					radio={ this.props.radio }
					project={ this.getProject() }
					sendMessageToParent={ this.handleMessageFromButtons.bind(this) }
					uiState={ this.state.ui }
					setUiState={ this.setUiState.bind(this) }
					buttons={ this.getButtons() }
				/>
				{ this.renderProject() }
			</div>
		)
	}

	renderProject() {
		var project = this.getProject()
		if (!project) { return <Loader /> }
		var Comp = (this._isModelTilemap()) ? Tilemap : Explainer
		return (
			<Comp
				app={this.props.app}
				radio={this.props.radio}
				uiState={ this.state.ui }
				setUiState={ this.setUiState.bind(this) }
				project={ project }
				related={ this.state.related }
			/>
		)
	}

	componentWillMount() {
		this.ensureData()
	}

	setUiState(uiStateChanges) {
		this.setState({ ui: Object.assign({}, this.state.ui, uiStateChanges) })
	}

	handleMessageFromButtons(message) {

		switch(message) {
			case 'toggle-search-bar':
				this.setUiState({ isSearchBarActive: !this.state.ui.isSearchBarActive })
				break
			case 'toggle-collapsed-state':
				this.setUiState({ isCollapsedMaster: !this.state.ui.isCollapsedMaster })
				break
			case 'toggle-help':
				this.setUiState({ isHelpActive: !this.state.ui.isHelpActive })
				break
			case 'print':
				global.window.print()
				break
			default:
				console.log('Unknown message from side bar buttons.')
		}

	}

	getButtons() {
		var project = this.getProject()
		if (!global.window) { return }
		var { authenticatedResearcher } = this.props
		var isResearcherAuthenticated = authenticatedResearcher.name && authenticatedResearcher.image
		return buttonsDataGenerator(project, isResearcherAuthenticated, this.state.ui.isCollapsedDueToOverflow)
	}

	getProject() {
		var { atlas_url } = this.props.params
		var { byUrl } = this.props.app.entities.projects
		if (!byUrl) { return }
		return byUrl[atlas_url]
	}

	getClassName() {

		var cls, data
		var project = this.getProject()

		data = (project != null) ? project.get('data') : null

		// boolean classnames
		return classNames({
			'atl': true,
			'atl--help': this.state.ui.isHelpActive,
			'atl--collapsed': (this.state.ui.isCollapsedMaster) || (!this.state.ui.isCollapsedMaster && this.state.ui.isCollapsedDueToOverflow),
			'atl__info-box--active': this.state.ui.isInfoBoxActive,
			'atl__info-box--narrow': data && (data.variables.getInfoBoxVariableCount() < 2)
		})

	}

	_isModelTilemap() {
		var project = this.getProject()
		if (!project) { return false }
		return (project.get('project_template_name') === 'Tilemap')
	}

	ensureData() {
		var project = this.getProject()
		if (!project) { this.fetchData() }
		else { this.fetchRelatedProjects() }
	}

	fetchRelatedProjects() {

		var prj = this.getProject()

		new models.project.Collection()
			.getClientFetchPromise({
				related_to: prj.get('id'),
				special_query_params: 'related_to'
			}, {
				data: 0,
				body_text: 0,
				encoded_image: 0
			})
			.then((coll) => {
				this.setState({ related: coll })
			}).catch((err) => { console.log(err); })

	}

	fetchData() {

		const { atlas_url } = this.props.params;

		return new models.project.Collection()
			.getClientFetchPromise({ atlas_url: atlas_url })
			.then((coll) => {
				var project = coll.models[0];
				if (project && project.exists()) {
					project.prepOnClient()
					this.props.dispatch({ type: 'FETCH_PROJECT_SUCCESS', data: project })
					this.fetchRelatedProjects()
				} else {
					// Redirect to listings page.
					this.props.dispatch(pushPath('/menu'))
					this.props.dispatch({
						type: 'SET_FLASH_MESSAGE',
						data: 'The page you are looking for is not available.'
					})
					setTimeout(() => {
						this.props.dispatch({ type: 'REMOVE_FLASH_MESSAGE' })
					}, 3500);
				}
			}).catch((err) => {  console.error('Project error: ', err.stack) });

	}

}
