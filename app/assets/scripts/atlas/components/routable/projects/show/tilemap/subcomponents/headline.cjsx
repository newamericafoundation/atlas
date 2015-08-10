Comp.Projects.Show.Tilemap.Headline = React.createClass

	render: ->
		project = @props.project
		<div className='atl__headline'>
			<p className='atl__headline__sections' dangerouslySetInnerHTML={{__html: @getSectionText() }}></p>
			<h1 className='atl__headline__title'>{ project.get('title') }</h1>
			<h2 className='atl__headline__description'>
				{ project.get('short_description') }
				<a href='#' className='link'>More...</a>
			</h2>
		</div>

	getSectionText: ->
		project = @props.project
		projectSectionNames = project.get('project_section_names')
		return '' unless projectSectionNames?
		projectSectionNames.join(',<br>').toUpperCase()