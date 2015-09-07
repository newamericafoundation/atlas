@Atlas.module 'Map', (Map) ->

	@startWithParent = false

	@on 'start', ->
		@Controller.show()

	@on 'stop', ->
		@Controller.destroy()