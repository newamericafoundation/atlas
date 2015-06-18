@Atlas.module 'Projects.Show.Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	Search.RootView = Marionette.ItemView.extend
	
		tagName: 'div'
		className: 'atl__search'
		template: 'projects/show/project_templates/tilemap/submodules/search/templates/root'

		events:
			'keyup input': 'changeSearchTerm'

		changeSearchTerm: (e) ->
			Search.term = $(e.target)[0].value
			App.vent.trigger 'search:term:change'