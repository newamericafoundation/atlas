@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	Base.AttributionView = Marionette.ItemView.extend

		tagName: 'div'
		className: 'atl__attribution bg-img-info--black'
		template: 'templates/misc/attribution'

		events:
			'click': 'toggleActiveState'

		toggleActiveState: (e) ->
			e.stopPropagation()
			@$el.toggleClass 'atl__attribution--active'