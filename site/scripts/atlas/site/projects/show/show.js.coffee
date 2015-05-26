@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', (atlas_url) ->

		App.currentDisplayMode = 'filter'

		App.commands.setHandler 'change:display:mode', (mode) ->
			App.currentDisplayMode = mode
			App.vent.trigger 'display:mode:change'

		Show.Controller.show()
		
		project = App.reqres.request 'project:entity', (atlas_url)
		project.on 'sync', =>
			if project.exists()
				App.currentProjectData = project.toJSON()
				App.currentProjectModel = project
				if project.get('project_template_id') is 1
					$('.atl').addClass('atl--light')
				@currentProjectTemplate = App.currentProjectData.project_template.name
				return Show[@currentProjectTemplate].start()
			Backbone.history.navigate 'welcome', { trigger: true }
		@

	@on 'stop', ->
		@stopListening()

	@