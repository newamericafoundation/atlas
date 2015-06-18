@Atlas.module 'Projects.Show.Tilemap.Popup', (Popup, App, Backbone, Marionette, $, _) ->

	Popup.RootView = Marionette.ItemView.extend

		tagName: 'a'
		className: 'atl__popup'
		template: 'projects/show/project_templates/tilemap/submodules/popup/templates/root'

		events:
			'click': 'activateModel'
			'hover': 'preventDefault'
			'mouseover': 'preventDefault'
			'mouseout': 'preventDefault'

		# If the popup overlaps with the map item, it should trigger the activation instead.
		activateModel: ->
			# console.log 'popup clicked'
			App.vent.trigger 'item:activate', @model

		onRender: ->
			@$el.addClass 'atl__popup--center' if @model.get('_itemType') is 'state'
			pos = App.reqres.request('item:map:position', @model)
			@$el.css
				top: pos.y
				left: pos.x
			@_renderLogo()

		_renderLogo: ->
			html = Marionette.Renderer.render("projects/show/project_templates/tilemap/submodules/popup/templates/logo")
			@$('#atl__popup__content__logo').html(html)

		preventDefault: (e) ->
			e.preventDefault()