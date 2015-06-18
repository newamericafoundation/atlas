Marionette.Renderer.render = (template, data) ->

	window.JST ?= {}
	window.JST_ATL ?= {}

	paths = [ JST_ATL['atlas/site/' + template + '.jst'], JST_ATL['atlas/' + template + '.jst'] ]

	for path in paths
		if path
			return path(data)
	
	throw "Template #{template} not found!"