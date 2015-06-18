@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', (atlas_url) ->

		App.currentDisplayMode = 'filter'

		Show.Controller.show()

		App.commands.setHandler 'change:display:mode', (mode) ->
			App.currentDisplayMode = mode
			App.vent.trigger 'display:mode:change'
		
		project = App.reqres.request 'project:entity', ({ atlas_url: atlas_url })
		project.on 'sync', =>
			if project.exists()
				App.vent.trigger 'current:project:change', project
				templateName = project.get 'project_template_name'
				Show[templateName].start()
			else
				Backbone.history.navigate 'welcome', { trigger: true }
		@

	@on 'stop', ->
		@stopListening()
		App.vent.trigger 'current:project:change', undefined

	@