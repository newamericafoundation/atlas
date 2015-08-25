@Atlas.module 'Site', (Site, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

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