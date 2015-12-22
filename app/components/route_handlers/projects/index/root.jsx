import React from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'

import Projects from './subcomponents/projects.jsx'
import ProjectSections from './subcomponents/project_sections.jsx'
import ProjectTemplates from './subcomponents/project_templates.jsx'
import SideBar from './../../../general/side_bar.jsx'

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


/*
 *
 *
 */
class Index extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.forceUpdate = this.forceUpdate.bind(this)
		this.state = {}
	}


	/*
	 *
	 *
	 */
	render() {
		var projects = this.getProjects()
		return (
			<div className="atl fill-parent">
				<SideBar buttons={ defaultButtons } />
				<div id="atl__main" className="-id-atl__main fill-parent">
					<div className="atl__main">
						<div className="atl__nav bg-c-off-white">
							<h1 className="title title--compact">Explore Atlas</h1>
							<ProjectTemplates 
								radio={this.props.radio}
								projectTemplates={this.state.projectTemplates}
								updateProjectsIndex={this.forceUpdate}
							/>
							<ProjectSections 
								radio={this.props.radio}
								projectSections={this.state.projectSections}
								updateProjectsIndex={this.forceUpdate}
							/>
						</div>
						<Projects 
							radio={this.props.radio}
							projects={projects} 
							projectTemplates={this.state.projectTemplates} 
							projectSections={this.state.projectSections}
							updateProjectsIndex={this.forceUpdate}
						/>
					</div>
				</div>
			</div>
		)	
	}


	/*
	 * Fetch entities separately. As soon as things arrive, the page should be populated.
	 *
	 */
	componentDidMount() {
		if (!this.getProjects()) { this.fetchProjects() }
		this.fetchProjectSections()
		this.fetchProjectTemplates()
	}


	/*
	 *
	 *
	 */
	getProjects() {
		return this.props.app.entities.projects.summaries
	}


	/*
	 * Fetch all projects without bulky fields that would take up a lot of bandwidth.
	 *
	 */
	fetchProjects() {
		var coll = new project.Collection()
		coll.getClientFetchPromise({}, { data: 0, body_text: 0, encoded_image: 0 }).then((coll) => {
			this.props.dispatch({ type: 'FETCH_PROJECT_SUMMARIES_SUCCESS', data: coll })
		}).catch((err) => { console.log(err); });
	}


	/*
	 * Fetch all project sections.
	 *
	 */
	fetchProjectSections() {
		var coll = new projectSection.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates()
			this.setState({ projectSections: coll })
		}).catch((err) => { console.log(err.stack) })
	}


	/*
	 * Fetch all project templates.
	 *
	 */
	fetchProjectTemplates() {
		var coll = new projectTemplate.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates()
			this.setState({ projectTemplates: coll })
		}).catch((err) => { console.log(err.stack) })
	}

}


export default connect(state => ({ 
	routing: state.routing,
	app: state.app
}))(Index)