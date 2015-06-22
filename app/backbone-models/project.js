var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base'),
	$ = require('jquery');


exports.Model = base.Model.extend({
	urlRoot: '/api/v1/projects',
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
			data.filters = new Models.Filters(data.filters, {
				parse: true
			});
			App.reqres.setHandler('filter:entities', function() {
				return data.filters;
			});
			data.infobox_variables = new Models.InfoBoxSections(data.infobox_variables, {
				parse: true
			});
			App.reqres.setHandler('info:box:section:entities', function() {
				return data.infobox_variables;
			});
			data.variables = new Models.Variables(data.variables, {
				parse: true
			});
			App.reqres.setHandler('variable:entities', function() {
				return data.variables;
			});
			data.items = new App.Models.Items(data.items, {
				parse: true
			});
			return App.reqres.setHandler('item:entities', (function(_this) {
				return function(query) {
					var id;
					if (data.items != null) {
						if (_.isObject(query)) {
							return data.items.findWhere(query);
						}
						if (query != null) {
							id = parseInt(query, 10);
							return data.items.findWhere({
								id: id
							});
						}
					}
					return data.items;
				};
			})(this));
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
		if (projectSections == null) {
			projectSections = App.reqres.request('project:section:entities');
		}
		if (projectTemplates == null) {
			projectTemplates = App.reqres.request('project:template:entities');
		}
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
	}
});