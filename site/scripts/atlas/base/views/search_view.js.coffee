@Atlas.module 'Base', (Base, App, Backbone, Marionette, $, _) ->


	Base.SearchModel = Backbone.Model.extend
		defaults:
			placeholder: 'Search'


	Base.SearchView = Marionette.ItemView.extend#

		tagName: 'div'
		className: 'atl__search'
		template: 'templates/misc/search'

		initialize: ->
			if not @model?
				@model = new Base.SearchModel()

		events:
			'keyup input': 'changeSearchTerm'

		changeSearchTerm: (e) ->
			term = $(e.target)[0].value
			App.searchTerm = term
			App.vent.trigger 'search:term:change', term