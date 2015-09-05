import React from 'react';
import Icons from './../../../../general/icons.jsx';

class ProjectSections extends React.Component {

	render() {
		return (
			<ul className="atl__project-section-filter">
				{ this.renderList() }
			</ul>
		);
	}

	renderList() {
		if (this.props.projectSections == null) { return; }
		return this.props.projectSections.map((item, i) => {
			return (
				<ProjectSection
					{...this.props} 
					projectSection={item} 
					key={i}
				/>
			);
		});

	}

}

class ProjectSection extends React.Component {

	render() {
		var projectSection = this.props.projectSection;
		return (
			<li className={ "toggle-button toggle-button--black " + this.getModifierClass() } onClick={ this.toggleActiveState.bind(this) }>
				<Icons.Hex className={'toggle-button__icon'} />
				<div className="toggle-button__text">
					<p>{projectSection.get('name')}</p>
				</div>
			</li>
		);

	}

	getModifierClass() {
		if(!this.props.projectSection.get('_isActive')) {
			return 'toggle-button--inactive';
		}
		return '';
	}

	toggleActiveState() {
		var App;
		this.props.projectSection.toggleActiveState();
		this.props.updateProjectsIndex();
	}

}

export default ProjectSections;