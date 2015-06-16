@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	Show.SideBarView = Marionette.ItemView.extend

		initialize: ->
			# Side bar is shown while the current project data and
			#   render dependencies are being fetched.
			#   
			@listenTo App.vent, 'current:project:change', (project) ->
				@model = project
				@updateLinkUrl()

		tagName: 'div'
		className: 'atl__side-bar fill-parent'
		template: 'projects/show/templates/side_bar'
		events: 
			'click a': 'navigate'			

		navigate: (e) ->
			e.preventDefault()
			e.stopPropagation()
			entity = $(e.currentTarget).attr('data-method')
			method = @["_#{entity}"]
			method(e) if method?

		_projects: ->
			Backbone.history.navigate 'menu', { trigger: true }

		_edit: ->
			Backbone.history.navigate ''
			url = App.currentProjectModel.buildUrl()
			window.location.href = url

		_collapse: (e) ->
			$('.atl').toggleClass 'atl--collapsed'
			$(e.target).toggleClass 'bg-img-expand--off-white'
			$('.atl__binary-toggle__link').each () ->
				$el = $(@)
				cls = $el.attr 'class'
				colorCls = cls.match(/bg-img-(filter|search)--(off-white|black)/g)[0]
				if colorCls.indexOf('off-white') > -1
					$el.removeClass colorCls
					colorCls = colorCls.replace('off-white', 'black')
					$el.addClass colorCls
				else
					$el.removeClass colorCls
					colorCls = colorCls.replace('black', 'off-white')
					$el.addClass colorCls

		_help: (e) ->
			$('.atl').toggleClass('atl--help')

		_print: ->
			window.print()

		updateLinkUrl: ->
			if @model?
				@$('input[type=hidden]').attr('value', @model.get('atlas_url'))


	Show.RootView = Marionette.LayoutView.extend

		template: 'projects/show/templates/root'
		className: 'atl atl--filter-display'
		regions:
			sideBar: '#atl__side-bar'
			main: '#atl__main'

		events: 
			'click .atl__binary-toggle__link': 'toggleDisplay'

		initialize: ->
			@listenTo App.vent, 'current:project:change', (project) ->
				@model = project
				@setTemplateNameModifierClass()

		# Set modifier class corresponding to the template name.
		setTemplateNameModifierClass: ->
			if @model?
				@$el.addClass 'atl--' + @model.get('project_template_name').toLowerCase()

		toggleDisplay: (e) ->

			e.preventDefault()
			$target = $(e.target)
			$app = $('.atl')

			activate = (mode) ->
				$('.atl__binary-toggle__link').removeClass 'atl__binary-toggle__link--active'
				$target.addClass 'atl__binary-toggle__link--active'
				App.commands.execute 'change:display:mode', mode

			if $target.attr('id') is 'atl__set-filter-display'
				activate('filter')
				$app.addClass('atl--filter-display')
				$app.removeClass('atl--search-display')

			if $target.attr('id') is 'atl__set-search-display'
				activate('search')
				$app.addClass('atl--search-display')
				$app.removeClass('atl--filter-display')