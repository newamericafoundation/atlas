@Atlas.module 'Projects.Show.Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->	

	Tilemap.View = Marionette.LayoutView.extend

		tagName: 'div'
		className: 'atl__main fill-parent'
		template: 'projects/show/project_templates/tilemap/templates/root'

		initialize: ->
			@listenTo App.vent, 'subview:ready', (subviewHash) ->
				for key, value of subviewHash
					@getRegion(key).show(value)
			$(window).on 'resize', @collapseIfSettingsBarIsOverflowing.bind(@)
			@listenTo App.vent, 'show:component:ready', @collapseIfSettingsBarIsOverflowing.bind(@)

		onBeforeDestroy: ->
			$(window).off 'resize', @collapseIfSettingsBarIsOverflowing.bind(@)

		filterHeight: 0
		headlineHeight: 0
		headerHeight: 0

		collapseIfSettingsBarIsOverflowing: ->
			tolerance = 60
			useHeight = @_getFilterHeight() + @_getHeadlineHeight() + @_getHeaderHeight() + tolerance
			availableHeight = $(window).height()
			console.log availableHeight
			space = availableHeight - useHeight
			if (space < 0) 
				$('.atl').addClass('atl--collapsed')
			else
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
			console.log @[name + 'Height']
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

