@Atlas.module 'Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	Legend.Controller = 

		show: ->
			Legend.rootView = @getRootView()
			Legend.rootView.render()

		destroy: ->
			Legend.rootView.destroy()

		getRootView: ->
			filter = App.reqres.request('filter')
			coll = new Backbone.Collection(filter.getActiveChild().children)
			rootView = new Legend.RootView
			    collection: coll
			    el: '.atl__legend'
			rootView