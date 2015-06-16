@Atlas.module "Projects.Show.Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->	

	Filter.ValueView = Marionette.ItemView.extend

		tagName: 'li'
		className: 'toggle-button'
		template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_value'

		initialize: ->
			@updateActiveState()
			@listenTo @model, 'change:_isActive', @updateActiveState

		templateHelpers: App.Util.formatters

		onShow: ->
			cls = @model.getBackgroundColorClass()
			@$('.toggle-button__background').attr 'class', "toggle-button__background #{cls}"

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

		triggerValueClick: (e) ->
			e.stopPropagation() if e?
			modelIndex = @_getModelIndex()
			App.vent.trigger 'value:click', modelIndex
			@

		triggerValueMouseOver: () ->
			modelIndex = @_getModelIndex()
			Filter.valueHoverIndex = modelIndex
			App.vent.trigger 'value:mouseover', modelIndex
			@

		triggerValueMouseOut: () ->
			Filter.valueHoverIndex = -1
			App.vent.trigger 'value:mouseout'
			@

		_getModelIndex: ->
			return @model.collection.models.indexOf @model



	Filter.ValuesView = Marionette.CompositeView.extend

		tagName: 'div'
		className: 'atl__filter-values'
		template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_values'
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
		template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_key'
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
		className: ''
		template: 'projects/show/project_templates/tilemap/submodules/filter/templates/filter_keys'
		childView: Filter.KeyView
		childViewContainer: 'ul'



	Filter.RootView = Marionette.LayoutView.extend

		tagName: 'div'
		className: 'atl__filter'
		template: 'projects/show/project_templates/tilemap/submodules/filter/templates/root'
		
		regions:
			keys: '#filter__keys'
			values: '#filter__values'