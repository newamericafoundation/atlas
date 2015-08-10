@Atlas.module 'Site', (Site, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

	App.swipeDirection = 'left'

	App.headerRegion = new Marionette.Region { el: '#header' }
	App.contentRegion = new Marionette.Region { el: '#atl' }

	App.currentDisplayMode = 'filter'

	App.commands.setHandler 'change:display:mode', (mode) ->
		App.currentDisplayMode = mode
		App.vent.trigger 'display:mode:change'

	App.reqres.setHandler 'current:project', ->
		App.currentProjectModel

	App.vent.on 'current:project:change', (project) ->
		App.currentProjectModel = project

	$(document).on 'mousewheel', (e) ->

		App.vent.trigger 'scroll'

		if e.deltaY > 50
			App.vent.trigger 'strong:scroll:up'

		if e.deltaY < -50
			App.vent.trigger 'strong:scroll:down'

		if e.deltaX > 50
			App.vent.trigger 'strong:scroll:left'
			
		if e.deltaX < -50
			App.vent.trigger 'strong:scroll:right'