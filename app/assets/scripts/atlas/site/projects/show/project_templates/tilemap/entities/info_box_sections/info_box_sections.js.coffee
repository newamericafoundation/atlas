@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->

		data = App.currentProjectModel.get 'data'

		infoBoxSections = new App.Models.InfoBoxSections data.infobox_variables, { parse: true } if data?

		App.reqres.setHandler 'info:box:section:entities', ->
			infoBoxSections


	@on 'stop', () ->
		App.reqres.removeHandler 'info:box:section:entities'