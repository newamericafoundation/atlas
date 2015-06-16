@Atlas.module 'About', (About, App, Backbone, Marionette, $, _) ->

	class About.RootView extends Marionette.LayoutView

		tagName: 'div'
		className: 'about bg-c-off-white'
		template: 'about/templates/root'