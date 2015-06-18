@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->

		data = App.currentProjectModel.get 'data'

		filters = new App.Models.Filters data.filters if data?

		App.reqres.setHandler 'filter:entities', ->
			filters