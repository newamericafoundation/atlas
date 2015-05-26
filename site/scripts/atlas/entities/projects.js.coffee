@Atlas.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.ProjectModel extends Backbone.Model

		urlRoot: '/api/v1/projects'

		# Returns the URL of the Atlas API that holds the data for the project.
		url: ->
			@urlRoot + "?atlas_url=#{@get 'atlas_url'}"

		# Checks if the project has the mandatory fields.
		exists: ->
			keyCount = 0
			json = @toJSON()
			for key of json
				keyCount += 1
			(keyCount isnt 1)

		# Parses JSON response.
		parse: (resp) ->
			resp = @_removeArrayWrapper resp
			resp = @_removeSpacesFromTemplateName resp
			resp = @_adaptMongoId resp
			resp = @_parseIntegerFields resp, [ 'project_section_id', 'project_template_id' ]

		# Filters a project by two filterable collections that it belongs to.
		# @param {object} projectSections
		# @param {object} projectTemplates
		# @returns {boolean}
		compositeFilter: (projectSections, projectTemplates) ->
			return true if ((not projectSections?) or (projectSections.length is 0))
			return true if ((not projectTemplates?) or (projectTemplates.length is 0))
			sectionsFilter = @filter projectSections, 'project_section'
			templatesFilter = @filter projectTemplates, 'project_template'
			@trigger 'visibility:change', (sectionsFilter and templatesFilter)
			return (sectionsFilter and templatesFilter)

		# Filter collection by its foreign 
		# @param {object} collection
		# @param {string} foreignKey
		# @returns {boolean}
		filter: (collection, foreignKey) ->
			if collection? and collection.test?
				return collection.test @, foreignKey
			return true

		# Finds model id within the common Mongoid return format: 
		#   { id: { $oid: "the actual id Backbone needs" } }.
		#   { _id: "the actual id Backbone needs" }
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		_adaptMongoId: (resp) ->
			if (resp.id? and resp.id.$oid? and _.isObject(resp.id))
				resp.id = resp.id['$oid'] 
				return resp
			if (resp._id? and not resp.id?)
				resp.id = resp._id
				delete resp._id
				return resp

		# Remove the array wrapper, if response is one-member array.
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		_removeArrayWrapper: (resp) ->
			resp = resp[0] if _.isArray(resp) and (resp.length is 1)
			resp

		# Removes spaces from template name.
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		_removeSpacesFromTemplateName: (resp) ->
			if (resp.template?) and (resp.template.name?)
				resp.template.name = resp.template.name.replace /\s+/g, ''
			resp

		# Parse integer fields.
		# @param {object} resp - Server resonse.
		# @param {array} integerKeys - Keys that are expected to hold integer values.
		# @returns {object} resp - Modified response.
		_parseIntegerFields: (resp, integerKeys = []) ->
			for key in integerKeys
				resp[key] = parseInt(resp[key], 10) if resp? and resp[key]?
			resp



	class Entities.ProjectCollection extends App.Base.Collection

		initialize: ->
			@on 'reset', @filter

		model: Entities.ProjectModel
		url: ->
			base = '/api/v1/projects'
			if @queryString?
				return "#{base}?#{@queryString}"
			base

		# Used to compare two models when sorting.
		# @param {object} model1
		# @param {object} model2
		# @returns {number} comparator - A comparator whose sign determines the sorting order.
		comparator: (model1, model2) ->
			i1 = if model1.get('is_section_overview') is 'Yes' then 10 else 0
			i2 = if model2.get('is_section_overview') is 'Yes' then 10 else 0
			if model1.get('title') < model2.get('title')
				i1 += 1
			else
				i2 += 1
			i2 - i1

		# Filter all children by project sections and templates.
		# @param {collection} projectSections
		# @param {collection} projectTemplates
		# @returns {object} this
		filter: (projectSections, projectTemplates) ->	
			projectSections ?= App.reqres.request 'project:section:entities'
			projectTemplates ?= App.reqres.request 'project:template:entities'
			for model in @models
				model.compositeFilter(projectSections, projectTemplates)
			@

	entityManager = new App.Base.EntityManager
		entityConstructor: Entities.ProjectModel
		entitiesConstructor: Entities.ProjectCollection
			
	App.reqres.setHandler 'project:entities', (options) ->
		entityManager.getEntities(options)

	App.reqres.setHandler 'project:entity', (atlas_url) ->
		entityManager.getEntity { atlas_url: atlas_url }