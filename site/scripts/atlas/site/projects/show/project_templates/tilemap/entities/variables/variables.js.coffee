@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->

		data = App.currentProjectData.data

		variables = new Entities.VariableCollection data.variables if data?

		App.reqres.setHandler 'variable:entities', (query) ->
			variables