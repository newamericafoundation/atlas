@Atlas.module 'Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->	

	Tilemap.View = Marionette.LayoutView.extend 

		tagName: 'div'
		className: 'atl__main fill-parent'
		template: 'tilemap/templates/root'

		initialize: ->
			@listenTo App.vent, 'subview:ready', (subviewHash) ->
				for key, value of subviewHash
					@getRegion(key).show(value)
			$(window).on 'resize', @collapseIfSettingsBarIsOverflowing.bind(@)
			@listenTo App.vent, 'show:component:ready', @collapseIfSettingsBarIsOverflowing.bind(@)

			App.reqres.setHandler 'is:settings:bar:overflowing', =>
				@isSettingsBarOverflowing()

		onBeforeDestroy: -> 
			$(window).off 'resize', @collapseIfSettingsBarIsOverflowing.bind(@)

		filterHeight: 0
		headlineHeight: 0
		headerHeight: 0

		isSettingsBarOverflowing: ->
			tolerance = 60
			useHeight = @_getFilterHeight() + @_getHeadlineHeight() + @_getHeaderHeight() + tolerance
			availableHeight = $(window).height()
			space = availableHeight - useHeight
			(space < 0)

		collapseIfSettingsBarIsOverflowing: ->
			if (@isSettingsBarOverflowing())
				$('.atl').addClass('atl--collapsed')
			else if not App.uiState.isCollapsed
				$('.atl').removeClass('atl--collapsed')

		_getFilterHeight: ->
			@_getHeight($('.atl__filter'), 'filter')

		_getHeadlineHeight: ->
			@_getHeight($('.atl__headline'), 'headline')

		_getHeaderHeight: ->
			@_getHeight($('#header'), 'header') 

		# Get component element height, caching its value on the view instance.
		#   the cache always dominates.
		# Used to collapse the settings bar if the content overflows vertically.
		# @param {object} $el
		# @param {string} name - Used to set up the cache variable, 
		#   e.g. name = 'some' will save cache under this.someHeight
		_getHeight: ($el, name) ->
			currentHeight = $el.height()
			# initialize cache
			unless @[name + 'Height']?
				@[name + 'Height'] = 0 
			if @[name + 'Height'] < currentHeight
				height = @[name + 'Height'] = currentHeight
			else
				height = @[name + 'Height']
			height

		regions:
			infoBox:  '#atl__info-box'
			map:      '#atl__map'
			info:     '#atl__info'
			popup:    '#atl__popup'

		preventDefault: (e) ->
			e.preventDefault()


		events: 
			'click #atl__set-filter-display': 'setFilterDisplay'
			'click #atl__set-search-display': 'setSearchDisplay'

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