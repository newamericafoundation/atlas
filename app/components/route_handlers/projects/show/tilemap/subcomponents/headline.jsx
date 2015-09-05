import React from 'react';

class Headline extends React.Component {

	constructor(props) {
		super(props);
		this.maxHeight = 0;
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
		);
	}

	componentDidMount() {
		this.props.cacheHeight(this.getHeight());
	}

	componentDidUpdate() {
		this.props.cacheHeight(this.getHeight());
	}

	getHeight() {
		var $el = $(React.findDOMNode(this.refs.root));
		var height = $el.height();
		if (height > this.maxHeight) { this.maxHeight = height; }
		else { height = this.maxHeight }
		return height;
	}

	openInfoBox(e) {
		var project = this.props.project;
		if (project == null) { return; }
		e.preventDefault();
		this.props.project.get('data').items.active = undefined;
		this.props.setUiState({ isInfoBoxActive: true });
	}

	getShortDescription() {
		var project = this.props.project;
		if (project == null) { return; }
		return project.get('short_description');
	}

	getSectionText() {
		var project, projectSectionNames;
		project = this.props.project;
		if (project == null) { return; }
		projectSectionNames = project.get('project_section_names');
		if (projectSectionNames == null) { return ''; }
		return projectSectionNames.join(',<br>').toUpperCase();
	}

	getTitle() {
		var project = this.props.project;
		if (project == null) { return; }
		return project.get('title');
	}

}

export default Headline;