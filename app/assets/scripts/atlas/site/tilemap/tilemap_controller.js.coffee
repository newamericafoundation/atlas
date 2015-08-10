@Atlas.module 'Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->

	Tilemap.Controller =

		show: ->
			@showMainView()
			@startSubmodules()

		destroy: ->
			@destroyMainView()

		showMainView: ->
			@setMainRegion()
			Tilemap.rootView = @getView()
			Tilemap.region.show Tilemap.rootView

		setMainRegion: ->
			Tilemap.region = new Marionette.Region { el: '#atl__main__temp' }

		destroyMainView: ->
			if Tilemap.rootView?
				Tilemap.rootView.destroy()
				delete Tilemap.rootView

		startSubmodules: ->
			for submoduleKey in Tilemap.submoduleKeys
				Tilemap.submodules[submoduleKey].start()

		getView: ->
			new Tilemap.View()