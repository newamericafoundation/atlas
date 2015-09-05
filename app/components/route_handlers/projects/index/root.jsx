import React from 'react';
import Projects from './subcomponents/projects.jsx';
import ProjectSections from './subcomponents/project_sections.jsx';
import ProjectTemplates from './subcomponents/project_templates.jsx';
import SideBar from './../../../general/side_bar.jsx';

import project from './../../../../models/project.js';
import projectSection from './../../../../models/project_section.js';
import projectTemplate from './../../../../models/project_template.js';

var defaultButtons = [
	{
		title: 'Submit Comment',
		contentType: 'outer-link',
		method: 'comment',
		url: 'mailto:atlas@newamerica.org',
		reactIconName: 'Comment', 
		isToggleable: false 
	}
];

class Index extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="atl fill-parent">
				<SideBar buttons={ defaultButtons } />
				<div id="atl__main" className="-id-atl__main fill-parent">
					<div className="atl__main">
						<div className="atl__nav bg-c-off-white">
							<h1 className="title title--compact">Explore Atlas</h1>
							<ProjectTemplates 
								App={this.props.App}
								projectTemplates={this.state.projectTemplates}
								updateProjectsIndex={this.forceUpdate.bind(this)}
							/>
							<ProjectSections 
								App={this.props.App} 
								projectSections={this.state.projectSections}
								updateProjectsIndex={this.forceUpdate.bind(this)}
							/>
						</div>
						<Projects 
							App={this.props.App} 
							projects={this.state.projects} 
							projectTemplates={this.state.projectTemplates} 
							projectSections={this.state.projectSections}
							updateProjectsIndex={this.forceUpdate.bind(this)}
						/>
					</div>
				</div>
			</div>
		)	
	}	

	componentDidMount() {
		this.fetchProjects();
		this.fetchProjectSections();
		this.fetchProjectTemplates();
	}

	fetchProjects() {
		var coll = new project.Collection()
		coll.getClientFetchPromise().then((coll) => {
			this.setState({ projects: coll });
		});
	}

	fetchProjectSections() {
		var coll = new projectSection.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates();
			this.setState({ projectSections: coll });
		});
	}

	fetchProjectTemplates() {
		var coll = new projectTemplate.Collection()
		coll.getClientFetchPromise().then((coll) => {
			coll.initializeActiveStates();
			this.setState({ projectTemplates: coll });
		});
	}

}

Index.contextTypes = {
	router: React.PropTypes.func
};

export default Index;