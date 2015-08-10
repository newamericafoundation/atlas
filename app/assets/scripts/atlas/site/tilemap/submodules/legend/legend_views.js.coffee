@Atlas.module 'Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	Legend.IconView = Marionette.ItemView.extend

		tagName: 'li'
		className: 'atl__legend__icon'
		template: 'tilemap/submodules/legend/templates/icon'

		onRender: ->
			cls = @getBackgroundColorClass()
			@$('.hexicon__hex').attr('class', "hexicon__hex #{cls}")
		
		events:
			'mouseenter': 'onMouseOver'
			'mouseleave': 'onMouseOut'
			'click': 'triggerValueClick'

		highlight: ->
			@$el.addClass 'atl__legend__icon--highlighted'

		dehighlight: ->
			@$el.removeClass 'atl__legend__icon--highlighted'

		toggleActiveState: ->
			@$el.toggleClass 'atl__legend__icon--inactive'

		# Trigger application-level value:mouseover event and set header top strip color.
		onMouseOver: ->
			modelIndex = @_getModelIndex()
			Legend.valueHoverIndex = modelIndex
			filter = @model.parent.parent
			filter.state.valueHoverIndex = modelIndex
			App.vent.trigger 'value:mouseover', modelIndex
			cls = @getBackgroundColorClass()
			App.commands.execute 'set:header:strip:color', { className: cls }

		# Trigger application-level value:mouseout event and clear header top strip color.
		onMouseOut: ->
			App.commands.execute 'set:header:strip:color', 'none'
			Legend.valueHoverIndex = -1
			filter = @model.parent.parent
			filter.state.valueHoverIndex = -1
			App.vent.trigger 'value:mouseout', -1

		# TODO: repeated in Filter view. Remove repetition.
		getBackgroundColorClass: ->
			k = @model.parent.parent.getValueCountOnActiveKey()
			i = @_getModelIndex() + 1
			colorIndex = App.CSS.ClassBuilder.interpolate(i, k)
			"bg-c-#{colorIndex}"

		# Trigger application-level value click event.
		triggerValueClick: ->
			modelIndex = @_getModelIndex()
			App.vent.trigger 'value:click', modelIndex

		# Returns the index of the view's model in its collection.
		# @returns {number} index
		_getModelIndex: ->
			@model.collection.models.indexOf @model


	Legend.RootView = Marionette.CompositeView.extend

		tagName: 'div'
		className: 'atl__legend'
		template: 'tilemap/submodules/legend/templates/root'
		childView: Legend.IconView
		childViewContainer: 'ul'

		initialize: ->
			@listenTo App.vent, 'value:click', @setActiveState
			@listenTo App.vent, 'item:mouseover item:mouseout value:mouseover value:mouseout', @setHighlighting
			@listenTo App.vent, 'key:click', ->
				filter = App.reqres.request('filter')
				@collection.reset filter.getActiveChild().children

		setActiveState: (index) ->
			child = @children.findByIndex(index)
			child.toggleActiveState()

		setHighlighting: ->
			hoveredItem = App.reqres.request('item:entities').hovered
			filter = App.reqres.request 'filter'
			if hoveredItem?
				indeces = filter.getValueIndeces(hoveredItem)
			else
				indeces = [ App.reqres.request('filter:value:hovered') ]
			@children.each (child, childIndex) -> 
				if childIndex in indeces
					child.highlight()
				else
					child.dehighlight()