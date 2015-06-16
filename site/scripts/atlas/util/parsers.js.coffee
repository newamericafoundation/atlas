@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	Util.parsers =

		# Finds model id within the common Mongoid return format: 
		#   { id: { $oid: "the actual id Backbone needs" } }.
		#   { _id: "the actual id Backbone needs" }
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		adaptMongoId: (resp) ->
			if resp.id?
				if resp.id.$oid?
					resp.id = resp.id['$oid'] 
			else if resp._id?
				if resp._id.$oid?
					resp.id = resp._id.$oid
				else
					resp.id = resp._id
				delete resp._id
			resp

		# Remove the array wrapper, if response is one-member array.
		# @param {object} resp - Server resonse.
		# @returns {object} resp - Modified response.
		removeArrayWrapper: (resp) ->
			resp = resp[0] if _.isArray(resp) and (resp.length is 1)
			resp

		# Remove all line breaks from field.
		removeLineBreaks: (resp, key) ->
			if resp[key]?
				resp[key] = resp[key].replace /(\r\n|\n|\r)/gm, ''
			resp

		# Removes all spaces from field.
		removeSpaces: (resp, key) ->
			if resp[key]?
				resp[key] = resp[key].replace /\s+/g, ''
			resp

		# Processes static HTML.
		processStaticHtml: (resp, key) ->
			formatters = Util.formatters
			if resp[key]?
				resp[key] = formatters.htmlToHtml(resp[key])
			return resp