@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.showIndex()