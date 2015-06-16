@Atlas.module 'Projects.Show.Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.modelBuilder = (filter, items) ->

		# [ California, Ohio, ..., ... ] -> California, Ohio and 26 other states
		formatItemList = (items) ->
			if items.length is 0
				return ' '
			if items.length is 1
				return items[0]
			if items.length is 2
				return "#{items[0]} and #{items[1]}"
			if items.length is 3
				return "#{items[0]}, #{items[1]} and #{items[2]}"
			return "#{items[0]}, #{items[1]} and #{items.length - 2} others"

		obj = 
			key: ' '
			value: ' '
			items: ' '

		matchingItems = []

		activeFilterChild = filter.getActiveChild()

		obj.key = activeFilterChild.get('short_description')
		varId = activeFilterChild.get('variable_id')

		valueIndex = App.reqres.request 'value:hovered'

		if valueIndex isnt -1
			filterValue = activeFilterChild.children[valueIndex]
			items.each (item) ->
				itemJSON = item.toJSON()
				if filterValue? and filterValue.test? and filterValue.test itemJSON, { ignoreState: true }
					matchingItems.push(itemJSON.name)
			obj.items = formatItemList(matchingItems)
			if filterValue?
				obj.value = filterValue.get('value')

		if items.hovered?
			hoveredItem = items.hovered
			obj.items = hoveredItem.get 'name'
			obj.value = hoveredItem.get(varId)

		obj