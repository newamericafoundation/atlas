import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import colors from './../../../../../utilities/colors.js'


/*
 *
 *
 */
class Project extends React.Component {
	
	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = {
			highlightBackgroundColor: 'none'
		}
	}


	/*
	 *
	 *
	 */
	render() {
		var { project } = this.props, cls
		if (!this.isVisible()) { return null }
		cls = classNames({
			'atl__project': true,
			'atl__project--explainer': (project.get('project_template_id') === '1'),
			'atl__project--overview': (project.get('is_section_overview') === 'Yes')
		})
		return (
			<Link 
				className={ cls }
				to={ `/${project.get('atlas_url')}` }
				onMouseEnter={ this.applyBackgroundColor.bind(this) } 
				onMouseLeave={ this.removeBackgroundColor.bind(this) } 
				onClick={ this.launch.bind(this) } 
				data-id={ project.get('id') } 
			>
				<div className="atl__project__background" >
					<div className="atl__project__background__image" style={this.getBackgroundStyle()}></div>
					<div className="center--content">
						<p className="atl__project__background__initials">{ this.getInitials() }</p>
					</div>
				</div>
				<div className="atl__project__text" style={{ backgroundColor: this.state.highlightBackgroundColor }} ref="project-text">
					<div className="center--content">
						<h1>{ project.get('title') }</h1>
					</div>
				</div>
			</Link>
		)
	}


	/*
	 *
	 *
	 */
	getBackgroundStyle() {
		var { project, shouldDisplayImage } = this.props
		if (!project) { return }
		var imageUrl = project.getImageUrl()
		if (shouldDisplayImage && imageUrl) {
			return { 'backgroundImage': project.getImageUrl(), 'opacity': '1' }
		}
		return { 'opacity': '0' }
	}


	/*
	 *
	 *
	 */
	getInitials() {
		var { project, shouldDisplayImage } = this.props
		var title, initials
		if (shouldDisplayImage && project.get('encoded_image')) { return '' }
		title = project.get('title')
		if (title == null) { return '' }
		initials = (title.substring(0, 1) + title.substring(1, 2).toLowerCase());
		return initials;
	}


	/*
	 * Determines if a project is visible.
	 *
	 */
	isVisible() {
		var { project, projectSections, projectTemplates } = this.props
		if (!projectSections || !projectTemplates) { return false }
		return (projectSections.test(project, 'project_section') && projectTemplates.test(project, 'project_template'))
	}


	/*
	 *
	 *
	 */
	launch(e) {
		var href = this.props.project.get('atlas_url')
		// When the following page is rendered, its theme color is set to
		//   current highlight color.
		// TODO refactor current theme color assignments
		var { radio } = this.props
		radio.currentThemeColor = this.getColor().replace('0.8', '1.0');
	}


	/*
	 *
	 *
	 */
	applyBackgroundColor() {
		var { radio } = this.props, color
		color = this.getColor()
		this.setState({ highlightBackgroundColor: color })
		radio.commands.execute('set:header:strip:color', { color: color })
	}


	/*
	 *
	 *
	 */
	removeBackgroundColor() {
		var { radio } = this.props
		this.setState({ highlightBackgroundColor: '' })
		radio.commands.execute('set:header:strip:color', 'none')
	}


	/*
	 *
	 *
	 */
	getColor() {
		var { project, projects } = this.props, index, color
		if (project == null || projects == null) { return }
		index = projects.indexOf(project)
		color = colors.toRgba(index % 15, 0.8)
		return color
	}

}

export default Project