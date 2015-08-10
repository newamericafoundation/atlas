@Atlas.module "Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->	

	Filter.ValueView = Marionette.ItemView.extend

		tagName: 'li'
		className: 'toggle-button'
		template: 'tilemap/submodules/filter/templates/filter_value'

		initialize: ->
			@updateActiveState()
			@listenTo @model, 'change:_isActive', @updateActiveState

		templateHelpers: App.Util.formatters

		onShow: ->
			cls = @getBackgroundColorClass()
			@$('.hexicon__hex').attr 'class', "hexicon__hex #{cls}"

		events: 
			'click': 'triggerValueClick'
			'mouseenter': 'triggerValueMouseOver'
			'mouseleave': 'triggerValueMouseOut'

		updateActiveState: ->
			if @model.isActive()
				@$el.removeClass('toggle-button--inactive')
			else
				@$el.addClass('toggle-button--inactive')
			@

		getBackgroundColorClass: ->
			k = @model.parent.parent.getValueCountOnActiveKey()
			i = @_getModelIndex() + 1
			colorIndex = App.CSS.ClassBuilder.interpolate(i, k)
			"bg-c-#{colorIndex}"

		triggerValueClick: (e) ->
			e.stopPropagation() if e?
			modelIndex = @_getModelIndex()
			App.vent.trigger 'value:click', modelIndex
			@

		triggerValueMouseOver: () ->
			modelIndex = @_getModelIndex()
			Filter.valueHoverIndex = modelIndex
			filter = @model.parent.parent
			filter.state.valueHoverIndex = modelIndex
			App.vent.trigger 'value:mouseover', modelIndex
			cls = @getBackgroundColorClass()
			App.commands.execute 'set:header:strip:color', { className: cls }
			@

		triggerValueMouseOut: () ->
			Filter.valueHoverIndex = -1
			filter = @model.parent.parent
			filter.state.valueHoverIndex = -1
			App.vent.trigger 'value:mouseout'
			App.commands.execute 'set:header:strip:color', 'none'
			@

		_getModelIndex: ->
			return unless @model.collection?
			return @model.collection.models.indexOf @model



	Filter.ValuesView = Marionette.CompositeView.extend

		tagName: 'div'
		className: 'atl__filter__values'
		template: 'tilemap/submodules/filter/templates/filter_values'
		childView: Filter.ValueView
		childViewContainer: 'ul'

		initialize: ->
			@listenTo App.vent, 'key:click', @rebuild
			@listenTo @model, 'change', @render

		rebuild: ->
			@model.rebuild()
			@collection.rebuild()



	Filter.KeyView = Marionette.ItemView.extend

		tagName: 'li'
		className: 'button'
		template: 'tilemap/submodules/filter/templates/filter_key'
		childView: Filter.ValueView
		childViewContainer: 'ul'

		initialize: ->
			@updateActiveState()
			@listenTo @model, 'change:_isActive', @updateActiveState
		
		events: 
			'click': 'handleClick'

		updateActiveState: ->
			if @model.isActive()
				@$el.addClass('button--active')
			else
				@$el.removeClass('button--active')
				
		handleClick: (e) ->
			e.stopPropagation()
			if not @model.isActive()
				modelIndex = @_getModelIndex()
				App.vent.trigger 'key:click', modelIndex
			@

		_getModelIndex: ->
			return @model.collection.models.indexOf @model


	Filter.KeysView = Marionette.CompositeView.extend

		tagName: 'div'
		className: 'atl__filter__keys'
		template: 'tilemap/submodules/filter/templates/filter_keys'
		childView: Filter.KeyView
		childViewContainer: 'ul'



	Filter.RootView = Marionette.LayoutView.extend

		tagName: 'div'
		className: 'atl__filter'
		template: 'tilemap/submodules/filter/templates/root'
		
		regions:
			keys: '#atl__filter__keys'
			values: '#atl__filter__values'