Comp.Projects.Show = React.createClass

	displayName: 'Projects.Show'

	mixins: [ Comp.Mixins.BackboneEvents ]

	getInitialState: ->
		{}

	render: ->
		<div className={ @_getClass() }>
			<Comp.SideBar App={ @props.App } project={ @state.project } />
			<div id="atl__main" className="-id-atl__main fill-parent">
				{ @_renderProject() }
			</div>
		</div>

	getDefaultProps: ->
		return { related: [] }

	_getClass: ->
		project = @state.project
		return "" unless project?
		cls = "atl atl--filter-display"
		cls += ' atl--' + project.get('project_template_name').toLowerCase()
		data = project.get 'data'
		cls += ' atl__info-box--narrow' if data? and (data.infobox_variables.length < 2)
		cls

	_renderProject: ->
		return <Comp.Loading /> unless @state.project?
		if @_isModelStatic()
			return <Comp.Projects.Show.Explainer App={@props.App} project={ @state.project } related={ @state.related } />
		if @_isModelTilemap()
			return <Comp.Projects.Show.Tilemap App={@props.App} project={ @state.project } />
		return <Comp.Loading />

	_isModelStatic: ->
		project = @state.project
		return false unless (project? and project.get?)
		return (project.get('project_template_name') in [ "Explainer", "Polling", "Policy Brief", "PolicyBrief" ])

	_isModelTilemap: ->
		project = @state.project
		return false unless (project? and project.get?)
		return (project.get('project_template_name') is 'Tilemap')

	_fetchRelatedProjects: ->
		App = @props.App
		project = @state.project
		if App? and project?
			id = project.get('id')
			related = App.reqres.request 'project:entities', { queryString: "related_to=#{id}", cache: false }
			related.on 'reset', =>
				@setState { related: related }

	# Not yet used.
	_fetchProject: () ->
		App = @props.App
		if App?
			project = App.reqres.request 'project:entity', ({ atlas_url: App.currentAtlasUrl })
			project.on 'sync', => 
				# Only 
				if project.exists()
					project.prepOnClient(App)
					App.vent.trigger 'current:project:change', project
					@setState { project: project }
					@_fetchRelatedProjects()
				else
					Backbone.history.navigate 'welcome', { trigger: true }

	componentDidMount: ->
		# View is rendered before current project is synced.
		App = @props.App
		@_fetchProject() if App?

	componentWillUnmount: ->
		App = @props.App