@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->
		data = App.currentProjectModel.get 'data'
		variables = new Entities.VariableCollection data.variables if data?
		App.reqres.setHandler 'variable:entities', (query) ->
			variables

	@on 'stop', () ->
		App.reqres.removeHandler 'variable:entities'