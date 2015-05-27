@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@listenTo App.vent, 'item:activate', @Controller.createAndReveal
		# @listenTo App.vent, 'strong:scroll:down', @Controller.createAndReveal
		# @listenTo App.vent, 'strong:scroll:up', @Controller.hideAndDestroy

	@on 'stop', ->
		@stopListening()