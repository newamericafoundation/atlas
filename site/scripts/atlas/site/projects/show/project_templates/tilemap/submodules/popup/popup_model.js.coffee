@Atlas.module 'Projects.Show.Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	Popup.Model = Backbone.Model.extend
		defaults:
			name: 'something'


	Popup.getModel = (item) ->
		new Popup.Model
			name: item.get 'name'