import React from 'react'
import classNames from 'classnames'
import * as Icons from './../../../../general/icons.jsx'
import HexIcon from './../../../../general/hex_icon.jsx'
import Loader from './../../../../general/loader.jsx'


/*
 *
 *
 */
class ProjectSections extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		return (
			<ul className="atl__project-section-filter">
				{ this.renderList() }
			</ul>
		);
	}


	/*
	 *
	 *
	 */
	renderList() {
		if (this.props.projectSections == null) { return <Loader /> }
		return this.props.projectSections.map((item, i) => {
			return (
				<ProjectSection
					{...this.props} 
					projectSection={item} 
					key={i}
				/>
			)
		})

	}

}


/*
 *
 *
 */
class ProjectSection extends React.Component {

	render() {
		var { projectSection } = this.props
		var cls = classNames({
			"toggle-button": true,
			"toggle-button--black": true,
			"toggle-button--inactive": !projectSection.get('_isActive')
		})
		return (
			<li className={ cls } onClick={ this.toggleActiveState.bind(this) }>
				<HexIcon className={'toggle-button__icon'} />
				<div className="toggle-button__text">
					<p>{projectSection.get('name')}</p>
				</div>
			</li>
		);

	}

	toggleActiveState() {
		this.props.projectSection.toggleActiveState();
		this.props.updateProjectsIndex();
	}

}

export default ProjectSections