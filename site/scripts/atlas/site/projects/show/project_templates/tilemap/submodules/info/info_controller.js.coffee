@Atlas.module 'Projects.Show.Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.Controller = 

		show: ->
			rootView = @getRootView()
			App.vent.trigger 'subview:ready', { 'info': rootView }

		getRootView: ->
			filter = App.reqres.request('filter')
			items = App.reqres.request('item:entities')
			model = new Info.Model()
			model.update(filter, items)
			view = new Info.RootView
				model: model
			view