@Atlas.module "Projects.Show.Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->

		@Controller.show()

		App.reqres.setHandler 'filter:value:hovered', ->
			Filter.valueHoverIndex

		App.reqres.setHandler 'filter', ->
			Filter.filter


	@on 'stop', ->
		@Controller.destroy()
		@stopListening()