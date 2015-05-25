@Atlas.module 'Projects.Show.Tilemap.Headline', (Headline, App, Backbone, Marionette, $, _) ->

	Headline.Controller = 

		show: ->
			rootView = @getRootView()
			App.vent.trigger 'subview:ready', { 'headline': rootView }


		getRootView: ->
			rootView = new Headline.RootView
				model: App.currentProjectModel
			rootView