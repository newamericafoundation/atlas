@Atlas.module 'Projects.Show.Tilemap', (Tilemap, App, Backbone, Marionette, $, _) ->

	Tilemap.Controller =

		showMainView: ->
			view = @getView()
			App.appContentRegion.show view

		startSubmodules: ->
			for submoduleKey in Tilemap.submoduleKeys
				Tilemap.submodules[submoduleKey].start()

		getView: ->
			new Tilemap.View()