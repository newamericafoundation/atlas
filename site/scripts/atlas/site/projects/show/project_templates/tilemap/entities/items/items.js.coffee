@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	@startWithParent = false

	@on 'start', () ->

		data = App.currentProjectData.data

		items = new Entities.ItemCollection data.items, { parse: true } if data?

		App.reqres.setHandler 'item:entities', (query) =>

			if items?
				# use query object by default
				if _.isObject query
					return items.findWhere query

				# if no object is passed in, assume it is an id
				if query?
					id = parseInt(query, 10)
					return items.findWhere({ id: id })

			# if nothing is passed in, return the whole collection
			items


		setHeaderStripColor = ->
			items = App.reqres.request 'item:entities'
			filter = App.reqres.request 'filter'
			hoveredItem = items.hovered
			if hoveredItem?
				i = filter.getValueIndeces hoveredItem
				cls = filter.getBackgroundColorClass i[0]
				App.commands.execute 'set:header:strip:color', { className: cls }
			else
				App.commands.execute 'set:header:strip:color', 'none'


		@listenTo App.vent, 'item:activate', (modelOrId) ->
			items.setActive modelOrId

		@listenTo App.vent, 'item:deactivate', ->
			items.setActive -1
			

		@listenTo App.vent, 'item:mouseover', (modelOrId) ->
			items.setHovered modelOrId
			setHeaderStripColor()

		@listenTo App.vent, 'item:mouseout', () ->
			items.setHovered -1
			setHeaderStripColor()