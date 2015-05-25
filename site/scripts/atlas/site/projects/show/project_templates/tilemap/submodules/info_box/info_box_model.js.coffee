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
		collectionData = if item? then @getItemSectionsCollection(item) else @getSummaryCollection()
		collection = new InfoBox.SectionsCollection collectionData

		return { 
			model: model
			collection: collection 
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
			variableDisplayTitle = if variable? then variable.get('display_title') else "Section"
			text = item.get variableId
			if text?
				text = text.toString() if _.isNumber(text)
				text = marked(text) if not _.isArray(text)
			obj =
				heading: variableDisplayTitle
				text: text
			obj


	# Get model data generic for project.
	# @returns {object} obj - Object used to construct Backbone Model.
	InfoBox.getSummaryCollection = () ->

		sections = []

		for i in [1, 2, 3, 4]

			sections.push
				heading: 'Section ' + i
				text: 'Text for section.'

		sections