@Atlas.module "Projects.Show.Tilemap.Filter", (Filter, App, Backbone, Marionette, $, _) ->

	# @constructor
	Filter.ValueModel = Marionette.Accountant.CompositeModel.extend

		# Test data.
		# @param {obj} d - Tested data hash.
		# @param {obj} options - Testing options, such as ignoreState (if set to true, data is tested even if filter is not active).
		test: (d, options) ->
			return false if not d?
			return false if ((not @get('_isActive')) and (not (options? and options.ignoreState))) 
			res = false
			key = @parent.get('variable_id')
			value = d[key]
			if not _.isArray(value)
				value = [ value ]
			for val in value
				res = res or @testValue(val)
			return res

		# Tests a single value.
		testValue: (value) ->
			res = false
			if @_isNumericFilter()
				res = true if (value < @get('max')) and (value > @get('min'))
			else
				res = true if value is @get('value')
			res

		# Checks if filter is numerical
		# @returns {boolean}
		_isNumericFilter: ->
			return ( @get('min')? and @get('max')? )

		# Returns active state.
		# @returns {boolean}
		isActive: ->
			@get '_isActive'

		# Activates value.
		# @returns {obj} this
		activate: ->
			@set '_isActive', true
			@

		# Deactivates value.
		# @returns {obj} this
		deactivate: ->
			@set '_isActive', false
			@

		# Toggles value.
		# @returns {obj} this
		toggle: ->
			@set '_isActive', !@isActive()
			@

		# Returns whether model is the child of the active parent.
		isParentActive: ->
			@parent is @parent.parent.getActiveChild()

		handleClick: ->
			@toggle()
			keyIndex = @parent.get('_index')
			activeKeyIndex = @parent.parent.get('activeIndex')

		getBackgroundColorClass: ->
			filter = @parent.parent
			filter.getBackgroundColorClass @get '_index'


	# @constructor
	Filter.KeyModel = Marionette.Accountant.CompositeModel.extend

		childModel: Filter.ValueModel

		# Activates all children.
		# @returns {obj} this
		activateAllChildren: ->
			child.activate() for child in @children
			@

		# Deactivates all children.
		# @returns {obj} this
		deactivateAllChildren: ->
			child.deactivate() for child in @children
			@

		# Toggles all children.
		# @returns {obj} this
		toggleAllChildren: ->
			child.toggle() for child in @children
			@

		# Returns active state.
		# @returns {boolean}
		isActive: ->
			@get '_isActive'

		# Activates value.
		# @returns {obj} this
		activate: ->
			@set '_isActive', true
			@

		# Deactivates value. Activates all children (resets children for next time the key is activated).
		# @returns {obj} this
		deactivate: ->
			@set '_isActive', false
			@activateAllChildren()
			@

		# Toggles value.
		# @returns {obj} this
		toggle: ->
			@set '_isActive', !@get('_isActive')
			@

		# Toggles one child.
		# @param {number} childIndex
		# @returns {obj} this
		toggleOne: (childIndex) ->
			@children[childIndex].toggle()

		# Returns the index of the child which tests the input data true. Used for color coding by filter options.
		# @param {obj} d - Input data.
		# @returns {number} index - Test index. If none found, returns undefined.
		getValueIndeces: (model) ->
			data = if (_.isFunction(model.toJSON)) then model.toJSON() else model
			dataIndeces = []
			for child, i in @children
				if child.test(data)
					dataIndeces.push i
			dataIndeces

		# Returns value of a child at a specified index.
		# @param {number} index
		# @returns {string} value
		getValue: (index) ->
			@children[index].get('value')

		# Test data against all children. Returns true if any data passes for at least one child.
		# @param {obj} data - Tested data hash.
		# @param {obj} options - Testing options, such as ignoreState (if set to true, data is tested even if filter is not active).
		test: (data, options) ->
			result = false
			for child in @children
				if child.test(data, options)
					result = true
			result

		# Returns background color class for model, interpolating the color scheme across its siblings.
		getBackgroundColorClass: () ->
			valueIndex = @parent.children.indexOf this
			@parent.getBackgroundColorClass valueIndex


	# @constructor
	Filter.Model = Marionette.Accountant.CompositeModel.extend

		childModel: Filter.KeyModel

		initialize: ->
			@listenTo App.vent, 'value:click', (index) ->
				@getActiveChild().children[index].handleClick() if @getActiveChild().children[index]?

			@listenTo App.vent, 'key:click', (index) ->
				@setActiveChildByIndex index

		# Test data against all children of the active child. Returns true if any data passes for at least one child.
		# @param {obj} d - Tested data hash.
		# @param {obj} options - Testing options, such as ignoreState (if set to true, data is tested even if filter is not active).
		test: (data) ->
			return @getActiveChild().test(data)

		# Sets active child index.
		# @param {number} activeIndex
		setActiveChildByIndex: (activeChildIndex) ->
			if @children[activeChildIndex] isnt @getActiveChild()
				@getActiveChild().deactivate()
				@children[activeChildIndex].activate()
				return true
			return false

		# Returns active child.
		getActiveChild: ->
			for child in @children
				if child.isActive()
					return child

		# Returns background color class by value index.
		# @param {number} valueIndex
		# @returns {string} colorClass
		getBackgroundColorClass: (valueIndex) ->
			k = @getValueCountOnActiveKey()
			i = valueIndex + 1
			colorIndex = App.CSS.ClassBuilder.interpolate(i, k)
			"bg-c-#{colorIndex}"

		# Returns value matched to the model.
		# @param {object} model
		# @returns {string} value
		getMatchingValue: (model) ->
			ind = @getValueIndeces(model)[0]
			if @getActiveChild().children[ind]?
				return @getActiveChild().children[ind].get 'value'
			return undefined

		# Returns the number of values on the active filter key.
		# @returns {number} valueCount
		getValueCountOnActiveKey: ->
			return @getActiveChild().children.length

		# Returns filter indeces for a model as an array. The first value is the index of the active filter key, and the second is the index of the value corresponding to the model data.
		# @param {obj} data - Data hash or backbone model.
		# @returns {array} arr - [ keyIndex, valueIndex ]
		getValueIndeces: (model) ->
			ach = @getActiveChild()
			ach.getValueIndeces(model)


		# Evaluates model.
		evaluate: (model) ->
			d = model.toJSON()
			result = 
				tested: true
				keyIndex: 1
				valueIndeces: 4
				totalValues: 8

		# Returns list of filter values for a given key.
		# @param {number} keyIndex
		# @returns {array}
		getItemListByOption: (keyIndex) ->
			ach = @getActiveChild()
			gch = ach.children[keyIndex]
			list = []
			data = @parent.data.data.data
			for datum in data
				if gch.test(datum, ignoreState: true)
					list.push datum.state
			list