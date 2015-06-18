@Atlas.module 'Projects.Show.Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()
		App.searchTerm = ""
		App.reqres.setHandler 'search:term', ->
			App.searchTerm

	@on 'stop', ->
		@Controller.destroy()
		@stopListening()