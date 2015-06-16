@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	InfoBox.Controller =

		create: () ->
			InfoBox.rootView = @_getRootView()
			InfoBox.rootView.render()

		updateAndReveal: () ->
			@Controller.update()
			@Controller.reveal()

		update: () ->
			@destroy()
			@_ensureContainer()
			@create()

		reveal: () ->
			InfoBox.rootView.reveal()

		hide: () ->
			InfoBox.rootView.hide()
			App.vent.trigger 'item:deactivate'

		destroy: () ->
			if InfoBox.rootView?
				InfoBox.rootView.destroy()

		# Ensure that the container exists.
		_ensureContainer: () ->
			$atl = $('.atl__main')
			if $atl.find('.atl__info-box').length is 0
				$atl.append('<div class="atl__info-box"></div>')

		_getRootView: () ->
			rootView = new InfoBox.RootView 
				model: @_getModel().model
				collection: @_getModel().collection
				el: '.atl__info-box'
			rootView

		_getModel: () ->
			activeItem = App.reqres.request('item:entities').active
			model = InfoBox.getModelObject activeItem
			model