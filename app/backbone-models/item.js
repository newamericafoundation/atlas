var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');


var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

exports.Model = base.Model.extend({
	parse: function(data) {
		this._processValues(data);
		this._checkPindrop(data);
		this._checkState(data);
		return data;
	},
	_processValues: function(data) {
		var key, value;
		for (key in data) {
			value = data[key];
			if (_.isString(value)) {
				if ((value.indexOf("|") > -1) && (value.indexOf("\n") === -1)) {
					data[key] = App.Util.formatters.atlasArrayToArray(value);
				} else {
					data[key] = value.trim();
				}
			}
		}
		return data;
	},
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
	_checkState: function(data) {
		var errors, stateData;
		errors = [];
		if (data.name != null) {
			stateData = _.where(Atlas.Data.states, {
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
	getImageName: function() {
		if (this.get('image') != null) {
			return this.get('image');
		}
		return this.get('name').replace(/(\r\n|\n|\r)/gm, "").toLowerCase();
	},
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
	toLongLatPoint: function() {
		return this.toLatLongPoint().reverse();
	},
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
	getLayerClasses: function(filter, valueHoverIndex, searchTerm, baseClass) {
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
		if (App.currentDisplayMode === 'filter') {
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
		} else if (App.currentDisplayMode === 'search') {
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
	model: Models.Item,
	getItemType: function() {
		var itemType;
		itemType = this.models[0].get('_itemType');
		return itemType;
	},
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
	getSortedValueList: function(key) {},
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
		state: function(collection) {
			var data, richGeoJson, setup;
			richGeoJson = new Models.RichGeoJson();
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
			data = App['us-states-10m'];
			if (data != null) {
				setup(data);
			} else {
				$.ajax({
					url: '/data/us-states-10m.js',
					dataType: 'script',
					success: function() {
						return setup(App['us-states-10m']);
					}
				});
			}
			return richGeoJson;
		},
		pindrop: function(collection) {
			var item, j, len, ref, richGeoJson;
			richGeoJson = new Models.RichGeoJson();
			ref = collection.models;
			for (j = 0, len = ref.length; j < len; j++) {
				item = ref[j];
				richGeoJson.features.push(item.toRichGeoJsonFeature());
			}
			richGeoJson.trigger('sync');
			return richGeoJson;
		}
	},
	getRichGeoJson: function() {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this);
	}
});