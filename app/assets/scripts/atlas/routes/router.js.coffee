@Atlas.module 'Router', (Router, App, Backbone, Marionette, $, _) ->

	Router.Router = Marionette.AppRouter.extend

		initialize: ->
			@history = new Router.History()

		routes:
			'welcome': 'welcome_index'
			#'about': 'about_index'
			'menu': 'projects_index'
			'show': 'projects_show'
			':atlas_url': 'projects_show'
			'*notFound': 'welcome_index'

		welcome_index: (param) ->
			# if route is unmatched, change route to /welcome
			Backbone.history.navigate '/welcome', { trigger: false }
			@navigate 'welcome_index', param
			App.Welcome.start()

		about_index: (param) ->
			@navigate 'about_index'
			App.About.start()

		projects_index: (param) ->
			@navigate 'projects_index', param
			App.Projects.start()
			App.Projects.Index.start()

		projects_show: (atlas_url, param) ->
			lastShowAction = @history.getLastActionByIndex(2)
			previous_atlas_url = lastShowAction.atlas_url if lastShowAction?
			atlas_url ?= previous_atlas_url
			atlas_url ?= 'mapping-college-readiness'
			param ?= {}
			# atlas_url is bundled within the other parameters
			param.atlas_url = atlas_url
			@navigate 'projects_show', param
			Backbone.history.navigate "/#{atlas_url}", { trigger: false }
			App.Projects.start()
			App.Projects.Show.start atlas_url

		navigate: (action, params) ->
			@history.add action, params
			@_stopRoutableModules()
			App.vent.trigger 'router:current:action:change', @history.getCurrentActionIndex()
			App.commands.execute 'apply:route:specific:styling', action

		navigateApp: (url, trigger=true) ->
			Backbone.history.navigate url, { trigger: trigger }

		_stopRoutableModules: () ->
			App.Welcome.stop()
			App.About.stop()
			App.Projects.stop()