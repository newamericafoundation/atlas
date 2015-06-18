@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	class Index.ProjectView extends Marionette.ItemView

		tagName: 'a'
		className: 'atl__project'
		template: 'projects/index/templates/projects/project'

		initialize: ->
			@listenTo @model, 'visibility:change', (isVisible) ->
				if isVisible
					@$el.removeClass 'hidden'
				else
					@$el.addClass 'hidden'

		onRender: ->
			@_setLinkUrl()
			@_applyThemeStyling()

		onBeforeDestroy: ->
			@attributionView.destroy() if @attributionView?

		events:
			'click': 'launchProject'
			'mouseenter': 'applyBackgroundColor'
			'mouseleave': 'removeBackgroundColor'

		launchProject: (e) ->
			e.preventDefault()
			href = @model.get 'atlas_url'
			# When the following page is rendered, its theme color is set to
			#   current highlight color.
			# TODO refactor current theme color assignments
			App.currentThemeColor = @getColor().replace('0.8', '1.0')
			Backbone.history.navigate href, { trigger: true }

		_applyThemeStyling: ->
			if @model.get('project_template_id') is "1"
				@$el.addClass 'atl__project--explainer'
			if @model.get('is_section_overview') is 'Yes'
				@$el.addClass 'atl__project--overview'

		_setLinkUrl: ->
			@$el.attr('href', @model.get 'atlas_url')

		applyBackgroundColor: ->
			color = @getColor()
			@$('.atl__project__text').css('background-color', color)
			App.commands.execute 'set:header:strip:color', color: color

		removeBackgroundColor: ->
			@$('.atl__project__text').css('background-color', '')
			App.commands.execute 'set:header:strip:color', 'none'

		getColor: ->
			index = @model.collection.indexOf @model
			color = App.CSS.Colors.toRgba index %% 15, 0.8

		addBackgroundImage: (datum, i) ->
			url = "url('data:image/png;base64,#{datum.encoded_image.replace(/(\r\n|\n|\r)/gm, "")}')"
			@$('.atl__project__background').css 'background-image', url
			@$('.atl__project__background__initials').fadeOut()

		appendBackgroundImageAttribution: (datum) ->
			credit = datum.image_credit
			if credit?
				$html = $(marked(credit))
				$html.find('a').attr 'target', '_blank'
				linkHtml = $html.html()
				@attributionView = new App.Base.AttributionView
					model: new Backbone.Model { linkHtml: linkHtml }
				@attributionView.render()
				@$el.append @attributionView.$el


	class Index.ProjectsView extends Marionette.CollectionView

		tagName: 'div'
		className: 'atl__projects'
		childView: Index.ProjectView

		initialize: ->
			@listenTo App.vent, 'project:filter:change', @_filterCollection
			@on 'render:collection', @_filterCollection

		onShow: ->
			@_addImages()

		_filterCollection: ->
			@collection.filter()

		_addImages: ->
			$.ajax
				url: 'api/v1/projects/image'
				type: 'get'
				success: (data) =>
					# filter projects that don't have an image.
					dataWithImage = []
					for datum in data
						if datum.encoded_image?
							dataWithImage.push datum
					
					@children.each (child) ->
						atlas_url = child.model.get 'atlas_url'
						index = 0
						for datum in dataWithImage
							index += 1
							if datum.atlas_url is atlas_url
								child.addBackgroundImage datum, index
								child.appendBackgroundImageAttribution datum, index