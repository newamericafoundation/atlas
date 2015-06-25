@Atlas.module 'Header', (Header, App, Backbone, Marionette, $, _) ->

	Header.Controller = 

		show: ->
			rootView = @getRootView()
			App.headerRegion.show rootView

			navCirclesView = @getNavCirclesView()
			rootView.getRegion('navCircles').show navCirclesView

			stripView = @getStripView()
			rootView.getRegion('strip').show stripView

			Header.rootView = rootView

		getNavCirclesView: ->
			new Header.NavCirclesView
				collection: Header.navCirclesCollection

		getMenuView: ->
			

		getStripView: ->
			new Header.StripView()

		getRootView: ->
			new Header.RootView()