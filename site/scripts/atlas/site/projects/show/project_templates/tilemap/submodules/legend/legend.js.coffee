@Atlas.module 'Projects.Show.Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->

		@Controller.show()
		
		App.reqres.setHandler 'legend:value:hovered', ->
			Legend.valueHoverIndex

		filter = App.reqres.request('filter')

		@listenTo App.vent, 'key:click', ->
			Legend.rootView.collection.reset(filter.getActiveChild().children)


	@on 'stop', ->
		App.reqres.removeHandler 'legend:value:hovered'
		@stopListening()