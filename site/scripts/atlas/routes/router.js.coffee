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
			# if route is unmatched, change route to /welcome
			Backbone.history.navigate '/welcome', { trigger: false }
			@navigate 'welcome_index'
			App.Welcome.start()


		about_index: () ->
			@navigate 'about_index'
			App.About.start()
			

		projects_index: () ->
			@navigate 'projects_index'
			App.Projects.start()
			App.Projects.Index.start()


		projects_show: (atlas_url) ->
			@navigate 'projects_show', { atlas_url: atlas_url }
			atlas_url ?= @atlas_url
			@atlas_url = atlas_url
			App.Projects.start()
			App.Projects.Show.start atlas_url


		navigate: (action, params) ->
			@history.add action, params
			@_setCurrentAction action
			@_stopRoutableModules()
			App.commands.execute 'apply:route:specific:styling', action


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