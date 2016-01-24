import _ from 'underscore'

import * as base from './../base.js'
import rgf from './../rich_geo_feature.js'

import * as richGeoJsonBuilders from './rich_geo_json_builder.js'
import setType from './type_checker.js'

import standardizeKey from './../utilities/standardize_key.js'

/** 
 * @constructor
 * Note on methods toLatLongPoint, toRichGeoJson: these methods assume that the model instance has a lat and long fields. 
 */
export class Model extends base.Model {
	
	/** 
	 * Recognize and process data.
	 * @param {object} data
	 * @returns {object} data - Modified data.
	 */
	parse(data) {

		this._standardizeName(data)
		this._processValues(data)
		setType(data)

		return data
	}


	_standardizeName(data) {
		standardizeKey(data, 'name', [ 'name', 'Name' ])
		if (data.Name && !data.name) {
			data.name = data.Name
			delete data.Name
		}
		return data
	}

	
	/** 
	 * Splits up values separated by '|' and removes leading and trailing whitespaces.
	 * Values are not split if there is a return character (assume text).
	 * Values are converted into arrays only if there is a '|' character.
	 * @param {object} data - Data object with key-value pairs.
	 * @returns {object} data - Modified data.
	 */
	_processValues(data) {
		for (let key in data) {
			let value = data[key]
			if (_.isString(value)) {
				if ((value.indexOf("|") > -1) && (value.indexOf("\n") === -1)) {
					data[key] = value.split('|').map(item => item.trim())
				} else {
					data[key] = value.trim()
				}
			}
		}
		return data
	}


	/** 
	 * Get and format image name.
	 * @returns {string} name - Lower-cased name without line breaks.
	 */
	getImageName() {
		if (this.get('image') != null) {
			return this.get('image')
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase()
	}

	
	/** 
	 * Sets latitude and longitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Lat, Long].
	 */
	toLatLongPoint() {
		var lat = this.get('lat')
		var long = this.get('long')
		if (lat == null) { lat = -37.8602828 }
		if (long == null) { long = 145.0796161 }
		return [lat, long]
	}

	
	/** 
	 * Reverses [Lat, Long] point and sets longitude and latitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Long, Lat].
	 */
	toLongLatPoint() {
		return this.toLatLongPoint().reverse()
	}

	
	/**
	 * Creates geoJson object from current model.
	 * @returns {object} geoJson.
	 */
	toRichGeoJsonFeature() {
		var geoJson = {
			type: 'Feature',
			_model: this,
			geometry: {
				type: 'Point',
				coordinates: this.toLongLatPoint()
			}
		}
		return geoJson
	}


	/**
	 * Returns display state.
	 * @param {}
	 * @returns {string} displayState - Element of [ 'neutral', 'highlighted', 'inactive' ]
	 */
	getDisplayState(filter, searchTerm) {

		var filterIndeces, valueHoverIndex, isFiltered

		if (!this.matchesSearchTerm(searchTerm)) { return 'inactive' }

		filterIndeces = filter.getValueIndeces(this)
		var { valueHoverIndex } = filter.state

		isFiltered = (filterIndeces.length > 0)

		if (!isFiltered) { return 'inactive' }

		if (filterIndeces.indexOf(valueHoverIndex) > -1) { return 'highlighted' }

		return

	}

	
	/** 
	 * Evaluates whether the name attribute matches a search term.
	 * @param {string} searchTerm
	 * @returns {boolean} - Match result.
	 */
	matchesSearchTerm(searchTerm) {
		var name = this.get('name')
		if (!searchTerm || searchTerm === "") { return true }
		if (!name) { return false }
		name = name.toLowerCase()
		searchTerm = searchTerm.toLowerCase()
		if (name === "") { return false }
		if (name.indexOf(searchTerm) === -1) { return false }
		return true
	}

}



/*
 *
 *
 */
export class Collection extends base.Collection {

	get model() { return Model }
	

