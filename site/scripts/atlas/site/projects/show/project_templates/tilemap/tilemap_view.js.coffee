@Atlas.module 'Projects.Show.Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->	

	Tilemap.View = Marionette.LayoutView.extend

		tagName: 'div'
		className: 'atl__main fill-parent'
		template: 'projects/show/project_templates/tilemap/templates/root'

		initialize: ->
			@listenTo App.vent, 'subview:ready', (subviewHash) ->
				for key, value of subviewHash
					@getRegion(key).show(value)

			$(window).on 'resize', ->
				console.log 'resized window' 

		collapseIfSettingsBarIsOverflowing: ->
			h1 = $('.atl__headline').height() + $('.atl__filter').height()
			h2 = $('.atl__settings-bar').height()

		regions:
			infoBox:  '#atl__info-box'
			map:      '#atl__map'
			info:     '#atl__info'
			popup:    '#atl__popup'

		preventDefault: (e) ->
			e.preventDefault()

