import _ from 'underscore'
import * as base from './base.js'

import rgf from './rich_geo_feature.js'

var states = require('./../../db/seeds/states.json')

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

		// Protect for uppercase Name typo.
		if (data.Name && !data.name) {
			data.name = data.Name;
			delete data.Name;
		}

		this._processValues(data)
		this._checkPin(data)
		this._checkUsState(data)
		this._checkUsCongressionalDistrict(data)

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
		var key, value;
		for (key in data) {
			value = data[key];
			if (_.isString(value)) {
				if ((value.indexOf("|") > -1) && (value.indexOf("\n") === -1)) {
					data[key] = _.map(value.split('|'), function(item) {
						return item.trim();
					});
				} else {
					data[key] = value.trim();
				}
			}
		}
		return data;
	}

	
	/** 
	 * Recognizes, validates and returns a pindrop item.
	 * @param {object} data
	 * @returns {object} - Validation summary object.
	 */
	_checkPin(data) {
		var foundLat, foundLong;
		foundLat = this.findAndReplaceKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		foundLong = this.findAndReplaceKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long']);
		if (foundLat && foundLong) {
			data._itemType = 'pin';
		}
		return data;
	}

	
	/** 
	 * Recognizes, validates and returns a US state.
	 * @param {object} data
	 * @returns {object} - Validation summary object.
	 */
	_checkUsState(data) {
		var stateData;
		if (data.name != null) {
			stateData = _.where(states, {
				name: data.name
			});
			if ((stateData != null) && stateData.length > 0) {
				data.id = stateData[0].id;
				data.code = stateData[0].code;
				data._itemType = 'us_state';
			}
		}
		return data;
	}


	_checkUsCongressionalDistrict(data) {
		if (data.cngdstcd != null) {
			data.id = data.cngdstcd;
			data._itemType = 'us_congressional_district';
		}
		return data;
	}


	/** 
	 * Get and format image name.
	 * @returns {string} name - Lower-cased name without line breaks.
	 */
	getImageName() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
	}

	
	/** 
	 * Sets latitude and longitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Lat, Long].
	 */
	toLatLongPoint() {
		var lat, long;
		lat = this.get('lat');
		long = this.get('long');
		if (lat == null) {
			lat = -37.8602828;
		}
		if (long == null) {
			long = 145.0796161;
		}
		return [lat, long];
	}

	
	/** 
	 * Reverses [Lat, Long] point and sets longitude and latitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Long, Lat].
	 */
	toLongLatPoint() {
		return this.toLatLongPoint().reverse();
	}

	
	/**
	 * Creates geoJson object from current model.
	 * @returns {object} geoJson.
	 */
	toRichGeoJsonFeature() {
		var geoJson;
		geoJson = {
			type: 'Feature',
			_model: this,
			geometry: {
				type: 'Point',
				coordinates: this.toLongLatPoint()
			}
		};
		return geoJson;
	}


	/**
	 * Returns display state.
	 * @param {}
	 * @returns {string} displayState - Element of [ 'neutral', 'highlighted', 'inactive' ]
	 */
	getDisplayState(filter, searchTerm) {

		var filterIndeces, valueHoverIndex, isFiltered;

		if (!this.matchesSearchTerm(searchTerm)) { return 'inactive' }

		filterIndeces = filter.getValueIndeces(this)
		var { valueHoverIndex } = filter.state

		isFiltered = (filterIndeces.length > 0);

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
	 * @returns {array} valueList - List of values for specified key.
	 */
	getValueList(variable) {
		var key = variable.get('id'),
			valueList = [];

		this.models.forEach((model) => {
			var value = model.get(key);
			if (_.isArray(value)) {
				value.forEach((val) => {
					if (valueList.indexOf(val) < 0) {
						valueList.push(val);
					}
				});
			} else {
				if (valueList.indexOf(value) < 0) {
					valueList.push(value);
				}
			}
		});

		// Sort value list if there is a value_order array set on the variable.
		if (variable && variable.get('value_order')) {
			let valueOrderArray = variable.get('value_order').split('|').map((s) => { return s.trim(); });
			valueList = valueList.sort((val_1, val_2) => {
				var index_1 = valueOrderArray.indexOf(val_1);
				var index_2 = valueOrderArray.indexOf(val_2);
				// If the value is not present in the value_order array, place it at the end of the list.
				if (index_1 < 0) { index_1 = 1000; }
				if (index_2 < 0) { index_2 = 1000; }
				return (index_1 - index_2);
			});
		}

		return valueList;
	}
	

	/** 
	 * Assumes the model has a latitude and longitude fields.
	 * Must first go through parse method to make sure these fields are named correctly.
	 * @returns {array} array of arrays - Latitude and longitude bounds, two arrays with two elements each.
	 */
	getLatLongBounds() {
		var j, lat, len, long, maxLat, maxLong, minLat, minLong, model, ref;
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			lat = model.get('lat');
			long = model.get('long');
			if ((typeof minLat === "undefined" || minLat === null) || (minLat > lat)) {
				minLat = lat;
			}
			if ((typeof maxLat === "undefined" || maxLat === null) || (maxLat < lat)) {
				maxLat = lat;
			}
			if ((typeof minLong === "undefined" || minLong === null) || (minLong > long)) {
				minLong = long;
			}
			if ((typeof maxLong === "undefined" || maxLong === null) || (maxLong < long)) {
				maxLong = long;
			}
		}
		return [
			[minLat, minLong],
			[maxLat, maxLong]
		];
	}
	

	/** 
	 * Creates single array from lat, long arrays of each model into one array (array of arrays).
	 * @returns {array} res - Returns array of arrays. E.g. [[lat, long], [lat, long]]
	 */
	toLatLongMultiPoint() {
		return this.models.map(model => model.toLatLongPoint())
	}
	

	get richGeoJsonBuilders() {

		return {

			base: function(collection, baseGeoData, getFeatureId) {

				var data, richGeoJson, setup;
				richGeoJson = new rgf.Collection();

				setup = function(data) {
					var feature, item, j, len, ref;
					richGeoJson.features = baseGeoData.features;
					ref = richGeoJson.features;
					for (j = 0, len = ref.length; j < len; j++) {
						feature = ref[j];
						let featureId = getFeatureId(feature);
						item = collection.findWhere({
							id: featureId
						});
						feature._model = item;
					}
					return richGeoJson.trigger('sync');
				};

				setup(baseGeoData);
				return richGeoJson;

			},

			us_state: function(collection, baseGeoData) {
				return this.base(collection, baseGeoData, (feature) => { return parseInt(feature.properties.id); });
			},

			us_congressional_district: function(collection, baseGeoData) {
				return this.base(collection, baseGeoData, (feature) => { 
					var props = feature.properties;
					return parseInt(`${parseInt(props.state_id, 10)}${props.id}`, 10); 
				});
			},

			pin: function(collection) {
				var item, j, len, ref, richGeoJson;
				richGeoJson = new rgf.Collection();
				ref = collection.models;
				for (j = 0, len = ref.length; j < len; j++) {
					item = ref[j];
					richGeoJson.features.push(item.toRichGeoJsonFeature());
				}
				richGeoJson.trigger('sync');
				return richGeoJson;
			}

		}

	}
	

	/** 
	 * The feature is either ready to use or triggers a sync event on itself once it is.
	 * @returns {} - Generic Rich GeoJson feature.
	 */
	getRichGeoJson(baseGeoData) {
		var type
		type = this.getItemType()
		return this.richGeoJsonBuilders[type](this, baseGeoData)
	}

}