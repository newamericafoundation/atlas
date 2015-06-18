@Atlas.module "Projects.Show.Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->

	Filter.Controller = 

		show: ->

			filter = @_buildFilter()

			Filter.rootView = new Filter.RootView
				el: '.atl__filter'
				model: filter

			# expose model
			Filter.filter = filter

			Filter.keysView = @getKeysView()
			Filter.valuesView = @getValuesView()

			Filter.rootView.render()

			Filter.rootView.getRegion('keys').show Filter.keysView
			Filter.rootView.getRegion('values').show Filter.valuesView


		destroy: ->
			Filter.filter.stopListening()
			Filter.rootView.destroy()


		_buildFilter: ->
			model = App.currentProjectModel
			data = model.get 'data'
			items = data.items
			variables = data.variables
			filters = data.filters
			new Filter.Model Filter.buildFilterTree items, variables, filters


		getKeysView: ->
			new Filter.KeysView
				collection: new Backbone.Collection Filter.filter.children


		getValuesView: ->

			ValuesCollection = Backbone.Collection.extend
				rebuild: ->
					@reset Filter.filter.getActiveChild().children

			ValuesModel = Backbone.Model.extend
				rebuild: ->
					@set 'long_description', Filter.filter.getActiveChild().get 'long_description'

			valuesCollection = new ValuesCollection()
			valuesCollection.rebuild()

			valuesModel = new ValuesModel()
			valuesModel.rebuild()

			new Filter.ValuesView
				collection: valuesCollection
				model: valuesModel