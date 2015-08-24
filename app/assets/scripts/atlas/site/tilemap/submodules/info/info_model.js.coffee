@Atlas.module 'Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.Model = Backbone.Model.extend

		update: () ->
			filter = App.reqres.request 'filter'
			items = App.reqres.request 'item:entities'
			info = Info.modelBuilder filter, items
			@set info