@Atlas.module 'Projects.Show.Tilemap.Info', (Info, App, Backbone, Marionette, $, _) ->

	Info.RootView = Marionette.ItemView.extend
	
		tagName: 'div'
		className: 'atl__info'
		template: 'projects/show/project_templates/tilemap/submodules/info/templates/root'
		
		initialize: ->
			@listenTo App.vent, 'value:mouseover value:mouseout item:mouseover item:mouseout key:click', (index) ->
				@model.update(index)
				@render()