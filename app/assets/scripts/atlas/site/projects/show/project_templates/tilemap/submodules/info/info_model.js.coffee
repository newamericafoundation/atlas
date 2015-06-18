@Atlas.module 'Projects.Show.Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.Model = Backbone.Model.extend

		initialize: ->
			@listenTo App.vent, 'mouseover:value', ->
				@updateInfo


		update: () ->

			filter = App.reqres.request 'filter'
			items = App.reqres.request 'item:entities'

			hoveredValueIndex = App.reqres.request 'filter:value:hovered'

			info = Info.modelBuilder filter, items, hoveredValueIndex

			@set info