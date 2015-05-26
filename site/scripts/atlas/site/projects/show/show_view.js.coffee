@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	Show.SideBarView = Marionette.ItemView.extend
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
			method() if method?

		_projects: ->
			Backbone.history.navigate 'menu', { trigger: true }

		_edit: ->
			Backbone.history.navigate ''
			window.location.href = "projects/#{App.currentProjectData.id}/edit"

		_collapse: ->
			$('.atl').toggleClass('atl--collapsed')


	Show.RootView = Marionette.LayoutView.extend

		template: 'projects/show/templates/root'
		className: 'atl atl--filter-display'
		regions:
			sideBar: '#atl__side-bar'
			main: '#atl__main'

		events: 
			'click .atl__binary-toggle__link': 'toggleDisplay'

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