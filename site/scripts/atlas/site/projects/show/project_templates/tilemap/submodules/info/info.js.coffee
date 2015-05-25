@Atlas.module 'Projects.Show.Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@stopListening()