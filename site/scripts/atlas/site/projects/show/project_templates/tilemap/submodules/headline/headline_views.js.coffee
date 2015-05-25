@Atlas.module 'Projects.Show.Tilemap.Headline', (Headline, App, Backbone, Marionette, $, _) ->

	Headline.RootView = Marionette.ItemView.extend
		template: 'projects/show/project_templates/tilemap/submodules/headline/templates/root'
		className: 'atl__headline'