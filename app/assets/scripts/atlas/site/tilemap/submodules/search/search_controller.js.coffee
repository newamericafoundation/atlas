@Atlas.module 'Tilemap.Search', (Search, App, Backbone, Marionette, $, _) ->

	Search.Controller = 

		show: ->
			Search.view = new App.Base.SearchView
				el: $('.atl__search')
				model: new Backbone.Model
					placeholder: 'Search Project'

			Search.view.render()

		destroy: ->
			Search.view.destroy()