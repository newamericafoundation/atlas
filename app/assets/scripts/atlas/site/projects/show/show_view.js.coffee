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
			'click': 'toggle'
			'click .atl__side-bar__icon': 'navigate'

		toggle: (e) ->
			$target = $(e.target)
			if $target.hasClass('atl__side-bar')
				$target.toggleClass('atl__side-bar--active')

		navigate: (e) ->
			# If the download form is clicked, don't execute JavaScript.
			$target = $(e.target)
			tagName = $target.prop('tagName').toLowerCase().trim()
			return if (tagName is 'form' or tagName is 'input')

			e.preventDefault()
			e.stopPropagation()
			entity = $(e.currentTarget).attr('data-method')
			method = @["_#{entity}"].bind(@)
			method(e) if method?

		_projects: ->
			Backbone.history.navigate 'menu', { trigger: true }

		_edit: ->
			Backbone.history.navigate ''
			url = App.currentProjectModel.buildUrl()
			window.location.href = url

		# Expand or collapse. To be renamed.
		_collapse: (e) ->
			# App.uiState.isCollapsed is highest authority in determining whether
			#   settings bar is expanded or not, but only if there is space.
			# TODO - clean up this complicated logic.
			isCollapsed = App.uiState.isCollapsed or $('.atl').hasClass('atl--collapsed')
			cannotExpand = App.reqres.request('is:settings:bar:overflowing')
			unless (isCollapsed) and (cannotExpand)
				App.uiState.isCollapsed = not App.uiState.isCollapsed
				$('.atl').toggleClass 'atl--collapsed'
				# get icon
				$target = $(e.target)
				if $target.hasClass('atl__side-bar__icon')
					$target = $($target.children()[0])
				$target.toggleClass 'bg-img-expand--off-white'

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
			'click #atl__set-filter-display': 'setFilterDisplay'
			'click #atl__set-search-display': 'setSearchDisplay'

		initialize: ->
			# View is rendered before current project is synced.
			@listenTo App.vent, 'current:project:change', (project) ->
				@model = project
				@setTemplateNameModifierClass()
				@setInfoBoxModifierClass()
			

		# Set modifier class corresponding to the template name.
		setTemplateNameModifierClass: ->
			if @model?
				@$el.addClass 'atl--' + @model.get('project_template_name').toLowerCase()

		setInfoBoxModifierClass: ->
			if @model?
				data = @model.get 'data' 
				if data?
					if (data.infobox_variables.length < 2)
						@$el.addClass 'atl__info-box--narrow'

		setFilterDisplay: (e) ->
			e.preventDefault()
			$('.atl').removeClass('atl--search-display').addClass('atl--filter-display')
			$('#atl__set-search-display').removeClass 'atl__binary-toggle__link--active'
			$('#atl__set-filter-display').addClass 'atl__binary-toggle__link--active'
			App.commands.execute 'change:display:mode', 'filter'

		setSearchDisplay: (e) ->
			e.preventDefault()
			$('.atl').removeClass('atl--filter-display').addClass('atl--search-display')
			$('#atl__set-filter-display').removeClass 'atl__binary-toggle__link--active'
			$('#atl__set-search-display').addClass 'atl__binary-toggle__link--active'
			App.commands.execute 'change:display:mode', 'search'