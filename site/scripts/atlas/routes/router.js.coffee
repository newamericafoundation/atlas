@Atlas.module 'Router', (Router, App, Backbone, Marionette, $, _) ->

	Router.Router = Marionette.AppRouter.extend

		initialize: ->
			@history = new Router.History()

		routes:
			'welcome': 'welcome_index'
			'about': 'about_index'
			'menu': 'projects_index'
			':atlas_url': 'projects_show'
			'*notFound': 'welcome_index'

		welcome_index: () ->
			# change not found route to /welcome
			Backbone.history.navigate '/welcome', { trigger: false }
			App.commands.execute 'apply:route:specific:styling', 'welcome_index'
			@history.add 'welcome_index'
			@_setCurrentAction 'welcome_index'
			@_stopRoutableModules()
			App.Welcome.start()

		about_index: () ->
			@history.add 'about_index'
			@_setCurrentAction 'about_index'
			App.commands.execute 'apply:route:specific:styling', 'about_index'
			@_stopRoutableModules()
			App.About.start()
			
		projects_index: () ->
			@history.add 'projects_index'
			@_setCurrentAction 'projects_index'
			App.commands.execute 'apply:route:specific:styling', 'projects_index'
			@_stopRoutableModules()
			App.Projects.start()
			App.Projects.Index.start()

		projects_show: (atlas_url) ->
			@_setCurrentAction 'projects_show'
			App.commands.execute 'apply:route:specific:styling', 'projects_show'
			@_stopRoutableModules()
			App.Projects.start()
			if atlas_url?
				@atlas_url = atlas_url
			else
				atlas_url = @atlas_url
			@history.add 'projects_show', { atlas_url: atlas_url }
			App.Projects.Show.start atlas_url

		_stopRoutableModules: () ->
			App.Welcome.stop()
			App.About.stop()
			App.Projects.stop()

		_setCurrentAction: (currentAction) ->
			Router.actionHistory.push currentAction
			Router.currentAction = currentAction
			App.vent.trigger 'router:current:action:change', Router.getCurrentActionIndex()
			@_setSwipeDirection()

		# when the current action changes, the main view will most likely slide out
		# this method determines the direction in which that sliding should happen
		_setSwipeDirection: () ->
			cai = Router.getCurrentActionIndex()
			pai = Router.getPreviousActionIndex()
			if cai < pai
				App.swipeDirection = 'left'
			else if cai > pai
				App.swipeDirection = 'right'
			else
				App.swipeDirection = 'top'