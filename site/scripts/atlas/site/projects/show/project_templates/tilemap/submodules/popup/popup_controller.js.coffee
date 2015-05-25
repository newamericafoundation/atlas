@Atlas.module 'Projects.Show.Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	Popup.Controller =

		create: () ->
			if not Popup.rootView?
				Popup.rootView = Popup.Controller.getRootView()
				App.vent.trigger 'subview:ready', { 'popup': Popup.rootView }

		purge: () ->
			if Popup.rootView?
				Popup.rootView.destroy()
				delete Popup.rootView

		getRootView: () ->
			items = App.reqres.request('item:entities')
			hoveredItem = items.hovered
			popupModel = Popup.getModel hoveredItem
			rootView = new Popup.RootView
				model: hoveredItem
			rootView