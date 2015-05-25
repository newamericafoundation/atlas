@Atlas.module 'Projects.Show.Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->	

	Tilemap.View = Marionette.LayoutView.extend
		initialize: ->
			@listenTo App.vent, 'subview:ready', (subviewHash) ->
				for key, value of subviewHash
					@getRegion(key).show(value)
		template: 'projects/show/project_templates/tilemap/templates/root'
		className: 'atl__main fill-parent'

		

		regions:
			headline: '#atl__headline'
			search:   '#atl__search'
			filter:   '#atl__filter'
			legend:   '#atl__legend'
			infoBox:  '#atl__info-box'
			build:    '#atl__build'
			map:      '#atl__map'
			info:     '#atl__info'
			popup:    '#atl__popup'

		preventDefault: (e) ->
			e.preventDefault()