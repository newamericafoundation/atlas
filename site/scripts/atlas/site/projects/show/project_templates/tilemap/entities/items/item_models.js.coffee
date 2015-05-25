@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	# @constructor
	# Note on methods toLatLongPoint, toRichGeoJson: these methods assume that the model instance has a lat and long fields.
	Entities.ItemModel = Backbone.Model.extend
		
		# Recognize and process data.
		parse: (data) ->
			@_processValues(data)
			Entities.itemChecker.pindrop(data)
			Entities.itemChecker.state(data)
			data

		# Splits up values separated by '|' and removes leading and trailing whitespaces.
		# Values are not split if there is a return character.
		# Values are converted into arrays only if there is a '|' character.
		_processValues: (data) ->
			for key, value of data
				if value? and value.indexOf? and value.split? and value.trim?
					if (value.indexOf("|") > -1) and (value.indexOf("\n") is -1)
						value = value.split "|"
						value = _.map value, (val) ->
							val.trim()
						data[key] = value
					else
						data[key] = value.trim()
			data

		# Returns latitude and longitude as a simple array.
		# @returns {array}
		toLatLongPoint: ->
			lat = @get 'lat'
			long = @get 'long'
			# if not latitude and longitude is found on the item, 
			#   set location to Melbourne, Australia
			lat ?= -37.8602828
			long ?= 145.0796161
			[lat, long]

		# Returns longitude and latitude as a simple array.
		# @returns {array}
		toLongLatPoint: ->
			@toLatLongPoint().reverse()

		# Returns GeoJson feature representation, with an embedded reference to the model instance. This is referred to as Rich GeoJson.
		# @returns {object} geoJson
		toRichGeoJsonFeature: ->
			geoJson = 
				type: 'Feature'
				_model: @
				geometry:
					type: 'Point'
					coordinates: @toLongLatPoint()
			geoJson


		# Returns layer classnames to be applied on the model.
		#   Classnames consist of group classes and element classes.
		#   Group classes specifiy generic styles such as highlighted, inactive, neutral.
		#   Element classes style components of the graphics corresponding to the item.
		#     - e.g. map-pin dividers
		# @param {object} filter - Filter object.
		# @param {object} valueHoverIndex - Index of hovered value.
		# @param {string} baseClass - Base class.
		# @returns {array} classNames
		getLayerClasses: (filter, valueHoverIndex, searchTerm, baseClass = 'map-region') ->

			highlightedClass = baseClass + '--highlighted'
			inactiveClass = baseClass + '--inactive'
			neutralClass = baseClass + '--neutral' # displayed, but in a generic, neutral way
			elementBaseClass = baseClass + '__element'

			layerClasses =
				group: baseClass
				elementBase: elementBaseClass
				elements: []

			classNames = []

			d = @toJSON()

			# Apply classes in filter mode.
			if App.currentDisplayMode is 'filter'
				isFiltered = filter.test d
				filterIndeces = filter.getValueIndeces(d)
				k = filter.getValueCountOnActiveKey()
				if isFiltered and filterIndeces?
					for i in filterIndeces
						if (i > -1) and (isFiltered)
							layerClasses.elements.push "#{elementBaseClass} #{filter.getBackgroundColorClass(i)}"
						if i is valueHoverIndex
							layerClasses.group = baseClass + ' ' + highlightedClass
				else
					layerClasses.group = (baseClass + ' ' + inactiveClass)

			# Apply classes in search mode.
			else if App.currentDisplayMode is 'search'

				if @matchesSearchTerm(searchTerm)
					layerClasses.group = (baseClass + ' ' + neutralClass)
					layerClasses.elements = [ '' ]
				else
					layerClasses.group = (baseClass + ' ' + inactiveClass)
					layerClasses.elements = [ '' ]

			layerClasses


		# Evaluates whether the name attribute matches a search term.
		# @param {string} searchTerm
		# @returns {boolean} match result
		matchesSearchTerm: (searchTerm) ->
			name = @get('name')
			return false if not (searchTerm.toLowerCase? and name.toLowerCase?)
			name = name.toLowerCase()
			searchTerm = searchTerm.toLowerCase()
			return false if (name is "")
			return false if name.indexOf(searchTerm) is -1
			return true


	# @constructor
	Entities.ItemCollection = Backbone.Collection.extend

		model: Entities.ItemModel

		getItemType: ->
			itemType = @models[0].get '_itemType'
			itemType

		# set active model under collection active field
		# @param {} active model or its id
		# @returns {Object} this
		setActive: (activeModel) ->
			if (_.isObject activeModel) and (activeModel in @models)
				@active = activeModel
			else
				id = parseInt(activeModel, 10);
				@active = if id is -1 then undefined else @findWhere( id: id )
			@

		# set hovered model under collection hovered field
		# @param {} hovered model or its id
		# @returns {Object} this
		setHovered: (hoveredModel) ->
			if (_.isObject hoveredModel) and (hoveredModel in @models)
				@hovered = hoveredModel
			else
				id = parseInt(hoveredModel, 10);
				@hovered = if id is -1 then undefined else @findWhere( id: id )
			@

		# Gets value list for a given key
		# @param {string} key
		# @returns {array} 
		getValueList: (key) ->
			valueList = []
			for model in @models
				value = model.get key
				if _.isArray value
					for val in value
						valueList.push val if val not in valueList
				else
					valueList.push value if value not in valueList
			valueList

		# TODO:
		# Gets value list sorted by frequency in the data.
		getSortedValueList: (key) ->


		# Returns latitude and longitude bounds.
		# Assumes the model has a latitude and longitude fields.
		# Must first go through parse method to make sure these fields are named correctly.
		getLatLongBounds: ->

			for model in @models
				lat = model.get 'lat'
				long = model.get 'long'

				minLat = lat if (not minLat?) or (minLat > lat)
				maxLat = lat if (not maxLat?) or (maxLat < lat)

				minLong = long if (not minLong?) or (minLong > long)
				maxLong = long if (not maxLong?) or (maxLong < long)

			return [ [minLat, minLong], [maxLat, maxLong] ]

		# Returns an array of simple latitude and longitude arrays.
		# @returns {array}
		toLatLongMultiPoint: ->
			res = []
			for model in @models
				res.push model.toLatLongPoint()
			res

		# Returns generic Rich GeoJson feature.
		# The feature is either ready to use or triggers a sync event on itself once it is.
		getRichGeoJson: ->
			type = this.getItemType()
			Entities.itemGeoJsonInjecters[type](@)