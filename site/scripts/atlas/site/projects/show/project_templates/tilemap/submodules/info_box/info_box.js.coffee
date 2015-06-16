@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@listenTo App.vent, 'item:activate', @Controller.updateAndReveal
		App.commands.setHandler 'activate:info:box', @Controller.updateAndReveal

	@on 'stop', ->
		@stopListening()
		@Controller.destroy()