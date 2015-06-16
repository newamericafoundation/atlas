@Atlas.module 'Projects.Show.Tilemap.Map', (Map, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@Controller.destroy()