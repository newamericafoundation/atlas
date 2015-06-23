@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.Variable = Models.BaseModel.extend()

	Models.Variables = Models.BaseCollection.extend
		model: Models.Variable 