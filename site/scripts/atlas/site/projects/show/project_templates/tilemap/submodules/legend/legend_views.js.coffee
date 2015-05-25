@Atlas.module 'Projects.Show.Tilemap.Legend', (Legend, App, Backbone, Marionette, $, _) ->

	Legend.IconView = Marionette.ItemView.extend

		tagName: 'li'
		className: 'atl__legend__icon'
		template: 'projects/show/project_templates/tilemap/submodules/legend/templates/icon'

		onShow: ->
			cls = @model.getBackgroundColorClass()
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
			App.vent.trigger 'value:mouseover', modelIndex
			filter = App.reqres.request 'filter'
			cls = filter.getBackgroundColorClass modelIndex
			App.commands.execute 'set:header:strip:color', { className: cls }

		# Trigger application-level value:mouseout event and clear header top strip color.
		onMouseOut: ->
			App.commands.execute 'set:header:strip:color', 'none'
			Legend.valueHoverIndex = -1
			App.vent.trigger 'value:mouseout', -1

		# Trigger application-level value click event.
		triggerValueClick: ->
			modelIndex = @_getModelIndex()
			App.vent.trigger 'value:click', modelIndex

		# Returns the index of the view's model in its collection.
		# @returns {number} index
		_getModelIndex: ->
			@model.collection.models.indexOf @model


	Legend.RootView = Marionette.CollectionView.extend

		tagName: 'ul'
		className: 'atl__legend'
		template: 'projects/show/project_templates/tilemap/submodules/legend/templates/root'
		childView: Legend.IconView

		initialize: ->
			@listenTo App.vent, 'value:click', @setActiveState
			@listenTo App.vent, 'item:mouseover item:mouseout value:mouseover value:mouseout', @setHighlighting

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