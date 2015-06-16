@Atlas.module 'Projects.Show.Tilemap.Headline', (Headline, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@Controller.destroy()
		@stopListening()