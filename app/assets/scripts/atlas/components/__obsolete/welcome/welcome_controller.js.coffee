@Atlas.module 'Welcome', (Welcome, App, Backbone, Marionette, $, _) ->

	Welcome.Controller = 

		show: ->
			rootView = @getRootView()
			App.contentRegion.show rootView

		getRootView: ->
			new Welcome.RootView()