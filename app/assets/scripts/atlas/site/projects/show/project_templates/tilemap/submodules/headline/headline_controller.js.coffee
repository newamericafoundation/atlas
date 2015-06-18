@Atlas.module 'Projects.Show.Tilemap.Headline', (Headline, App, Backbone, Marionette, $, _) ->

	Headline.Controller = 

		show: ->
			Headline.rootView = @getRootView()
			Headline.rootView.render()

		destroy: ->
			Headline.rootView.destroy();

		getRootView: ->
			rootView = new Headline.RootView
				el: '.atl__headline'
				model: App.currentProjectModel
			rootView