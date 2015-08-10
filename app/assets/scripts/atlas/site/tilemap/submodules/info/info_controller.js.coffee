@Atlas.module 'Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.Controller = 

		show: ->
			Info.rootView = @getRootView()
			Info.rootView.render()

		destroy: ->
			Info.rootView.destroy()

		getRootView: ->
			filter = App.reqres.request('filter')
			items = App.reqres.request('item:entities')
			model = new Info.Model()
			model.update(filter, items)
			view = new Info.RootView
				el: '.atl__info'
				model: model
			view