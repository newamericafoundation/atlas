@Atlas.module 'CSS', (CSS, App, Backbone, Marionette, $, _) ->

	# http://codepen.io/anon/pen/RNXzKN

	# Get background svg pattern.
	CSS._getBackgroundSvg = (options) ->
		options ?= {}
		options.color1 ?= 'red'
		options.color2 ?= 'blue'
		pattern = options.pattern || 'stripe'
		options.scale ?= 1
		html = Marionette.Renderer.render("templates/svg/#{pattern}", options)


	CSS.getEncodedSvg = (svg) ->
		url = "data:image/svg+xml;base64,#{window.btoa(svg)}"
		"url('#{url}')"

	# Get Base64 encoded background image url for svg pattern.
	CSS.getBackgroundImage = (options) ->
		svg = CSS._getBackgroundSvg options
		CSS.getEncodedSvg(svg)


	templateList = [ 
		'build'
		'contract'
		'dictionary'
		'down'
		'download' 
	]