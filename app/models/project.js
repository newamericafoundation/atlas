var _ = require('underscore'),
    Backbone = require('backbone'),
    formatters = require('./../utilities/formatters.js'),
    base = require('./base.js'),
    projectSection = require('./project_section.js'),
    projectTemplate = require('./project_template.js'),
    filter = require('./filter.js'),
    variable = require('./variable.js'),
    item = require('./item.js');


exports.Model = base.Model.extend({

    name: 'project',

    defaults: {
        'title': 'New Project',
        'author': '',
        'tags': 'a,b,c,d',
        'is_section_overview': 'No',
        'is_live': 'No',
        'project_template_id': '0',
        'project_section_ids': [ '1' ],
        'atlas_url': ''
    },

    // Form fields.
    fields: [

        {
            id: 'title',
            formComponentName: 'Text',
            formComponentProps: {
                id: 'title',
                labelText: 'Project Title',
                hint: '',
                placeholder: 'Enter Project Title'
            }
        },

        {
            id: 'atlas_url',
            formComponentName: 'Text',
            formComponentProps: {
                id: 'atlas_url',
                labelText: 'Atlas Url',
                hint: '',
                placeholder: 'Enter Atlas Url'
            }
        },

        {
            id: 'author',
            formComponentName: 'Text',
            formComponentProps: {
                id: 'author',
                labelText: 'Author',
                hint: '',
                placeholder: 'Enter Author'
            }
        },

        {
            id: 'is_section_overview',
            formComponentName: 'Radio',
            formComponentProps: {
                id: 'is_section_overview',
                labelText: 'Is section overview.',
                hint: 'Each section has one overview project - check if this is one of them:',
                options: [ 'Yes', 'No' ],
                defaultOption: 'Yes'
            }
        },

        {
            id: 'is_live',
            formComponentName: 'Radio',
            formComponentProps: {
                id: 'is_live',
                labelText: 'Is live.',
                hint: 'Please specify whether this project is viewable on the live site. Changes take effect immediately.',
                options: [ 'Yes', 'No' ],
                defaultOption: 'Yes'
            }
        },

        {
            id: 'project_section_ids',
            name: 'Project Sections',
            formComponentName: 'ForeignCollectionCheckBox',
            formComponentProps: {
                id: 'project_section_ids',
                foreignCollection: new projectSection.Collection(),
                labelText: 'Project Sections',
                hint: ''
            }
        },

        {
            id: 'project_template_id',
            formComponentName: 'ForeignCollectionRadio',
            formComponentProps: {
                id: 'project_template_id',
                foreignCollection: new projectTemplate.Collection(),
                labelText: 'Project Template',
                hint: 'Determines how data is displayed, e.g. Explainer'
            },
            foreignModelName: 'ProjectTemplate'
        },

        {
            id: 'tags',
            formComponentName: 'SelectizeText',
            formComponentProps: {
                id: 'tags',
                labelText: 'Tags',
                hint: 'Tags'
            }
        },

        {
            id: 'body_text',
            formComponentName: 'CKEditor',
            formComponentProps: {
                id: 'body_text',
                labelText: 'Body Text'
            }
        },

        {
            id: 'data',
            formComponentName: 'SpreadsheetFile',
            formComponentProps: {
                id: 'data',
                labelText: 'Data file',
                hint: '',
                worksheets: [ 'data', 'variables' ]
            }
        },

        {
            id: 'image',
            formComponentName: 'ImageFile',
            formComponentProps: {
                id: 'image',
                labelText: 'Image File',
                hint: ''
            }
        },

        {
            id: 'image_credit',
            formComponentName: 'Text',
            formComponentProps: {
                id: 'image_credit',
                labelText: 'Image Credit',
                hint: "Single URL or Markdown, e.g. 'Image supplied by [Image Corporation](http://www.imgcrp.com)':",
                placeholder: 'Image Credit'
            }
        }

    ],

    urlRoot: '/api/v1/projects',

    /** API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. */
    customQueryKeys: ['related_to'],

    getEditUrl: function() {
        var id = this.get('id');
        if (id) { return `/projects/${id}/edit`; }
        return '/';
    },

    getViewUrl: function() {
        return '/' + this.get('atlas_url');
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
        if (json.id == null) { return false; }
        for (key in json) {
            keyCount += 1;
        }
        return (keyCount > 1);
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

    getImageUrl: function() {
        var encodedImage = this.get('encoded_image');
        if (encodedImage == null) { return; }
        encodedImage = encodedImage.replace(/(\r\n|\n|\r)/gm, '');
        if (encodedImage.indexOf('base64') > -1) { return "url(" + encodedImage + ")"; }
        return "url('data:image/png;base64," + encodedImage + "')";
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
        var prj, tags0, tags1, i, max;
        // Project is not related to itself, it is itself :).
        if (this === project) { return false; }
        tags0 = this.get('tags');
        tags1 = project.get('tags');
        if (tags0 === '' || tags1 === '') { return false; }
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

    // Process entry spreadsheet data.
    beforeSave: function() {

        var varModel = new variable.Model(),
            data = this.get('data');

        if (data) {

            if (data.variables) {
                console.log('there are variables');
                let variables = this.get('data').variables;
                variables = variables.map((variable) => {
                    return varModel.parse(variable);
                });
                this.get('data').variables = variables;
                console.log(variables);
            }

            if (data.data) {
                data.items = data.data;
                delete data.data;
            }

        }

    },

    /** If there is a data field, convert to appropriate collections. */
    buildData: function() {
        var data;
        data = this.get('data');
        if (data != null) {
            data.variables = new variable.Collection(data.variables);
            data.items = new item.Collection(data.items, { parse: true });
            console.log(data.items);
            // data.filters = data.variables.extractFilters();
            this.buildFilterTree();

            console.log(data.filter);
        }
    },

    /*
     * Build filter tree by taking each variable the display items are filtered by, and finding every possible value for each variable.
     * E.g. if the items are filtered by marital status and preferred pet, the return value of this method is schematically represented as follows:
     * { "marital_status": [ "single", "married", "divourced five times" ], "preferred_pet": [ "hamster", "comodo dragon", "lama" ] } 
     */
    buildFilterTree: function() {

        var filterTree, filterVariables,
            data = this.get('data'),
            items = data.items,
            variables = data.variables;

        console.log(variables);

        filterVariables = variables.getFilterVariables().map(function(variable, index) {

            var formatter, nd, o, variable;

            if (variable.get('format') != null) {
                formatter = formatters[variable.get('format')];
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
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
        this.embedForeignModelNames();
    },

    embedForeignModelNames: function() {
        var templates = new projectTemplate.Collection(),
            sections = new projectSection.Collection();

        this.addForeignField('project_template_id', templates, 'name');
        this.addForeignField('project_section_ids', sections, 'name');

        return this;
    },

    /*
     * Return an integer friendly index value for the current hovered or active item.
     * Used in coloring.
     */
    getFriendlyIndeces: function() {
        var items = this.get('data').items,
            filter = this.get('data').filter,
            item = items.hovered || items.active;
        return filter.getFriendlyIndeces(item, 15);
    }

});

exports.Collection = base.Collection.extend({

    dbCollection: 'projects',

    apiUrl: '/api/v1/projects',

    model: exports.Model,

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
    },

    /*
     * API query filter.
     *
     */
    related_to: function(id) {

        var referenceModel = this.findWhere({ id: id }),
            resp;

        if (referenceModel == null) { return []; }

        resp = [];

        this.each((model) => {
            if (model.isRelatedTo(referenceModel)) {
                resp.push(model.toJSON());
            }
        });

        return resp;

    }

});