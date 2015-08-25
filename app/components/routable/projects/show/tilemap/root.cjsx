Comp.Projects.Show.Tilemap = React.createClass
	
	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Comp.Projects.Show.Tilemap'

	render: ->
		
		# return <div id="atl__main__temp" className="fill-parent"></div>

		<div className='atl__main fill-parent'>
			<Comp.Projects.Show.Tilemap.Map {...@props} />
			
			<div className="atl__base-layer"></div>
			<div className="atl__settings-bar">
				<Comp.Projects.Show.Tilemap.Headline {...@props} />
				<Comp.Projects.Show.Tilemap.DisplayToggle {...@props} />
				<Comp.Projects.Show.Tilemap.Search {...@props} />
				<Comp.Projects.Show.Tilemap.Filter {...@props} filter={ @getFilter() } />
			</div>

			<Comp.Projects.Show.Tilemap.Popup {...@props} />
			<Comp.Projects.Show.Tilemap.InfoBox {...@props} activeItem={ @getActiveItem() } />
		</div>

	getFilter: ->
		@props.project.get('data').filter

	getActiveItem: ->
		@props.project.get('data').items.active

	componentWillMount: ->
		@setItemEventListeners()

	setItemEventListeners: ->

		project = @props.project
		App = @props.App

		items = project.get('data').items
		filter = project.get('data').filter
		
		setHeaderStripColor = ->
			hoveredItem = items.hovered
			if hoveredItem?
				indeces = filter.getFriendlyIndeces(hoveredItem, 15)
				cls = "bg-c-#{indeces[0]}"
				App.commands.execute 'set:header:strip:color', { className: cls }
			else
				App.commands.execute 'set:header:strip:color', 'none'

		@listenTo App.vent, 'item:activate', (modelOrId) ->
			items.setActive modelOrId

		@listenTo App.vent, 'item:deactivate', ->
			items.setActive -1
			
		@listenTo App.vent, 'item:mouseover', (modelOrId) ->
			items.setHovered modelOrId
			setHeaderStripColor()

		@listenTo App.vent, 'item:mouseout', () ->
			items.setHovered -1
			setHeaderStripColor()