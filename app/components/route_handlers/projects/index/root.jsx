import React from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'

import Projects from './subcomponents/projects.jsx'
import ProjectSections from './subcomponents/project_sections.jsx'
import ProjectTemplates from './subcomponents/project_templates.jsx'
import SideBar from './../../../general/side_bar/root.jsx'

import models from './../../../../models/index.js'

var { project, projectSection, projectTemplate } = models

var defaultButtons = [
	{
		title: 'Submit Comment',
		contentType: 'outer-link',
		method: 'comment',
		url: 'mailto:atlas@newamerica.org',
		reactIconNames: [ 'Comment' ],
		isToggleable: false
	}
]


export default class Index extends React.Component {

	constructor(props) {
		super(props)
		this.forceUpdate = this.forceUpdate.bind(this)
		this.state = {}
	}

	render() {
		var projects = this.getProjects()
		var { projectSections, projectTemplates } = this.props.app.entities
		return (
			<div className="atl fill-parent">
				<SideBar buttons={ defaultButtons } />
				<div id="atl__main" className="-id-atl__main fill-parent">
					<div className="atl__main">
						<div className="atl__nav bg-c-off-white">
							<h1 className="title title--compact">Explore Atlas</h1>
							{/* <ProjectTemplates
								radio={this.props.radio}
								projectTemplates={projectTemplates}
								updateProjectsIndex={this.forceUpdate}
							/> */}
							<ProjectSections
								radio={this.props.radio}
								projectSections={projectSections}
								updateProjectsIndex={this.forceUpdate}
							/>
						</div>
						<Projects
							radio={this.props.radio}
							projects={projects}
							projectTemplates={projectTemplates}
							projectSections={projectSections}
							updateProjectsIndex={this.forceUpdate}
						/>
					</div>
				</div>
			</div>
		)
	}

	componentDidMount() {
		if (!this.getProjects()) { this.fetchProjects() }
		var { projectSections, projectTemplates } = this.props.app.entities
		if (!projectSections || projectSections.length === 0) { this.fetchProjectSections() }
		if (!projectTemplates || projectTemplates.length === 0) { this.fetchProjectTemplates() }
	}

	getProjects() {
		return this.props.app.entities.projects.summaries
	}

	fetchProjects() {
		var coll = new project.Collection()
		coll.getClientFetchPromise({}, { data: 0, body_text: 0, encoded_image: 0 }).then((coll) => {
			this.props.dispatch({ type: 'FETCH_PROJECT_SUMMARIES_SUCCESS', data: coll })
		}).catch((err) => {
			window.location.assign('/menu')
		})
	}

	fetchProjectSections() {
		var coll = new projectSection.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates()
			this.props.dispatch({ type: 'FETCH_PROJECT_SECTIONS_SUCCESS', data: coll })
			this.setState({ projectSections: coll })
		}).catch((err) => {
			window.location.assign('/menu')
			console.log(err.stack)
		})
	}

	fetchProjectTemplates() {
		var coll = new projectTemplate.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates()
			this.props.dispatch({ type: 'FETCH_PROJECT_TEMPLATES_SUCCESS', data: coll })
			this.setState({ projectTemplates: coll })
		}).catch((err) => {
			window.location.assign('/menu')
			console.log(err.stack)
		})
	}

}
