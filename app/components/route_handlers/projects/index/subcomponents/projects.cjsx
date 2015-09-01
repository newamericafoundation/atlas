Comp.Projects.Index.Projects = React.createClass
	
	displayName: 'Projects.Index.Projects'

	getInitialState: ->
		{
			shouldDisplayImage: false,
			hasDisplayedImage: false
		}

	render: ->
		return (
			<div className="atl__projects">
				{ this.renderList() }
			</div>
		)

	renderList: ->
		return unless this.props.projects?
		this.props.projects.map (project, i) =>
			<Comp.Projects.Index.Projects.Project 
				{...this.props} 
				key={i}
				project={project}
				shouldDisplayImage={this.state.shouldDisplayImage}
			/>

	componentDidUpdate: ->
		projects = this.props.projects
		return unless projects?
		this.ensureProjectImages()

	ensureProjectImages: ->
		projects = this.props.projects

		return unless projects?

		return if (this.state.hasDisplayedImage)

		if projects.hasImages
			return this.setState({ shouldDisplayImage: true, hasDisplayedImage: true })

		$.ajax
			url: 'api/v1/projects/image'
			type: 'get'
			success: (data) =>
				# filter projects that don't have an image.
				dataWithImage = []
				for datum in data
					if datum.encoded_image?
						project = projects.findWhere { atlas_url: datum.atlas_url }
						project.set 'encoded_image', datum.encoded_image
						project.set 'image_credit', datum.image_credit
				projects.hasImages = true
				this.setState { shouldDisplayImage: true, hasDisplayedImage: true }
				


Comp.Projects.Index.Projects.Project = React.createClass
	
	render: ->
		return <div/> if not this.isVisible()
		project = this.props.project
		<a className={ "atl__project " + this.getModifierClasses() } onMouseEnter={ this.applyBackgroundColor } onMouseLeave={ this.removeBackgroundColor } onClick={ this.launch } href={ project.get('atlas_url') }>
			<div className="atl__project__background atl__project__background--unselected" style={this.getBackgroundStyle()} >
				<div className="center--content">
					<p className="atl__project__background__initials">{ this.getInitials() }</p>
				</div>
			</div>
			<div className="atl__project__text" ref="project-text">
				<div className="center--content">
					<h1>{ project.get('title') }</h1>
				</div>
			</div>
			{ this.renderAttribution() }
		</a>

	renderAttribution: ->
		project = this.props.project
		return unless project.get('image_credit')? and project.get('image_credit') isnt ''
		return (
			<div className="atl__attribution bg-img-info--black">
				<div className="atl__attribution__link">
					<p>{ 'Image Credit' }</p>
					<div>{ 'Shutterstock' }</div>
				</div>
			</div>
		)

	getBackgroundStyle: ->
		project = this.props.project
		return unless project? and this.props.shouldDisplayImage
		return { 'backgroundImage': project.getImageUrl() }


	getInitials: ->
		project = this.props.project
		return '' if project.get('encoded_image')?
		title = project.get 'title'
		initials = (title.substring(0, 1) + title.substring(1, 2).toLowerCase()) if title?
		return initials

	getModifierClasses: ->
		classes = []
		project = this.props.project
		if project.get('project_template_id') is "1"
			classes.push 'atl__project--explainer'
		if project.get('is_section_overview') is 'Yes'
			classes.push 'atl__project--overview'
		return '' if classes.length is 0
		return classes.join(' ')

	isVisible: ->
		project = this.props.project
		projectSections = this.props.projectSections
		projectTemplates = this.props.projectTemplates
		return false unless (projectSections? and projectTemplates?)
		return projectSections.test(project, 'project_section') and projectTemplates.test(project, 'project_template')

	launch: (e) ->
		e.preventDefault()
		href = this.props.project.get 'atlas_url'
		# When the following page is rendered, its theme color is set to
		#   current highlight color.
		# TODO refactor current theme color assignments
		App = this.props.App
		App.currentThemeColor = this.getColor().replace('0.8', '1.0') if App?
		Backbone.history.navigate href, { trigger: true } if Backbone?

	applyBackgroundColor: ->
		color = this.getColor()
		$el = $(React.findDOMNode(this.refs['project-text']))
		$el.css('background-color', color)
		App = this.props.App
		App.commands.execute 'set:header:strip:color', color: color if App?

	removeBackgroundColor: ->
		$el = $(React.findDOMNode(this.refs['project-text']))
		$el.css('background-color', '')
		App = this.props.App
		App.commands.execute 'set:header:strip:color', 'none' if App?

	getColor: ->
		App = this.props.App
		project = this.props.project
		projects = this.props.projects
		return unless App? and project? and projects?
		index = projects.indexOf project
		color = App.CSS.Colors.toRgba index %% 15, 0.8
		return color