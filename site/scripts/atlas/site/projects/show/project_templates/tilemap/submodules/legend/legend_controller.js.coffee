@Atlas.module 'Projects.Show.Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	Legend.Controller = 

		show: ->
			rootView = @getRootView()
			Legend.rootView = rootView
			App.vent.trigger 'subview:ready', { 'legend': rootView }

		getRootView: ->
			filter = App.reqres.request('filter')
			coll = new Backbone.Collection(filter.getActiveChild().children)
			rootView = new Legend.RootView
			    collection: coll
			rootView