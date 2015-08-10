@Atlas.module 'Tilemap.Headline', (Headline, App, Backbone, Marionette, $, _) ->

	Headline.RootView = Marionette.ItemView.extend
		template: 'tilemap/submodules/headline/templates/root'
		className: 'atl__headline'

		events:
			'click .link': 'openInfoBox'
			'click .atl__headline__title': 'openInfoBox'

		openInfoBox: ->
			App.commands.execute 'activate:info:box'