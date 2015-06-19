@Atlas.module 'About', (About, App, Backbone, Marionette, $, _) ->

	About.Controller = 

		show: ->
			rootView = @getRootView()
			App.contentRegion.show rootView


		getRootView: ->
			new About.RootView()