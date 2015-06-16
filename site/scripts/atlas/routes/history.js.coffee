@Atlas.module 'Router', (Router, App, Backbone, Marionette, $, _) ->

	# actions correspond to routes
	Router.actions = [ 'welcome_index', 'projects_index', 'projects_show', 'about_index' ]
	Router.actionHistory = []

	# Custom history object storing previous routes and other relevant parameters.
	class Router.History

		constructor: ->
			@_history = []

		_actions: [ 'welcome_index', 'projects_index', 'projects_show', 'about_index' ]

		# Add a route to the history.
		# @param {string} action
		# @param {object} options
		# @returns {object} this
		add: (action, options) ->
			obj = { actionIndex: @_actions.indexOf(action) }
			_.extend(obj, options)
			@_history.push obj
			# console.log @_history
			@

		# Returns the index of the current action.
		# @returns {number} index
		getCurrentActionIndex: ->
			len = @_history.length
			return @_history[len - 1].actionIndex

		# Returns the index of the previous action.
		# @returns {number} index
		getPreviousActionIndex: ->
			len = @_history.length
			return @_history[len - 2].actionIndex if len >= 2

		getLastActionByIndex: (actionIndex) ->
			len = @_history.length
			for i in [len-1..0] by -1
				hist = @_history[i]
				return hist if (hist.actionIndex is actionIndex)

		# when the current action changes, the main view will most likely slide out
		# this method determines the direction in which that sliding should happen
		setSwipeDirection: ->
			cai = @getCurrentActionIndex()
			pai = @getPreviousActionIndex()
			if cai < pai
				App.swipeDirection = 'left'
			else if cai > pai
				App.swipeDirection = 'right'
			else
				App.swipeDirection = 'top'