@Atlas = do (Backbone, Marionette) ->

	App = new Marionette.Application()

	App.uiState ?= {}

	App.on 'start', ->
		console.log 'Hi, Mom!'
		router = new App.Router.Router()
		App.router = router
		Backbone.history.start({ pushState: true }) if Backbone.history

	App