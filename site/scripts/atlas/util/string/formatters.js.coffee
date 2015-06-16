@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	Util.formatters = 

		# Process HTML.
		htmlToHtml: (html) ->
			$html = $(html)
			$html.find('a').attr('target', '_blank')
			# TODO - make sure the href points to the outside
			newHtml = $('<div></div>').append($html.clone()).html()
			newHtml

		# Converts Atlas array.
		atlasArrayToArray: (atlasArray) ->
			arr = atlasArray.split "|"
			arr = _.map arr, (item) ->
				item.trim()
			return arr

		# Removes line breaks.
		removeLineBreaks: (string) ->
			string = String(string)
			return string.replace /(\r\n|\n|\r)/gm, ''

		# Removes spaces.
		removeSpaces: (string) ->
			string = String(string)
			return string.replace /\s+/g, ''

		# Hyphenate a long string.
		hyphenate: (string) ->
			string = String(string)
			string.replace('ommunication','ommuni-cation')

		# Convert to Markdown.
		mdToHtml: (string) ->
			html = marked(string) if string?
			if html?
				return @htmlToHtml(html)