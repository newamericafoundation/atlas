@Atlas = do (Backbone, Marionette) ->

	App = new Marionette.Application()

	App.on 'start', ->
		
		router = new App.Router.Router()
		App.rtr = router
		Backbone.history.start({ pushState: true }) if Backbone.history

		$(document).on 'mousewheel', (e) ->

			App.vent.trigger 'scroll'

			if e.deltaY > 50
				App.vent.trigger 'strong:scroll:up'

			if e.deltaY < -50
				App.vent.trigger 'strong:scroll:down'

			if e.deltaX > 50
				App.vent.trigger 'strong:scroll:left'
			
			if e.deltaX < -50
				App.vent.trigger 'strong:scroll:right'

	App