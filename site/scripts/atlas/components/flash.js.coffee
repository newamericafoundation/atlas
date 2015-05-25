@Atlas.module 'Components', (Components, App, Backbone, Marionette, $, _) ->

	hideTimeout = undefined

	@on 'start', ->
		hideFlash = ->
			$('.flash').fadeOut()
		hideTimeout = setTimeout hideFlash, 1000

	@on 'stop', ->
		clearTimeout hideTimeout