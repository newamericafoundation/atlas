@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.CoreDatum = Models.BaseModel.extend
		urlRoot: '/api/v1/core_data'
		url: ->
			@urlRoot + "?" + $.param({ name: @get('name') })

		parse: (resp) ->
			resp = @_removeArrayWrapper resp


	Models.CoreData = Models.BaseCollection.extend
		model: Models.CoreDatum
		url: 'api/v1/core_data'