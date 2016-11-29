import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import Base from './base.jsx'

export default class Headline extends Base {

	constructor(props) {
		super(props)
		this.maxHeight = 0
	}

	render() {
		return (
			<div className='atl__headline' ref='root'>
				<p className='atl__headline__sections' dangerouslySetInnerHTML={{__html: this.getSectionText() }}></p>
				<h1 className='atl__headline__title'>{ this.getTitle() }</h1>
				<h2 className='atl__headline__description'>
					{ this.getShortDescription() }
					<a href='#' className='link' onClick={ this.openInfoBox.bind(this) } >More...</a>
				</h2>
			</div>
		)
	}

	openInfoBox(e) {
		var { project } = this.props
		if (!project) { return }
		e.preventDefault()
		this.props.project.get('data').items.active = undefined
		this.props.setUiState({ isInfoBoxActive: true })
	}

	getShortDescription() {
		var { project } = this.props
		if (!project) { return }
		return project.get('short_description')
	}

	getSectionText() {
		var { project } = this.props
		var projectSectionNames
		if (project == null) { return }
		projectSectionNames = project.get('project_section_names')
		if (projectSectionNames == null) { return '' }
		return projectSectionNames.join(',<br>').toUpperCase()
	}

	getTitle() {
		var { project } = this.props
		if (project == null) { return }
		return project.get('title')
	}

}
