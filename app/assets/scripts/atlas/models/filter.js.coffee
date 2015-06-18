@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.Filter = Models.BaseModel.extend
		getVariableModel: (variables) ->
			variables ?= App.reqres.request('variable:entities')
			variables.findWhere { id: @get('variable_id') }

	Models.Filters = Models.BaseCollection.extend
		model: Models.Filter