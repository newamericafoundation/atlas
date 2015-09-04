@Atlas = do (Backbone, Marionette) ->

	App = new Marionette.Application()

	App.on 'start', ->

		$(document).on 'mousewheel', (e) ->
			App.vent.trigger 'scroll'

	App