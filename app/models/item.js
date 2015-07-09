var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	rgf = require('./rich_geo_feature'),
	$ = require('jquery'),
	states = require('./../../db/seeds/states.json');

var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

// @constructor
// Note on methods toLatLongPoint, toRichGeoJson: these methods assume that the model instance has a lat and long fields.
exports.Model = base.Model.extend({
	/** 
	 * Recognize and process data.
	 * @param {object} data
	 * @returns {object} data - Modified data.
	 */
	parse: function(data) {
		this._processValues(data);
		this._checkPindrop(data);
		this._checkState(data);
		return data;
	},
	
	/** 
	 * Splits up values separated by '|' and removes leading and trailing whitespaces.
	 * Values are not split if there is a return character (assume text).
	 * Values are converted into arrays only if there is a '|' character.
	 * @param {object} data - Data object with key-value pairs
	 * @returns {object} data - Modified data.
	 */
	_processValues: function(data) {
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
	},
	
	/** 
	 * Recognizes, validates and returns a pindrop item.
	 * @param {object} data
	 * @returns {object} - Validation summary object.
	 */
	_checkPindrop: function(data) {
		var errors, foundLat, foundLong;
		errors = [];
		foundLat = this._findAndReplaceKey(data, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		foundLong = this._findAndReplaceKey(data, 'long', ['longitude', 'Longitude', 'long', 'Long']);
		if (foundLat && foundLong) {
			data._itemType = 'pindrop';
			return {
				recognized: true,
				errors: []
			};
		} else if (foundLat || foundLong) {
			return {
				recognized: true,
				errors: ['Latitude or longitude not found.']
			};
		}
		return {
			recognized: false
		};
	},
	
	/** 
	 * Recognizes, validates and returns a US state.
	 * @param {object} data
	 * @returns {object} - Validation summary object.
	 */
	_checkState: function(data) {
		var errors, stateData;
		errors = [];
		if (data.name != null) {
			stateData = _.where(states, {
				name: data.name
			});
			if ((stateData != null) && stateData.length > 0) {
				data.id = stateData[0].id;
				data.code = stateData[0].code;
				data._itemType = 'state';
			} else {
				errors.push(data.name + ' not recognized as a state. Possibly a typo.');
			}
			return {
				recognized: true,
				errors: errors
			};
		}
		return {
			recognized: false
		};
	},
	
	/** 
	 * Get and format image name
	 * @returns {string} name - Lower-cased name without line breaks.
	 */
	getImageName: function() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
	},
	
	/** 
	 * Sets latitude and longitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Lat, Long].
	 */
	toLatLongPoint: function() {
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
	},
	
	/** 
	 * Reverses [Lat, Long] point and sets longitude and latitude as a simple array.
	 * @returns {array} - Spatial data point as simple array [Long, Lat].
	 */
	toLongLatPoint: function() {
		return this.toLatLongPoint().reverse();
	},
	
	/** 
	 * Creates geoJson object from current model
	 * @returns {object} geoJson
	 */
	toRichGeoJsonFeature: function() {
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
	},
	
	/** 
	 * Returns layer classnames to be applied on the model.
	 * Classnames consist of group classes and element classes.
	 * Group classes specifiy generic styles such as highlighted, inactive, neutral.
	 * Element classes style components of the graphics corresponding to the item. E.g. map-pin dividers
	 * @param {object} filter - Filter object.
	 * @param {object} valueHoverIndex - Index of hovered value.
	 * @param {} searchTerm
	 * @param {string} baseClass - Base class.
	 * @param {} currentDisplayMode
	 * @returns {array} layerClasses - Array of class names.
	 */
	getLayerClasses: function(filter, valueHoverIndex, searchTerm, baseClass, currentDisplayMode) {
		var classNames, d, elementBaseClass, filterIndeces, highlightedClass, i, inactiveClass, isFiltered, j, k, layerClasses, len, neutralClass;
		if (baseClass == null) {
			baseClass = 'map-region';
		}
		highlightedClass = baseClass + '--highlighted';
		inactiveClass = baseClass + '--inactive';
		neutralClass = baseClass + '--neutral';
		elementBaseClass = baseClass + '__element';
		layerClasses = {
			group: baseClass,
			elementBase: elementBaseClass,
			elements: []
		};
		classNames = [];
		d = this.toJSON();
		if (currentDisplayMode === 'filter') {
			isFiltered = filter.test(d);
			filterIndeces = filter.getValueIndeces(d);
			k = filter.getValueCountOnActiveKey();
			if (isFiltered && (filterIndeces != null)) {
				for (j = 0, len = filterIndeces.length; j < len; j++) {
					i = filterIndeces[j];
					if ((i > -1) && isFiltered) {
						layerClasses.elements.push(elementBaseClass + " " + (filter.getBackgroundColorClass(i)));
					}
					if (i === valueHoverIndex) {
						layerClasses.group = baseClass + ' ' + highlightedClass;
					}
				}
			} else {
				layerClasses.group = baseClass + ' ' + inactiveClass;
			}
		} else if (currentDisplayMode === 'search') {
			if (this.matchesSearchTerm(searchTerm)) {
				layerClasses.group = baseClass + ' ' + neutralClass;
				layerClasses.elements = [''];
			} else {
				layerClasses.group = baseClass + ' ' + inactiveClass;
				layerClasses.elements = [''];
			}
		}
		return layerClasses;
	},
	
	/** 
	 * Evaluates whether the name attribute matches a search term.
	 * @param {string} searchTerm
	 * @returns {boolean} - Match result.
	 */
	matchesSearchTerm: function(searchTerm) {
		var name;
		name = this.get('name');
		if (!((searchTerm.toLowerCase != null) && (name.toLowerCase != null))) {
			return false;
		}
		name = name.toLowerCase();
		searchTerm = searchTerm.toLowerCase();
		if (name === "") {
			return false;
		}
		if (name.indexOf(searchTerm) === -1) {
			return false;
		}
		return true;
	}
});


