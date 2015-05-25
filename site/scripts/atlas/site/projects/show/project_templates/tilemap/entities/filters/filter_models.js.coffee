@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	Entities.FilterModel = Backbone.Model.extend

		getVariableModel: ->
			variables = App.reqres.request('variable:entities')
			variables.findWhere { id: @get('variable_id') }


	Entities.FilterCollection = Backbone.Collection.extend
		model: Entities.FilterModel