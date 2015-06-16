@Atlas.module 'Projects.Show.Tilemap.Filter', (Filter, App, Backbone, Marionette, $, _) ->

	# Builds filter tree object. Contains all filter data keys (variable_id) and all values that appear in the item set.
	# @param {object} items
	# @param {object} variables
	# @param {object} filters
	# @returns {object} filterTree
	Filter.buildFilterTree = (items, variables, filters) ->

		filters ?= []

		filterVariables = filters.map (filter, index) ->

			formatters = App.Util.formatters

			variable = filter.getVariableModel()

			variable_id = variable.get 'id'
			display_title = variable.get 'display_title'
			short_description = variable.get 'short_description'
			long_description = variable.get 'long_description'
			long_description = formatters.mdToHtml(long_description)
			type = filter.get 'type'

			o =
				variable_id: variable_id
				display_title: display_title
				short_description: short_description
				long_description: long_description
				type: filter.get type
				_isActive: (if index is 0 then true else false)

			nd = filter.get('numerical_dividers')

			if nd?
				o.values = Filter.buildNumericalFilter nd
			else
				o.values = _.map items.getValueList(o.variable_id), (item) ->
					{ value: item }

			_.map o.values, (val) ->
				val._isActive = true
				val

			o

		filterTree = 
			variables: filterVariables

		filterTree


	# Builds numerical filter value object from bounds.
	# @param {number} min - Lower bound.
	# @param {number} max - Upper bound.
	# @returns {object} filterValue
	Filter.buildNumericalFilterValue = (min, max) ->
		filterValue =
			min: min
			max: max

		if min is -1000000
			filterValue.value = "Less than #{max}"
		else if max is +1000000
			filterValue.value = "Greater than #{min}"
		else
			filterValue.value = "Between #{min} and #{max}"
		filterValue


	# Builds numerical filter array from divider string.
	# @param {string} dividerString
	# @returns {object} numericalFilter
	Filter.buildNumericalFilter = (dividerString) ->

		values = _.map dividerString.split('|'), (member, index) ->
			if member is ""
				if index is 0
					return -1000000
				return +1000000
			return parseInt member, 10

		numericalFilter = []

		for i in [0..values.length-2]
			numericalFilter.push Filter.buildNumericalFilterValue(values[i], values[i + 1])

		numericalFilter