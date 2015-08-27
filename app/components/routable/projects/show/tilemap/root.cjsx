Comp.Projects.Show.Tilemap = React.createClass
	
	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Comp.Projects.Show.Tilemap'

	render: ->
		<div className='atl__main fill-parent'>
			{ @renderItems() }
			<Comp.Projects.Show.Tilemap.Map {...@props} />
			<Comp.Projects.Show.Tilemap.TopBar {...@props} />			
			<Comp.Projects.Show.Tilemap.SettingsBar {...@props} />
			<Comp.Projects.Show.Tilemap.Popup {...@props} />
			<Comp.Projects.Show.Tilemap.InfoBox {...@props} activeItem={ @getActiveItem() } />
			{ @renderBaseLayer() }
		</div>

	renderItems: ->
		if @props.uiState.itemsDisplayMode is 'map'
			return <Comp.Projects.Show.Tilemap.Map {...@props} />
		return <Comp.Projects.Show.Tilemap.List {...@props} />

	renderBaseLayer: ->
		return undefined
		<div className="atl__base-layer" />

	getActiveItem: ->
		@props.project.get('data').items.active

	componentWillMount: ->
		@setItemEventListeners()
		App = @props.App
		return unless App?
		App.commands.setHandler 'update:tilemap', =>
			@forceUpdate()

	setHeaderStripColor: ->
		project = @props.project
		items = project.get('data').items
		filter = project.get('data').filter
		hoveredItem = items.hovered
		if hoveredItem?
		    indeces = filter.getFriendlyIndeces(hoveredItem, 15)
		    cls = "bg-c-#{indeces[0]}"
		    App.commands.execute 'set:header:strip:color', { className: cls }
		else
		    App.commands.execute 'set:header:strip:color', 'none'

	setItemEventListeners: ->
		self = @
		App = @props.App
		return unless App?
		project = @props.project
		items = project.get('data').items
		@listenTo App.vent, 'item:activate', (modelOrId) ->
		    items.setActive modelOrId
		@listenTo App.vent, 'item:deactivate', ->
		    items.setActive -1
		@listenTo App.vent, 'item:mouseover', (modelOrId) =>
		    items.setHovered modelOrId
		    self.setHeaderStripColor()
		@listenTo App.vent, 'item:mouseout', () =>
		    items.setHovered -1
		    self.setHeaderStripColor()