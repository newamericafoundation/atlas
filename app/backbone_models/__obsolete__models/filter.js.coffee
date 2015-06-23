@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.Filter = Models.BaseModel.extend

		# Find by variable_id in a specified variables collection.
		# @param {object} variables
		# @returns {object}
		getVariableModel: (variables) ->
			variables.findWhere { id: @get('variable_id') }


	Models.Filters = Models.BaseCollection.extend
		model: Models.Filter