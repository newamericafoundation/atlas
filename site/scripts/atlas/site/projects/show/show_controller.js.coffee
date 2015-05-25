@Atlas.module 'Projects.Show', (Show, App, Backbone, Marionette, $, _) ->

	Show.Controller =

		show: ->
			Show.rootView = @getRootView()
			App.contentRegion.show Show.rootView, { preventDestroy: true }
			Show.rootView.getRegion('sideBar').show @getSideBarView()
			App.appContentRegion = Show.rootView.getRegion 'main'

		getSideBarView: ->
			new Show.SideBarView()

		getRootView: ->
			new Show.RootView()