@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	InfoBox.SectionsCollection = Backbone.Collection.extend()

	InfoBox.Model = Backbone.Model.extend
		defaults:
			name: 'General Project Info'

	# Get model instance, including a model and a collection.
	# @param {object} item - Active item.
	# @param {object} filter
	# @returns {object} model
	InfoBox.getModelObject = (item) ->
		model = if item? then item else App.currentProjectModel
		collectionData = if item? then @getItemSectionsCollection(item) else undefined
		return { 
			model: model
			collection: if collectionData? then new InfoBox.SectionsCollection(collectionData) else undefined
		}
		return new InfoBox.Model modelData


	# Get model data for a specific item.
	# @param {object} item - Active item.
	# @param {object} filter
	# @returns {object} obj - Object used to construct Backbone Model.
	InfoBox.getItemSectionsCollection = (item) ->

		infoBoxSections = App.reqres.request 'info:box:section:entities'
		variables = App.reqres.request 'variable:entities'
		
		sections = _.map infoBoxSections.models, (infoBoxSection) ->
			variableId = infoBoxSection.get 'variable_id'
			variable = variables.findWhere { id: variableId }
			sectionTitle = if variable? then variable.get('display_title') else "Section"
			text = item.get variableId
			obj =
				heading: sectionTitle
				text: getSectionHtml(text)
			obj

	# Converts a section entry (field of an item) to html.
    # Supports markdown.
	getSectionHtml = (raw) ->
		# do not process if already broken down to an array
		#   based on | separation character
		return raw if (not raw?) or _.isArray(raw)
		# convert to string if number
		return raw.toString() if _.isNumber(raw)
		# convert to markdown
		html = marked(raw)
		formatters = App.Util.formatters
		formatters.htmlToHtml(html)