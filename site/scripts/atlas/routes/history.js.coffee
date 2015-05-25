@Atlas.module 'Router', (Router, App, Backbone, Marionette, $, _) ->

	# actions correspond to routes
	Router.actions = [ 'welcome_index', 'projects_index', 'projects_show', 'about_index' ]
	Router.actionHistory = []

	class Router.History

		constructor: ->
			@_history = []
		_actions: [ 'welcome_index', 'projects_index', 'projects_show', 'about_index' ]

		add: (action, options) ->
			obj = { actionIndex: @_actions.indexOf(action) }
			_.extend(obj, options)
			@_history.push obj

		getSwipeDirection: ->
			'left'



	Router.getActionIndex = (action) ->
		Router.actions.indexOf action

	Router.getCurrentActionIndex = ->
		currentAction = Router.actionHistory[Router.actionHistory.length - 1]
		Router.getActionIndex Router.currentAction

	Router.getPreviousActionIndex = ->
		previousAction = Router.actionHistory[Router.actionHistory.length - 2]
		Router.getActionIndex previousAction