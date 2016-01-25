import _ from 'underscore'

import formatters from './../../utilities/formatters.js'

import * as base from './../base.js'
import * as projectSection from './../project_section.js'
import * as projectTemplate from './../project_template.js'
import * as filter from './../filter.js'
import * as variable from './../variable.js'
import * as variableGroup from './../variable_group.js'
import * as item from './../item/index.js'

import models from './../index.js'

import defaults from './defaults.json'
import fields from './fields.json'


export class Model extends base.Model {

    get resourceName() { return 'project' }

    // API queries that need to be handled custom. For every key, there is a this.is_#{key} method that filters a model. 
    get customQueryKeys() { return [ 'related_to' ] }

    getIndexUrl() { return '/menu' }
    getViewUrl() { return `/${this.get('atlas_url')}` }

    get defaults() { return defaults }

    get fields() {

        // If there is a foreign collection defined
        return fields.map((field) => {
            var { foreignCollectionName } = field.formComponentProps
            if (foreignCollectionName != null) {
                field.formComponentProps.foreignCollection = new models[foreignCollectionName].Collection()
            }
            return field
        })

    }

    exists() {
        var keyCount = Object.keys(this.toJSON()).length
        return (keyCount > 1)
    }

    getImageUrl() {
        var encodedImage = this.get('encoded_image')
        if (encodedImage == null) { return }
        encodedImage = encodedImage.replace(/(\r\n|\n|\r)/gm, '')
        if (encodedImage.indexOf('base64') > -1) { return `url(${encodedImage})` }
        return `url('data:image/png;base64,${encodedImage}')`
    }

    /** 
     * Filters a project by two filterable collections that it belongs to.
     * @param {object} projectSections
     * @param {object} projectTemplates
     * @returns {boolean} filter - Whether both project sections and templates are in filter variable.
     */
    compositeFilter(projectSections, projectTemplates) {
        var sectionsFilter = this.filter(projectSections, 'project_section')
        var templatesFilter = this.filter(projectTemplates, 'project_template')
        var filter = sectionsFilter && templatesFilter
        return filter
    }

    /*
     * Custom query method to find related projects based on tags.
     * @param {string} project - Project Id.
     * @returns {boolean} - Related status.
     */
    isRelatedTo(project) {
        var prj, tags0, tags1
        // Project is not related to itself, it is itself :).
        if (this === project) { return false }
        tags0 = this.get('tags')
        tags1 = project.get('tags')
        if (tags0 === '' || tags1 === '') { return false }
        tags0 = tags0.split(',')
        tags1 = tags1.split(',')
        for (let tag0 of tags0) {
            if (tags1.indexOf(tag0) > -1) {
                return true
            }
        }
        return false
    }

    /**
     * Filter collection by its foreign key.
     * @param {object} collection
     * @param {string} foreignKey
     * @returns {boolean}
     */
    filter(collection, foreignKey) {
        if ((collection != null) && (collection.test != null)) {
            return collection.test(this, foreignKey)
        }
        return true
    }

    getImageAttributionHtml() {
        var cred = this.get('image_credit')
        return formatters.markdown(cred)
    }

    beforeSave() {

        var varModel = new variable.Model()
        var varGroupModel = new variableGroup.Model()
        var data = this.get('data')

        function parseDataField(data, fieldName, parserModel) {
            if (data[fieldName]) {
                let fieldValues = data[fieldName]
                fieldValues = fieldValues.map((fieldValue) => parserModel.parse(fieldValue))
                data[fieldName] = fieldValues
            }
        }

        if (data) {
            parseDataField(data, 'variables', varModel)
            parseDataField(data, 'variable_groups', varGroupModel)
            // Rename data field to items (per name conflict from spreadsheet format convention).
            if (data.data) {
                data.items = data.data
                delete data.data
            }
        }

    }

