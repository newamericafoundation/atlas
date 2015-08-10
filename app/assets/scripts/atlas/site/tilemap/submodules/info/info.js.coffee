@Atlas.module 'Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@Controller.destroy()
		@stopListening()