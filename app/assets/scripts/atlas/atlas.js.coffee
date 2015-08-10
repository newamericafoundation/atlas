@Atlas = do (Backbone, Marionette) ->

	App = new Marionette.Application()

	App.uiState = {
		isCollapsed: false
	}

	App.on 'start', ->
		console.log 'Hi, Mom!'
		router = new App.Router.Router()
		App.router = router
		App.dataCache = {}
		Backbone.history.start({ pushState: true }) if Backbone.history

	App