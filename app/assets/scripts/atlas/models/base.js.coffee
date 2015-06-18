@Atlas.module 'Models', (Models, App, Backbone, Marionette, $, _) ->

	Models.BaseModel = Backbone.Model.extend

		# Finds and replaces key.
		# @param {object} data - Data as key-value pairs.
		# @param {string} standardKey
		# @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
		# @returns {boolean} found - Whether the key is found in the data.
		_findAndReplaceKey: (data, standardKey, keyFormatList) ->
			found = false
			keyFormatList ?= [ standardKey ]
			for kf in keyFormatList
				if data[kf]
					found = true
					if kf isnt standardKey
						data[standardKey] = data[kf]
						delete data[kf]
			found


		# Adapts Mongoid ID.
		_adaptMongoId: (data) ->
			data
		


	Models.BaseCollection = Backbone.Collection.extend
		model: Models.BaseModel