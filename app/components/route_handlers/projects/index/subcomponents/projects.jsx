import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as colors from './../../../../utilities/colors.js';

class Projects extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayImage: false,
			hasDisplayedImage: false
		};
	}

	render() {
		return (
			<div className="atl__projects">
				{ this.renderList() }
			</div>
		);
	}

	renderList() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		return projects.map((project, i) => {
			return (
				<Project 
					{...this.props} 
					key={i}
					project={project}
					shouldDisplayImage={this.state.shouldDisplayImage}
				/>
			);
		});
	}

	componentDidUpdate() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		this.ensureProjectImages();
	}

	ensureProjectImages() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		if (this.state.hasDisplayedImage) { return; }
		if (projects.hasImages) {
			return this.setState({ shouldDisplayImage: true, hasDisplayedImage: true });
		}

		$.ajax({
			url: 'api/v1/projects/image',
			type: 'get',
			success: (data) => {
				// filter projects that don't have an image.
				var dataWithImage = [];
				data.forEach((datum) => {
					var project;
					if (datum.encoded_image != null) {
						project = projects.findWhere({ atlas_url: datum.atlas_url });
						project.set('encoded_image', datum.encoded_image);
						project.set('image_credit', datum.image_credit);
					}
				});
				projects.hasImages = true;
				this.setState({ shouldDisplayImage: true, hasDisplayedImage: true });
			}
		});
	}

}

Projects.contextTypes = {
	router: React.PropTypes.func
};



class Project extends React.Component {
	
	render() {
		var project;
		if (!this.isVisible()) {
			return (<div/>);
		}
		project = this.props.project;
		return (
			<Link className={ "atl__project " + this.getModifierClasses() } onMouseEnter={ this.applyBackgroundColor.bind(this) } onMouseLeave={ this.removeBackgroundColor.bind(this) } onClick={ this.launch.bind(this) } to={ '/' + project.get('atlas_url') }>
				<div className="atl__project__background atl__project__background--unselected" style={this.getBackgroundStyle()} >
					<div className="center--content">
						<p className="atl__project__background__initials">{ this.getInitials() }</p>
					</div>
				</div>
				<div className="atl__project__text" ref="project-text">
					<div className="center--content">
						<h1>{ project.get('title') }</h1>
					</div>
				</div>
				{ this.renderAttribution() }
			</Link>
		);
	}

	renderAttribution() {
		var project = this.props.project,
			imageCredit = project.get('image_credit');
		if (imageCredit == null || (imageCredit === '')) { return; }
		return (
			<div className="atl__attribution bg-img-info--black">
				<div className="atl__attribution__link">
					<p>{ 'Image Credit' }</p>
					<div>{ 'Shutterstock' }</div>
				</div>
			</div>
		)
	}

	getBackgroundStyle() {
		var project = this.props.project;
		if (project == null || !this.props.shouldDisplayImage) { return; }
		return { 'backgroundImage': project.getImageUrl() };
	}


	getInitials() {
		var project = this.props.project,
			title, initials;
		if (project.get('encoded_image') != null) { return ''; }
		title = project.get('title');
		if (title == null) { return ''; }
		initials = (title.substring(0, 1) + title.substring(1, 2).toLowerCase());
		return initials;
	}

	getModifierClasses() {
		var classes = [],
			project = this.props.project;
		if (project.get('project_template_id') === '1') {
			classes.push('atl__project--explainer');
		}
		if (project.get('is_section_overview') === 'Yes') {
			classes.push('atl__project--overview');
		}
		if (classes.length === 0) { return ''; }
		return classes.join(' ');
	}

	isVisible() {
		var project = this.props.project,
			projectSections = this.props.projectSections,
			projectTemplates = this.props.projectTemplates;
		if (projectSections == null || projectTemplates == null) { return false; }
		return (projectSections.test(project, 'project_section') && projectTemplates.test(project, 'project_template'))
	}

	launch(e) {
		var href, App;
		href = this.props.project.get('atlas_url')
		// When the following page is rendered, its theme color is set to
		//   current highlight color.
		// TODO refactor current theme color assignments
		App = this.props.App;
		if (App == null) { return; }
		App.currentThemeColor = this.getColor().replace('0.8', '1.0');
	}

	applyBackgroundColor() {
		var color, $el, App;
		color = this.getColor()
		$el = $(React.findDOMNode(this.refs['project-text']))
		$el.css('background-color', color);
		App = this.props.App;
		if (App == null) { return; }
		App.commands.execute('set:header:strip:color', { color: color });
	}

	removeBackgroundColor() {
		var $el, App;
		$el = $(React.findDOMNode(this.refs['project-text']))
		$el.css('background-color', '');
		App = this.props.App;
		if (App == null) { return; }
		App.commands.execute('set:header:strip:color', 'none');
	}

	getColor() {
		var App, project, projects, index, color;
		App = this.props.App;
		project = this.props.project;
		projects = this.props.projects;
		if (App == null || project == null || projects == null) { return; }
		index = projects.indexOf(project);
		color = colors.toRgba(index % 15, 0.8);
		return color;
	}

}

Project.contextTypes = {
	router: React.PropTypes.func
};


export default Projects;