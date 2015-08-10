@Atlas.module "Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->

	Filter.Controller = 

		show: ->

			filter = @_getFilter()
			filter.state = {}

			Filter.rootView = new Filter.RootView
				el: '.atl__filter'
				model: filter

			# expose model
			Filter.filter = filter

			Filter.keysView = @getKeysView()
			Filter.valuesView = @getValuesView()

			Filter.rootView.render()
			App.vent.trigger 'show:component:ready'

			Filter.rootView.getRegion('keys').show Filter.keysView
			Filter.rootView.getRegion('values').show Filter.valuesView


		destroy: ->
			Filter.filter.stopListening()


		_getFilter: ->
			model = App.currentProjectModel
			filter = model.get('data').filter

			filter.listenTo App.vent, 'value:click', (index) ->
				@getActiveChild().children[index].handleClick() if @getActiveChild().children[index]?

			filter.listenTo App.vent, 'key:click', (index) ->
				@setActiveChildByIndex index

			filter


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