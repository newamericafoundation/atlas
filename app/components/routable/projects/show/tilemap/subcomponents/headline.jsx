Comp.Projects.Show.Tilemap.Headline = class extends React.Component {

	render() {
		project = this.props.project;
		return (
			<div className='atl__headline'>
				<p className='atl__headline__sections' dangerouslySetInnerHTML={{__html: this.getSectionText() }}></p>
				<h1 className='atl__headline__title'>{ project.get('title') }</h1>
				<h2 className='atl__headline__description'>
					{ project.get('short_description') }
					<a href='#' className='link' onClick={ this.openInfoBox.bind(this) } >More...</a>
				</h2>
			</div>
		);
	}

	openInfoBox(e) {
		e.preventDefault();
		this.props.setUiState({ isInfoBoxActive: true });
	}

	getSectionText() {
		project = this.props.project;
		projectSectionNames = project.get('project_section_names');
		if (projectSectionNames == null) { return ''; }
		return projectSectionNames.join(',<br>').toUpperCase();
	}

}