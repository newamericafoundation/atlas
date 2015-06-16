@Atlas.module 'Projects.Show.Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	Popup.Controller =

		create: () ->
			if not Popup.rootView?
				Popup.rootView = Popup.Controller.getRootView()
				Popup.rootView.render()

		destroy: () ->
			if Popup.rootView?
				Popup.rootView.destroy()
				delete Popup.rootView

		getRootView: () ->
			items = App.reqres.request('item:entities')
			hoveredItem = items.hovered
			popupModel = Popup.getModel hoveredItem

			$atl = $('.atl')

			if $atl.find('.atl__popup').length is 0
				$atl.append('<div class="atl__popup"></div>')

			rootView = new Popup.RootView
				model: hoveredItem
				el: '.atl__popup'
			rootView