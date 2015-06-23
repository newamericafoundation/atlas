@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.Researcher = Models.BaseModel.extend()
	
	Models.Researchers = Models.BaseCollection.extend
		model: Models.Researcher