@Atlas.module 'Projects.Show.Tilemap.Submodules', (Submodules, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	App.reqres.setHandler 'value:hovered', ->
		f = App.reqres.request 'filter:value:hovered'
		l = App.reqres.request 'legend:value:hovered'
		if (f isnt -1) and f?
			return f
		return l