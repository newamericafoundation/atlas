@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.InfoBoxSection = App.Models.BaseModel.extend()
	Models.InfoBoxSections = App.Models.BaseCollection.extend()