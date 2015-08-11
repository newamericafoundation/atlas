Comp.Projects.Index = React.createClass

	displayName: 'Projects.Index'

	mixins: [ Comp.Mixins.BackboneEvents ]

	render: ->
		<div className="atl fill-parent">
			<Comp.SideBar buttons={[{title: 'Submit Comment', method: 'comment', icon: 'comment', reactIcon: 'Comment', isToggleable: false }]} />
			<div id="atl__main" className="-id-atl__main fill-parent">
				<div className="atl__main">
					<div className="atl__nav bg-c-off-white">
						<h1 className="title title--compact">Explore Atlas</h1>
						<Comp.Projects.Index.ProjectTemplates App={@props.App} projectTemplates={@props.App.dataCache.projectTemplates} />
						<Comp.Projects.Index.ProjectSections App={@props.App} projectSections={@props.App.dataCache.projectSections} />
					</div>
					<Comp.Projects.Index.Projects App={@props.App} projects={@props.App.dataCache.projects} projectTemplates={@props.App.dataCache.projectTemplates} projectSections={@props.App.dataCache.projectSections} />
				</div>
			</div>
		</div>

	componentDidMount: ->
		@_fetchProjects()
		@_fetchProjectSections()
		@_fetchProjectTemplates()
		@_updateOnFilterChange()

	_updateOnFilterChange: ->
		App = @props.App
		if App?
			@listenTo App.vent, 'project:filter:change', @forceUpdate

	_fetchProjects: ->
		App = @props.App
		if App?
			projects = App.reqres.request "project:entities", { cache: true }
			if projects.length? and projects.length > 0
				App.dataCache.projects = projects
				@forceUpdate()
			projects.on 'reset', =>
				App.dataCache.projects = projects
				@forceUpdate()

	_fetchProjectSections: ->
		App = @props.App
		if App?
			projectSections = App.reqres.request "project:section:entities", { cache: true }
			App.dataCache.projectSections = projectSections
			@forceUpdate()

	_fetchProjectTemplates: ->
		App = @props.App
		if App?
			projectTemplates = App.reqres.request "project:template:entities", { cache: true }
			App.dataCache.projectTemplates = projectTemplates
			@forceUpdate()
