@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->

	view =
		inAnimation:
			startCSS: {}
			endCSS: {}
			restCSS: {}
		outAnimation:
			startCSS: {}
			endCSS: {}
			restCSS: {}

	Base.Region = Marionette.Region.extend

		# TODO: more robust swap region.
		# Swap regions with an animation.
		show2: (view, options) ->

			if not this.currentView?
				Marionette.Region.prototype.show.apply @, [ view, options ]
				return @

			$currentEl = undefined
			$el = undefined
			currentView = this.currentView;

			direction = App.swipeDirection

			anim =
				start:
					view: 
						'position': 'absolute'
				end:
					view: {}
					currentView: {}
				rest:
					view:
						'position': ''

			anim.start.view[direction] = '-100%'
			anim.end.view[direction] = '0'
			anim.rest.view[direction] = ''
			anim.end.currentView[direction] = '+100%'

			$currentEl = currentView.$el;

			view.render()
			$el = view.$el
			$el.css anim.start.view

			@$el.prepend($el)

			@currentView = view
			view._parent = @

			$el.animate anim.end.view, 1000, -> $el.css anim.rest.view

			@stopListening currentView
			currentView.stopListening()
			currentView.off()

			$currentEl.animate anim.end.currentView, 1000, -> currentView.destroy()