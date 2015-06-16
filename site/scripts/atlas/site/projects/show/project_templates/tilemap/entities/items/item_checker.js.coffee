@Atlas.module 'Projects.Show.Tilemap.Entities', (Entities, App, Backbone, Marionette, $, _) ->

	Entities.itemChecker = 

		check: (data) ->

		# Finds and replaces key.
		# @param {object} data - Data as key-value pairs.
		# @param {string} standardKey
		# @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
		# @returns {boolean} found - Whether the key is found in the data.
		findAndReplaceKey: (data, standardKey, keyFormatList) ->
			found = false
			keyFormatList ?= [ standardKey ]
			for kf in keyFormatList
				if data[kf]
					found = true
					if kf isnt standardKey
						data[standardKey] = data[kf]
						delete data[kf]
			found

		# Recognizes, validates and returns a pindrop item.
		pindrop: (data) ->
			errors = []
			foundLat =  @findAndReplaceKey data, 'lat', [ 'latitude', 'Latitude', 'lat', 'Lat' ]
			foundLong = @findAndReplaceKey data, 'long', [ 'longitude', 'Longitude', 'long', 'Long' ]
			if foundLat and foundLong
				data._itemType = 'pindrop'
				return { recognized: true, errors: [] }
			else if foundLat or foundLong
				return { recognized: true, errors: [ 'Latitude or longitude not found.' ] }
			return { recognized: false }

		# Recognizes, validates and returns a US state.
		# @param {Object} data
		# @returns {Object} Validation summary object.
		state: (data) ->
			errors = []
			if data.name?
				stateData = _.where Atlas.Data.states, name: data.name
				if stateData? and stateData.length > 0
					data.id = stateData[0].id
					data.code = stateData[0].code
					data._itemType = 'state'
				else
					errors.push (data.name + ' not recognized as a state. Possibly a typo.')
				return { recognized: true, errors: errors }
			return { recognized: false }