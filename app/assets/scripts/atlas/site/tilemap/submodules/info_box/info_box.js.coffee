@Atlas.module 'Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@listenTo App.vent, 'item:activate', @Controller.updateAndReveal.bind(@Controller)
		App.commands.setHandler 'activate:info:box', @Controller.updateAndReveal.bind(@Controller)

	@on 'stop', ->
		@stopListening()
		@Controller.destroy()