@Atlas.module 'Projects.Show.Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@listenTo App.vent, 'item:mouseover', @Controller.create
		@listenTo App.vent, 'item:mouseout', @Controller.destroy

		App.commands.setHandler 'destroy:popup', =>
			@Controller.destroy()

	@on 'stop', ->
		App.commands.removeHandler 'destroy:popup'
		@Controller.destroy()
		@stopListening()