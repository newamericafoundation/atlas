@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', (atlas_url) ->

		App.currentDisplayMode = 'filter'

		Show.Controller.show()

		App.commands.setHandler 'change:display:mode', (mode) ->
			App.currentDisplayMode = mode
			App.vent.trigger 'display:mode:change'
		

		setDataRequestHandlers = (project) ->
			data = project.get 'data'
			if data?
				App.reqres.setHandler 'filter:entities', -> data.filters
				App.reqres.setHandler 'info:box:section:entities', -> data.infobox_variables
				App.reqres.setHandler 'variable:entities', -> data.variables

				App.reqres.setHandler 'item:entities', (query) =>
					if data.items? 
						# use query object by default
						if _.isObject query
							return data.items.findWhere query
						# if no object is passed in, assume it is an id
						if query?
							id = parseInt(query, 10)
							return data.items.findWhere({ id: id })
					# if nothing is passed in, return the whole collection
					data.items


		project = App.reqres.request 'project:entity', ({ atlas_url: atlas_url })
		project.on 'sync', => 

			# Only 
			if project.exists()
				App.vent.trigger 'current:project:change', project
				templateName = project.get 'project_template_name'
				project.buildData()
				setDataRequestHandlers(project)
				Show[templateName].start()

			else
				Backbone.history.navigate 'welcome', { trigger: true }
		@

	@on 'stop', ->
		@stopListening()
		App.vent.trigger 'current:project:change', undefined

	@