@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@stopListening()