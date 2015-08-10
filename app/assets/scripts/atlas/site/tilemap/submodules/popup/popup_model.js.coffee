@Atlas.module 'Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	Popup.Model = Backbone.Model.extend
		defaults:
			name: 'something'


	Popup.getModel = (item) ->
		name = if (item? and item.get?) then item.get('name') else ''
		new Popup.Model
			name: name