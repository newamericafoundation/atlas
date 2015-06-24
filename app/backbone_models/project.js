var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	filter = require('./filter'),
	infoBoxSection = require('./info_box_section'),
	variable = require('./variable'),
	item = require('./item'),
	$ = require('jquery');


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