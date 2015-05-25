@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->

		data = App.currentProjectData.data

		infoBoxSections = new Entities.ItemCollection data.infobox_variables, { parse: true } if data?

		App.reqres.setHandler 'info:box:section:entities', ->
			infoBoxSections