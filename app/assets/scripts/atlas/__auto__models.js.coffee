`
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var base = require('./base'),
	baseFilter = require('./base_filter'), 
	coreDatum = ('./core_datum'), 
	filter = require('./filter'), 
	image = require('./image'), 
	infoBoxSection = require('./info_box_section'), 
	item = require('./item'), 
	project = require('./project'), 
	projectSection = require('./project_section'), 
	projectTemplate = require('./project_template'), 
	researcher = require('./researcher'), 
	richGeoFeature = require('./rich_geo_feature'), 
	variable = require('./variable');

window.Atlas.module('Models', function(Models) {

	Models.BaseModel = base.Model;
	Models.BaseCollection = base.Collection;

	Models.BaseFilterModel = baseFilter.Model;
	Models.BaseFilterCollection = baseFilter.Collection;

	Models.CoreDatum = coreDatum.Model;
	Models.CoreData = coreDatum.Collection;

	Models.Filter = filter.Model;
	Models.Filters = filter.Collection;

	Models.Image = image.Model;
	Models.Images = image.Collection;

	Models.InfoBoxSection = infoBoxSection.Model;
	Models.InfoBoxSections = infoBoxSection.Collection;

	Models.Item = item.Model;
	Models.Items = item.Collection;

	Models.Project = project.Model;
	Models.Projects = project.Collection;

	Models.ProjectSection = projectSection.Model;
	Models.ProjectSections = projectSection.Collection;

	Models.ProjectTemplate = projectTemplate.Model;
	Models.ProjectTemplates = projectTemplate.Collection;

	Models.Researcher = researcher.Model;
	Models.Researchers = researcher.Collection;

	Models.RichGeoFeature = richGeoFeature.Model;
	Models.RichGeoFeatures = richGeoFeature.Collection;
	
	Models.Variable = variable.Model;
	Models.Variables = variable.Collection;
	
});
},{"./base":2,"./base_filter":3,"./filter":4,"./image":5,"./info_box_section":6,"./item":7,"./project":8,"./project_section":9,"./project_template":10,"./researcher":11,"./rich_geo_feature":12,"./variable":13}],2:[function(require,module,exports){
var Backbone = (window.Backbone),
	_ = (window._),
	$ = (window.$);

exports.Model = Backbone.Model.extend({

	parse: function(data) {
		data = this._adaptMongoId(data);
		return data;
	},

	/*
	 * Adds fields of a foreign collection, referenced by a foreign id within the model.
	 * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
	 *                                  the former references a single value, the latter an array.
	 * @param {object} foreignCollection
	 * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
	 * @returns {object} this - The model instance, with 'model_name' field added.
	 */
	addForeignField: function(foreignIdKey, foreignCollection, fieldKey) {

		var newKey, 
			foreignModel, foreignIds, foreignId,
			singleForeignIdKey, // if foreignIdKey holds an array
			foreignFields = [],
			i, max;

		if (foreignIdKey.slice(-2) === 'id') {
			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({id: this.get(foreignIdKey)});
			this.set(newKey, foreignModel.get(fieldKey));
		} else if (foreignIdKey.slice(-3) === 'ids') {
			foreignIds = this.get(foreignIdKey);
			for(i = 0, max = foreignIds.length; i < max; i += 1) {
				foreignId = foreignIds[i];
				// simple pluralization
				newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
				foreignModel = foreignCollection.findWhere({id: foreignId});
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey));
				}
			}
			this.set(newKey, foreignFields);
		}

		return this;

	},

	_findAndReplaceKey: function(data, standardKey, keyFormatList) {
		var found, i, kf, len;
		found = false;
		if (keyFormatList == null) {
			keyFormatList = [standardKey]; 
		}
		for (i = 0, len = keyFormatList.length; i < len; i++) {
			kf = keyFormatList[i];
			if (data[kf]) {
				found = true;
				if (kf !== standardKey) {
					data[standardKey] = data[kf];
					delete data[kf];
				}
			}
		}
		return found;
	},

	_adaptMongoId: function(data) {
		if ((data._id != null)) {
			if ((data._id.$oid != null)) {
				data.id = String(data._id.$oid);
			} else {
				data.id = data._id;
			}
			delete data._id;
		} else if ((data.id != null) && (data.id.$oid != null)) {
			data.id = String(data.id.$oid);
		}
		return data;
	},

	_removeArrayWrapper: function(resp) {
		if (_.isArray(resp) && (resp.length === 1)) {
			resp = resp[0];
		}
		return resp;
	},

	_removeLineBreaks: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
		}
		return resp;
	},

	_removeSpaces: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/\s+/g, '');
		}
		return resp;
	},

	_processStaticHtml: function(resp, key) {
		var $html, html, newHtml;
		html = resp[key];
		$html = $(html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		resp[key] = newHtml;
		return resp;
	},

	getMarkdownHtml: function(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	}

});

exports.Collection = Backbone.Collection.extend({
	model: exports.Model,

	parse: function(resp) {
		var i, max,
			item;
		if (exports.Model.prototype.parse == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}

});
},{}],3:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$),
	indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

exports.Model = base.Model.extend({
	_activate: function() {
		return this.set('_isActive', true);
	},
	_deactivate: function() {
		return this.set('_isActive', false);
	},
	toggleActiveState: function() {
		if (this.isActive()) {
			if (!((this.collection != null) && this.collection.hasSingleActiveChild)) {
				return this._deactivate();
			}
		} else {
			this._activate();
			if ((this.collection != null) && this.collection.hasSingleActiveChild) {
				return this.collection.deactivateSiblings(this);
			}
		}
	},
	isActive: function() {
		return this.get('_isActive');
	},
	test: function(testedModel, foreignKey) {
		var foreignId, foreignIds, id;
		if (!this.isActive()) {
			return false;
		}
		id = this.get('id');
		foreignId = testedModel.get(foreignKey + '_id');
		if (foreignId != null) {
			return id === foreignId;
		}
		foreignIds = testedModel.get(foreignKey + '_ids');
		if (foreignIds != null) {
			return (indexOf.call(foreignIds, id) >= 0);
		}
		return false;
	}
});

exports.Collection = base.Collection.extend({
	initialize: function() {
		if (this.initializeActiveStatesOnReset) {
			return this.on('reset', this.initializeActiveStates);
		}
	},
	model: exports.Model,
	hasSingleActiveChild: false,
	deactivateSiblings: function(activeChild) {
		var i, len, model, ref, results;
		ref = this.models;
		results = [];
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model !== activeChild) {
				results.push(model._deactivate());
			} else {
				results.push(void 0);
			}
		}
		return results;
	},
	initializeActiveStates: function() {
		var i, index, len, model, ref;
		ref = this.models;
		for (index = i = 0, len = ref.length; i < len; index = ++i) {
			model = ref[index];
			model.set('_isActive', !this.hasSingleActiveChild ? true : (index === 0 ? true : false));
		}
		return this.trigger('initialize:active:states');
	},
	test: function(testedModel, foreignKey) {
		var i, len, model, ref;
		ref = this.models;
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			if (model.test(testedModel, foreignKey)) {
				return true;
			}
		}
		return false;
	}
});
},{"./base":2}],4:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	getVariableModel: function(variables) {
		return variables.findWhere({
			id: this.get('variable_id')
		});
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],5:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend({
	urlRoot: '/api/v1/images',
	url: function() {
		return this.urlRoot + ("?name=" + (this.get('name')));
	},
	parse: function(resp) {
		resp = this._removeArrayWrapper(resp);
		resp = this._removeLineBreaks(resp, 'encoded');
		return resp;
	},
	getBackgroundImageCss: function() {
		var encoded;
		encoded = this.get('encoded');
		if (encoded != null) {
			return "url('data:image/png;base64," + encoded + "')";
		}
	},
	getAttributionHtml: function() {
		return this.getMarkdownHtml('credit');
	}
});

exports.Collection = base.Collection.extend({
	model: exports.Model,
	url: '/api/v1/images'
});
},{"./base":2}],6:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);


exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});

},{"./base":2}],7:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	rgf = require('./rich_geo_feature'),
	$ = (window.$),
	states = require('./../../db/seeds/states.json');

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
	getRichGeoJson: function(baseGeoData) {
		var type;
		type = this.getItemType();
		return this.richGeoJsonBuilders[type](this, baseGeoData);
	}
});
},{"./../../db/seeds/states.json":16,"./base":2,"./rich_geo_feature":12}],8:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	filter = require('./filter'),
	infoBoxSection = require('./info_box_section'),
	variable = require('./variable'),
	item = require('./item'),
	$ = (window.$);


exports.Model = base.Model.extend({

	urlRoot: '/api/v1/projects',

	// API queries that need to be handled custom.
	// For every key, there is an this.is_#{key} method that filters a model.
	customQueryKeys: [ 'related_to' ],

	url: function() {
		return this.urlRoot + ("?atlas_url=" + (this.get('atlas_url')));
	},

	buildUrl: function() {
		return "http://build.atlas.newamerica.org/projects/" + (this.get('id')) + "/edit";
	},

	exists: function() {
		var json, key, keyCount;
		keyCount = 0;
		json = this.toJSON();
		for (key in json) {
			keyCount += 1;
		}
		return keyCount !== 1;
	},

	parse: function(resp) {
		resp = this._adaptMongoId(resp);
		resp = this._removeArrayWrapper(resp);
		resp = this._removeSpaces(resp, 'template_name');
		resp = this._processStaticHtml(resp, 'body_text');
		return resp;
	},

	compositeFilter: function(projectSections, projectTemplates) {
		var filter, sectionsFilter, templatesFilter;
		sectionsFilter = this.filter(projectSections, 'project_section');
		templatesFilter = this.filter(projectTemplates, 'project_template');
		filter = sectionsFilter && templatesFilter;
		this.trigger('visibility:change', filter);
		return filter;
	},

	/*
	 * Custom query method.
	 * @param {string} projectId
	 * @returns {boolean}
	 */
	is_related_to: function(projectId) {

	},

	filter: function(collection, foreignKey) {
		if ((collection != null) && (collection.test != null)) {
			return collection.test(this, foreignKey);
		}
		return true;
	},

	getImageAttributionHtml: function() {
		return this.getMarkdownHtml('image_credit');
	},

	buildData: function() {
		var data;
		data = this.get('data');
		if (data != null) {
			data.filters = new filter.Collection(data.filters, {
				parse: true
			});
			data.infobox_variables = new infoBoxSection.Collection(data.infobox_variables, {
				parse: true
			});
			data.variables = new variable.Collection(data.variables, {
				parse: true
			});
			data.items = new item.Collection(data.items, {
				parse: true
			});
		}
	}

});

exports.Collection = base.Collection.extend({

	initialize: function() {
		return this.on('reset', this.filter);
	},

	model: exports.Model,

	url: function() {
		var base;
		base = '/api/v1/projects';
		if (this.queryString != null) {
			return base + "?" + this.queryString;
		}
		return base;
	},

	comparator: function(model1, model2) {
		var i1, i2;
		i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0;
		i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0;
		if (model1.get('title') < model2.get('title')) {
			i1 += 1;
		} else {
			i2 += 1;
		}
		return i2 - i1;
	},

	filter: function(projectSections, projectTemplates) {
		var i, len, model, ref;
		if ((projectSections.models == null) || (projectSections.models.length === 0)) {
			return;
		}
		if ((projectTemplates.models == null) || (projectTemplates.models.length === 0)) {
			return;
		}
		if (this.models.length === 0) {
			return;
		}
		ref = this.models;
		for (i = 0, len = ref.length; i < len; i++) {
			model = ref[i];
			model.compositeFilter(projectSections, projectTemplates);
		}
		return this;
	},

	parse: function(resp) {
		var i, max,
			item;
		if (exports.Model.prototype.parse == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}
	
});
},{"./base":2,"./filter":4,"./info_box_section":6,"./item":7,"./variable":13}],9:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	baseFilter = require('./base_filter'),
	$ = (window.$),
	seed = require('./../../db/seeds/project_sections.json');

exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_sections'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_sections',
	hasSingleActiveChild: false,
	initializeActiveStatesOnReset: true,
	initialize: function() {
		this.reset(seed);
	}
});
},{"./../../db/seeds/project_sections.json":14,"./base_filter":3}],10:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	baseFilter = require('./base_filter'),
	$ = (window.$),
	seed = require('./../../db/seeds/project_templates.json');


exports.Model = baseFilter.Model.extend({
	urlRoot: '/api/v1/project_templates'
});

exports.Collection = baseFilter.Collection.extend({
	model: exports.Model,
	url: '/api/v1/project_templates',
	hasSingleActiveChild: true,
	initializeActiveStatesOnReset: true,
	comparator: 'order',
	initialize: function() {
		this.reset(seed);
	}
});
},{"./../../db/seeds/project_templates.json":15,"./base_filter":3}],11:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);

exports.Model = base.Model.extend();
exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],12:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	$ = (window.$);

exports.Model = Backbone.Model.extend({});

exports.Collection = Backbone.Collection.extend({
	initialize: function() {
		_.extend(this, Backbone.Events);
		this.type = 'FeatureCollection';
		return this.features = [];
	},
	model: exports.Model,
	onReady: function(next) {
		if (this.features.length > 0) {
			next();
			return;
		}
		return this.on('sync', next);
	}
});
},{}],13:[function(require,module,exports){
var _ = (window._),
	Backbone = (window.Backbone),
	base = require('./base'),
	$ = (window.$);


exports.Model = base.Model.extend();

exports.Collection = base.Collection.extend({
	model: exports.Model
});
},{"./base":2}],14:[function(require,module,exports){
module.exports=[
	{ "id": "0", "name": "Early Education" },
	{ "id": "1", "name": "PreK-12 Education" },
	{ "id": "2", "name": "Higher Education" },
	{ "id": "3", "name": "Learning Technologies" },
	{ "id": "4", "name": "Dual Language Learners" },
	{ "id": "5", "name": "Workforce Development" },
	{ "id": "6", "name": "Federal Education Budget" }
]
},{}],15:[function(require,module,exports){
module.exports=[
	{ "id": "0", "order": 0, "display_name": "Analysis Tools", "name": "Tilemap" },
	{ "id": "1", "order": 3, "display_name": "Explainers", "name": "Explainer" },
	{ "id": "2", "order": 1, "display_name": "Policy Briefs", "name": "Policy Brief" },
	{ "id": "3", "order": 2, "display_name": "Polling", "name": "Polling" }
]
},{}],16:[function(require,module,exports){
module.exports=[
  {
    "id": 1,
    "name": "Alabama",
    "code": "AL"
  }, {
    "id": 2,
    "name": "Alaska",
    "code": "AK"
  }, {
    "id": 60,
    "name": "American Samoa",
    "code": "AS"
  }, {
    "id": 4,
    "name": "Arizona",
    "code": "AZ"
  }, {
    "id": 5,
    "name": "Arkansas",
    "code": "AR"
  }, {
    "id": 6,
    "name": "California",
    "code": "CA"
  }, {
    "id": 8,
    "name": "Colorado",
    "code": "CO"
  }, {
    "id": 9,
    "name": "Connecticut",
    "code": "CT"
  }, {
    "id": 10,
    "name": "Delaware",
    "code": "DE"
  }, {
    "id": 11,
    "name": "District of Columbia",
    "code": "DC"
  }, {
    "id": 12,
    "name": "Florida",
    "code": "FL"
  }, {
    "id": 13,
    "name": "Georgia",
    "code": "GA"
  }, {
    "id": 66,
    "name": "Guam",
    "code": "GU"
  }, {
    "id": 15,
    "name": "Hawaii",
    "code": "HI"
  }, {
    "id": 16,
    "name": "Idaho",
    "code": "ID"
  }, {
    "id": 17,
    "name": "Illinois",
    "code": "IL"
  }, {
    "id": 18,
    "name": "Indiana",
    "code": "IN"
  }, {
    "id": 19,
    "name": "Iowa",
    "code": "IA"
  }, {
    "id": 20,
    "name": "Kansas",
    "code": "KS"
  }, {
    "id": 21,
    "name": "Kentucky",
    "code": "KY"
  }, {
    "id": 22,
    "name": "Louisiana",
    "code": "LA"
  }, {
    "id": 23,
    "name": "Maine",
    "code": "ME"
  }, {
    "id": 24,
    "name": "Maryland",
    "code": "MD"
  }, {
    "id": 25,
    "name": "Massachusetts",
    "code": "MA"
  }, {
    "id": 26,
    "name": "Michigan",
    "code": "MI"
  }, {
    "id": 27,
    "name": "Minnesota",
    "code": "MN"
  }, {
    "id": 28,
    "name": "Mississippi",
    "code": "MS"
  }, {
    "id": 29,
    "name": "Missouri",
    "code": "MO"
  }, {
    "id": 30,
    "name": "Montana",
    "code": "MT"
  }, {
    "id": 31,
    "name": "Nebraska",
    "code": "NE"
  }, {
    "id": 32,
    "name": "Nevada",
    "code": "NV"
  }, {
    "id": 33,
    "name": "New Hampshire",
    "code": "NH"
  }, {
    "id": 34,
    "name": "New Jersey",
    "code": "NJ"
  }, {
    "id": 35,
    "name": "New Mexico",
    "code": "NM"
  }, {
    "id": 36,
    "name": "New York",
    "code": "NY"
  }, {
    "id": 37,
    "name": "North Carolina",
    "code": "NC"
  }, {
    "id": 38,
    "name": "North Dakota",
    "code": "ND"
  }, {
    "id": 39,
    "name": "Ohio",
    "code": "OH"
  }, {
    "id": 40,
    "name": "Oklahoma",
    "code": "OK"
  }, {
    "id": 41,
    "name": "Oregon",
    "code": "OR"
  }, {
    "id": 42,
    "name": "Pennsylvania",
    "code": "PA"
  }, {
    "id": 72,
    "name": "Puerto Rico",
    "code": "PR"
  }, {
    "id": 44,
    "name": "Rhode Island",
    "code": "RI"
  }, {
    "id": 45,
    "name": "South Carolina",
    "code": "SC"
  }, {
    "id": 46,
    "name": "South Dakota",
    "code": "SD"
  }, {
    "id": 47,
    "name": "Tennessee",
    "code": "TN"
  }, {
    "id": 48,
    "name": "Texas",
    "code": "TX"
  }, {
    "id": 49,
    "name": "Utah",
    "code": "UT"
  }, {
    "id": 50,
    "name": "Vermont",
    "code": "VT"
  }, {
    "id": 51,
    "name": "Virginia",
    "code": "VA"
  }, {
    "id": 78,
    "name": "Virgin Islands of the U.S.",
    "code": "VI"
  }, {
    "id": 53,
    "name": "Washington",
    "code": "WA"
  }, {
    "id": 54,
    "name": "West Virginia",
    "code": "WV"
  }, {
    "id": 55,
    "name": "Wisconsin",
    "code": "WI"
  }, {
    "id": 56,
    "name": "Wyoming",
    "code": "WY"
  }
]
},{}]},{},[1]);

`