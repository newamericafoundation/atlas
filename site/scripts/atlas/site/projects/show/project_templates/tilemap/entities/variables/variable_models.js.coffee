@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	Entities.VariableModel = Backbone.Model.extend()

	Entities.VariableCollection = Backbone.Collection.extend
		model: Entities.VariableModel