import React from 'react'
import classNames from 'classnames'
import * as Icons from './../../../../general/icons.jsx'
import HexIcon from './../../../../general/hex_icon.jsx'
import Loader from './../../../../general/loader.jsx'


function ProjectSections(props) {

	var { projectSections } = props

	function renderList() {
		if (projectSections == null) { return <Loader /> }
		return projectSections.map((item, i) => {
			return (
				<ProjectSection
					{...props} 
					projectSection={item} 
					key={i}
				/>
			)
		})

	}

	return (
		<ul className="atl__project-section-filter">
			{ renderList() }
		</ul>
	)

}


function ProjectSection(props) {

	function toggleActiveState() {
		props.projectSection.toggleActiveState()
		props.updateProjectsIndex()
	}

	var { projectSection } = props

	var cls = classNames({
		"toggle-button": true,
		"toggle-button--black": true,
		"toggle-button--inactive": !projectSection.get('_isActive')
	})

	return (
		<li className={ cls } onClick={ toggleActiveState }>
			<HexIcon className={'toggle-button__icon'} />
			<div className="toggle-button__text">
				<p>{ projectSection.get('name') }</p>
			</div>
		</li>
	)

}

export default ProjectSections