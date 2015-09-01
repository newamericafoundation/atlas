@Atlas = do (Backbone, Marionette) ->

	App = new Marionette.Application()

	App.on 'start', ->

		console.log 'Hi, Mom!'

		router = new App.Router.Router()
		App.router = router

		$(document).on 'mousewheel', (e) ->
			App.vent.trigger 'scroll'

		Backbone.history.start({ pushState: true }) if Backbone.history

	App