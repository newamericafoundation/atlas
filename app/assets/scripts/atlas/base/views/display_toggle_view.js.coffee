@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	Base.DisplayToggleView = Marionette.ItemView.extend
		tagName: 'div'
		className: 'atl__display-toggle'