exports.Collection = base.Collection.extend({
	model: exports.Model,
	
	/** 
	 * 
	 * @returns {} itemType
	 */
	getItemType: function() {
		var itemType;
		itemType = this.models[0].get('_itemType');
		return itemType;
	},
	
	/** 
	 * Set active model under collection active field.
	 * @param {} activeModel - Active model or its id.
	 * @returns {object} this
	 */
	setActive: function(activeModel) {
		var id;
		if ((_.isObject(activeModel)) && (indexOf.call(this.models, activeModel) >= 0)) {
			this.active = activeModel;
		} else {
			id = parseInt(activeModel, 10);
			this.active = id === -1 ? void 0 : this.findWhere({
				id: id
			});
		}
		return this;
	},
	
	/** 
	 * Set hovered model under collection hovered field.
	 * @param {} hoveredModel - Hovered model or its id.
	 * @returns {object} this
	 */
	setHovered: function(hoveredModel) {
		var id;
		if ((_.isObject(hoveredModel)) && (indexOf.call(this.models, hoveredModel) >= 0)) {
			this.hovered = hoveredModel;
		} else {
			id = parseInt(hoveredModel, 10);
			this.hovered = id === -1 ? void 0 : this.findWhere({
				id: id
			});
		}
		return this;
	},
	
	/** 
	 * Gets value list for a given key.
	 * @param {string} key
	 * @returns {array} valueList
	 */
	getValueList: function(key) {
		var j, l, len, len1, model, ref, val, value, valueList;
		valueList = [];
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			value = model.get(key);
			if (_.isArray(value)) {
				for (l = 0, len1 = value.length; l < len1; l++) {
					val = value[l];
					if (indexOf.call(valueList, val) < 0) {
						valueList.push(val);
					}
				}
			} else {
				if (indexOf.call(valueList, value) < 0) {
					valueList.push(value);
				}
			}
		}
		return valueList;
	},
	
	/** TODO: Gets value list sorted by frequency in the data. */
	getSortedValueList: function(key) {},
	
	/** 
	 * Assumes the model has a latitude and longitude fields.
	 * Must first go through parse method to make sure these fields are named correctly.
	 * @returns {array} array of arrays - Latitude and longitude bounds, two arrays with two elements each.
	 */
	getLatLongBounds: function() {
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
	},
	
	/** 
	 * 
	 * @returns {array} array of arrays - Returns array of simple latitute and longitude arrays.
	 */
	toLatLongMultiPoint: function() {
		var j, len, model, ref, res;
		res = [];
		ref = this.models;
		for (j = 0, len = ref.length; j < len; j++) {
			model = ref[j];
			res.push(model.toLatLongPoint());
		}
		return res;
	},
	
	richGeoJsonBuilders: {
		state: function(collection, baseGeoData) {
			var data, richGeoJson, setup;
			richGeoJson = new rgf.Collection();
			setup = function(data) {
				var feature, item, j, len, ref;
				richGeoJson.features = topojson.feature(data, data.objects.states).features;
				ref = richGeoJson.features;
				for (j = 0, len = ref.length; j < len; j++) {
					feature = ref[j];
					item = collection.findWhere({
						id: feature.id
					});
					feature._model = item;
				}
				return richGeoJson.trigger('sync');
			};
			setup(baseGeoData);
			return richGeoJson;
		},
		pindrop: function(collection) {
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
	},
	
	/** 
	 * The feature is either ready to use or triggers a sync event on itself once it is.
	 * @returns {} - Generic Rich GeoJson feature.
	 */
	getRichGeoJson: function(baseGeoData) {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this, baseGeoData);
	}

});
