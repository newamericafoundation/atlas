Comp.Projects.Index.Projects = React.createClass
	
	displayName: 'Projects.Index.Projects'

	mixins: [ Comp.Mixins.BackboneEvents ]

	render: ->
		<div className="atl__projects">
			{ @_renderList() }
		</div>

	_renderList: ->
		return unless @props.projects?
		@props.projects.map (project, i) =>
			<Comp.Projects.Index.Projects.Project key={i} App={@props.App} project={project} projects={@props.projects} projectSections={@props.projectSections} projectTemplates={@props.projectTemplates} />

	componentDidUpdate: ->
		projects = @props.projects
		if projects?
			@_injectProjectImages()

	_injectProjectImages: ->
		projects = @props.projects
		return if projects.imagesAlreadyInjected
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
				projects.imagesAlreadyInjected = true
				@forceUpdate()
				


Comp.Projects.Index.Projects.Project = React.createClass
	
	displayName: 'Projects.Index.Projects.Item'

	render: ->
		project = @props.project
		<a className={ "atl__project " + @getModifierClasses() } onMouseEnter={ @applyBackgroundColor } onMouseLeave={ @removeBackgroundColor } onClick={ @launch } href={ project.get('atlas_url') }>
			<div className="atl__project__background atl__project__background--unselected" style={@getBackgroundStyle()} >
				<div className="center--content">
					<p className="atl__project__background__initials">{ @getInitials() }</p>
				</div>
			</div>
			<div className="atl__project__text" ref="project-text">
				<div className="center--content">
					<h1>{ project.get('title') }</h1>
				</div>
			</div>
			{ @renderAttribution() }
		</a>

	renderAttribution: ->
		project = @props.project
		return unless project.get('image_credit')? and project.get('image_credit') isnt ''
		return <div className="atl__attribution bg-img-info--black">
			<div className="atl__attribution__link">
				<p>{ 'Image Credit' }</p>
				<div>{ 'Shutterstock' }</div>
			</div>
		</div>

	getBackgroundStyle: ->
		project = @props.project
		return unless project?
		return { 'backgroundImage': project.getImageUrl() }


	getInitials: ->
		project = @props.project
		return '' if project.get('encoded_image')?
		title = project.get 'title'
		initials = (title.substring(0, 1) + title.substring(1, 2).toLowerCase()) if title?
		return initials

	getModifierClasses: ->
		classes = []
		project = @props.project
		if project.get('project_template_id') is "1"
			classes.push 'atl__project--explainer'
		if project.get('is_section_overview') is 'Yes'
			classes.push 'atl__project--overview'
		unless @test()
			classes.push 'atl__project--hidden'
		return '' if classes.length is 0
		return classes.join(' ')

	test: ->
		project = @props.project
		projectSections = @props.projectSections
		projectTemplates = @props.projectTemplates
		return false unless (projectSections? and projectTemplates?)
		return projectSections.test(project, 'project_section') and projectTemplates.test(project, 'project_template')

	launch: (e) ->
		e.preventDefault()
		href = @props.project.get 'atlas_url'
		# When the following page is rendered, its theme color is set to
		#   current highlight color.
		# TODO refactor current theme color assignments
		App = @props.App
		App.currentThemeColor = @getColor().replace('0.8', '1.0') if App?
		Backbone.history.navigate href, { trigger: true } if Backbone?

	applyBackgroundColor: ->
		color = @getColor()
		$el = $(React.findDOMNode(@refs['project-text']))
		$el.css('background-color', color)
		App = @props.App
		App.commands.execute 'set:header:strip:color', color: color if App?

	removeBackgroundColor: ->
		$el = $(React.findDOMNode(@refs['project-text']))
		$el.css('background-color', '')
		App = @props.App
		App.commands.execute 'set:header:strip:color', 'none' if App?

	getColor: ->
		App = @props.App
		project = @props.project
		projects = @props.projects
		if App? and project? and projects?
			index = projects.indexOf project
			color = App.CSS.Colors.toRgba index %% 15, 0.8
			return color