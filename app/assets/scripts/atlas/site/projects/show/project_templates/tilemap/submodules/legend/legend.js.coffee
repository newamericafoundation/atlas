@Atlas.module 'Projects.Show.Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->

		@Controller.show()
		
		App.reqres.setHandler 'legend:value:hovered', ->
			Legend.valueHoverIndex


	@on 'stop', ->
		App.reqres.removeHandler 'legend:value:hovered'
		@Controller.destroy()
		@stopListening()