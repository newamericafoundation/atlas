@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	# theme settings for 
	@projectTemplates = 
		"Tilemap":
			theme: 'dark'
		"Explainer":
			theme: 'light'
		"Policy Brief":
			theme: 'light'
		"Polling":
			theme: 'light'

	@getTheme = ->
		if @projectTemplates[@currentProjectTemplate]?
			return @projectTemplates[@currentProjectTemplate].theme
		return 'dark'