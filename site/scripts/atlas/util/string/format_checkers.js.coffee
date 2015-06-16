@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	Util.formatCheckers = 

		# Checks if entry is in markdown.
		isMarkdown: (string) ->
			return false if not _.isString(string)

		# Checks if entry is an Atlas array -> |-separated list, without line breaks.
		isAtlasArray: (string) ->
			return false if not _.isString(string)
			return (string.indexOf("|") > -1) and (string.indexOf("\n") is -1)