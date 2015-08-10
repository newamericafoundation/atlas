@Atlas.module 'Util', (Util, App, Backbone, Marionette, $, _) ->

	Util.formatters = 

		# Currency formatter.
		currency: (v) ->
			return v unless numeral?
			formatter = if (v > 999) then '($0a)' else '($0)'
			return numeral(v).format(formatter)

		number: (v) ->
			return v unless numeral?
			formatter = if (v > 99999) then '(0a)' else '(0)'
			return numeral(v).format(formatter)

		percent: (v) ->
			return (v + '%')

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