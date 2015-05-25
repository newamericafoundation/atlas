@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	class Header.NavCircleView extends Marionette.ItemView

		tagName: 'li'
		className: 'nav-circle'
		template: 'header/templates/nav_circle'
		events:
			'click': 'navigate'
		navigate: (e) ->
			e.preventDefault()
			href = @model.get 'url'
			Backbone.history.navigate href, { trigger: true }

		activate: ->
			@$el.addClass 'nav-circle--active'

		deactivate: ->
			@$el.removeClass 'nav-circle--active'


	class Header.NavCirclesView extends Marionette.CompositeView

		initialize: ->
			@listenTo App.vent, 'router:current:action:change', (index) ->
				@children.each (child, childIndex) ->
					if index is childIndex then child.activate() else child.deactivate()
					
		tagName: 'div'
		className: 'header__nav-circles'
		template: 'header/templates/nav_circles'
		childView: Header.NavCircleView
		childViewContainer: 'ul'


	class Header.StripView extends Marionette.ItemView

		tagName: 'div'
		className: 'header__strip'
		template: 'header/templates/strip'

		initialize: ->
			baseClassName = 'header__strip'

			App.commands.setHandler 'set:header:strip:color', (options) =>
				if options is 'none'
					@$el.attr 'class', @className
					@$el.css 'background-color', ''
				else if options.color?
					# reset class to original
					@$el.attr 'class', baseClassName
					@$el.css 'background-color', options.color
				else if options.className?
					# erase all previously assigned color setting classes
					@$el.css 'background-color', ''
					@$el.attr 'class', baseClassName
					@$el.addClass options.className


	class Header.RootView extends Marionette.LayoutView
		tagName: 'div'
		className: 'header'
		template: 'header/templates/root'

		events:
			'click .bg-img-naf': 'navigate'

		navigate: (e) ->
			e.preventDefault()
			Backbone.history.navigate 'welcome', { trigger: true }

		regions:
			navCircles: '#header__nav-circles'
			strip: '#header__strip'