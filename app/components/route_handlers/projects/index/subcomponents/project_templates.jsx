import React from 'react';
import classNames from 'classnames';
import Icons from './../../../../general/icons.jsx';

class ProjectTemplates extends React.Component {

	render() {
		return (
			<ul className="atl__project-template-filter">
				{ this.renderList() }
			</ul>
		);
	}

	renderList() {
		if (this.props.projectTemplates == null) { return; }
		return this.props.projectTemplates.map((item, i) => {
			return (
				<ProjectTemplate
					{...this.props} 
					projectTemplate={item} 
					key={i} 
				/>
			);
		});
	}

}


class ProjectTemplate extends React.Component {
	
	render() {
		var projectTemplate = this.props.projectTemplate;
		return (
			<li className={ "icon-button " + this.getModifierClasses() } onClick={this.toggleActiveState.bind(this)} >
				<div className={ `icon-button__icon bg-img-${ this.getIcon() }--black` }></div>
				<p className="icon-button__text">
					{projectTemplate.get('display_name')}
				</p>
			</li>
		);
	}

	getModifierClasses() {
		var classes, projectTemplate;
		classes = [];
		projectTemplate = this.props.projectTemplate;
		if (projectTemplate.get('id') === '2') { classes.push('hidden'); }
		if (projectTemplate.get('_isActive')) { classes.push('icon-button--active');  }
		if (classes.length === 0) { return ''; }
		return classes.join(' ');
	}

	getIcon() {
		var templateName = this.props.projectTemplate.get('name'),
			dictionary = {
				'Tilemap': 'map',
				'Explainer': 'dictionary',
				'Polling': 'graph'
			};
		return dictionary[templateName];
	}

	toggleActiveState() {
		this.props.projectTemplate.toggleActiveState();
		this.props.updateProjectsIndex();
	}

}

export default ProjectTemplates;