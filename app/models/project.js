var _ = require('underscore'),
    Backbone = require('backbone'),
    formatters = require('./../utilities/formatters.js'),
    base = require('./base.js'),
    filter = require('./filter.js'),
    variable = require('./variable.js'),
    item = require('./item.js');


exports.Model = base.Model.extend({

    urlRoot: '/api/v1/projects',

    /** API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. */
    customQueryKeys: ['related_to'],

    /** 
     * Returns the URL of the Atlas API that holds the data for the project. 
     * @returns {string} url
     */
    url: function() {
        return this.urlRoot + ("?atlas_url=" + (this.get('atlas_url')));
    },

    /** 
     * Returns the URL of the Build.Atlas API that holds the data for the project. 
     * @returns {string} buildUrl
     */
    buildUrl: function() {
        return "http://build.atlas.newamerica.org/projects/" + (this.get('id')) + "/edit";
    },

    /** 
     * Conversts model object to json
     * Checks if it has mandatory fields (id and more than one key). 
     * returns {boolean} - Whether madatory fields exist
     */
    exists: function() {
        var json, key, keyCount;
        keyCount = 0;
        json = this.toJSON();
        for (key in json) {
            keyCount += 1;
        }
        return (keyCount !== 1) && (json.id != null);
    },

    /**
     * Recognize and process JSON data.
     * @param {object} resp - JSON response.
     * @returns {object} resp - Modified JSON response.
     */
    parse: function(resp) {
        resp = this._adaptMongoId(resp);
        resp = this._removeArrayWrapper(resp);
        resp = this._removeSpaces(resp, 'template_name');
        resp = this._processStaticHtml(resp, 'body_text');
        return resp;
    },

    /** 
     * Filters a project by two filterable collections that it belongs to.
     * @param {object} projectSections
     * @param {object} projectTemplates
     * @returns {boolean} filter - Whether both project sections and templates are in filter variable.
     */
    compositeFilter: function(projectSections, projectTemplates) {
        var filter, sectionsFilter, templatesFilter;
        sectionsFilter = this.filter(projectSections, 'project_section');
        templatesFilter = this.filter(projectTemplates, 'project_template');
        filter = sectionsFilter && templatesFilter;
        return filter;
    },

    /*
     * Custom query method to find related projects based on tags.
     * @param {string} project - Project Id.
     * @returns {boolean} - Related status.
     */
    isRelatedTo: function(project) {
        var self = this,
            prj, tags0, tags1, i, max;
        if (this === project) {
            return false;
        }
        tags0 = this.get('tags');
        tags1 = project.get('tags');
        if (tags0 === '' || tags1 === '') {
            return false;
        }
        tags0 = tags0.split(',');
        tags1 = tags1.split(',');
        for (i = 0, max = tags0.length; i < max; i += 1) {
            if (tags1.indexOf(tags0[i]) > -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * Filter collection by its foreign key.
     * @param {object} collection
     * @param {string} foreignKey
     * @returns {boolean}
     */
    filter: function(collection, foreignKey) {
        if ((collection != null) && (collection.test != null)) {
            return collection.test(this, foreignKey);
        }
        return true;
    },

    /** Get imgage attribution html. */
    getImageAttributionHtml: function() {
        return this.getMarkdownHtml('image_credit');
    },

    /** If there is a data field, convert to appropriate collections. */
    buildData: function() {
        var data;
        data = this.get('data');
        if (data != null) {
            data.variables = new variable.Collection(data.variables, {
                parse: true
            });
            data.items = new item.Collection(data.items, {
                parse: true
            });
            this.buildFilterTree();
        }
    },

    buildFilterTree: function(items, variables, filters) {

        var self = this,
            filterTree, filterVariables,
            data = this.get('data'),
            items = data.items,
            variables = data.variables,
            filters = data.filters;

        if (filters == null) {
            filters = [];
        }

        var fv = variables.getFilterVariables();

        filterVariables = fv.map(function(variable, index) {

            var formatter, nd, o, variable;

            if (variable.get('format') != null) {
                formatter = formatters[variable.get('format')];
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
                display_title: variable.get('display_title'),
                short_description: variable.get('short_description'),
                long_description: variable.getMarkdownHtml('long_description'),
                type: variable.get('filter_type'),
                _isActive: (index === 0 ? true : false)
            };

            nd = variable.get('numerical_filter_dividers');

            if (nd != null) {
                o.values = variable.getNumericalFilter(formatter);
            } else {
                o.values = _.map(items.getValueList(variable.get('id')), function(item) {
                    if (formatter != null) {
                        item = formatter(item);
                    }
                    return {
                        value: item
                    };
                });
            }

            _.map(o.values, function(val) {
                val._isActive = true;
                return val;
            });

            return o;

        });

        filterTree = {
            variables: filterVariables
        };

        data.filter = new filter.FilterTree(filterTree);
        data.filter.state = {};

    },

    /**
     * Prepares model on the client.
     * @param {object} App - Marionette application instance. 
     */
    prepOnClient: function() {
        this.buildData();
        this.setHtmlToc('body_text');
    }

});

exports.Collection = base.Collection.extend({

    /**
     * Initializes collection
     */
    // initialize: function() {
    //     return this.on('reset', this.filter);
    // },
    
    model: exports.Model,

    /**
     * Creates new URL using base API path and query.
     * @returns {string} base - Modified root URL.
     */
    url: function() {
        var base;
        base = '/api/v1/projects';
        if (this.queryString != null) {
            return base + "?" + this.queryString;
        }
        return base;
    },

    /**
     * Used to compare two models when sorting.
     * @param {object} model1
     * @param {object} model2
     * @returns {number} comparator - A comparator whose sign determines the sorting order.
     */
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

    /** 
     * Filter all children by project sections and templates.
     * @param {collection} projectSections
     * @param {collection} projectTemplates
     * @returns {object} this
     */
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

    /**
     * Recognize and process server response.
     * @param {object} resp - Server response.
     * @returns {object} resp - Modified response.
     */
    parse: function(resp) {
        var i, max,
            item;
        if (exports.Model.prototype.parse == null) {
            return resp;
        }
        for (i = 0, max = resp.length; i < max; i += 1) {
            item = resp[i];
            resp[i] = exports.Model.prototype.parse(item);
        }
        return resp;
    }

});