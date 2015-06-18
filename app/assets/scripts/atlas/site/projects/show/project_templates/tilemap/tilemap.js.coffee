@Atlas.module 'Projects.Show.Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	# Specifies the start order of the submodules.
	# It is crucially important that Entities start first, as they need to run
	#   configuration code on user interactions that affect these base entities,
	#   such as when an item:activate or item:mouseover event is being fired.
	#   In that case, other modules listen to the same events, but rely on the
	#   updated information obtained from the Entities submodule.
	#   Future devs: by adding a new layer of events, this behavior can be eliminated.
	# Later order is not that relevant.
	Tilemap.submoduleKeys = [ 
		'Filter'
		'Search'
		'Legend'
		'Info'
		'Headline'
		'Map'
		'InfoBox'
		'Popup'
	] 

	setItemEventListeners = =>

		items = App.reqres.request 'item:entities'

		setHeaderStripColor = ->
			
			filter = App.reqres.request 'filter'
			hoveredItem = items.hovered
			if hoveredItem?
				i = filter.getValueIndeces hoveredItem
				cls = filter.getBackgroundColorClass i[0]
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


	@on 'start', ->
		@Controller.showMainView()			
		@Controller.startSubmodules()
		setItemEventListeners()

	@on 'stop', ->
		@stopListening()