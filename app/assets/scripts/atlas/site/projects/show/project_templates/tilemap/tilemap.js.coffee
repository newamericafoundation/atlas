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
		'Entities' 
		'Filter'
		'Search'
		'Legend'
		'Info'
		'Headline'
		'Map'
		'InfoBox'
		'Popup'
	]

	@on 'start', ->
		@Controller.showMainView()			
		@Controller.startSubmodules()