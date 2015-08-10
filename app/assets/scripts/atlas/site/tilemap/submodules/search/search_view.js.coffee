@Atlas.module 'Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	Search.RootView = Marionette.ItemView.extend
	
		tagName: 'div'
		className: 'atl__search'
		template: 'tilemap/submodules/search/templates/root'

		events:
			'keyup input': 'changeSearchTerm'

		changeSearchTerm: (e) ->
			Search.term = $(e.target)[0].value
			App.vent.trigger 'search:term:change'