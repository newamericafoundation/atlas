@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	@startWithParent = true

	@on 'start', ->
		@Controller.show()

		App.commands.setHandler 'set:header:text', (text) ->
			Header.rootView.setText text

	@on 'stop', ->
		@stopListening()