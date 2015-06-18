@Atlas.module 'Site', (Site, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

	App.swipeDirection = 'left'

	App.addRegions
		headerRegion: 
			selector: '#header'
			regionClass: Marionette.Region
		contentRegion: 
			selector: '#atl'
			regionClass: App.Base.Region

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