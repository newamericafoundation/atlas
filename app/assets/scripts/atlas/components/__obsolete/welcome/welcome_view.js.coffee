@Atlas.module 'Welcome', (Welcome, App, Backbone, Marionette, $, _) ->

	class Welcome.RootView extends Marionette.LayoutView

		tagName: 'div'
		className: 'welcome'
		template: 'welcome/templates/root'

		initialize: ->
			@listenTo App.vent, 'mouse:move', @_setColor

		_setColor: (mouse) ->
			color = App.CSS.Colors.interpolate mouse.x
			@$('.welcome__strip').css 'background-color', color
			@$('.welcome__title__alias').css 'color', color

		_unsetColor: ->
			@$('.banner__strip').css 'background-color', ''
			@$('.banner__title__alias').css 'color', ''

		events:
			'click #welcome__main-nav__button': 'toggle'

		toggle: (e) ->
			e.preventDefault()
			App.vent.trigger 'project:filter:change'
			Backbone.history.navigate 'menu', { trigger: true }