	/** 
	 * Gets item type first model in a collection.
	 * @returns {string} itemType
	 */
	getItemType() {
		return this.models[0].get('_itemType')
	}
	

	/** 
	 * Set active model under collection active field.
	 * @param {} activeModel - Active model or its id.
	 * @returns {object} this
	 */
	setActive(activeModel) {
		var id
		if ((_.isObject(activeModel)) && (this.models.indexOf(activeModel) >= 0)) {
			this.active = activeModel
		} else {
			id = parseInt(activeModel, 10)
			this.active = id === -1 ? void 0 : this.findWhere({ id: id })
		}
		return this
	}
	

	/** 
	 * Set hovered model under collection hovered field.
	 * @param {} hoveredModel - Hovered model or its id.
	 * @returns {object} this
	 */
	setHovered(hoveredModel) {
		var id
		if ((_.isObject(hoveredModel)) && (this.models.indexOf(hoveredModel) >= 0)) {
			this.hovered = hoveredModel
		} else {
			id = parseInt(hoveredModel, 10)
			this.hovered = (id === -1) ? undefined : this.findWhere({ id: id })
		}
		return this
	}
	

	/** 
	 * Gets lists of values for a given key.
	 * @param {string|object} key|variable - Key or variable model instance.
	 * @returns {array} values - List of values for specified key.
	 */
	getValueList(variable) {
		var key = variable.get('id')
		var values = []

		this.models.forEach((model) => {
			var value = model.get(key)
			if (_.isArray(value)) {
				value.forEach((val) => {
					if (values.indexOf(val) < 0) { values.push(val) }
				})
			} else {
				if (values.indexOf(value) < 0) { values.push(value) }
			}
		})

		// Sort value list if there is a value_order array set on the variable.
		if (variable && variable.get('value_order')) {
			let valueOrderArray = variable.get('value_order').split('|').map(s => s.trim())
			values = values.sort((val_1, val_2) => {
				var index_1 = valueOrderArray.indexOf(val_1)
				var index_2 = valueOrderArray.indexOf(val_2)
				// If the value is not present in the value_order array, place it at the end of the list.
				if (index_1 < 0) { index_1 = 1000 }
				if (index_2 < 0) { index_2 = 1000 }
				return (index_1 - index_2)
			})
		}

		return values
	}
	

	/** 
	 * Assumes the model has a latitude and longitude fields.
	 * Must first go through parse method to make sure these fields are named correctly.
	 * @returns {array} array of arrays - Latitude and longitude bounds, two arrays with two elements each.
	 */
	getLatLongBounds() {
		var maxLat, maxLong, minLat, minLong
		for (let model of this.models) {
			let lat = model.get('lat')
			let long = model.get('long')
			if ((typeof minLat === "undefined" || minLat === null) || (minLat > lat)) {
				minLat = lat
			}
			if ((typeof maxLat === "undefined" || maxLat === null) || (maxLat < lat)) {
				maxLat = lat
			}
			if ((typeof minLong === "undefined" || minLong === null) || (minLong > long)) {
				minLong = long
			}
			if ((typeof maxLong === "undefined" || maxLong === null) || (maxLong < long)) {
				maxLong = long
			}
		}

		return [
			[minLat, minLong],
			[maxLat, maxLong]
		]
	}
	

	/** 
	 * Creates single array from lat, long arrays of each model into one array (array of arrays).
	 * @returns {array} res - Returns array of arrays. E.g. [[lat, long], [lat, long]]
	 */
	toLatLongMultiPoint() {
		return this.models.map(model => model.toLatLongPoint())
	}
	

	/** 
	 * The feature is either ready to use or triggers a sync event on itself once it is.
	 * @returns {} - Generic Rich GeoJson feature.
	 */
	getRichGeoJson(baseGeoData) {
		var type = this.getItemType()
		return richGeoJsonBuilders[type](this, baseGeoData)
	}

}