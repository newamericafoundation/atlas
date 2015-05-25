@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	InfoBox.Controller =

		createAndReveal: () ->
			if not InfoBox.rootView?
				InfoBox.rootView = InfoBox.Controller.getRootView()
				App.vent.trigger 'subview:ready', { 'infoBox': InfoBox.rootView }
				InfoBox.rootView.reveal()

		hideAndDestroy: () ->
			if InfoBox.rootView?
				InfoBox.rootView.hideAndDestroy()
				delete InfoBox.rootView
				App.vent.trigger 'item:deactivate'

		getRootView: () ->
			activeItem = App.reqres.request('item:entities').active
			infoBoxModelObject = InfoBox.getModelObject activeItem
			rootView = new InfoBox.RootView infoBoxModelObject
			rootView