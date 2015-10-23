import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import * as colors from './../../../../utilities/colors.js';


class Project extends React.Component {
	
	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			highlightBackgroundColor: 'none'
		};
	}


	/*
	 *
	 *
	 */
	render() {
		var project, cls;
		if (!this.isVisible()) {
			return null;
		}
		project = this.props.project;
		cls = classNames({
			'atl__project': true,
			'atl__project--explainer': (project.get('project_template_id') === '1'),
			'atl__project--overview': (project.get('is_section_overview') === 'Yes')
		});
		return (
			<Link 
				className={ cls } 
				onMouseEnter={ this.applyBackgroundColor.bind(this) } 
				onMouseLeave={ this.removeBackgroundColor.bind(this) } 
				onClick={ this.launch.bind(this) } 
				to={ '/' + project.get('atlas_url') }
				data-id={project.get('id')} 
			>
				<div className="atl__project__background" style={this.getBackgroundStyle()} >
					<div className="center--content">
						<p className="atl__project__background__initials">{ this.getInitials() }</p>
					</div>
				</div>
				<div className="atl__project__text" style={{ backgroundColor: this.state.highlightBackgroundColor }} ref="project-text">
					<div className="center--content">
						<h1>{ project.get('title') }</h1>
					</div>
				</div>
				{ this.renderAttribution() }
			</Link>
		);
	}


	/*
	 *
	 *
	 */
	renderAttribution() {
		return null;
		var project = this.props.project,
			imageCredit = project.get('image_credit'),
			InfoComp = Icons.Info;
		if (imageCredit == null || (imageCredit === '')) { return; }
		return (
			<div className="atl__attribution">
				<InfoComp />
				<div className="atl__attribution__link">
					<p>{ 'Image Credit' }</p>
					<div>{ 'Shutterstock' }</div>
				</div>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	getBackgroundStyle() {
		// return { 'backgroundImage': 'url(/static/images/resize_cache--Stock_Photos_w400--shutterstock_114464926.jpg)' };
		var project = this.props.project;
		if (project == null || !this.props.shouldDisplayImage) { return; }
		var style = { 'backgroundImage': project.getImageUrl() };
		return style;
	}


	/*
	 *
	 *
	 */
	getInitials() {
		var project = this.props.project,
			title, initials;
		if (project.get('encoded_image') != null) { return ''; }
		title = project.get('title');
		if (title == null) { return ''; }
		initials = (title.substring(0, 1) + title.substring(1, 2).toLowerCase());
		return initials;
	}


	/*
	 * Determines if a project is visible.
	 *
	 */
	isVisible() {
		var project = this.props.project,
			projectSections = this.props.projectSections,
			projectTemplates = this.props.projectTemplates;
		if (projectSections == null || projectTemplates == null) { return false; }
		return (projectSections.test(project, 'project_section') && projectTemplates.test(project, 'project_template'))
	}


	/*
	 *
	 *
	 */
	launch(e) {
		var href;
		href = this.props.project.get('atlas_url')
		// When the following page is rendered, its theme color is set to
		//   current highlight color.
		// TODO refactor current theme color assignments
		var { radio } = this.props;
		radio.currentThemeColor = this.getColor().replace('0.8', '1.0');
	}


	/*
	 *
	 *
	 */
	applyBackgroundColor() {
		var color;
		color = this.getColor();
		this.setState({ highlightBackgroundColor: color });
		var { radio } = this.props;
		radio.commands.execute('set:header:strip:color', { color: color });
	}


	/*
	 *
	 *
	 */
	removeBackgroundColor() {
		this.setState({ highlightBackgroundColor: '' });
		var { radio } = this.props;
		radio.commands.execute('set:header:strip:color', 'none');
	}


	/*
	 *
	 *
	 */
	getColor() {
		var project, projects, index, color;
		project = this.props.project;
		projects = this.props.projects;
		if (project == null || projects == null) { return; }
		index = projects.indexOf(project);
		color = colors.toRgba(index % 15, 0.8);
		return color;
	}

}

export default Project;