@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.BaseFilterModel = Models.BaseModel.extend

		# Activates model. Takes no collection filter logic into consideration - hence internal only.
		_activate: ->
			@set '_isActive', true
			
		# Deactivates model. Takes no collection filter logic into consideration - hence internal only.
		_deactivate: ->
			@set('_isActive', false)

		# Toggle the model's active state.
		toggleActiveState: ->
			if @isActive()
				@_deactivate() unless (@collection? and @collection.hasSingleActiveChild)
			else
				@_activate()
				@collection.deactivateSiblings(@) if (@collection? and @collection.hasSingleActiveChild)

		# Get active state.
		isActive: ->
			@get '_isActive'

		# Tests whether a tested model satisfies a belongs_to relation with the model instance under a specified foreign key. Example: this.get('id') === testedModel.get('user_id') if the foreign key is 'user'.
		# @param {object} testedModel
		# @param {string} foreignKey
		test: (testedModel, foreignKey) ->
			return false if not @isActive()
			id = @get('id')
			# test for single foreign_key_id
			foreignId = testedModel.get(foreignKey + '_id')
			if foreignId?
				return (id is foreignId)
			# test for foreign_key_ids array
			#   this is ignored if previous test took place (foreign_key_id is found)
			foreignIds = testedModel.get(foreignKey + '_ids')
			if foreignIds?
				return (id in foreignIds)
			return false



	Models.BaseFilterCollection = Models.BaseCollection.extend

		initialize: ->
			if @initializeActiveStatesOnReset 
				@on 'reset', @initializeActiveStates

		model: Models.BaseFilterModel

		hasSingleActiveChild: false

		# deactivate all siblings of an active child element. usually called from the active child model instance
		deactivateSiblings: (activeChild) ->
			for model in @models
				model._deactivate() if model isnt activeChild
		
		# Set and initialize active state of the collection's models.
		# If the hasSingleActiveChild is set to true on the collection instance, the first model is set as active and all others are set as inactive.
		# Otherwise, all models are set as active.
		initializeActiveStates: ->
			for model, index in @models
				model.set '_isActive', if (not @hasSingleActiveChild) then true else (if index is 0 then true else false)
			@trigger 'initialize:active:states'


		test: (testedModel, foreignKey) ->
			for model in @models
				if model.test(testedModel, foreignKey)
					return true
			return false