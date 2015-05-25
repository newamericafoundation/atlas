@Atlas.module "Projects.Show.Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->

	Filter.Controller = 

		show: ->

			filter = @_buildFilter()

			rootView = new Filter.RootView
				model: filter

			# expose model
			Filter.filter = filter

			keysView = @getKeysView()
			valuesView = @getValuesView()

			# expose view
			Filter.valuesView = valuesView

			App.vent.trigger 'subview:ready', { 'filter': rootView }

			rootView.getRegion('keys').show keysView
			rootView.getRegion('values').show valuesView


		tearDown: ->
			Filter.filter.stopListening()


		_buildFilter: ->
			items = App.reqres.request('item:entities')
			variables = App.reqres.request('variable:entities')
			filters = App.reqres.request('filter:entities')
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