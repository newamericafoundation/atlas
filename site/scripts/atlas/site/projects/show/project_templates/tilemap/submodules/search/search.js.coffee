@Atlas.module 'Projects.Show.Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()
		Search.term = ""
		App.reqres.setHandler 'search:term', ->
			Search.term

	@on 'stop', ->
		@stopListening()
		App.reqres.removeHandler 'search:term'