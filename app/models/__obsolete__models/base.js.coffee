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
			if (data._id?)
				if (data._id.$oid?)
					data.id = String(data._id.$oid)
				else
					data.id = data._id
				delete data._id				
			else if(data.id? && data.id.$oid?)
				data.id = String(data.id.$oid)
			data


		# Remove the array wrapper, if response is one-member array.
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		_removeArrayWrapper: (resp) ->
			resp = resp[0] if _.isArray(resp) and (resp.length is 1)
			resp


		# Remove all line breaks from field.
		_removeLineBreaks: (resp, key) ->
			if resp[key]?
				resp[key] = resp[key].replace /(\r\n|\n|\r)/gm, ''
			resp


		# Removes all spaces from field.
		_removeSpaces: (resp, key) ->
			if resp[key]?
				resp[key] = resp[key].replace /\s+/g, ''
			resp

		# Process static html on a key.
		_processStaticHtml: (resp, key) ->
			html = resp[key]
			$html = $(html)
			$html.find('a').attr('target', '_blank')
			# TODO - make sure the href points to the outside
			newHtml = $('<div></div>').append($html.clone()).html()
			resp[key] = newHtml
			resp


		# Get markdown html.
		getMarkdownHtml: (key) ->
			md = @get(key)
			if md?
				$html = $(marked(md))
				$html.find('a').attr 'target', '_blank'
				newHtml = $('<div></div>').append($html.clone()).html()
				return newHtml


	Models.BaseCollection = Backbone.Collection.extend
		model: Models.BaseModel