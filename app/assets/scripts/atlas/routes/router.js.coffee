@Atlas.module 'Router', (Router, App, Backbone, Marionette, $, _) ->

	Router.Router = Marionette.AppRouter.extend

		initialize: ->
			@history = new Router.History()

		routes:
			'welcome': 'welcome_index'
			'menu': 'projects_index'
			'show': 'projects_show'
			'projects/new': 'projects_new'
			':atlas_url': 'projects_show'
			'*notFound': 'welcome_index'

		renderReactLayout: (opt = {}) ->
			el = $('#site')[0]
			opt.App = App
			c = React.createElement(Comp.BackboneLayout, opt)
			React.render(c, el)

		# Shorthand for Backbone history navigation.
		navigate: (url, options) ->
			# set trigger to true by default
			options ?= { trigger: true }
			options.trigger ?= true
			Backbone.history.navigate url, options

		welcome_index: (param) ->
			# if route is unmatched, change route to /welcome
			Backbone.history.navigate '/welcome', { trigger: false }
			@_initiateNavigation 'welcome_index', param
			@renderReactLayout
				route: 'welcome_index'
				theme: 'none'
				headerTitle: 'New America'
				routableComponentName: 'Welcome'

		projects_index: (param) ->
			@_initiateNavigation 'projects_index', param
			@renderReactLayout
				route: 'projects_index'
				theme: 'atlas'
				headerTitle: 'Atlas'
				routableComponentName: 'Projects.Index'

		projects_show: (atlas_url, param={}) ->
			atlas_url = @_getAtlasUrl atlas_url
			# bundle atlas_url within the other parameters
			param.atlas_url = atlas_url
			App.currentAtlasUrl = atlas_url
			@_initiateNavigation 'projects_show', param
			@renderReactLayout
				route: 'projects_show'
				theme: 'atlas'
				headerTitle: 'Atlas'
				routableComponentName: 'Projects.Show'
				atlas_url: atlas_url

		projects_new: ->
			@_initiateNavigation 'projects_new'
			@renderReactLayout
				route: 'projects_new'
				theme: 'atlas'
				headerTitle: 'Atlas'
				routableComponentName: 'Projects.New'

		# Get atlas url value, defaulting to previously accessed atlas url or a hard-coded one.
		_getAtlasUrl: (atlas_url) ->
			lastShowAction = @history.getLastActionByIndex(2)
			previous_atlas_url = lastShowAction.atlas_url if lastShowAction?
			atlas_url ?= previous_atlas_url
			atlas_url ?= 'mapping-college-readiness'
			return atlas_url

		# Called before navigation.
		_initiateNavigation: (action, params) ->
			@history.add action, params
			App.vent.trigger 'router:current:action:change', @history.getCurrentActionIndex()
			$('body').attr 'class', 'atl-route--' + action
			App.commands.execute 'set:header:strip:color'