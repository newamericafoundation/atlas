@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.Project = Models.BaseModel.extend

		urlRoot: '/api/v1/projects'

		# Returns the URL of the Atlas API that holds the data for the project.
		url: ->
			@urlRoot + "?atlas_url=#{@get 'atlas_url'}"

		buildUrl: ->
			"http://build.atlas.newamerica.org/projects/#{@get('id')}/edit"

		# Checks if the project has the mandatory fields.
		exists: ->
			keyCount = 0
			json = @toJSON()
			for key of json
				keyCount += 1
			(keyCount isnt 1)

		# Parses JSON response.
		parse: (resp) ->
			parsers = App.Util.parsers
			resp = parsers.removeArrayWrapper resp
			resp = parsers.removeSpaces resp, 'template_name'
			resp = parsers.processStaticHtml resp, 'body_text'
			resp

		# Filters a project by two filterable collections that it belongs to.
		# @param {object} projectSections
		# @param {object} projectTemplates
		# @returns {boolean}
		compositeFilter: (projectSections, projectTemplates) ->
			sectionsFilter = @filter projectSections, 'project_section'
			templatesFilter = @filter projectTemplates, 'project_template'
			filter = (sectionsFilter and templatesFilter)
			@trigger 'visibility:change', filter
			return filter

		# Filter collection by its foreign key.
		# @param {object} collection
		# @param {string} foreignKey
		# @returns {boolean}
		filter: (collection, foreignKey) ->
			if collection? and collection.test?
				return collection.test @, foreignKey
			return true

		# Get imgage attribution html.
		getImageAttributionHtml: () ->
			credit = @get 'image_credit'
			if credit?
				$html = $(marked(credit))
				$html.find('a').attr 'target', '_blank'
				return $html.html()


		# If there is a data field, convert to appropriate collections.
		buildData: () ->
			data = @get('data')
			if data?

				data.filters = new Models.Filters data.filters, { parse: true }
				App.reqres.setHandler 'filter:entities', -> data.filters

				data.infobox_variables = new Models.InfoBoxSections data.infobox_variables, { parse: true }
				App.reqres.setHandler 'info:box:section:entities', -> data.infobox_variables

				data.variables = new Models.Variables data.variables, { parse: true }
				App.reqres.setHandler 'variable:entities', -> data.variables

				data.items = new App.Models.Items data.items, { parse: true }
				
				App.reqres.setHandler 'item:entities', (query) =>

					if data.items? 
						# use query object by default
						if _.isObject query
							return data.items.findWhere query

						# if no object is passed in, assume it is an id
						if query?
							id = parseInt(query, 10)
							return data.items.findWhere({ id: id })

					# if nothing is passed in, return the whole collection
					data.items



	Models.Projects = Models.BaseCollection.extend

		initialize: ->
			@on 'reset', @filter 

		model: Models.Project

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
			return if (not projectSections.models?) or (projectSections.models.length is 0)
			return if (not projectTemplates.models?) or (projectTemplates.models.length is 0)
			return if @models.length is 0
			for model in @models
				model.compositeFilter(projectSections, projectTemplates)
			@