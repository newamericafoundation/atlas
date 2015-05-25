@Atlas.module 'Projects.Show.Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	Search.Controller = 

		show: ->
			rootView = new Search.RootView()
			App.vent.trigger 'subview:ready', { 'search': rootView }