    /*
     * If there is a data field, convert to appropriate collections.
     *
     */
    buildData() {
        var data = this.get('data')
        if (data) {
            data.variables = new variable.Collection(data.variables)
            if (data.variable_groups) {
                data.variable_groups = new variableGroup.Collection(data.variable_groups)
                data.variable_groups.sort()
            }
            data.items = new item.Collection(data.items, { parse: true })
            this.buildFilterTree()
        }
    }


    /*
     * Build filter tree by taking each variable the display items are filtered by, and finding every possible value for each variable.
     * E.g. if the items are filtered by marital status and preferred pet, the return value of this method is schematically represented as follows:
     * { "marital_status": [ "single", "married", "divourced five times" ], "preferred_pet": [ "hamster", "comodo dragon", "lama" ] } 
     */
    buildFilterTree() {

        var filterTree, filterVariables
        var data = this.get('data')
        var { items, variables } = data

        filterVariables = variables.getFilterVariables().map(function(variable, index) {

            var formatter, nd, o, variable

            if (variable.get('format')) {
                let formatterName = variable.get('format')
                // formatterName = (formatterName !== 'markdown') ? 'number' : formatterName
                formatter = formatters[formatterName]
            }

            o = {
                variable: variable,
                variable_id: variable.get('id'),
                _isActive: (index === 0 ? true : false)
            }

            nd = variable.get('numerical_filter_dividers')

            if (nd != null) {
                o.values = variable.getNumericalFilter(formatter)
            } else {
                o.values = _.map(items.getValueList(variable), function(item) {
                    return { 
                        value: formatter ? formatter(item) : item 
                    }
                })
            }

            _.map(o.values, function(val) {
                val._isActive = true
                return val
            })

            return o

        })

        filterTree = { variables: filterVariables }

        data.filter = new filter.FilterTree(filterTree)
        data.filter.makeComposite()

        data.filter.state = {}

    }


    /*
     * Prepares model on the client.
     * @param {object} App - Marionette application instance. 
     */
    prepOnClient() {
        this.buildData()
        this.setHtmlToc('body_text')
        this.embedForeignModelNames()
    }

    embedForeignModelNames() {
        var templates = new projectTemplate.Collection()
        var sections = new projectSection.Collection()
        this.addForeignField('project_template_id', templates, 'name')
        this.addForeignField('project_section_ids', sections, 'name')
        return this
    }


    /*
     * Return an integer friendly index value for the current hovered or active item.
     * Used in coloring.
     */
    getFriendlyIndeces() {
        var { items, filter } = this.get('data')
        var item = items.hovered || items.active
        return filter.getFriendlyIndeces(item, 15)
    }

}



/*
 *
 *
 */
export class Collection extends base.Collection {

    get model() { return Model }

    comparator(model1, model2) {
        var i1 = model1.get('is_section_overview') === 'Yes' ? 10 : 0
        var i2 = model2.get('is_section_overview') === 'Yes' ? 10 : 0
        if (model1.get('title') < model2.get('title')) {
            i1 += 1
        } else {
            i2 += 1
        }
        return i2 - i1
    }

    /** 
     * Filter all children by project sections and templates.
     * @param {collection} projectSections
     * @param {collection} projectTemplates
     * @returns {object} this
     */
    filter(projectSections, projectTemplates) {
        if ((projectSections.models == null) || (projectSections.models.length === 0)) { return }
        if ((projectTemplates.models == null) || (projectTemplates.models.length === 0)) { return }
        if (this.models.length === 0) { return }
        this.models.forEach((model) => {
            model.compositeFilter(projectSections, projectTemplates)
        })
        return this
    }

    parse(resp) {
        if (exports.Model.prototype.parse == null) { return resp }
        return resp.map(item => exports.Model.prototype.parse(item))
    }


    // API query filter.
    related_to(id) {

        var resp = []

        if (id == null) { return this.toJSON() }

        var referenceModel =  this.findWhere({ id: id })

        if (referenceModel == null) { return resp }

        this.each((model) => {
            if (model.isRelatedTo(referenceModel)) {
                resp.push(model.toJSON())
            }
        })

        return resp

    }

}