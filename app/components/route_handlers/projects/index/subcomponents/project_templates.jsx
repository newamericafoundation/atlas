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
		var projectTemplate = this.props.projectTemplate,
			IconComp = Icons[this.getIconName()];
		return (
			<li className={ "icon-button " + this.getModifierClasses() } onClick={this.toggleActiveState.bind(this)} >
				<div className='icon-button__icon'>
					<IconComp />
				</div>
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

	getIconName() {
		var templateName = this.props.projectTemplate.get('name'),
			dictionary = {
				'Tilemap': 'Map',
				'Explainer': 'Dictionary',
				'Policy Brief': 'Dictionary',
				'Polling': 'Graph'
			};
		return dictionary[templateName];
	}

	toggleActiveState() {
		this.props.projectTemplate.toggleActiveState();
		this.props.updateProjectsIndex();
	}

}

export default ProjectTemplates;